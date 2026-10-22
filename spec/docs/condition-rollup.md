# Condition roll-up

Roll-up is computed on the client and never stored. Golden cases live in
`spec/fixtures/condition-rollup.json`; every platform asserts them.

## Severity

| Condition | Severity |
|-----------|----------|
| good | 0 |
| fair | 1 |
| needs_attention | 2 |
| needs_replacement | 3 |
| unknown | excluded |

## Rules

- A layer is one of the seven system categories. A component belongs to a layer
  through its system.
- Tombstoned (deleted) components are ignored everywhere, including the total.
- A layer's condition is the worst severity over its non-deleted components with
  a known condition, or null ("Not assessed") when it has none.
- The whole-house condition is the worst severity over the layers whose condition
  is not null, or null when every layer is null.
- Per layer, `counts` has one integer per known condition. `total` counts
  non-deleted components including `unknown`.

## Fixture shape

```json
{
  "severity": { "good": 0, "fair": 1, "needs_attention": 2, "needs_replacement": 3, "unknown": null },
  "cases": [
    {
      "name": "...",
      "components": [{ "category": "plumbing", "condition": "good", "deleted": false }],
      "expected": {
        "layers": {
          "plumbing": { "condition": "good", "counts": { "good": 1, "fair": 0, "needs_attention": 0, "needs_replacement": 0 }, "total": 1 }
        },
        "house": "good"
      }
    }
  ]
}
```

`expected.layers` always lists all seven categories in taxonomy order, with
`condition: null`, zero counts and `total: 0` for an empty layer.
