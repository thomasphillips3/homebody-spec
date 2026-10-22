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
    /**
     * Recall matches the server wrote for this home's components. Optional: records without it
     * stay valid.
     */
    recall_alerts?: RecallAlert[];
    rooms:          Room[];
    /**
     * Semver of the Home Record spec this document conforms to, e.g. 0.2.0. Downstream import
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
    /**
     * Canonical owner-scoped Storage key:
     * {owner_user_id}/homes/{home_id}/attachments/{attachment_id}.ext.
     */
    storage_path: string;
}

export type AttachmentKind = "photo" | "receipt" | "manual_pdf" | "usdz_mesh" | "floor_plan_source" | "roomplan_structure" | "gltf_mesh";

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
    location_note?:          null | string;
    make?:                   null | string;
    manual_attachment_id?:   null | string;
    manual_url?:             null | string;
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

export type ComponentType = "plumbing_fixture" | "toilet" | "sink" | "bathtub_shower" | "main_water_shutoff" | "gas_shutoff" | "water_supply_line" | "drain_waste_vent" | "sewer_lateral" | "sump_pump" | "water_treatment" | "electrical_panel" | "subpanel" | "electric_meter" | "service_conductors" | "branch_circuit" | "outlet" | "gfci_receptacle" | "light_fixture" | "smoke_detector" | "co_detector" | "generator" | "solar_pv_system" | "hvac_furnace" | "hvac_ac_unit" | "hvac_heat_pump" | "hvac_mini_split" | "hvac_boiler" | "hvac_air_handler" | "hvac_ductwork" | "thermostat" | "hvac_filter" | "hvac_ventilation_fan" | "hvac_fireplace" | "roof_covering" | "flashing" | "skylight" | "chimney" | "roof_vent" | "gutter" | "downspout" | "soffit_fascia" | "attic_insulation" | "foundation" | "structural_member" | "water_heater" | "refrigerator" | "dishwasher" | "range_oven" | "microwave" | "range_hood" | "clothes_washer" | "clothes_dryer" | "garbage_disposal" | "appliance_generic" | "exterior_wall_covering" | "window" | "exterior_door" | "garage_door" | "garage_door_opener" | "deck_porch_patio" | "driveway_walkway" | "fence_wall" | "irrigation_system" | "septic_system" | "well_pump" | "pool_spa" | "camera" | "video_doorbell" | "network_router" | "network_access_point" | "smart_hub" | "smart_lock" | "alarm_panel" | "leak_sensor" | "structured_wiring_panel" | "low_voltage_cabling" | "other";

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

export type Event =
    | (EventFields & { system_id: string; component_id?: string | null })
    | (EventFields & { component_id: string; system_id?: string | null });

export interface EventFields {
    attachment_ids:   string[];
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
    /**
     * Optional short label for the event, at most 200 characters. Shown in history lists ahead
     * of the notes.
     */
    title?: null | string;
}

export type EventType = "inspection" | "service" | "repair" | "replacement" | "reading" | "note";

export interface Home {
    address:      string;
    baths?:       number | null;
    beds?:        number | null;
    created_at:   string;
    id:           string;
    lot_size_m2?: number | null;
    /**
     * Per-home service interval overrides. Keys are component_type ids; a value is a whole
     * number of days that overrides the taxonomy default_service_interval_days for that type in
     * this home. A component's own service_interval_days still wins over both (D-03 resolution
     * order).
     */
    maintenance_defaults?: { [key: string]: number } | null;
    name:                  string;
    owner_user_id:         string;
    parcel_id?:            null | string;
    sq_ft?:                number | null;
    year_built?:           number | null;
}

export interface Level {
    elevation_offset_m:     number;
    home_id:                string;
    id:                     string;
    import_attachment_id?:  null | string;
    import_origin_m?:       [number, number, ...number[]] | null;
    import_pixel_height?:   number | null;
    import_pixel_width?:    number | null;
    import_scale_m_per_px?: number | null;
    name:                   string;
    scale_confidence:       ScaleConfidence;
    /**
     * Soft reference (not a foreign key) to the gltf_mesh Attachment used by Android and web 3D
     * viewers.
     */
    scan_glb_attachment_id?: null | string;
    /**
     * Translation in meters from scan XZ (after rotation) to plan space.
     */
    scan_origin_m?:     [number, number, ...number[]] | null;
    scan_review_state?: ScanReviewState | null;
    /**
     * Rotation in radians from scan XZ to plan space. planPoint = R(rotation) * (X, Z) +
     * scan_origin_m.
     */
    scan_rotation_rad?: number | null;
    /**
     * Soft reference (not a foreign key) to the roomplan_structure Attachment holding the
     * captured structure JSON.
     */
    scan_structure_attachment_id?: null | string;
    /**
     * Soft reference (not a foreign key) to the usdz_mesh Attachment of a RoomPlan scan; the
     * level patch can sync before the attachment row.
     */
    scan_usdz_attachment_id?: null | string;
    sort_order:               number;
}

export type ScaleConfidence = "measured" | "estimated";

export type ScanReviewState = "pending_review" | "reviewed";

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
    /**
     * Provenance of the row. Null means hand.
     */
    source?: PlanElementSource | null;
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

export type PlanElementSource = "hand" | "trace" | "roomplan";

/**
 * A possible CPSC recall match for one component. The server writes alerts (the recall Edge
 * Function inserts them); clients may change only status.
 */
export interface RecallAlert {
    component_id: string;
    confidence:   Confidence;
    detected_at:  string;
    hazard?:      null | string;
    home_id:      string;
    /**
     * UUIDv5 over "{component_id}:{recall_number}" in namespace
     * 5f3c9a2e-7b1d-4e68-9c04-2a8d6e1b7f35, so re-running the matcher never duplicates an alert.
     */
    id:          string;
    matched_on:  MatchedOn;
    recall_date: string;
    /**
     * CPSC numeric RecallID.
     */
    recall_id: number;
    /**
     * CPSC recall number, e.g. 26123.
     */
    recall_number: string;
    remedy?:       null | string;
    status:        Status;
    title:         string;
    /**
     * Link to the recall on cpsc.gov. Clients open it only when its scheme is https and its
     * host ends with cpsc.gov.
     */
    url: string;
}

export type Confidence = "likely" | "possible";

export type MatchedOn = "model" | "manufacturer";

export type Status = "open" | "dismissed" | "resolved";

export interface Room {
    area_computed_m2?: number | null;
    geometry:          Geometry;
    id:                string;
    level_id:          string;
    name:              string;
    room_type:         RoomType;
    /**
     * Provenance of the row. Null means hand.
     */
    source?: PlanElementSource | null;
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
