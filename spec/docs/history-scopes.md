# History scopes

Which events a History list shows, in what order, and how they group. Pure logic
every platform implements the same way. Fixture: `fixtures/history-scopes.json`.
Used by the component History section, the layer view, the room view and the
Maintenance History tab. Tests in the spec repo verify the fixture against an
independent reference implementation, and each platform asserts the same file.

## 1. Order

Every scope orders events by `occurred_at` descending (newest first), ties broken
by lowercase `id` ascending. This is the ordering key of `event-application.md`
section 3 reversed on the instant only: `9...` before `a...`, and an uppercase id
compares as its lowercase form.

## 2. Scopes

Soft-deleted events never appear in any scope.

- Component scope: events whose `component_id` is that component. Shown even when
  the component itself is soft-deleted.
- Layer scope (the layer's system): events whose `system_id` is the layer's
  system, plus events of every non-deleted component whose `system_id` is that
  system. Events of a soft-deleted component are excluded from the layer scope.
- Room scope: events of non-deleted components whose `room_ids` contains the room.
  System-level events are excluded. A room with no components has an empty list.
- House scope: every live event for the home, including orphans whose component
  was deleted and system-level events. Events of another home never appear.

## 3. Month grouping

The group key is the first 7 characters of `occurred_at` (`YYYY-MM`, the UTC
month). Groups are ordered newest month first. Rows inside a group keep the
scope order of section 1. An empty scope has no groups.

## 4. Delete confirmation counts

The cascade delete confirmation (C15, D-34) states a count of live events:

- Deleting a component counts the live events whose `component_id` is that
  component.
- Deleting a home counts every live event of that home, including system-level
  events.

Soft-deleted events are never counted.

## Fixture list

`fixtures/history-scopes.json`: one shared dataset (`home_id`, `systems`, `rooms`,
`components`, `events`) with `cases` (scope and expected event ids),
`month_group_cases` and `cascade_count_cases`. Event fields used: `id`,
`home_id`, `system_id`, `component_id`, `event_type`, `occurred_at`, `title`,
`deleted`. Component fields used: `id`, `home_id`, `system_id`, `room_ids`,
`deleted`.
