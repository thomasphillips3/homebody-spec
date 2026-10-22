# Component behavior

Pure logic every platform implements the same way. Each section names its
fixture under `spec/fixtures/components/` (or beside it); tests in the spec repo
verify each fixture against an independent reference implementation, and each
platform asserts the same fixture.

All geometry is in meters, per-level plan space, Y-down.

## 1. Type search

Fixture: `components/search.json`. Used by the Add Component type step.

1. Lowercase and trim the query, then split it into tokens on whitespace.
2. Split each type's label and each alias into words on non-alphanumeric
   characters.
3. A type matches when every query token is a prefix of at least one word of the
   label plus its aliases.
4. Rank 0 when every token is a prefix of a word of the label alone, otherwise
   rank 1.
5. Sort by rank, keeping taxonomy document order inside a rank. The `other`
   type, when it matches, is always last.
6. The candidate types are those of the chosen category plus `other`. A null
   category searches every layer.
7. An empty query matches every candidate type and returns them in document
   order with `other` last.

This is a token prefix rule: "hot wat" finds the water heater through the alias
"hot water heater".

## 2. room_ids

Fixture: `components/placement.json`, `room_ids_cases`.

`room_ids` is computed on every geometry change, never edited. Together with
`geometry` it is written in the same mutation as `level_id` (the active level).

- A room is a ring of points. A repeated last vertex is dropped.
- A point is inside a room when it is inside by the even-odd rule, or lies within
  1e-9 m of a ring edge (edge-inclusive).
- A point component gets every room that contains it. A point on a shared edge
  gets both rooms.
- A polyline component gets a room when any of its vertices is inside or on the
  ring, or any of its segments intersects any ring edge (proper crossing or
  touching).
- The result is de-duplicated and sorted lexicographically on the lowercase
  room id.

## 3. Marker position and hit-testing

Fixture: `components/placement.json`, `hit_test_cases`.

Marker position: a point component's marker is at `coordinates[0]`. A run's
marker is at the midpoint of its longest segment (the first one on ties). This
matches the `marker` draw command in `render-model.md`.

A tap at plan point `t` selects a component as follows, with
`meters_per_pixel` converting screen tolerances to meters:

1. Consider only components whose category is visible and whose geometry is
   non-null and well formed (a point has one pair, a polyline has at least two).
2. Marker candidates: markers within 22 px (`22 * meters_per_pixel`) of `t`,
   inclusive.
3. Line candidates: run segments within 12 px of `t`, inclusive. A run's distance
   is its smallest segment distance.
4. If there are marker candidates, choose among them; otherwise choose among line
   candidates. A marker therefore beats a closer run line.
5. Choose the smallest distance, then the lexicographically smallest id.

Hidden layers are not hit-testable. Distances are plain doubles; fixtures avoid
floating-point ties except where the numbers are exactly representable.

## 4. Reminders

Fixture: `components/reminders.json`. All arithmetic is on civil dates with
integer days-from-civil. Do not use `Date` or `Calendar`: they drift with
time zones and daylight saving. Output is `YYYY-MM-DD`.

- `warranty_end` is `warranty_start` plus `warranty_length_months` calendar
  months, with the day clamped to the last day of the target month (Jan 31 plus
  1 month is Feb 28, or Feb 29 in a leap year). Null when either input is null.
- `next_service_due` is (`last_serviced_at`, else `install_date`) plus
  `service_interval_days` days. Null when the interval is null, is not a positive
  integer (zero, negative or fractional), or both dates are null.

Whether a result is overdue is a UI comparison against today and is not part of
the fixture.

## 5. Condition roll-up

See `condition-rollup.md` and `fixtures/condition-rollup.json`.

## 6. Cross-level links

Fixture: `components/links.json`.

A component has one nullable `linked_component_id` pointer. Rows that are
deleted are ignored, and a pointer to a deleted row counts as no pointer (the
component's effective pointer is null).

- Group: the connected set reachable through effective pointers in either
  direction.
- Candidates for a source component: non-deleted components of the same
  category, on a different level, other than the source. Each is flagged
  `in_other_group` (true when it is not already in the source's group). Sort by
  id.
- `disabled_reason`: `single_level` when the home has one level (no candidates
  are offered), otherwise `no_candidates` when the list is empty, otherwise
  null.
- Link: attach the root of the source's group (the group member whose effective
  pointer is null) to the target by setting its pointer, returned as
  `{ set_pointer_on, to }`. Returns null when the target is already in the
  source's group, which covers linking a component to itself.
- Unlink: clear the pointer on whichever of the two components holds it,
  returned as `{ clear_pointer_on }`; null when neither points directly at the
  other.

Create both components first, then set the pointer in a second mutation, so the
foreign key target is already synced.

## 7. Nameplate parsing

See `nameplate-parsing.md`.

## 8. manual_url

A component's `manual_url` is opened by the user, so only `http` and `https`
URLs are allowed, on write and again on open. The database enforces the same.
