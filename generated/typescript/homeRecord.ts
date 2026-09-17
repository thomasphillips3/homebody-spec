import * as z from "zod";


export const AttachmentKindSchema = z.enum([
    "manual_pdf",
    "photo",
    "receipt",
    "usdz_mesh",
]);
export type AttachmentKind = z.infer<typeof AttachmentKindSchema>;


export const ComponentTypeSchema = z.enum([
    "appliance_generic",
    "camera",
    "downspout",
    "electrical_panel",
    "gutter",
    "hvac_ac_unit",
    "hvac_furnace",
    "light_fixture",
    "network_router",
    "other",
    "outlet",
    "plumbing_fixture",
    "smoke_detector",
    "thermostat",
    "water_heater",
]);
export type ComponentType = z.infer<typeof ComponentTypeSchema>;

// Shared condition scale used by Component.condition and Event.condition_after, so the two
// cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for
// not-yet-assessed.

export const ConditionSchema = z.enum([
    "fair",
    "good",
    "needs_attention",
    "needs_replacement",
    "unknown",
]);
export type Condition = z.infer<typeof ConditionSchema>;


export const PlanGeometryTypeSchema = z.enum([
    "point",
    "polygon",
    "polyline",
]);
export type PlanGeometryType = z.infer<typeof PlanGeometryTypeSchema>;


export const EventTypeSchema = z.enum([
    "inspection",
    "note",
    "reading",
    "repair",
    "replacement",
    "service",
]);
export type EventType = z.infer<typeof EventTypeSchema>;


export const ScaleConfidenceSchema = z.enum([
    "estimated",
    "measured",
]);
export type ScaleConfidence = z.infer<typeof ScaleConfidenceSchema>;


export const PlanElementKindSchema = z.enum([
    "door",
    "opening",
    "wall",
    "window",
]);
export type PlanElementKind = z.infer<typeof PlanElementKindSchema>;


export const PurpleTypeSchema = z.enum([
    "polygon",
]);
export type PurpleType = z.infer<typeof PurpleTypeSchema>;


export const RoomTypeSchema = z.enum([
    "attic",
    "basement",
    "bathroom",
    "bedroom",
    "closet",
    "dining_room",
    "garage",
    "hallway",
    "kitchen",
    "laundry",
    "living_room",
    "office",
    "other",
]);
export type RoomType = z.infer<typeof RoomTypeSchema>;


export const SmartHomeReadingSourceSchema = z.enum([
    "ecobee",
    "homekit",
    "nest",
    "other",
]);
export type SmartHomeReadingSource = z.infer<typeof SmartHomeReadingSourceSchema>;


export const CategorySchema = z.enum([
    "appliances_and_water_heater",
    "electrical",
    "exterior_and_site",
    "hvac",
    "low_voltage_and_smart_home",
    "plumbing",
    "roof_structure",
]);
export type Category = z.infer<typeof CategorySchema>;


export const UtilityBillSourceSchema = z.enum([
    "import",
    "manual",
]);
export type UtilityBillSource = z.infer<typeof UtilityBillSourceSchema>;


export const UtilityTypeSchema = z.enum([
    "electric",
    "gas",
    "water",
]);
export type UtilityType = z.infer<typeof UtilityTypeSchema>;

export const AttachmentSchema = z.object({
    "captured_at": z.union([z.coerce.date(), z.null()]).optional(),
    "file_size_bytes": z.number(),
    "home_id": z.string(),
    "id": z.string(),
    "kind": AttachmentKindSchema,
    "linked_component_id": z.union([z.null(), z.string()]).optional(),
    "linked_event_id": z.union([z.null(), z.string()]).optional(),
    "mime_type": z.string(),
    "storage_path": z.string(),
});
export type Attachment = z.infer<typeof AttachmentSchema>;

export const PlanGeometrySchema = z.object({
    "coordinates": z.array(z.array(z.number()).min(2).max(2)),
    "type": PlanGeometryTypeSchema,
});
export type PlanGeometry = z.infer<typeof PlanGeometrySchema>;

export const EventSchema = z.object({
    "attachment_ids": z.array(z.string()),
    "component_id": z.union([z.null(), z.string()]).optional(),
    "condition_after": z.union([ConditionSchema, z.null()]).optional(),
    "cost_cents": z.union([z.number(), z.null()]).optional(),
    "event_type": EventTypeSchema,
    "home_id": z.string(),
    "id": z.string(),
    "notes": z.union([z.null(), z.string()]).optional(),
    "occurred_at": z.coerce.date(),
    "performed_by": z.union([z.null(), z.string()]).optional(),
    "reading_unit": z.union([z.null(), z.string()]).optional(),
    "reading_value": z.union([z.number(), z.null()]).optional(),
    "system_id": z.union([z.null(), z.string()]).optional(),
});
export type Event = z.infer<typeof EventSchema>;

