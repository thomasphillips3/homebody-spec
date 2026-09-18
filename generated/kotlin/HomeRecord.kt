// To parse the JSON, install kotlin's serialization plugin and do:
//
// val json       = Json { allowStructuredMapKeys = true }
// val homeRecord = json.parse(HomeRecord.serializer(), jsonString)

@file:UseSerializers(OffsetDateTimeSerializer::class, LocalDateSerializer::class)

package quicktype

import java.time.OffsetDateTime
import java.time.LocalDate

import kotlinx.serialization.*
import kotlinx.serialization.json.*
import kotlinx.serialization.descriptors.*
import kotlinx.serialization.encoding.*

/**
 * Root document for a Home Record export. Flat, database-table-mirroring shape - one home,
 * plus arrays of every other entity, each keyed by an id and its parent foreign keys rather
 * than deep nesting.
 */
@Serializable
data class HomeRecord (
    val attachments: List<Attachment>,
    val components: List<Component>,
    val events: List<Event>,
    val home: Home,
    val levels: List<Level>,

    @SerialName("plan_elements")
    val planElements: List<PlanElement>,

    val rooms: List<Room>,

    /**
     * Semver of the Home Record spec this document conforms to, e.g. 0.1.1. Downstream import
     * validation rejects unknown versions rather than duck-typing.
     */
    @SerialName("schema_version")
    val schemaVersion: String,

    @SerialName("smart_home_readings")
    val smartHomeReadings: List<SmartHomeReading>,

    val systems: List<SystemElement>,

    @SerialName("utility_bills")
    val utilityBills: List<UtilityBill>
)

@Serializable
data class Attachment (
    @SerialName("captured_at")
    val capturedAt: OffsetDateTime? = null,

    @SerialName("file_size_bytes")
    val fileSizeBytes: Long,

    @SerialName("home_id")
    val homeID: String,

    val id: String,
    val kind: AttachmentKind,

    @SerialName("linked_component_id")
    val linkedComponentID: String? = null,

    @SerialName("linked_event_id")
    val linkedEventID: String? = null,

    @SerialName("mime_type")
    val mimeType: String,

    /**
     * Canonical owner-scoped Storage key:
     * {owner_user_id}/homes/{home_id}/attachments/{attachment_id}.ext.
     */
    @SerialName("storage_path")
    val storagePath: String
)

@Serializable
enum class AttachmentKind(val value: String) {
    @SerialName("manual_pdf") ManualPDF("manual_pdf"),
    @SerialName("photo") Photo("photo"),
    @SerialName("receipt") Receipt("receipt"),
    @SerialName("usdz_mesh") UsdzMesh("usdz_mesh");
}

@Serializable
data class Component (
    @SerialName("component_type")
    val componentType: ComponentType,

    /**
     * Shared condition scale used by Component.condition and Event.condition_after, so the two
     * cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for
     * not-yet-assessed.
     */
    val condition: Condition,

    @SerialName("custom_fields")
    val customFields: JsonObject,

    val geometry: PlanGeometry? = null,
    val id: String,

    @SerialName("install_date")
    val installDate: LocalDate? = null,

    @SerialName("last_serviced_at")
    val lastServicedAt: LocalDate? = null,

    @SerialName("level_id")
    val levelID: String? = null,

    @SerialName("linked_component_id")
    val linkedComponentID: String? = null,

    val make: String? = null,

    @SerialName("manual_attachment_id")
    val manualAttachmentID: String? = null,

    val model: String? = null,
    val name: String,
    val notes: String? = null,

    @SerialName("room_ids")
    val roomIDS: List<String>,

    @SerialName("serial_number")
    val serialNumber: String? = null,

    @SerialName("service_interval_days")
    val serviceIntervalDays: Long? = null,

    @SerialName("system_id")
    val systemID: String,

    @SerialName("warranty_length_months")
    val warrantyLengthMonths: Long? = null,

    @SerialName("warranty_start")
    val warrantyStart: LocalDate? = null
)

