# Attachment referencing

`Attachment` records (photos, receipts, manual PDFs, RoomPlan USDZ meshes)
are **referenced, not embedded**, in a Home Record JSON document.

## What is actually stored

An `Attachment` entity's `storage_path` field holds a Supabase Storage key -
a path like
`{owner_user_id}/homes/{home_id}/attachments/{attachment_id}.jpg` that
resolves to the actual bytes in Supabase Storage. The first path segment is
always the owning user's UUID, matching the deployed Storage RLS policy. The
JSON document itself never contains attachment bytes: no `base64`-encoded
image data, no inline PDF content, no embedded USDZ mesh.
`Event.attachment_ids`,
`Component.manual_attachment_id`, `Attachment.linked_event_id`, and
`Attachment.linked_component_id` are all references by id - the same pattern
as every other foreign-key-shaped field in the spec.

## Why reference instead of embed

This keeps an exported Home Record JSON document compact and fast to
transfer, parse, and diff, regardless of how many high-resolution photos or
how large a RoomPlan USDZ mesh a home has accumulated. A home with years of
inspection photos should still produce a JSON export in the low kilobytes to
single-digit megabytes, not one that scales with total photo storage.

Reference-by-path does mean a bare Home Record JSON export is not
self-contained - resolving an attachment to actual bytes requires access to
the storage location the `storage_path` points at. That is an accepted
trade-off for v1: the primary export/import use case is app-to-app or
device-to-device transfer where both sides have (or can be granted) access
to the same storage backend, not "hand someone a single file with
everything in it."

## A bundled-bytes export is a documented future extension, not part of v1

A future export mode that packages attachment bytes alongside the JSON (for
example, a zip containing `record.json` plus an `attachments/` directory) is
anticipated - it is the natural shape for the offline bundle export
scenario referenced in the Phase 7 roadmap - but it is explicitly **not**
part of this v1 JSON shape. When that mode is added, it will be a new,
separate export format built on top of this spec (e.g. a container format
that embeds one `HomeRecord` document plus attachment bytes keyed by
`storage_path`), not a change to how `Attachment.storage_path` or any
`*_id`/`*_ids` reference field behaves inside the JSON document itself. A
consumer of the JSON document as defined by this spec should always expect
attachments to be references, never inline bytes.