export const HomeSchema = z.object({
    "address": z.string(),
    "baths": z.union([z.number(), z.null()]).optional(),
    "beds": z.union([z.number(), z.null()]).optional(),
    "created_at": z.coerce.date(),
    "id": z.string(),
    "lot_size_m2": z.union([z.number(), z.null()]).optional(),
    "name": z.string(),
    "owner_user_id": z.string(),
    "parcel_id": z.union([z.null(), z.string()]).optional(),
    "sq_ft": z.union([z.number(), z.null()]).optional(),
    "year_built": z.union([z.number(), z.null()]).optional(),
});
export type Home = z.infer<typeof HomeSchema>;

export const LevelSchema = z.object({
    "elevation_offset_m": z.number(),
    "home_id": z.string(),
    "id": z.string(),
    "name": z.string(),
    "scale_confidence": ScaleConfidenceSchema,
    "sort_order": z.number(),
});
export type Level = z.infer<typeof LevelSchema>;

export const GeometryClassSchema = z.object({
    "coordinates": z.array(z.array(z.number()).min(2).max(2)),
    "type": PlanGeometryTypeSchema,
});
export type GeometryClass = z.infer<typeof GeometryClassSchema>;

export const GeometrySchema = z.object({
    "coordinates": z.array(z.array(z.number()).min(2).max(2)),
    "type": PurpleTypeSchema,
});
export type Geometry = z.infer<typeof GeometrySchema>;

export const SmartHomeReadingSchema = z.object({
    "component_id": z.string(),
    "id": z.string(),
    "metric": z.string(),
    "recorded_at": z.coerce.date(),
    "source": SmartHomeReadingSourceSchema,
    "unit": z.string(),
    "value": z.number(),
});
export type SmartHomeReading = z.infer<typeof SmartHomeReadingSchema>;

export const SystemSchema = z.object({
    "category": CategorySchema,
    "home_id": z.string(),
    "id": z.string(),
    "name": z.string(),
    "notes": z.union([z.null(), z.string()]).optional(),
});
export type System = z.infer<typeof SystemSchema>;

export const UtilityBillSchema = z.object({
    "attachment_id": z.union([z.null(), z.string()]).optional(),
    "billing_period_end": z.string(),
    "billing_period_start": z.string(),
    "cost_cents": z.union([z.number(), z.null()]).optional(),
    "home_id": z.string(),
    "id": z.string(),
    "source": UtilityBillSourceSchema,
    "usage_amount": z.number(),
    "usage_unit": z.string(),
    "utility_type": UtilityTypeSchema,
});
export type UtilityBill = z.infer<typeof UtilityBillSchema>;

export const ComponentSchema = z.object({
    "component_type": ComponentTypeSchema,
    "condition": ConditionSchema,
    "custom_fields": z.record(z.string(), z.any()),
    "geometry": z.union([PlanGeometrySchema, z.null()]).optional(),
    "id": z.string(),
    "install_date": z.union([z.null(), z.string()]).optional(),
    "last_serviced_at": z.union([z.null(), z.string()]).optional(),
    "level_id": z.union([z.null(), z.string()]).optional(),
    "linked_component_id": z.union([z.null(), z.string()]).optional(),
    "make": z.union([z.null(), z.string()]).optional(),
    "manual_attachment_id": z.union([z.null(), z.string()]).optional(),
    "model": z.union([z.null(), z.string()]).optional(),
    "name": z.string(),
    "notes": z.union([z.null(), z.string()]).optional(),
    "room_ids": z.array(z.string()),
    "serial_number": z.union([z.null(), z.string()]).optional(),
    "service_interval_days": z.union([z.number(), z.null()]).optional(),
    "system_id": z.string(),
    "warranty_length_months": z.union([z.number(), z.null()]).optional(),
    "warranty_start": z.union([z.null(), z.string()]).optional(),
});
export type Component = z.infer<typeof ComponentSchema>;

export const PlanElementSchema = z.object({
    "geometry": GeometryClassSchema,
    "host_element_id": z.union([z.null(), z.string()]).optional(),
    "id": z.string(),
    "kind": PlanElementKindSchema,
    "level_id": z.string(),
});
export type PlanElement = z.infer<typeof PlanElementSchema>;

export const RoomSchema = z.object({
    "area_computed_m2": z.union([z.number(), z.null()]).optional(),
    "geometry": GeometrySchema,
    "id": z.string(),
    "level_id": z.string(),
    "name": z.string(),
    "room_type": RoomTypeSchema,
});
export type Room = z.infer<typeof RoomSchema>;

export const HomeRecordSchema = z.object({
    "attachments": z.array(AttachmentSchema),
    "components": z.array(ComponentSchema),
    "events": z.array(EventSchema),
    "home": HomeSchema,
    "levels": z.array(LevelSchema),
    "plan_elements": z.array(PlanElementSchema),
    "rooms": z.array(RoomSchema),
    "schema_version": z.string(),
    "smart_home_readings": z.array(SmartHomeReadingSchema),
    "systems": z.array(SystemSchema),
    "utility_bills": z.array(UtilityBillSchema),
});
export type HomeRecord = z.infer<typeof HomeRecordSchema>;
