# Systems bootstrap

Every home has seven `System` rows, one per layer. Their ids are deterministic,
so two devices that bootstrap the same home offline converge on the same rows
instead of creating duplicates.

## Id

`System.id` is a UUIDv5 (RFC 4122 section 4.3, SHA-1, version nibble 5, variant
bits `10xx`) of the name `"{home_id lowercase}:{category}"` in the namespace

```
5f3c9a2e-7b1d-4e68-9c04-2a8d6e1b7f35
```

This is the existing app namespace. It never changes. The colon separator keeps
these names disjoint from scan names, which use `/`.

## The seven systems

| category | name |
|----------|------|
| plumbing | Plumbing |
| electrical | Electrical |
| hvac | HVAC |
| roof_structure | Roof and structure |
| appliances_and_water_heater | Appliances and water heater |
| exterior_and_site | Exterior and site |
| low_voltage_and_smart_home | Low-voltage and smart home |

## Ensure rule

`ensure(home_id)` runs when a home is created and every time a home is opened:

1. For each category in the order above, compute the id.
2. If a local row with that id exists in any state (including a pending local
   write), skip it.
3. Otherwise create it with `{ home_id, category, name }`.
4. Return the category-to-id map.

It is idempotent and a no-op when all seven exist. The server applies a repeated
identical push as a column-wise update that changes nothing, so two devices
pushing the same row yield one row.

Never run it for a tombstoned home: the server refuses to resurrect a
soft-deleted row. Deleting a home also deletes its systems and components, which
keeps that case unreachable.

## Vectors

`spec/fixtures/bootstrap-systems.json` pins the ids for home
`10000000-0000-4000-8000-000000000001`. A spec test recomputes each id with
SHA-1 independently of any fixture-reading code, and each platform asserts the
same table.
