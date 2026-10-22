# Event application

How logging, editing and deleting an event updates the component it targets.
Pure logic every platform implements the same way. Fixture:
`fixtures/event-application.json`. Used by the Log Event form, the Log Session
screen, the event detail editor and the quick-log confirm card on web, iOS and
Android. Tests in the spec repo verify the fixture against an independent
reference implementation, and each platform asserts the same file.

## 1. Date convention

1. The form picks a civil date `D` (`YYYY-MM-DD`). It is stored as
   `occurred_at = D + "T12:00:00Z"`.
2. The civil date of any event is the first 10 characters of `occurred_at`, the
   UTC date part, whatever the time of day. An event stored at
   `2026-04-01T23:30:00Z` is on `2026-04-01`.
3. "Today" is the device-local civil date, read from the device wall clock in the
   device time zone. It is not derived from UTC: a phone at UTC+13 at 01:30 on
   March 2 logs `2026-03-02`, although the UTC instant is still March 1. A phone
   at UTC-11 at 22:30 on March 1 logs `2026-03-01`, although the UTC instant is
   already March 2.
4. No timezone field exists on events, components or homes.
5. All day arithmetic uses integer days-from-civil (see
   `component-behavior.md` section 4). Never `Date` or `Calendar` arithmetic.

Fixture: `log_today_cases` (device local wall time in, civil date and stored
`occurred_at` out, including UTC+13, UTC-11, a leap day and a year boundary) and
`civil_cases`.

## 2. Qualifying types

`service`, `repair` and `replacement` are the qualifying types for
`last_serviced_at`. `inspection`, `reading` and `note` never touch it.

## 3. Ordering key

The key of an event is the pair (`occurred_at` as an instant, lowercase `id`
string). "Later" means the greater key: compare the instant first, then compare
the lowercased id strings by code unit. Events carry no `created_at` and
`updated_at` moves on edit, so the id is the only stable tie-break.

Consequences the fixtures pin:

- `9...` sorts before `a...` (digits before letters).
- An uppercase id compares as its lowercase form: `B2...` sorts after `a5...`,
  although the ASCII code of `B` is below that of `a`.

## 4. Targets

- A component event sets `component_id` and leaves `system_id` null.
- A layer event sets `system_id` only (no `component_id`).
- `home_id` is always set. For a component event it is the home of the
  component's system.
- A layer event never touches a component.

## 5. The Owner rule

Inputs: the component (`last_serviced_at`, `condition`), the event before the
change (`before`, null on create), the event after the change (`after`, null on
delete) and `events_after`, the full list of LIVE events on the component after
the change is applied (it includes `after`, excludes `before` and any tombstoned
event). Output: the new `last_serviced_at`, the new `condition` and a `patch`
holding only the fields whose value changed (`{}` when nothing changes).

When the target is a layer (component is null) the result is the unchanged inputs
and an empty patch.

`last_serviced_at`:

1. Start from the current value.
2. If `after` qualifies, raise it to the greater of the current value and
   `civil(after)`. A null current value is lower than any date.
3. Then, if `before` qualified and `civil(before)` equals the current value (the
   changed event owned the value) and any of the following holds, replace the
   value with the greatest civil date over the qualifying events in
   `events_after`, or null when there are none:
   - `after` is null (delete),
   - `after` does not qualify (edit-away),
   - `civil(after)` is earlier than `civil(before)`.

`condition`:

1. `latest` is the event in `events_after` with a non-null `condition_after` and
   the greatest key, or none.
2. Create (`before` is null): if `after.condition_after` is non-null and `after`
   is `latest`, the condition becomes `after.condition_after`.
3. Edit or delete (`before` is non-null):
   - if `after` is non-null, has a non-null `condition_after` and is `latest`,
     the condition becomes `after.condition_after`;
   - otherwise, if `before.condition_after` is non-null, equals the current
     component condition, and `before` had the greatest key among the events with
     a non-null `condition_after` in (`events_after` without `after`) together
     with `before` (the changed event owned the condition), the condition becomes
     `latest.condition_after` when `latest` exists, else it is left unchanged.
4. Backfilling an old event never overwrites a newer condition, and a condition
   set by hand is only replaced by an event that is later than every other
   conditioned event.

Create and edit only raise. Delete and edit-away recompute only when the changed
event owned the current value. A date or condition set by hand that no event
owns is therefore never lowered by editing or deleting events.

Caveat: a manual `last_serviced_at` that happens to equal the deleted event's
date is treated as event-owned and recomputed. This is accepted and pinned by a
fixture case.

### Worked examples

- Create: component `last_serviced_at` null, create a service on `2026-05-10`.
  The value becomes `2026-05-10`; the patch is `{ last_serviced_at }`.
- Backfill: value `2026-05-10`, create a service on `2025-03-01`. The value stays
  `2026-05-10`; the patch is `{}`.
- Delete owner: value `2026-05-01`, owned by event A; another service exists on
  `2026-03-01`. Deleting A recomputes the value to `2026-03-01`.
- Delete only event: value `2026-05-01`, owned by the only service event. Deleting
  it makes the value null. The condition the event carried is left unchanged
  because no conditioned event remains.

## 6. Moving an event between components

Changing the component of an event is two calls: a delete on the old component
(`before` = the event on the old component, `after` = null) and a create on the
new component (`before` = null, `after` = the event with the new `component_id`).
The fixture holds one example pair (`move-...`).

## 7. One local transaction

The event write and the component patch commit together in one local transaction
on every platform. Only the fields in `patch` are written to the component. They
sync as ordinary field mutations (last write wins per field).

## Fixture list

`fixtures/event-application.json`: `apply_cases` (create, backfill, edit-date,
edit-type, edit-condition, delete-owner, delete-non-owner, delete-only-event,
tie, condition-latest-wins, condition-backfill, condition-manual-override,
layer-event, manual-date, non-noon, uppercase-id, move), `log_today_cases`,
`civil_cases`. Each apply case holds `component`, `before`, `after`,
`events_after` and `expected` (`last_serviced_at`, `condition`, `patch`).
