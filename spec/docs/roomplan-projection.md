# RoomPlan projection

This document is the single normative source for turning an Apple RoomPlan
`CapturedStructure` into Home Record plan rows (`PlanElement` and `Room`
geometry, plus the `Level` scan placement fields). Every platform that
produces scan geometry, and every test that pins it, follows these rules.
The fixtures under `spec/fixtures/roomplan/` are the executable form of this
document: `*.structure.json` are inputs and `*.plan.golden.json` are the
expected outputs.

All numbers below are meters and radians unless stated.

## 1. Inputs

- RoomPlan space is right-handed, Y-up, meters. Plan space (see
  `units-and-coordinates.md`) is Y-down meters.
- A surface transform is 16 floats, column-major: indices 0-3 are the local
  X axis, 4-7 the local Y axis, 8-11 the local Z axis, 12-15 the translation.
  `world = T * (x, y, z, 1)`, so `world.x = m[0]*x + m[4]*y + m[8]*z + m[12]`
  and likewise for `y` (row 1) and `z` (row 2).
- `dimensions` is `[width, height, thickness]`. A surface is a unit box
  scaled by `dimensions` and placed by `transform`. Wall thickness may be 0.
- `polygonCorners` are `[x, y, z]` triples in the surface local frame.
- Only the flattened top-level arrays of the structure (`walls`, `doors`,
  `windows`, `openings`, `floors`, `sections`) are projected. The `rooms`
  array is ignored. Objects are ignored.

## 2. Plan mapping

```
planPoint = R(scan_rotation_rad) * (X, Z) + scan_origin_m
R(t)      = [[cos t, -sin t], [sin t, cos t]]
```

`(X, Z)` are the world X and world Z of a point. Plan Y is world Z with no
mirror. Derivation: looking down the -Y axis with +X to the right puts +Z
toward the bottom of the screen, which is the plan's Y-down direction.

`scan_rotation_rad` and `scan_origin_m` are computed by the normalization in
section 6 and stored on the `Level`, so the original USDZ can be registered
to the plan later.

## 3. Segment rule (wall, door, window, opening)

The base edge of a surface runs from local `(-w/2, -h/2, 0)` to
`(+w/2, -h/2, 0)`, where `w = dimensions[0]` and `h = dimensions[1]`. Push
both points through the transform and drop Y. The first point is `a`, the
second is `b`.

- Every emitted element is a 2-point polyline `[a, b]`.
- A door's hinge is its first point, the local -x end (assumption A3 in
  section 11).
- Drop any segment shorter than 0.05 m. The wall chords in section 7 are
  subject to the same rule.

## 4. Rooms

For each floor surface, in input order:

1. Take `polygonCorners` through the transform, drop Y, and close the ring by
   repeating the first point if the last differs from it.
2. If `polygonCorners` is empty, use the dimensions rectangle instead:
   local `(-w/2, -h/2)`, `(w/2, -h/2)`, `(w/2, h/2)`, `(-w/2, h/2)` with
   local z = 0, where `h = dimensions[1]` is the extent along the floor's
   local Y axis.
3. Require at least 3 distinct vertices, else skip the floor and emit the
   warning `degenerate_floor`.
4. `area_m2` is the absolute shoelace area of the ring.
5. `room_type` comes from the first section (input order) whose center,
   taken as world `(x, z)`, lies inside the ring (ray casting, evaluated
   before normalization; the test is rotation invariant). Section label to
   room type: `livingRoom` to `living_room`, `bedroom`, `bathroom`,
   `kitchen`, `diningRoom` to `dining_room`, anything else `other`. With no
   containing section the type is `other`. `room_type` always stays inside
   the database check set: `bedroom`, `bathroom`, `kitchen`, `living_room`,
   `dining_room`, `garage`, `basement`, `attic`, `hallway`, `closet`,
   `laundry`, `office`, `other`.

## 5. Hosting

A door, window, or opening gets `host_surface_id` as follows:

1. If `parentIdentifier` names a wall in the input, that wall.
2. Otherwise the nearest wall whose distance is within 0.35 m, where the
   distance is from the element midpoint `(a + b) / 2` to the wall's emitted
   segments (the base edge, or the chords of a curved wall), minimum over
   segments. Ties go to the earlier wall in input order.
3. Otherwise null.

For a curved wall the host id is the wall surface identifier, never a chord
id.

## 6. Normalization

One rigid transform per scan, applied after all points are mapped to
`(X, Z)`:

1. For each wall surface (one entry per surface, a curved wall counts once by
   its chord from `a` to `b`) compute `phi_i = atan2(dZ, dX)` of the base
   edge `a` to `b` and a weight `w_i` equal to the chord length.
2. `mean = atan2(sum w_i sin(4 phi_i), sum w_i cos(4 phi_i)) / 4`.
   `scan_rotation_rad = -mean`, which lies in `[-pi/4, pi/4)`. If the
   resultant vector length is below `1e-9` times the total weight (or there
   are no walls) use `0`.
3. Rotate every emitted point (elements and room rings) with
   `R(scan_rotation_rad)`.
