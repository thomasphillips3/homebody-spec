# Recall matching

How a CPSC recall is matched to a component and turned into a `RecallAlert`. Pure
logic with no network. The TypeScript matcher in the Supabase Edge Function
(`_shared/recall-match.ts`) implements it and the clients rely on its output.
Fixtures: `fixtures/recalls/` (canned CPSC records and `match-cases.json`). Tests
in the spec repo verify every expectation against an independent reference
implementation written from this document.

CPSC `Products[].Model` is empty for every recall in the dataset, so matching is a
free-text match over the title, the description and the company names (C4, D-27).
Serial numbers are ignored in v1 (C16): CPSC carries serial ranges only in
free-form sentences. The Description is shown to the user so they can compare.

## 1. Normalization

- `norm(s)`: Unicode NFKD, remove combining marks, uppercase, replace every run of
  characters outside `A-Z0-9` with one space, trim. A null value is the empty
  string. (NFKD turns a trademark sign into the letters `TM`, so `Scotch(tm)`
  becomes the single word `SCOTCHTM`. This is intended and pinned by a fixture.)
- `compact(s)`: `norm(s)` with the spaces removed.

## 2. Texts

- `recallText` is `norm` of the Title, the Description (null treated as empty) and
  every `Products[].Name`, `Products[].Description` and `Products[].Model`,
  joined by spaces.
- Company names are the `Name` of every `Manufacturers`, `Importers` and
  `Distributors` entry. `Retailers` are never used. Each name is cut at its first
  `", of "` before normalizing, so the `of City, State` location text never counts
  as a brand (`Friedrich Air Conditioning Co., of San Antonio, Texas` becomes
  `Friedrich Air Conditioning Co.`).
- `brandText` is `norm` of the Title and the cut company names. A brand whose
  `short_line_only` flag in `spec/taxonomy/brands.json` is true is matched against
  the cut company names only, never the Title.
