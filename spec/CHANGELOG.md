# Changelog

All notable changes to the Home Record spec are documented in this file.

## 0.5.0 - 2026-10-22

- Widened `Component.component_type` from 15 to 78 values covering the seven
  layers (plumbing, electrical, HVAC, roof and structure, appliances and water
  heater, exterior and site, low-voltage and smart home) plus `other`. All 15
  previous values stay valid and unchanged.
- Added optional nullable `Component.manual_url` (format uri; clients and the
  database accept only http and https) and `Component.location_note`.
- `schema_version` accepts `0.5.0`; both Home Record fixtures use it and the
  maximal fixture gains a heat pump component using the new fields.
- Added `spec/taxonomy/components.json` (the single data source for the 78
  types: category, label, placement, default service interval, aliases, typed
  fields) and `spec/taxonomy/brands.json` (brand dictionary for nameplate make
  detection).
- Added shared behavior fixtures: `bootstrap-systems.json` (deterministic
  UUIDv5 system ids), `condition-rollup.json`, `nameplate/` (17 parser
  cases), and `components/` (`placement`, `reminders`, `search`, `links`).
- Render model extension: optional `components` input, a `marker` draw
  command, per-segment `component.run` strokes with `category`, and the
  `component.*` style tokens, glyph paths and layer colors. Existing goldens are
  unchanged; a `components-overlay` golden pair is added.
- Added docs: `taxonomy.md`, `nameplate-parsing.md`, `condition-rollup.md`,
  `systems-bootstrap.md`, `component-behavior.md`; `render-model.md` updated.
- Compatibility: every new field is optional and nullable, so 0.4.0 records
  still validate. A 0.5.0 record that uses a new `component_type` cannot be
  imported by a 0.4.0 reader because the enum is widened.

## 0.4.0 - 2026-10-22

- Added six optional nullable scan fields to `Level` (`scan_usdz_attachment_id`,
  `scan_structure_attachment_id`, `scan_glb_attachment_id`, `scan_origin_m`,
  `scan_rotation_rad`, `scan_review_state`) so a level can come from a
  RoomPlan scan and carry a review gate (PLAN-06, PLAN-07, MAGIC-04). The
  three attachment pointers are soft references, not foreign keys, because
  the level patch can sync before the attachment row.
- Added optional nullable `source` (`hand`, `trace`, `roomplan`; null means
  hand) to `PlanElement` and `Room` so scan rows can be told apart from
  hand-drawn rows in one coordinate space.
- Added `roomplan_structure` and `gltf_mesh` to `Attachment.kind`.
- Added `spec/docs/roomplan-projection.md` (normative 3D-to-2D projection
  rules) and the `spec/fixtures/roomplan/` structure fixtures with derived
  plan goldens, plus a `roomplan-scan` render parity pair.
- Compatibility: all new fields are optional and nullable; every 0.3.0
  record stays valid.

## 0.3.0 - 2026-09-28

- Added five nullable import fields to `Level` (`import_attachment_id`,
  `import_origin_m`, `import_scale_m_per_px`, `import_pixel_width`,
  `import_pixel_height`) so a level can carry an imported floor-plan
  background image/PDF, its plan-space placement, and its pixel dimensions.
  None of these fields are required; existing hand-drawn Level records
  round-trip unchanged (PLAN-03).
- Added `floor_plan_source` to `Attachment.kind`, labeling the imported
  file distinctly from `photo`/`receipt`/`manual_pdf`/`usdz_mesh`.
- Updated `maximal-home.json` with a `Level` exercising the new import
  fields and a `floor_plan_source` `Attachment`.

## 0.2.0 - 2026-09-18

- Added the shared plan render model (`spec/render/`) with TypeScript reference
  implementation, style tokens, and golden draw-command fixtures for cross-platform
  parity (PLAN-09).
- Documented the render contract in `spec/docs/render-model.md`.
- No required Home Record entity fields changed; `schema_version` `0.2.0` marks
  documents produced after this release.

## 0.1.1 - 2026-09-17

- Generated a public Swift package API that external Release consumers can
  import and decode without `@testable`.
- Replaced lossy generated Zod validation with a standalone validator built
  from the authoritative Draft 2020-12 schema.
- Confined schema reference loading to real paths under `spec/schema` and
  disabled built-in file and network resolution.
- Required every Event to target a non-null system or component UUID and
  enforced point, polyline, and polygon coordinate cardinality.
- Canonicalized attachment paths to begin with `owner_user_id`, matching
  deployed Storage RLS.
- Added distributable npm outputs, direct Node and Swift consumer tests,
  fixture integrity checks, version checks, and hardened CI validation.

## 0.1.0 - 2026-09-17

Initial Home Record spec: Home, Level, Room, PlanGeometry, PlanElement,
System, Component, Event, Attachment, SmartHomeReading, UtilityBill
entities.

## Compatibility Policy

The Home Record spec follows semantic versioning (`MAJOR.MINOR.PATCH`),
recorded in `spec/VERSION` and echoed in every document's
`schema_version` field.

- **Patch version bumps (`0.1.x`)** correct schema or tooling defects without
  adding or removing public fields. A patch may tighten validation only where
  the prior schema contradicted an already documented or deployed invariant.
- **Minor version bumps (`0.x.0`)** add optional fields or enum values
  only. A minor bump never removes a field, never changes a field's type,
  and never makes a previously-optional field required. A document
  produced against `0.1.0` remains valid against every later `0.x.0`
  schema.
- **Major version bumps (`x.0.0`)** may make breaking changes: removing or
  retyping a field, tightening a previously-optional field to required, or
  restructuring an entity.
- **Unknown versions fail closed.** Any consumer reading a `schema_version`
  it does not recognize as compatible must reject the document with an
  explicit "unsupported version" error. Attempting best-effort parsing of
  an unrecognized version is not spec-conformant behavior - see Pitfall 8
  in the project's research notes for why silent best-effort parsing is
  the wrong default here.