4. `scan_origin_m = -(min x, min y)` of the rotated bounding box of all
   emitted element points and room ring points, so the bounding box top-left
   lands on `(0, 0)`. With no points the origin is `[0, 0]`.
5. Normalize `-0` to `0`.

## 7. Curved walls

A wall with a non-null `curve` is subdivided into chord segments
(assumption A2 in section 11):

- `curve.center` is `[cx, cz]` in the surface local horizontal plane,
  `radius` is `r`, and the angles are radians (the encoded measurement
  `value` is already radians).
- An arc point at angle `t` is local `(cx + r cos t, -h/2, cz + r sin t)`
  pushed through the transform.
- Sweep is `|endAngle - startAngle|` in degrees. Chord count is
  `n = ceil(sweepDegrees / 15 - 1e-9)`, at least 1. Points are taken at
  `t_k = startAngle + (endAngle - startAngle) * k / n` for `k = 0..n`.
- Orientation: compute the arc end points `p0` (at `startAngle`) and `p1`
  (at `endAngle`). If `|p0 - a| + |p1 - b|` is greater than
  `|p0 - b| + |p1 - a|` reverse the point list so the chain runs from the
  `a` side to the `b` side.
- If either end of the chain misses its base-edge end point (`a` or `b`) by
  more than 0.05 m, ignore the arc, emit the single straight base-edge
  chord, and emit the warning `curve_fallback`.
- Chord element ids are `<identifier>#<k>` with `k` from 0, in chain order.
  This also applies to the single fallback chord (`<identifier>#0`).
- Every chord is its own 2-point wall polyline. Editors and enclosure code
  read only the first and last point of a wall, so a curved wall is never
  emitted as one multi-point polyline.

## 8. Ordering

Elements are emitted walls first (input order, chords in chain order), then
doors, then windows, then openings (each in input order). Rooms follow floor
input order. `story_count` is the number of distinct `story` values over all
wall, door, window, opening, and floor surfaces. When it is greater than 1
the producer should also emit the warning `multi_story` and never split the
scan across levels automatically.

A dropped short segment (section 3) emits the warning `short_segment_dropped`.

## 9. Limits (security)

A producer must reject the whole structure when any of these hold, because the
structure may be hostile or corrupt:

- any non-finite number in a transform, dimension, polygon corner, curve, or
  section center;
- more than 5000 surfaces (walls, doors, windows, openings, and floors
  together);
- any coordinate magnitude above 10000 m (transform translation, dimensions,
  polygon corner, section center, or projected point).

## 10. Golden file format

`<name>.plan.golden.json`:

```json
{
  "scan_rotation_rad": 0,
  "scan_origin_m": [0, 0],
  "story_count": 1,
  "elements": [
    {
      "surface_id": "<uuid or uuid#k>",
      "kind": "wall | door | window | opening",
      "host_surface_id": null,
      "coordinates": [[0, 0], [4, 0]]
    }
  ],
  "rooms": [
    {
      "surface_id": "<uuid>",
      "room_type": "kitchen",
      "ring": [[0, 0], [4, 0], [4, 3], [0, 3], [0, 0]],
      "area_m2": 12
    }
  ],
  "warnings": [{ "code": "curve_fallback", "surface_id": "<uuid>" }]
}
```

Numbers are rounded to 6 decimals. Consumers compare with a tolerance of
`1e-4`; the independent derive script (`derive-goldens.mjs --check`) uses
`1e-6`.

The structure fixtures are written by `generate-structures.mjs` and the
goldens by `derive-goldens.mjs`, which is a second implementation written
from this document. Hand-worked check of the box fixture: a 4 m (X) by 3 m (Z)
room gives walls `(0,0)-(4,0)`, `(4,0)-(4,3)`, `(4,3)-(0,3)`, `(0,3)-(0,0)`,
a door `(0.55,0)-(1.45,0)` on the north wall, a window `(4,0.9)-(4,2.1)` on
the east wall, and a room ring `(0,0),(4,0),(4,3),(0,3),(0,0)` of area 12.

Fixtures:

| Name | Covers |
|------|--------|
| `box` | Four walls, off-center door, window on one wall only, floor, kitchen section |
| `rotated30` | The box yawed 30 degrees about Y and translated; same elements, nonzero rotation and origin |
| `lshape` | Non-rectangular floor, hosted door and window, opening with null `parentIdentifier` (0.35 m fallback) |
| `tworoom` | Two rooms sharing one wall emitted once, two floors, two sections |
| `arcwall` | A curved wall subdivided into 15 degree chords plus a straight wall, no floor |

## 11. Known unverified assumptions

These could not be checked without a LiDAR capture. The device UAT capture
must re-check them and, if wrong, this document and the goldens change in a
new spec release.

- **A1.** The flattened `CapturedStructure` arrays share one world frame
  (they are not per-room frames offset by `referenceOriginTransform`).
- **A2.** `curve` lives in the surface local horizontal plane as described in
  section 7.
- **A3.** RoomPlan gives no door hinge side; the local -x end is the hinge.
