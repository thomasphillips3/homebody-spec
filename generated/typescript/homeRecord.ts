/**
 * Root document for a Home Record export. Flat, database-table-mirroring shape - one home,
 * plus arrays of every other entity, each keyed by an id and its parent foreign keys rather
 * than deep nesting.
 */
export interface HomeRecord {
    attachments:   Attachment[];
    components:    Component[];
    events:        Event[];
    home:          Home;
    levels:        Level[];
    plan_elements: PlanElement[];
    rooms:         Room[];
    /**
     * Semver of the Home Record spec this document conforms to, e.g. 0.1.1. Downstream import
     * validation rejects unknown versions rather than duck-typing.
     */
    schema_version:      string;
    smart_home_readings: SmartHomeReading[];
    systems:             System[];
    utility_bills:       UtilityBill[];
}

export interface Attachment {
    captured_at?:         null | string;
    file_size_bytes:      number;
    home_id:              string;
    id:                   string;
    kind:                 AttachmentKind;
    linked_component_id?: null | string;
    linked_event_id?:     null | string;
    mime_type:            string;
    storage_path:         string;
}

export type AttachmentKind = "photo" | "receipt" | "manual_pdf" | "usdz_mesh";

export interface Component {
    component_type: ComponentType;
    /**
     * Shared condition scale used by Component.condition and Event.condition_after, so the two
     * cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for
     * not-yet-assessed.
     */
    condition:               Condition;
    custom_fields:           { [key: string]: unknown };
    geometry?:               PlanGeometry | null;
    id:                      string;
    install_date?:           null | string;
    last_serviced_at?:       null | string;
    level_id?:               null | string;
    linked_component_id?:    null | string;
    make?:                   null | string;
    manual_attachment_id?:   null | string;
    model?:                  null | string;
    name:                    string;
    notes?:                  null | string;
    room_ids:                string[];
    serial_number?:          null | string;
    service_interval_days?:  number | null;
    system_id:               string;
    warranty_length_months?: number | null;
    warranty_start?:         null | string;
}

export type ComponentType = "water_heater" | "hvac_furnace" | "hvac_ac_unit" | "electrical_panel" | "outlet" | "light_fixture" | "plumbing_fixture" | "gutter" | "downspout" | "smoke_detector" | "thermostat" | "camera" | "network_router" | "appliance_generic" | "other";

/**
 * Shared condition scale used by Component.condition and Event.condition_after, so the two
 * cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for
 * not-yet-assessed.
 */
export type Condition = "good" | "fair" | "needs_attention" | "needs_replacement" | "unknown";

/**
 * Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
 * 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
 */
export interface PlanGeometry {
    coordinates: Array<[number, number, ...number[]]>;
    type:        PlanGeometryType;
}

export type PlanGeometryType = "point" | "polyline" | "polygon";

export interface Event {
    attachment_ids:   string[];
    component_id?:    string;
    condition_after?: Condition | null;
    cost_cents?:      number | null;
    event_type:       EventType;
    home_id:          string;
    id:               string;
    notes?:           null | string;
    occurred_at:      string;
    performed_by?:    null | string;
    reading_unit?:    null | string;
    reading_value?:   number | null;
    system_id?:       string;
}

export type EventType = "inspection" | "service" | "repair" | "replacement" | "reading" | "note";

export interface Home {
    address:       string;
    baths?:        number | null;
    beds?:         number | null;
    created_at:    string;
    id:            string;
    lot_size_m2?:  number | null;
    name:          string;
    owner_user_id: string;
    parcel_id?:    null | string;
    sq_ft?:        number | null;
    year_built?:   number | null;
}

export interface Level {
    elevation_offset_m: number;
    home_id:            string;
    id:                 string;
    name:               string;
    scale_confidence:   ScaleConfidence;
    sort_order:         number;
}

export type ScaleConfidence = "measured" | "estimated";

export interface PlanElement {
    /**
     * Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
     * 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
     */
    geometry:         GeometryClass;
    host_element_id?: null | string;
    id:               string;
    kind:             PlanElementKind;
    level_id:         string;
}

/**
 * Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
 * 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
 */
export interface GeometryClass {
    coordinates: Array<[number, number, ...number[]]>;
    type:        PlanGeometryType;
}

export type PlanElementKind = "wall" | "door" | "window" | "opening";

export interface Room {
    area_computed_m2?: number | null;
    geometry:          Geometry;
    id:                string;
    level_id:          string;
    name:              string;
    room_type:         RoomType;
}

/**
 * Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
 * 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
 */
export interface Geometry {
    coordinates: Array<[number, number, ...number[]]>;
    type:        PurpleType;
}

export type PurpleType = "polygon";

export type RoomType = "bedroom" | "bathroom" | "kitchen" | "living_room" | "dining_room" | "garage" | "basement" | "attic" | "hallway" | "closet" | "laundry" | "office" | "other";

export interface SmartHomeReading {
    component_id: string;
    id:           string;
    metric:       string;
    recorded_at:  string;
    source:       SmartHomeReadingSource;
    unit:         string;
    value:        number;
}

export type SmartHomeReadingSource = "homekit" | "ecobee" | "nest" | "other";

export interface System {
    category: Category;
    home_id:  string;
    id:       string;
    name:     string;
    notes?:   null | string;
}

export type Category = "plumbing" | "electrical" | "hvac" | "roof_structure" | "appliances_and_water_heater" | "exterior_and_site" | "low_voltage_and_smart_home";

export interface UtilityBill {
    attachment_id?:       null | string;
    billing_period_end:   string;
    billing_period_start: string;
    cost_cents?:          number | null;
    home_id:              string;
    id:                   string;
    source:               UtilityBillSource;
    usage_amount:         number;
    usage_unit:           string;
    utility_type:         UtilityType;
}

export type UtilityBillSource = "manual" | "import";

export type UtilityType = "gas" | "electric" | "water";
