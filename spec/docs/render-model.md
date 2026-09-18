# Plan render model

The render model is a platform-agnostic list of **draw commands** derived from
`rooms` and `plan_elements` for a single `Level`. It is the contract that keeps
iOS, Android, and web plan views visually aligned (PLAN-09).

Geometry in the Home Record is always stored as `PlanGeometry` in **meters**,
per-level plan space, **Y-down** (see `units-and-coordinates.md`). The render
model never applies calibration or pixel scale; clients convert meters to
screen pixels when drawing.

## Inputs

`generateRenderModel` accepts:

| Field | Description |
|-------|-------------|
| `level_id` | UUID of the level being rendered |
| `rooms` | Room records with `polygon` geometry for fills and hit-testing |
| `plan_elements` | Wall, door, window, and opening polylines for strokes and arcs |

Only entities whose `level_id` matches `level_id` are included.

## Outputs

`RenderModel`:

| Field | Description |
|-------|-------------|
| `level_id` | Same as input |
| `commands` | Sorted array of `DrawCommand` |

### Draw command kinds

| Kind | Used for | Fields |
|------|----------|--------|
| `fill` | Room interiors | `polygon`, `hit_test_id` (room id), `style` |
| `stroke` | Walls, openings, door gaps, windows | `points` (two endpoints per segment) |
| `arc` | Door swing (optional visual) | `center`, `radius_m`, `start_angle_rad`, `end_angle_rad` |

Each command includes:

- `id` - stable string derived from source entity and command role
- `layer` - z-order (lower drawn first)
- `style` - token referencing `spec/render/style-tokens.json`
- `source_id` - `room.id` or `plan_element.id`

Commands are sorted by `layer`, then `source_id`, then `id`.

### Style tokens

`spec/render/style-tokens.json` defines meter-based stroke widths and fill
opacities. Line weight is **not** expressed in pixels; each client multiplies
`width_m` by its current meters-per-point scale at draw time.

Layer numbers in the same file define default z-order:

1. Room fills
2. Walls
3. Openings
4. Doors (gap + swing arc)
5. Windows

Platform chrome (Liquid Glass, Material 3) applies outside this model.

## Reference implementation

TypeScript lives under `spec/render/`:

- `draw-commands.ts` - `generateRenderModel`
- `types.ts` - portable types for Swift/Kotlin ports
- `style-tokens.json` - shared visual constants

Golden vectors under `spec/fixtures/render/` pair `*.input.json` with
`*.golden.json`. CI runs Vitest (`tests/render/golden.test.ts`) on every
change to the render module.

## Door swing convention

For a door `polyline`, the **first** point is the hinge and the **last** is the
free end along the wall. The swing arc uses the segment length as radius and
sweeps 90 degrees into the positive-Y half-plane relative to the wall direction
(Y-down plan space).

## Selected room styling

`room.fill.selected` is defined in style tokens for clients to swap when a room
is selected (PLAN-08). The generator emits `room.fill` only; selection is a
client-side style override on the same polygon/hit_test_id.