- `typeText` is `norm` of the Title, every `Products[].Name` and the first sentence
  of the Description (the text up to and including the first period followed by a
  space, or all of it when there is none). Some recalls name one product class in
  the Title and another in the Description (recall 26026 is titled "Tankless Water
  Heaters" but describes gas boilers), so both are consulted.

## 3. Model hit

- `recallModels`: the tokens of `recallText` (split on spaces) that have a length of
  at least 4 and contain a digit, plus the concatenation of each adjacent token
  pair when the result has a length of at least 4 and contains a digit. The pair
  join finds hyphenated and spaced models (`VRS-150` becomes `VRS 150`, then
  `VRS150`).
- A component model is valid when `compact(model)` has a length of at least 5 and
  contains a digit. Anything else is ignored for model matching.
- `modelHit`: with `c = compact(model)`, some recall model `r` satisfies one of
  - `r == c`,
  - `c` starts with `r` and `len(r) >= 6` (the family-prefix rule: the component
    model carries an extra suffix),
  - `r` starts with `c` and `len(c) >= 6`.

## 4. Brand hit

The alias list for the component make is: the aliases of the `brands.json` entry
whose `name` or any alias equals `norm(make)`, plus `norm(make)` itself. A brand
hit needs some alias to appear as a whole word run in the brand text (delimited by
spaces on both sides). An empty make never hits. Whole-word matching means `Rich`
does not hit `Friedrich`, and short makes need an exact token.

## 5. Type hit

Each component carries `type_keywords`, already the lowercased label and aliases of
its taxonomy type. A type hit needs some keyword (after `norm`) to appear as a
whole word run in `typeText`, optionally followed by `S` or `ES` on the last word
(`furnace` matches `FURNACES`, `air conditioner` matches `AIR CONDITIONERS`).

## 6. Decision

For a recall and a component with a make or a model:

1. If the model is valid and `modelHit`: `likely` when the brand hits or
   `len(compact(model)) >= 8`, otherwise `possible`. `matched_on` is `model`.
2. If the model is valid, there is no `modelHit` and `recallModels` is not empty:
   no match. The recall lists models and this one is not among them. This
   suppresses the largest class of false positives (same brand and type, different
   model).
3. Otherwise (no valid model, or the recall lists no models): brand hit and type
   hit give `possible` with `matched_on` `manufacturer`. Anything else is no match.

Only `likely` matches notify (the clients). `possible` matches are listed tagged
"Possible match". The fixture states the expected `confidence` and `matched_on`
(both null for no match).

## 7. Alerts

The alert id is the UUIDv5 of `{lowercase component_id}:{recall_number}` in
namespace `5f3c9a2e-7b1d-4e68-9c04-2a8d6e1b7f35`, so rerunning the matcher is
idempotent and Dismiss Recall is permanent. A recall update never resurrects a
dismissed or resolved alert (`insert ... on conflict (id) do nothing`).

Alert fields: `recall_number` (string), `recall_id` (the integer `RecallID`),
`title`, `hazard` (the first `Hazards[].Name` or null), `remedy` (the first
`Remedies[].Name` or null), `url`, `recall_date` (the first 10 characters of
`RecallDate`), `matched_on`, `confidence`, `status` `open`, plus `home_id` and
`component_id`. The server adds `user_id` and `detected_at`.

Sanitization, applied to title, hazard and remedy (recall text is untrusted):

1. delete the C0 control characters other than the ASCII whitespace characters
   (U+0000 to U+0008 and U+000E to U+001F) and DEL (U+007F);
2. replace every run of ASCII whitespace (U+0009 to U+000D and U+0020) with one
   space;
3. trim;
4. clip to 500 (title) or 2000 (hazard, remedy) Unicode scalar values;
5. an empty hazard or remedy becomes null.

URL rule: the url is kept only when it is at most 2048 characters, starts with
`https://`, its authority has no `@` and no `:`, and its host (lowercased) is
`cpsc.gov` or ends with `.cpsc.gov`. Otherwise it is replaced by the fallback
`https://www.cpsc.gov/Recalls`. A null url also gets the fallback. Look-alike hosts
(`cpsc.gov.example.com`) and userinfo tricks (`https://www.cpsc.gov@example.com/`)
fall back. The database CHECK and the clients enforce the same rule.

## 8. CPSC API facts the code must respect

- Base URL `https://www.saferproducts.gov/RestWebServices/Recall` with
  `format=json`. No authentication. Be polite: sequential requests and a
  descriptive User-Agent.
- Query parameters are a whitelist: `RecallID`, `RecallNumber`, `RecallDateStart`,
  `RecallDateEnd`, `LastPublishDateStart`, `LastPublishDateEnd`, `RecallURL`,
  `RecallTitle`, `RecallDescription`, `ProductName`, `Manufacturer`, `Retailer`,
  `Importer`, `Distributor`, `ManufacturerCountry`, `UPC`, `Hazard`, `Remedy`,
  `RemedyOption`, `ConsumerContact`, `InconjunctionURL`, `ImageURL`, `Injury`.
  Dates are `yyyy-MM-dd` (`MM/dd/yyyy` silently returns nothing).
- An unknown or misspelled parameter is ignored and the API returns the whole
  dataset (about 27 MB). Never send a parameter outside the whitelist, and guard
  the response size.
- Failures come back as HTTP 200 with one fake record: `RecallID` 0 or a null
  `RecallNumber` means the call failed (`error-record.json`). The client must throw,
  and the incremental cursor must not advance.
- Fields can be empty or null: `Description` (one record), `Hazards` (empty on some
  records), `Manufacturers` (often empty, the brand being in `Importers` or the
  Title). Company names read `Company, of City, State`.
- Fingerprint rule: the matcher decides which components need a targeted backfill
  query by `sha1` hex of `norm(make) + "|" + compact(model)`; a changed fingerprint
  means the component is queried again.

## Fixtures

`fixtures/recalls/`: seven single-record payloads in the live API shape (real
records for 23218, 26776, 26026 and 27024, plus `null-description.json`,
`no-hazards.json` and `error-record.json`, which are small synthetic records) and
`match-cases.json` (`cases`, `alert_cases`, `error_record_cases`). A match case
names a payload file, a component (`id`, `component_type`, `make`, `model`,
`type_keywords`) and the expected `confidence` and `matched_on`.
