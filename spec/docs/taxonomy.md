# Component taxonomy

`spec/taxonomy/components.json` is the single data source for component
types. The `component_type` enum in `component.schema.json` and this file are
kept equal by `tests/taxonomy.test.mjs` (id-set equality, 78 types). Each
platform vendors a byte-equal copy of the file and loads it at runtime; no
platform hard-codes a type list.

## File shape

```json
{
  "version": "0.5.0",
  "categories": ["plumbing", "electrical", "hvac", "roof_structure",
                 "appliances_and_water_heater", "exterior_and_site",
                 "low_voltage_and_smart_home"],
  "types": [
    {
      "id": "water_heater",
      "category": "appliances_and_water_heater",
      "label": "Water heater",
      "placement": "point",
      "default_service_interval_days": 365,
      "aliases": ["hot water heater", "tank"],
      "fields": [
        { "key": "heater_type", "label": "Heater type", "kind": "enum",
          "options": ["storage", "tankless"] },
        { "key": "capacity_gal", "label": "Capacity", "kind": "number", "unit": "gal" }
      ]
    }
  ]
}
```

- `categories` is the fixed layer order: plumbing, electrical, hvac,
  roof_structure, appliances_and_water_heater, exterior_and_site,
  low_voltage_and_smart_home. Platforms show layers in this order.
- `types` keeps document order: layer order first, then table order inside a
  layer, with `other` last. Platforms preserve it for display.
- `placement` is `point`, `run` or `either` (the user picks Point or Run).
- `default_service_interval_days` is null or a positive integer. Phase 6
  consumes it; reminders treat null as "no schedule".
- `aliases` are lowercase search terms (InterNACHI and HPXML vocabulary).
- `fields[].kind` is one of `text`, `number`, `enum`, `date`, `bool`. `unit` is
  optional on numbers. `options` is required and non-empty on enums.

## Category rule

Each type has exactly one category. Where InterNACHI places an item, that
placement wins: smoke and CO detectors are Electrical, chimney, gutters and
downspouts are Roof and structure, garage doors and openers are Exterior,
fireplaces and ventilation fans are HVAC. The thermostat stays in HVAC.
HPXML sub-types are `enum` fields (for example `heat_pump_type`), not
separate types.

The `other` type has category `any` and is offered in every layer. It has one
text field, `description`. Counting `other` does not satisfy the per-layer
minimum of 8 types.

## Label rule

Type labels are sentence case. Field labels are derived from the key by
replacing underscores with spaces and sentence-casing, after dropping a
trailing unit suffix that the `unit` already carries (`capacity_gal` with unit
`gal` is "Capacity"). Fixed overrides: `afue` is "Efficiency (AFUE)", `uef` is
"UEF", `seer` is "SEER", `hspf` is "HSPF", `cfm` is "Airflow", `r_value` is
"R-value", `u_factor` is "U-factor", `capacity_btuh` is "Capacity". Clients
append the unit when rendering.

## Field value storage

Values live in `Component.custom_fields`, keyed by the field `key`:

- numbers are JSON numbers, dates are `YYYY-MM-DD` strings, bools are JSON
  booleans, enums are the option string, text is a string;
- a cleared field removes the key or writes JSON null, never an empty string;
- unknown keys already present are preserved untouched when another field
  changes.

`wire_gauge` options are the strings "14", "12", "10", "8", "6", "other".

## Brands

`spec/taxonomy/brands.json` holds the brand dictionary for nameplate make
detection. See `nameplate-parsing.md` for the matching rule.

## manual_url safety

`Component.manual_url` is a link the user can open. The schema marks it
`format: uri`, but a uri format also permits `javascript:`, `file:` and `data:`
schemes. Clients must allow only `http` and `https` when writing the field and
again when opening it, and the database enforces the same with a CHECK
constraint.
