# Changelog

All notable changes to the Home Record spec are documented in this file.

## 0.1.0 - 2026-09-17

Initial Home Record spec: Home, Level, Room, PlanGeometry, PlanElement,
System, Component, Event, Attachment, SmartHomeReading, UtilityBill
entities.

## Compatibility Policy

The Home Record spec follows semantic versioning (`MAJOR.MINOR.PATCH`),
recorded in `spec/VERSION` and echoed in every document's
`schema_version` field.

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