@Serializable
enum class ComponentType(val value: String) {
    @SerialName("appliance_generic") ApplianceGeneric("appliance_generic"),
    @SerialName("camera") Camera("camera"),
    @SerialName("downspout") Downspout("downspout"),
    @SerialName("electrical_panel") ElectricalPanel("electrical_panel"),
    @SerialName("gutter") Gutter("gutter"),
    @SerialName("hvac_ac_unit") HvacACUnit("hvac_ac_unit"),
    @SerialName("hvac_furnace") HvacFurnace("hvac_furnace"),
    @SerialName("light_fixture") LightFixture("light_fixture"),
    @SerialName("network_router") NetworkRouter("network_router"),
    @SerialName("other") Other("other"),
    @SerialName("outlet") Outlet("outlet"),
    @SerialName("plumbing_fixture") PlumbingFixture("plumbing_fixture"),
    @SerialName("smoke_detector") SmokeDetector("smoke_detector"),
    @SerialName("thermostat") Thermostat("thermostat"),
    @SerialName("water_heater") WaterHeater("water_heater");
}

/**
 * Shared condition scale used by Component.condition and Event.condition_after, so the two
 * cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for
 * not-yet-assessed.
 */
@Serializable
enum class Condition(val value: String) {
    @SerialName("fair") Fair("fair"),
    @SerialName("good") Good("good"),
    @SerialName("needs_attention") NeedsAttention("needs_attention"),
    @SerialName("needs_replacement") NeedsReplacement("needs_replacement"),
    @SerialName("unknown") Unknown("unknown");
}

/**
 * Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
 * 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
 */
@Serializable
data class PlanGeometry (
    val coordinates: List<List<Double>>,
    val type: PlanGeometryType
)

@Serializable
enum class PlanGeometryType(val value: String) {
    @SerialName("point") Point("point"),
    @SerialName("polygon") Polygon("polygon"),
    @SerialName("polyline") Polyline("polyline");
}

@Serializable
data class Event (
    @SerialName("attachment_ids")
    val attachmentIDS: List<String>,

    @SerialName("component_id")
    val componentID: String? = null,

    @SerialName("condition_after")
    val conditionAfter: Condition? = null,

    @SerialName("cost_cents")
    val costCents: Long? = null,

    @SerialName("event_type")
    val eventType: EventType,

    @SerialName("home_id")
    val homeID: String,

    val id: String,
    val notes: String? = null,

    @SerialName("occurred_at")
    val occurredAt: OffsetDateTime,

    @SerialName("performed_by")
    val performedBy: String? = null,

    @SerialName("reading_unit")
    val readingUnit: String? = null,

    @SerialName("reading_value")
    val readingValue: Double? = null,

    @SerialName("system_id")
    val systemID: String? = null
)

@Serializable
enum class EventType(val value: String) {
    @SerialName("inspection") Inspection("inspection"),
    @SerialName("note") Note("note"),
    @SerialName("reading") Reading("reading"),
    @SerialName("repair") Repair("repair"),
    @SerialName("replacement") Replacement("replacement"),
    @SerialName("service") Service("service");
}

@Serializable
data class Home (
    val address: String,
    val baths: Double? = null,
    val beds: Long? = null,

    @SerialName("created_at")
    val createdAt: OffsetDateTime,

    val id: String,

    @SerialName("lot_size_m2")
    val lotSizeM2: Double? = null,

    val name: String,

    @SerialName("owner_user_id")
    val ownerUserID: String,

    @SerialName("parcel_id")
    val parcelID: String? = null,

    @SerialName("sq_ft")
    val sqFt: Double? = null,

    @SerialName("year_built")
    val yearBuilt: Long? = null
)

@Serializable
data class Level (
    @SerialName("elevation_offset_m")
    val elevationOffsetM: Double,

    @SerialName("home_id")
    val homeID: String,

    val id: String,
    val name: String,

    @SerialName("scale_confidence")
    val scaleConfidence: ScaleConfidence,

    @SerialName("sort_order")
    val sortOrder: Long
)

@Serializable
enum class ScaleConfidence(val value: String) {
    @SerialName("estimated") Estimated("estimated"),
    @SerialName("measured") Measured("measured");
}

@Serializable
data class PlanElement (
    /**
     * Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
     * 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
     */
    val geometry: GeometryClass,

    @SerialName("host_element_id")
    val hostElementID: String? = null,

    val id: String,
    val kind: PlanElementKind,

    @SerialName("level_id")
    val levelID: String
)

/**
 * Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
 * 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
 */
@Serializable
data class GeometryClass (
    val coordinates: List<List<Double>>,
    val type: PlanGeometryType
)

@Serializable
enum class PlanElementKind(val value: String) {
    @SerialName("door") Door("door"),
    @SerialName("opening") Opening("opening"),
    @SerialName("wall") Wall("wall"),
    @SerialName("window") Window("window");
}

