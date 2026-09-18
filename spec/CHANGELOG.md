# Changelog

All notable changes to the Home Record spec are documented in this file.

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
