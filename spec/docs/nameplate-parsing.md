# Nameplate parsing

OCR engines (VisionKit and Vision on iOS, ML Kit on Android, tesseract.js on
web) only produce text lines. A pure `NameplateParser`, implemented natively on
each platform with no shared runtime, maps those lines to
`{ make, model, serial }`. Every implementation must produce exactly the
`expected` object for every case in `spec/fixtures/nameplate/*.json`. The
reference implementation used to verify the fixtures is
`tests/helpers/nameplate-reference.mjs`.

Output is a user-confirmed suggestion, never written to a component without the
Confirm nameplate step.

## Input and output

Input: an array of text lines in reading order. Output: `make`, `model`,
`serial`, each a string or null.

## Normalization

For each line, in order:

1. Unicode NFD, then remove combining marks (U+0300 to U+036F), so an accented
   `MODÈLE` becomes `MODELE`.
2. Replace NBSP (U+00A0) with a space.
3. Collapse runs of whitespace to one space and trim.
4. Drop lines that are now empty.

Matching runs on uppercase copies. Output values are uppercased, except `make`,
which is the dictionary name.

## Label patterns

Match with word boundaries (`\b`), not lookbehind (Safari before 16.4 lacks it).
Both patterns end with `(?![A-Z])` so a label never matches inside a longer word.

```
MODEL  = \b(?:MODEL(?:E)?(?:\s*(?:NO\.?|NUMBER|NUM\.?|#|CODE))?(?:\s*/\s*MODELE)?|MOD\.?(?:\s*NO\.?)?|M/N|MDL\.?|CAT(?:ALOG)?\.?\s*(?:NO\.?|#)?)(?![A-Z])
SERIAL = \b(?:SERIAL(?:\s*(?:NO\.?|NUMBER|NUM\.?|#))?(?:\s*/\s*SERIE)?|SER\.?(?:\s*(?:NO\.?|#))?|S/N|SN)(?![A-Z])
```

## Value tokens

`MINLEN`: model 3, serial 4. Maximum token length is 30 for both.

A value is the first valid token of a text, scanning whitespace-separated words
left to right. For each word:

1. Strip leading characters in `:#.-` and trailing characters in `.,;:`.
2. Skip it when its length is below `MINLEN` or above 30.
3. Skip it unless it fully matches `[A-Z0-9][A-Z0-9\-/.]*`.
4. Skip it unless it contains at least one digit.

This skips `NO.`, `N0` (a zero read for the letter O), bare punctuation and
words like `GAL`.

## Algorithm

For each normalized line `i` (uppercased):

1. Find every MODEL and SERIAL match. Sort by start (longer match first on a tie)
   and drop any match that overlaps the previous kept one. These are the line's
   hits.
2. For each hit `j`, skip it when its field is already set. The value text is the
   line from the end of the hit to the start of the next hit (or the end of the
   line). Take the first valid token of the value text.
3. Next-line rule: when no token was found, the hit is the last hit on the line,
   the value text contains only characters from ` :#.-`, and line `i + 1` exists
   and has no label hits, take the first valid token of line `i + 1` instead.
4. Set the field when a token was found. The first value found for a field wins.

## Make

Brand dictionary: `spec/taxonomy/brands.json`, shape
`{ "brands": [{ "name", "aliases", "short_line_only" }] }`.

- Aliases are uppercase alphanumeric tokens joined by single spaces. `A. O.
  Smith` has aliases `A O SMITH`, `AO SMITH`, `AOSMITH`.
- To match, split each normalized uppercase line into alphanumeric tokens
  (split on every non-alphanumeric run), join with single spaces, and look for an
  alias as a whole token sequence.
- `short_line_only` brands (common English words such as State, Ring, Delta)
  match only on lines of at most 3 tokens.
- The earliest line with any match wins. Within that line the longest alias
  wins; on a tie the brand that comes first in the dictionary wins.
- `make` is the brand `name`, not the matched alias. No match means null.

## Corpus

| Case | Make | Model | Serial |
|------|------|-------|--------|
| rheem-water-heater | Rheem | XE50T10HD50U0 | RHLN0412345678 |
| ao-smith-split-lines | A. O. Smith | ENT-40 | M17A012345 |
| lennox-furnace | Lennox | SLP98UH090V48C | 5614C12345 |
| carrier-condenser-inline | Carrier | 24ACC636A003 | 3919E12345 |
| trane-ser-no | Trane | 4TWR4036G1000A | 2213ABC123 |
| goodman-mn-sn | Goodman | GMVC960803BN | 1912345678 |
| square-d-panel-no-serial | Square D | QO130M200PC | null |
| whirlpool-bilingual | Whirlpool | WRF535SWHZ00 | XJ4512345 |
| samsung-model-code | Samsung | RF28R7351SR/AA | 0B1K12345678X |
| ge-dishwasher | GE | GDT545PSJ0SS | FR123456H |
| ecobee-thermostat | Ecobee | EB-STATE5-01 | 411234567890 |
| bradford-white-next-line | Bradford White | RG2PV50H6N | ZB1234567 |
| noisy-zero-for-o | Rheem | XE40M12EC45U1 | RHLN0712345678 |
| noisy-garbage | null | null | null |
| label-then-label | Lennox | null | 5614C12345 |
| brand-only | Navien | null | null |
| empty | null | null | null |

The corpus covers a water heater, furnace, AC condenser, panel, appliances,
a thermostat, split-line, inline two-label, bilingual and next-line layouts,
two noisy cases, one brand-only case and one empty case. The whirlpool input
keeps its accented characters.
