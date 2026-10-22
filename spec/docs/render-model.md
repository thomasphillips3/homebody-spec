# Plan render model

The render model is a platform-agnostic list of **draw commands** derived from
`rooms`, `plan_elements` and (optionally) `components` for a single `Level`. It is the contract that keeps
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
| `components` | Optional. Components to overlay: `id`, `level_id`, `category` (the layer), `geometry` (`point` with one pair, or `polyline` with two or more) |

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
| `marker` | Point component, or the midpoint glyph of a run component | `center`, `category`, `glyph`, `hit_test_id` (component id) |

Each command includes:

- `id` - stable string derived from source entity and command role
- `layer` - z-order (lower drawn first)
- `style` - token referencing `spec/render/style-tokens.json`
- `source_id` - `room.id`, `plan_element.id` or `component.id`

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

## Component overlay

`components` is optional. When it is absent or empty the output is exactly what it
was before components existed (the three older goldens are byte-identical), and
no component field is emitted. Absent optional fields are omitted, never null.

Clients pass **only components whose layer is currently visible**. Layer
visibility is device-local UI state (never synced), so it lives outside the
generator.

For components whose `level_id` equals the input `level_id`:

- A **point** component (exactly one coordinate pair) emits one `marker`:
  `id` `<id>:component.marker`, style `component.marker`, layer 50,
  `source_id` and `hit_test_id` equal to the component id, `center` the rounded
  pair, `category`, and `glyph` from the category map below.
- A **polyline** component (two or more pairs) emits one `stroke` per segment:
  `id` `<id>:component.run:<i>` (i from 0), style `component.run`, layer 40,
  `source_id` the component id, `category`, and `points` the two rounded
  endpoints. It also emits exactly one `marker` at the midpoint of its longest
  segment (the first one on ties), computed from the rounded endpoints and then
  rounded again.
- Malformed geometry (a point without exactly one pair, a polyline with fewer
  than two) is skipped. Components on another level are skipped.
- Coordinates are rounded to 6 decimals, and commands are sorted by layer, then
  `source_id`, then `id`, exactly as for other commands.

The generator never receives a condition and never emits `component.halo` or
`component.badge`. Selection (halo) and condition (badge) are client state drawn
over the model; see the drawing rules below.

### Category to glyph

There is no per-component glyph override.

| Category | Glyph |
|----------|-------|
| plumbing | droplet |
| electrical | bolt |
| hvac | fan |
| roof_structure | roofline |
| appliances_and_water_heater | appliance_box |
| exterior_and_site | tree |
| low_voltage_and_smart_home | router |

### Component tokens

`style-tokens.json` keeps the meter-based `strokes` map untouched. Component
sizes are screen-fixed and live in a `markers` group (logical pixels: pt, dp, px):

| Token | Values |
|-------|--------|
| `component.marker` | diameter 28, hit radius 22, badge 14 |
| `component.run` | width 4, casing 6, hit band 12 |
| `component.halo` | ring 3, gap 2 |

Layers: `component.run` 40, `component.halo` 45, `component.marker` 50,
`component.badge` 51. The `components` section of the same file holds layer
colors, condition colors, halo ink and the glyph and badge path data.

Layer colors (light / dark), WCAG AA against the plan canvas:

| Layer | Light | Dark |
|-------|-------|------|
| plumbing | #00698f | #5cc8f0 |
| electrical | #8f5a00 | #f2b84b |
| hvac | #b8431a | #ff8a5c |
| roof_structure | #6b4f2a | #d2b07a |
| appliances_and_water_heater | #6a3fa0 | #b99af0 |
| exterior_and_site | #4d7a14 | #9acd5a |
| low_voltage_and_smart_home | #c2185b | #ff7aa8 |

Glyphs (seven) and condition badges (good, fair, needs_attention,
needs_replacement, each with an `outer` shape and a `mark`) are 24x24 viewBox
paths that use only absolute `M`, `L`, `C` and `Z` commands separated by single
spaces, so each platform parses them with a tiny parser, and are filled with the
even-odd rule. The badge fill is the condition color and the mark uses the badge
mark color. The not-assessed condition (`unknown`) has a color and a dashed circle
outline in chrome but no badge on the plan.

### Drawing rules (client)

- Markers and run strokes keep a constant screen size at every zoom.
- Runs use round caps and joins, a 4 px stroke in the layer color over a 6 px
  casing in the canvas color. All runs are solid.
- A marker is a 28 px disc in the surface color with a 2 px ring and the 16 px
  glyph in the layer color. A 14 px condition badge sits at its bottom-right when
  the condition is known, on a 2 px canvas-colored casing.
- The selection halo is a 3 px ring in plan ink with a 2 px canvas-colored gap,
  drawn around the selected marker or midpoint glyph, plus a 3 px ink casing
  under a selected run.
- Z-order: runs 40, halo 45, markers 50, badges 51, above all room and element
  layers.
- Hit-testing uses the radii above; see `component-behavior.md`.
