# Units and coordinate system

This document defines the units and coordinate conventions used across the
Home Record spec. The JSON Schema itself only describes shape and type - it
cannot express "this number is in meters" or "Y points down." A third party
implementing this spec from `spec/schema/` alone needs this document too.

## Units

Every dimensional value in the spec - lengths, areas, coordinates, elevation
offsets - is in **meters**. There is no per-field unit tag and no `{value,
unit}` pair anywhere in the schema. A single fixed unit was chosen over a
unit-tagged-value pattern because it removes an entire class of unit-mismatch
bugs (mixing meters and feet in the same document) at the cost of pushing
unit conversion to the edges, which is where it belongs anyway.

- `Home.sq_ft` is the one exception in naming only: it is stored as a plain
  number and named to match how US assessor data reports it (square feet),
  not square meters. Every other dimensional field - `Home.lot_size_m2`,
  `Level.elevation_offset_m`, `PlanGeometry.coordinates`, computed areas like
  `Room.area_computed_m2` - uses metric units and says so in the field name.
- Imperial/metric display formatting (showing a client's user "10 ft" instead
  of "3.05 m") is entirely a client-side presentation concern. It is never
  stored, and the spec has no field for a user's preferred display unit.
- Every input source converts to meters at the point of entry, once, and the
  stored value is never re-derived from an original unit:
  - RoomPlan's `CapturedRoom` already reports walls, doors, windows, and
    openings in meters, in a right-handed 3D coordinate system - no
    conversion needed beyond the 3D-to-2D collapse described below.
  - Hand-drawn plans have no inherent unit. The drawing tool asks for one
    calibration measurement ("this wall is 8 feet") and converts that single
    reference into meters; every other point in that drawing session is then
    already in meters.
  - Imported/traced raster or PDF plans go through the same one-time
    calibration step (click two points on the image, enter the real-world
    distance) to compute a meters-per-pixel scale factor. That scale factor
    is stored as Level metadata for re-tracing later, but every point
    actually written into `PlanGeometry.coordinates` is already in meters -
    nothing downstream needs to know a scale factor or handle pixels.

## Coordinate system

Each `Level` owns its own independent 2D plan space. There is no shared
whole-home 3D coordinate system in v1.

- **Origin.** A level's origin is the top-left corner of that level's plan
  bounding box. It is not tied to true north, GPS, or any fixed real-world
  reference point.
- **Axes and orientation.** The Y axis points **down** - increasing Y moves
  toward the bottom of the plan, matching screen and canvas coordinate
  conventions on all three platforms (SwiftUI `Canvas`, Compose `Canvas`,
  HTML `<canvas>`/`react-konva`). This was chosen specifically so no renderer
  needs a Y-flip between storage and display.
- **Shape.** `PlanGeometry.coordinates` is an array of `[x, y]` pairs in that
  level's plan space, in meters, per the units section above. A `point` has
  one pair, a `polyline` has two or more, a `polygon` has three or more
  (typically closed by repeating the first point as the last).

## Per-level transforms, not a shared 3D grid

`Level.sort_order` and `Level.elevation_offset_m` are the only mechanism for
stacking levels for display - `sort_order` determines the vertical order
levels are drawn in (e.g. basement below main floor below second floor), and
`elevation_offset_m` gives an optional real-world height offset for that
stacking (for a 3D or isometric view later).

There is deliberately no attempt to register levels into one shared XY grid
in v1. Real-world multi-story RoomPlan capture does not produce
automatically-aligned coordinates across floors - the user starts a fresh
scan on each level, and that scan's origin has no relationship to any other
level's origin. Forcing alignment (for example, matching a stairwell
footprint between two levels) is a real feature, but it is a v2 feature, not
a blocker for v1.

This is a **known v1 limitation**, not a bug: a system that physically runs
between floors (a plumbing stack, an electrical riser) is logged as separate
`Component` records per level today, connected only by the
`Component.linked_component_id` escape hatch. A future version may add a
true shared coordinate system or an explicit per-level alignment transform;
neither exists in this version of the spec.

## One representation regardless of source

RoomPlan capture, hand-drawing, and import/trace all convert into the exact
same `PlanGeometry` shape at the moment a plan is saved:

- RoomPlan's 3D wall/door/window/opening surfaces are projected onto the
  horizontal plane by taking each surface's base edge - a standard "plan
  from BIM" projection performed once, at import time.
- Hand-drawn geometry is already 2D and already in the level's plan space by
  construction.
- Imported/traced geometry is converted from image-pixel space into the
  level's plan space using the calibration scale factor described above.

Once a `Room`, `PlanElement`, or `Component` geometry is stored, nothing
downstream - the renderer, the PDF export, another app importing this spec -
ever needs to know whether that geometry originated from a LiDAR scan, a
hand drawing, or a traced import. That normalization at ingestion time is
the entire point of having one shared `PlanGeometry` type.
