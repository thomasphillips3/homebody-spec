# Notification plan

Which local notifications a device should have pending, as a pure function of the
components, the home defaults, "now" and a few device settings. Fixture:
`fixtures/notification-plan.json`. Used by the iOS, Android and web reminder
schedulers. Tests in the spec repo verify the fixture against an independent
reference implementation, and each platform asserts the same file.

The rows of the plan come from the maintenance schedule function
(`maintenance-schedule.md`): `next_due`, `warranty_end` and the statuses are that
function's output for the current "today".

## 1. Inputs

- `now_local`: the device wall-clock time as `YYYY-MM-DDTHH:mm`. Today is its
  first 10 characters.
- `home_defaults` and `taxonomy_defaults`: as in `maintenance-schedule.md`.
- `components`: the component rows (`id`, `name`, `component_type`,
  `service_interval_days`, `last_serviced_at`, `install_date`, `warranty_start`,
  `warranty_length_months`, `deleted`).
- `snoozed_until`: map of component id to a civil date (device-local, see
  section 6). `{}` when nothing is snoozed.
- `enabled_kinds`: the kinds the user has turned on. Default: all four.
- `max_items`: the cap. Default 60.

## 2. Notices

All times are 09:00 device local. `fire_at` is the local wall-clock string
`{fire_date}T09:00`; each platform interprets it in the device time zone. The fire
date of a notice is its fire date in the rules below.

Service notices come from the schedule `next_due`:

| Kind | Fire date | Body |
|------|-----------|------|
| `service_due` | `next_due` minus 7 days | `Service due in 7 days` |
| `service_due` | `next_due` | `Service due today` |
| `service_overdue` | `next_due` plus 7k days, k = 1 to 4 | `Service overdue {7k} days` |

So at most 6 service notices per component: the 7-day notice, the due-day notice
and 4 weekly overdue repeats (7, 14, 21 and 28 days).

Warranty notices come from `warranty_end`:

| Kind | Fire date | Body |
|------|-----------|------|
| `warranty_ending` | `warranty_end` minus 30 days | `Warranty ends in 30 days` |
| `warranty_ending` | `warranty_end` minus 7 days | `Warranty ends in 7 days` |

The title is the component name. Kind `recall` is reserved and never emitted by
this function: recall notices are posted once after a pull that brings a new
`likely` open alert and are outside the plan.

## 3. Eligibility and filters

Applied in this order:

1. Drop deleted components.
2. A component whose service status is `needs_baseline` produces no service
   notices. Its warranty notices are independent of the service schedule and are
   still produced.
3. Drop a notice unless its `fire_at` is strictly later than `now_local` (string
   comparison). A notice due at 09:00 is not eligible at 09:00 exactly.
4. Snooze: when `snoozed_until` has a date `S` for the component, drop its
   `service_due` and `service_overdue` notices whose fire date is on or before `S`.
   Warranty notices are never snoozed.
5. Drop notices whose kind is not in `enabled_kinds`. This runs before the cap, so
   a disabled kind never uses a slot.
6. Sort by `fire_at`, then kind rank (`service_due`, `service_overdue`,
   `warranty_ending`, `recall`), then lowercase notification `id`.
7. Keep the first `max_items`.

## 4. Ids

`id` is the UUIDv5 of the string

```
{lowercase component_id}:{kind}:{fire_date}
```

in the namespace `5f3c9a2e-7b1d-4e68-9c04-2a8d6e1b7f35` (the same namespace as the
system ids). D-06 reads "due_date or fire_date"; this document fixes it to the fire
date, so the 7-days-before and due-day notices of one kind get distinct ids, and a
moved due date changes the ids. An uppercase component id gives the same ids as its
lowercase form. `id_vectors` lists independently recomputed values.

## 5. Reconciling with the system

Compute the plan, diff its ids against the pending requests, add the missing ones
and remove the stale ones. Never remove all pending requests and re-add them: a
wipe-and-reschedule drops everything if the app is killed in between. Reconcile on
foreground, after sync, after any event log, after a snooze and from the platform
background task.

The cap exists because iOS keeps at most 64 pending local notifications: schedule
the soonest 60 and leave headroom for the system and for recall notices. Android
and web use the same plan.

## 6. Snooze

Snooze Reminder is device-local (D-35, C17). It is stored in UserDefaults,
DataStore or localStorage, never synced, and other devices still fire. It enters
the plan as `snoozed_until`. The pre-set choices are 1 day, 3 days and 1 week from
today; the stored value is the civil date `S` and the rule in section 3 drops
notices on or before `S`.

## 7. Fixture

`fixtures/notification-plan.json`: `namespace`, `cases` (each with `name`,
`now_local`, `home_defaults`, `taxonomy_defaults`, `components`, `snoozed_until`,
`enabled_kinds`, `max_items` and `expected`, a list of `{ id, kind, component_id,
fire_at, title, body }`) and `id_vectors`.
