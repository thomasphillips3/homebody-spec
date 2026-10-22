# Maintenance schedule

When a component is next due for service, when its warranty ends, and which
section of the Due tab it belongs to. Pure logic every platform implements the
same way. Fixture: `fixtures/maintenance-schedule.json`. Used by the component
Reminders block, the Maintenance Due tab, the notification plan
(`notification-plan.md`), widgets and the Live Activity on web, iOS and Android.
Tests in the spec repo verify the fixture against an independent reference
implementation, and each platform asserts the same file.

All arithmetic is on civil dates (`YYYY-MM-DD`) with integer days-from-civil,
the same algorithm as `component-behavior.md` section 4. Never `Date` or
`Calendar`. "Today" is the device-local civil date and is an input to the
function.

This function replaces the earlier `nextServiceDue` (which read only
`service_interval_days`). The warranty end rule and the civil date math are kept.

## 1. Effective interval

The interval resolves in this order, and the first valid value wins:

1. `component.service_interval_days`
2. `home.maintenance_defaults[component_type]`
3. the taxonomy `default_service_interval_days` for the type
4. none

A value is valid only when it is an integer number of at least 1. Zero, negative,
fractional, string and null values are ignored and resolution falls through to the
next source. A home default for a different component type is never consulted.
The result is `{ days, source }` where `source` is `component`, `home`, `taxonomy`
or `none`.

Taxonomy defaults are supplied to the function as an explicit input
(`taxonomy_defaults`, a map of type to days), so the fixtures need no taxonomy
file. Platforms build that map from `spec/taxonomy/components.json`.

Fixture: `interval_cases`.

## 2. Baseline and next due

1. Baseline is `last_serviced_at`, else `install_date`, else none. The result
   reports the `baseline_source`: `last_serviced`, `install` or `none`.
2. `next_due` is the baseline plus the interval in days, only when both exist.
   Otherwise null.
3. `days_until_due` is `daysFromCivil(next_due) - daysFromCivil(today)`, or null
   when there is no `next_due`. Negative when overdue.

Integer civil days make daylight saving irrelevant: a baseline of 2026-03-07 with
a 1-day interval is due 2026-03-08 whether or not the clocks changed that night.
The fixtures include the 2026 spring-forward and fall-back dates to prove it.

## 3. Service status

- `needs_baseline` when the interval is none or the baseline is none.
  `needs_baseline_reason` is `no_interval` when the interval is none (this is
  checked first), otherwise `no_baseline`. It is null for every other status.
- `overdue` when `days_until_due < 0`
- `due_today` when `days_until_due == 0`
- `due_soon` when `days_until_due` is 1 to 30 inclusive
- `scheduled` when `days_until_due > 30`

## 4. Warranty

- `warranty_end` is `warranty_start` plus `warranty_length_months` calendar
  months, with the day clamped to the last day of the target month (Jan 31 plus
  1 month is Feb 28, or Feb 29 in a leap year). Null when either input is null.
- `warranty_days_until` is the days from today to `warranty_end`, or null.
- `warranty_status`: `none` without an end, `expired` when days < 0,
  `ending_soon` when days is 0 to 30 inclusive, `active` when days > 30.

Fixture: `warranty_cases` (and the warranty fields of every schedule case).

## 5. Result shape

`schedule_cases` hold the inputs (`today`, `component`, `home_defaults`,
`taxonomy_defaults`) and an `expected` object:

```
interval_days, interval_source, baseline, baseline_source, next_due,
days_until_due, service_status, needs_baseline_reason,
warranty_end, warranty_days_until, warranty_status
```

A soft-deleted component yields no row (`expected` is null).

## 6. Due tab sections

`section_cases` hold `today`, the defaults, a list of components and
`expected_sections`, five lists of component ids. Assignment:

| Section | Components |
|---------|------------|
| `overdue` | service_status `overdue` |
| `due_today` | service_status `due_today` |
| `coming_up` | service_status `due_soon` (the next 30 days) |
| `warranty_ending` | warranty_status `ending_soon` |
| `needs_baseline` | service_status `needs_baseline` |

Rules:

- A component can be in a service section and in `warranty_ending` at once.
- A `scheduled` component appears in no service section.
- Deleted components appear nowhere.
- A `needs_baseline` component can still be in `warranty_ending`.

Sort (total order inside each list):

- `overdue`, `due_today` and `coming_up`: `next_due` ascending, then lowercase
  `name`, then lowercase `id`.
- `warranty_ending`: `warranty_end` ascending, then lowercase `name`, then
  lowercase `id`.
- `needs_baseline`: lowercase `name`, then lowercase `id`.

Lowercase comparison is by code unit on the lowercased string. `Pump` and `pump`
compare equal on name and fall through to the id.

## 7. Display strings

The fixture holds numbers, not display strings. Clients render the wording from
`days_until_due` and `warranty_days_until` (UI-SPEC): "Overdue {n} days"
(`Overdue 1 day` for 1), "Due today", "Due in {n} days" (`Due tomorrow` for 1),
"Warranty ends in {n} days", and "Needs a baseline" with the reason line for
`no_interval` or `no_baseline`.
