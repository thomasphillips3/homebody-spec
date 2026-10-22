# Quick log

Turns one sentence ("replaced the furnace filter today, $28") into a draft
event. Two engines read the sentence, and one deterministic resolver picks the
component. Fixtures: `fixtures/quick-log/sentences.json`, `resolver.json` and
`extractions.json`. Every platform ports the typed parser, the extraction
normalizer and the resolver natively, with no shared runtime, and must produce
exactly the `expected` object of every case. The reference implementation used
to verify the fixtures lives inside `tests/phase6-quicklog.test.mjs`.

## Engines

- Typed parser (section 2): rule based, always available. Web always uses it.
  iOS and Android use it when the on-device model is unavailable.
- On-device model (iOS 26 Foundation Models, Android ML Kit GenAI): returns raw
  text phrases only (section 3). The model never supplies ids, dates, amounts
  or event types. Those come from the normalizer and the resolver below, so the
  extraction cases and the sentence cases feed the same code.
- The resolver (section 4) is shared by both engines and is the only thing that
  can pick a component id.

Nothing is written until the user confirms the card. A card whose status is
`ambiguous` or `none` keeps "Log This Event" disabled until the user picks a
component. A sentence the model reads as an instruction ("ignore previous
instructions") has no lexicon verb, so it degrades to a note with no component
hint and the user still confirms every field.

The reference clock for the fixtures is fixed: `now_local` 2026-10-22T10:00,
`today` 2026-10-22, a Thursday. The app passes the device-local civil date as
`today`. Notes for the created event are the original trimmed sentence; they are
not part of the corpus.

## Shared tables

Lexicon (first column is the event type):

| event_type | verbs |
|------------|-------|
| inspection | inspected, inspect, checked, tested, examined, looked at |
| reading | read, measured, recorded |
| repair | repaired, fixed, patched, rewired, resealed, sealed, tightened, unclogged |
| replacement | replaced, swapped, installed, changed |
| service | serviced, cleaned, flushed, tuned, lubricated, greased, drained, descaled, winterized, vacuumed, refilled |

Consumables: filter, filters, battery, batteries, bulb, bulbs, cartridge,
cartridges, pad, pads.

Weekdays: monday through sunday, full names only. Month names: jan, january,
feb, february, mar, march, apr, april, may, jun, june, jul, july, aug, august,
sep, sept, september, oct, october, nov, november, dec, december.

All matching is case-insensitive and on whole words. All date math uses integer
days-from-civil (see `component-behavior.md` section 4), never `Date` or
`Calendar` arithmetic. Weekday of a civil date: `(daysFromCivil + 4) mod 7`
with 0 = Sunday (1970-01-01 was a Thursday).

## 2. Typed parser: parseSentence(input, today)

Output: `{ event_type, component_hint, occurred_on, cost_cents, title }`.

1. Clean. Trim and collapse runs of whitespace to one space. Keep this string
   as the original. Then remove the filler words um, uh, like, so, okay, ok,
   just, basically (whole words, each with one directly following comma if
   present), collapse whitespace again and trim.
2. Cost. Try these patterns in order on the cleaned text; the first pattern
   that matches wins and its matched span is removed.
   1. A dollar sign, optional spaces, then digits with optional thousands
      commas (`1,250`) and an optional `.d` or `.dd` cents part.
   2. The same number (no dollar sign) followed by `dollars`, `bucks` or `usd`.

   `cost_cents` is whole dollars times 100 plus cents. A single decimal digit
   is tens of cents: `.5` is 50. No match gives null. Spelled-out numbers
   ("twenty eight dollars") are unsupported by design and give null; the words
   stay in the text.
3. Date. Try these patterns in order; the first that matches wins, and its span
   is removed together with one directly preceding `on` or `from`.
   1. ISO `yyyy-mm-dd`, when it is a real calendar date.
   2. `yesterday`: today minus 1.
   3. `today`: today.
   4. `N days ago` or `N weeks ago`, where N is digits or `a` or `an` (meaning
      1); weeks count 7 days each.
   5. `last week`: today minus 7.
   6. `last <weekday>` or a bare `<weekday>`: the most recent such weekday
      strictly before today, so the weekday equal to today means 7 days
      earlier. Days back = `((weekday(today) - weekday(target) + 6) mod 7) + 1`.
   7. Month name, optional period, day 1 to 31 with an optional `st`, `nd`,
      `rd` or `th`.
   8. Numeric `M/D`.

   Patterns 7 and 8 use the current calendar year of `today`, rolled back one
   year when the result is later than today. A date that is not a real calendar
   date does not match (the text stays). No match gives `today`. "The day
   before yesterday" is not supported.
4. Verb. Scan the remaining text left to right for the first lexicon entry as a
   whole word (`looked at` is two words). Words before the verb are dropped. No
   verb gives `event_type` note, `component_hint` null, and `title` = the
   original (step 1) with its first letter uppercased, cut to at most 60
   characters (then trailing space trimmed). Cost and date are still extracted
   for a note.
5. Subject. Take the text after the verb. Cut it at the first comma, or the
   first period followed by a space or the end. Split into words and cut at the
   first word that is `for`, `at`, `because` or `and`. Drop leading words the,
   a, an, my, our, new, old, some (repeatedly). Drop trailing words for, at, on,
   and, it (repeatedly). Lowercase. An empty subject gives `component_hint`
   null.
6. Consumables. When the verb is replaced, swapped, installed or changed and the
   subject's last word is a consumable, `event_type` becomes `service` and
   `component_hint` is the subject without that last word (the whole subject if
   nothing remains). Otherwise `component_hint` is the subject. A replaced
   consumable is a service, not a replacement.
7. Title. The matched verb lowercased with its first letter uppercased, then a
   space and the full subject (so `looked at` keeps both words). With an empty
   subject the title is the verb alone. A service-by-consumable keeps the typed
   verb: `Replaced furnace filter`.

Unsupported in this release: spelled-out numbers, relative phrases beyond the
list above, times of day, ranges, abbreviated weekdays, and numeric fractions
such as `1/2`. A reading event does not extract a numeric value; the user fills
it in on the confirm card.

## 3. Model output: fromExtraction(extracted, today)

The model returns `{ action, subject, datePhrase, amountPhrase, notes }`, each a
string or null. `notes` is carried to the card unchanged and is not part of the
expected object. The normalizer:

- Action: lowercase and trim, then the first lexicon entry found in it (same
  whole-word scan). An unknown or null action gives `note` and a null hint.
- Subject: cleaned with step 5 above (cut, leading and trailing words,
  lowercase), then step 6 when the action is replaced, swapped, installed or
  changed.
- Date: step 3 patterns on `datePhrase`; null or unparseable gives `today`.
- Cost: step 2 patterns on `amountPhrase`, or a bare number such as `28` or
  `1,250.50` read as dollars; null or anything else gives null.
- Title: step 7 using the matched verb and the cleaned subject. For a note the
  title is the trimmed action and raw subject joined by a space, first letter
  uppercased, at most 60 characters; `Note` when both are empty.

## 4. Resolver: resolveHint(hint, components)

Input components carry `id`, `name`, `component_type`, `make`, `model`,
`type_label` and `aliases` (the taxonomy label and aliases of the type).
Output: `{ status, component_ids }` with status `resolved`, `ambiguous` or
`none`.

1. A null or empty hint gives `none`.
2. Tokenize the hint into lowercase alphanumeric words. Drop the stopwords the,
   a, an, my, our, unit, thing, one, main, old, new, uh, um. Strip a trailing
   `s` from words longer than 3 letters that do not end in `ss`. An empty token
   list gives `none`.
3. For each component build two word sets with the same tokenizing and
   stripping (no stopword removal): `nameWords` (words of `name`) and
   `otherWords` (words of `type_label`, every alias and `make`).
4. A component matches when every hint token is a prefix of some word in
   `nameWords` or `otherWords`. Its tier is 0 when every hint token is a prefix
   of a `nameWords` word, else 1.
5. Take the lowest tier present. One component in that tier gives `resolved`,
   several give `ambiguous`, none matching gives `none`.
6. `component_ids` are ordered by lowercase `name`, then lowercase `id`.

The model path and the typed path both call this resolver with the
`component_hint` they produced. The card shows the matched component, or an
inline picker over `component_ids` for `ambiguous` and the full component list
for `none`.