@Serializable
data class Room (
    @SerialName("area_computed_m2")
    val areaComputedM2: Double? = null,

    val geometry: Geometry,
    val id: String,

    @SerialName("level_id")
    val levelID: String,

    val name: String,

    @SerialName("room_type")
    val roomType: RoomType
)

/**
 * Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
 * 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
 */
@Serializable
data class Geometry (
    val coordinates: List<List<Double>>,
    val type: PurpleType
)

@Serializable
enum class PurpleType(val value: String) {
    @SerialName("polygon") Polygon("polygon");
}

@Serializable
enum class RoomType(val value: String) {
    @SerialName("attic") Attic("attic"),
    @SerialName("basement") Basement("basement"),
    @SerialName("bathroom") Bathroom("bathroom"),
    @SerialName("bedroom") Bedroom("bedroom"),
    @SerialName("closet") Closet("closet"),
    @SerialName("dining_room") DiningRoom("dining_room"),
    @SerialName("garage") Garage("garage"),
    @SerialName("hallway") Hallway("hallway"),
    @SerialName("kitchen") Kitchen("kitchen"),
    @SerialName("laundry") Laundry("laundry"),
    @SerialName("living_room") LivingRoom("living_room"),
    @SerialName("office") Office("office"),
    @SerialName("other") Other("other");
}

@Serializable
data class SmartHomeReading (
    @SerialName("component_id")
    val componentID: String,

    val id: String,
    val metric: String,

    @SerialName("recorded_at")
    val recordedAt: OffsetDateTime,

    val source: SmartHomeReadingSource,
    val unit: String,
    val value: Double
)

@Serializable
enum class SmartHomeReadingSource(val value: String) {
    @SerialName("ecobee") Ecobee("ecobee"),
    @SerialName("homekit") Homekit("homekit"),
    @SerialName("nest") Nest("nest"),
    @SerialName("other") Other("other");
}

@Serializable
data class SystemElement (
    val category: Category,

    @SerialName("home_id")
    val homeID: String,

    val id: String,
    val name: String,
    val notes: String? = null
)

@Serializable
enum class Category(val value: String) {
    @SerialName("appliances_and_water_heater") AppliancesAndWaterHeater("appliances_and_water_heater"),
    @SerialName("electrical") Electrical("electrical"),
    @SerialName("exterior_and_site") ExteriorAndSite("exterior_and_site"),
    @SerialName("hvac") Hvac("hvac"),
    @SerialName("low_voltage_and_smart_home") LowVoltageAndSmartHome("low_voltage_and_smart_home"),
    @SerialName("plumbing") Plumbing("plumbing"),
    @SerialName("roof_structure") RoofStructure("roof_structure");
}

@Serializable
data class UtilityBill (
    @SerialName("attachment_id")
    val attachmentID: String? = null,

    @SerialName("billing_period_end")
    val billingPeriodEnd: LocalDate,

    @SerialName("billing_period_start")
    val billingPeriodStart: LocalDate,

    @SerialName("cost_cents")
    val costCents: Long? = null,

    @SerialName("home_id")
    val homeID: String,

    val id: String,
    val source: UtilityBillSource,

    @SerialName("usage_amount")
    val usageAmount: Double,

    @SerialName("usage_unit")
    val usageUnit: String,

    @SerialName("utility_type")
    val utilityType: UtilityType
)

@Serializable
enum class UtilityBillSource(val value: String) {
    @SerialName("import") Import("import"),
    @SerialName("manual") Manual("manual");
}

@Serializable
enum class UtilityType(val value: String) {
    @SerialName("electric") Electric("electric"),
    @SerialName("gas") Gas("gas"),
    @SerialName("water") Water("water");
}

object OffsetDateTimeSerializer : KSerializer<OffsetDateTime> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("OffsetDateTime", PrimitiveKind.STRING)
    override fun deserialize(decoder: Decoder): OffsetDateTime = OffsetDateTime.parse(decoder.decodeString())
    override fun serialize(encoder: Encoder, value: OffsetDateTime) {
        encoder.encodeString(java.time.format.DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(value))
    }
}

object LocalDateSerializer : KSerializer<LocalDate> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("LocalDate", PrimitiveKind.STRING)
    override fun deserialize(decoder: Decoder): LocalDate = LocalDate.parse(decoder.decodeString())
    override fun serialize(encoder: Encoder, value: LocalDate) {
        encoder.encodeString(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE.format(value))
    }
}
