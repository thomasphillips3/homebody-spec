// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse the JSON, add this file to your project and do:
//
//   let homeRecord = try HomeRecord(json)

import Foundation

/// Root document for a Home Record export. Flat, database-table-mirroring shape - one home,
/// plus arrays of every other entity, each keyed by an id and its parent foreign keys rather
/// than deep nesting.
// MARK: - HomeRecord
public struct HomeRecord: Codable {
    public let attachments: [Attachment]
    public let components: [Component]
    public let events: [Event]
    public let home: Home
    public let levels: [Level]
    public let planElements: [PlanElement]
    public let rooms: [Room]
    /// Semver of the Home Record spec this document conforms to, e.g. 0.1.1. Downstream import
    /// validation rejects unknown versions rather than duck-typing.
    public let schemaVersion: String
    public let smartHomeReadings: [SmartHomeReading]
    public let systems: [System]
    public let utilityBills: [UtilityBill]

    public enum CodingKeys: String, CodingKey {
        case attachments = "attachments"
        case components = "components"
        case events = "events"
        case home = "home"
        case levels = "levels"
        case planElements = "plan_elements"
        case rooms = "rooms"
        case schemaVersion = "schema_version"
        case smartHomeReadings = "smart_home_readings"
        case systems = "systems"
        case utilityBills = "utility_bills"
    }

    public init(attachments: [Attachment], components: [Component], events: [Event], home: Home, levels: [Level], planElements: [PlanElement], rooms: [Room], schemaVersion: String, smartHomeReadings: [SmartHomeReading], systems: [System], utilityBills: [UtilityBill]) {
        self.attachments = attachments
        self.components = components
        self.events = events
        self.home = home
        self.levels = levels
        self.planElements = planElements
        self.rooms = rooms
        self.schemaVersion = schemaVersion
        self.smartHomeReadings = smartHomeReadings
        self.systems = systems
        self.utilityBills = utilityBills
    }
}

// MARK: HomeRecord convenience initializers and mutators

public extension HomeRecord {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(HomeRecord.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        attachments: [Attachment]? = nil,
        components: [Component]? = nil,
        events: [Event]? = nil,
        home: Home? = nil,
        levels: [Level]? = nil,
        planElements: [PlanElement]? = nil,
        rooms: [Room]? = nil,
        schemaVersion: String? = nil,
        smartHomeReadings: [SmartHomeReading]? = nil,
        systems: [System]? = nil,
        utilityBills: [UtilityBill]? = nil
    ) -> HomeRecord {
        return HomeRecord(
            attachments: attachments ?? self.attachments,
            components: components ?? self.components,
            events: events ?? self.events,
            home: home ?? self.home,
            levels: levels ?? self.levels,
            planElements: planElements ?? self.planElements,
            rooms: rooms ?? self.rooms,
            schemaVersion: schemaVersion ?? self.schemaVersion,
            smartHomeReadings: smartHomeReadings ?? self.smartHomeReadings,
            systems: systems ?? self.systems,
            utilityBills: utilityBills ?? self.utilityBills
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

// MARK: - Attachment
public struct Attachment: Codable {
    public let capturedAt: Date?
    public let fileSizeBytes: Int
    public let homeID: String
    public let id: String
    public let kind: AttachmentKind
    public let linkedComponentID: String?
    public let linkedEventID: String?
    public let mimeType: String
    public let storagePath: String

    public enum CodingKeys: String, CodingKey {
        case capturedAt = "captured_at"
        case fileSizeBytes = "file_size_bytes"
        case homeID = "home_id"
        case id = "id"
        case kind = "kind"
        case linkedComponentID = "linked_component_id"
        case linkedEventID = "linked_event_id"
        case mimeType = "mime_type"
        case storagePath = "storage_path"
    }

    public init(capturedAt: Date?, fileSizeBytes: Int, homeID: String, id: String, kind: AttachmentKind, linkedComponentID: String?, linkedEventID: String?, mimeType: String, storagePath: String) {
        self.capturedAt = capturedAt
        self.fileSizeBytes = fileSizeBytes
        self.homeID = homeID
        self.id = id
        self.kind = kind
        self.linkedComponentID = linkedComponentID
        self.linkedEventID = linkedEventID
        self.mimeType = mimeType
        self.storagePath = storagePath
    }
}

// MARK: Attachment convenience initializers and mutators

public extension Attachment {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(Attachment.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        capturedAt: Date?? = nil,
        fileSizeBytes: Int? = nil,
        homeID: String? = nil,
        id: String? = nil,
        kind: AttachmentKind? = nil,
        linkedComponentID: String?? = nil,
        linkedEventID: String?? = nil,
        mimeType: String? = nil,
        storagePath: String? = nil
    ) -> Attachment {
        return Attachment(
            capturedAt: capturedAt ?? self.capturedAt,
            fileSizeBytes: fileSizeBytes ?? self.fileSizeBytes,
            homeID: homeID ?? self.homeID,
            id: id ?? self.id,
            kind: kind ?? self.kind,
            linkedComponentID: linkedComponentID ?? self.linkedComponentID,
            linkedEventID: linkedEventID ?? self.linkedEventID,
            mimeType: mimeType ?? self.mimeType,
            storagePath: storagePath ?? self.storagePath
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

public enum AttachmentKind: String, Codable {
    case manualPDF = "manual_pdf"
    case photo = "photo"
    case receipt = "receipt"
    case usdzMesh = "usdz_mesh"
}

// MARK: - Component
public struct Component: Codable {
    public let componentType: ComponentType
    /// Shared condition scale used by Component.condition and Event.condition_after, so the two
    /// cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for
    /// not-yet-assessed.
    public let condition: Condition
    public let customFields: [String: JSONAny]
    public let geometry: PlanGeometry?
    public let id: String
    public let installDate: String?
    public let lastServicedAt: String?
    public let levelID: String?
    public let linkedComponentID: String?
    public let make: String?
    public let manualAttachmentID: String?
    public let model: String?
    public let name: String
    public let notes: String?
    public let roomIDS: [String]
    public let serialNumber: String?
    public let serviceIntervalDays: Int?
    public let systemID: String
    public let warrantyLengthMonths: Int?
    public let warrantyStart: String?

    public enum CodingKeys: String, CodingKey {
        case componentType = "component_type"
        case condition = "condition"
        case customFields = "custom_fields"
        case geometry = "geometry"
        case id = "id"
        case installDate = "install_date"
        case lastServicedAt = "last_serviced_at"
        case levelID = "level_id"
        case linkedComponentID = "linked_component_id"
        case make = "make"
        case manualAttachmentID = "manual_attachment_id"
        case model = "model"
        case name = "name"
        case notes = "notes"
        case roomIDS = "room_ids"
        case serialNumber = "serial_number"
        case serviceIntervalDays = "service_interval_days"
        case systemID = "system_id"
        case warrantyLengthMonths = "warranty_length_months"
        case warrantyStart = "warranty_start"
    }

    public init(componentType: ComponentType, condition: Condition, customFields: [String: JSONAny], geometry: PlanGeometry?, id: String, installDate: String?, lastServicedAt: String?, levelID: String?, linkedComponentID: String?, make: String?, manualAttachmentID: String?, model: String?, name: String, notes: String?, roomIDS: [String], serialNumber: String?, serviceIntervalDays: Int?, systemID: String, warrantyLengthMonths: Int?, warrantyStart: String?) {
        self.componentType = componentType
        self.condition = condition
        self.customFields = customFields
        self.geometry = geometry
        self.id = id
        self.installDate = installDate
        self.lastServicedAt = lastServicedAt
        self.levelID = levelID
        self.linkedComponentID = linkedComponentID
        self.make = make
        self.manualAttachmentID = manualAttachmentID
        self.model = model
        self.name = name
        self.notes = notes
        self.roomIDS = roomIDS
        self.serialNumber = serialNumber
        self.serviceIntervalDays = serviceIntervalDays
        self.systemID = systemID
        self.warrantyLengthMonths = warrantyLengthMonths
        self.warrantyStart = warrantyStart
    }
}

// MARK: Component convenience initializers and mutators

public extension Component {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(Component.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        componentType: ComponentType? = nil,
        condition: Condition? = nil,
        customFields: [String: JSONAny]? = nil,
        geometry: PlanGeometry?? = nil,
        id: String? = nil,
        installDate: String?? = nil,
        lastServicedAt: String?? = nil,
        levelID: String?? = nil,
        linkedComponentID: String?? = nil,
        make: String?? = nil,
        manualAttachmentID: String?? = nil,
        model: String?? = nil,
        name: String? = nil,
        notes: String?? = nil,
        roomIDS: [String]? = nil,
        serialNumber: String?? = nil,
        serviceIntervalDays: Int?? = nil,
        systemID: String? = nil,
        warrantyLengthMonths: Int?? = nil,
        warrantyStart: String?? = nil
    ) -> Component {
        return Component(
            componentType: componentType ?? self.componentType,
            condition: condition ?? self.condition,
            customFields: customFields ?? self.customFields,
            geometry: geometry ?? self.geometry,
            id: id ?? self.id,
            installDate: installDate ?? self.installDate,
            lastServicedAt: lastServicedAt ?? self.lastServicedAt,
            levelID: levelID ?? self.levelID,
            linkedComponentID: linkedComponentID ?? self.linkedComponentID,
            make: make ?? self.make,
            manualAttachmentID: manualAttachmentID ?? self.manualAttachmentID,
            model: model ?? self.model,
            name: name ?? self.name,
            notes: notes ?? self.notes,
            roomIDS: roomIDS ?? self.roomIDS,
            serialNumber: serialNumber ?? self.serialNumber,
            serviceIntervalDays: serviceIntervalDays ?? self.serviceIntervalDays,
            systemID: systemID ?? self.systemID,
            warrantyLengthMonths: warrantyLengthMonths ?? self.warrantyLengthMonths,
            warrantyStart: warrantyStart ?? self.warrantyStart
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

public enum ComponentType: String, Codable {
    case applianceGeneric = "appliance_generic"
    case camera = "camera"
    case downspout = "downspout"
    case electricalPanel = "electrical_panel"
    case gutter = "gutter"
    case hvacACUnit = "hvac_ac_unit"
    case hvacFurnace = "hvac_furnace"
    case lightFixture = "light_fixture"
    case networkRouter = "network_router"
    case other = "other"
    case outlet = "outlet"
    case plumbingFixture = "plumbing_fixture"
    case smokeDetector = "smoke_detector"
    case thermostat = "thermostat"
    case waterHeater = "water_heater"
}

/// Shared condition scale used by Component.condition and Event.condition_after, so the two
/// cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for
/// not-yet-assessed.
public enum Condition: String, Codable {
    case fair = "fair"
    case good = "good"
    case needsAttention = "needs_attention"
    case needsReplacement = "needs_replacement"
    case unknown = "unknown"
}

/// Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
/// 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
// MARK: - PlanGeometry
public struct PlanGeometry: Codable {
    public let coordinates: [[Double]]
    public let type: PlanGeometryType

    public enum CodingKeys: String, CodingKey {
        case coordinates = "coordinates"
        case type = "type"
    }

    public init(coordinates: [[Double]], type: PlanGeometryType) {
        self.coordinates = coordinates
        self.type = type
    }
}

// MARK: PlanGeometry convenience initializers and mutators

public extension PlanGeometry {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(PlanGeometry.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        coordinates: [[Double]]? = nil,
        type: PlanGeometryType? = nil
    ) -> PlanGeometry {
        return PlanGeometry(
            coordinates: coordinates ?? self.coordinates,
            type: type ?? self.type
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

public enum PlanGeometryType: String, Codable {
    case point = "point"
    case polygon = "polygon"
    case polyline = "polyline"
}

// MARK: - Event
public struct Event: Codable {
    public let attachmentIDS: [String]
    public let componentID: String?
    public let conditionAfter: Condition?
    public let costCents: Int?
    public let eventType: EventType
    public let homeID: String
    public let id: String
    public let notes: String?
    public let occurredAt: Date
    public let performedBy: String?
    public let readingUnit: String?
    public let readingValue: Double?
    public let systemID: String?

    public enum CodingKeys: String, CodingKey {
        case attachmentIDS = "attachment_ids"
        case componentID = "component_id"
        case conditionAfter = "condition_after"
        case costCents = "cost_cents"
        case eventType = "event_type"
        case homeID = "home_id"
        case id = "id"
        case notes = "notes"
        case occurredAt = "occurred_at"
        case performedBy = "performed_by"
        case readingUnit = "reading_unit"
        case readingValue = "reading_value"
        case systemID = "system_id"
    }

    public init(attachmentIDS: [String], componentID: String?, conditionAfter: Condition?, costCents: Int?, eventType: EventType, homeID: String, id: String, notes: String?, occurredAt: Date, performedBy: String?, readingUnit: String?, readingValue: Double?, systemID: String?) {
        self.attachmentIDS = attachmentIDS
        self.componentID = componentID
        self.conditionAfter = conditionAfter
        self.costCents = costCents
        self.eventType = eventType
        self.homeID = homeID
        self.id = id
        self.notes = notes
        self.occurredAt = occurredAt
        self.performedBy = performedBy
        self.readingUnit = readingUnit
        self.readingValue = readingValue
        self.systemID = systemID
    }
}

// MARK: Event convenience initializers and mutators

public extension Event {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(Event.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        attachmentIDS: [String]? = nil,
        componentID: String?? = nil,
        conditionAfter: Condition?? = nil,
        costCents: Int?? = nil,
        eventType: EventType? = nil,
        homeID: String? = nil,
        id: String? = nil,
        notes: String?? = nil,
        occurredAt: Date? = nil,
        performedBy: String?? = nil,
        readingUnit: String?? = nil,
        readingValue: Double?? = nil,
        systemID: String?? = nil
    ) -> Event {
        return Event(
            attachmentIDS: attachmentIDS ?? self.attachmentIDS,
            componentID: componentID ?? self.componentID,
            conditionAfter: conditionAfter ?? self.conditionAfter,
            costCents: costCents ?? self.costCents,
            eventType: eventType ?? self.eventType,
            homeID: homeID ?? self.homeID,
            id: id ?? self.id,
            notes: notes ?? self.notes,
            occurredAt: occurredAt ?? self.occurredAt,
            performedBy: performedBy ?? self.performedBy,
            readingUnit: readingUnit ?? self.readingUnit,
            readingValue: readingValue ?? self.readingValue,
            systemID: systemID ?? self.systemID
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

public enum EventType: String, Codable {
    case inspection = "inspection"
    case note = "note"
    case reading = "reading"
    case repair = "repair"
    case replacement = "replacement"
    case service = "service"
}

// MARK: - Home
public struct Home: Codable {
    public let address: String
    public let baths: Double?
    public let beds: Int?
    public let createdAt: Date
    public let id: String
    public let lotSizeM2: Double?
    public let name: String
    public let ownerUserID: String
    public let parcelID: String?
    public let sqFt: Double?
    public let yearBuilt: Int?

    public enum CodingKeys: String, CodingKey {
        case address = "address"
        case baths = "baths"
        case beds = "beds"
        case createdAt = "created_at"
        case id = "id"
        case lotSizeM2 = "lot_size_m2"
        case name = "name"
        case ownerUserID = "owner_user_id"
        case parcelID = "parcel_id"
        case sqFt = "sq_ft"
        case yearBuilt = "year_built"
    }

    public init(address: String, baths: Double?, beds: Int?, createdAt: Date, id: String, lotSizeM2: Double?, name: String, ownerUserID: String, parcelID: String?, sqFt: Double?, yearBuilt: Int?) {
        self.address = address
        self.baths = baths
        self.beds = beds
        self.createdAt = createdAt
        self.id = id
        self.lotSizeM2 = lotSizeM2
        self.name = name
        self.ownerUserID = ownerUserID
        self.parcelID = parcelID
        self.sqFt = sqFt
        self.yearBuilt = yearBuilt
    }
}

// MARK: Home convenience initializers and mutators

public extension Home {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(Home.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        address: String? = nil,
        baths: Double?? = nil,
        beds: Int?? = nil,
        createdAt: Date? = nil,
        id: String? = nil,
        lotSizeM2: Double?? = nil,
        name: String? = nil,
        ownerUserID: String? = nil,
        parcelID: String?? = nil,
        sqFt: Double?? = nil,
        yearBuilt: Int?? = nil
    ) -> Home {
        return Home(
            address: address ?? self.address,
            baths: baths ?? self.baths,
            beds: beds ?? self.beds,
            createdAt: createdAt ?? self.createdAt,
            id: id ?? self.id,
            lotSizeM2: lotSizeM2 ?? self.lotSizeM2,
            name: name ?? self.name,
            ownerUserID: ownerUserID ?? self.ownerUserID,
            parcelID: parcelID ?? self.parcelID,
            sqFt: sqFt ?? self.sqFt,
            yearBuilt: yearBuilt ?? self.yearBuilt
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

// MARK: - Level
public struct Level: Codable {
    public let elevationOffsetM: Double
    public let homeID: String
    public let id: String
    public let name: String
    public let scaleConfidence: ScaleConfidence
    public let sortOrder: Int

    public enum CodingKeys: String, CodingKey {
        case elevationOffsetM = "elevation_offset_m"
        case homeID = "home_id"
        case id = "id"
        case name = "name"
        case scaleConfidence = "scale_confidence"
        case sortOrder = "sort_order"
    }

    public init(elevationOffsetM: Double, homeID: String, id: String, name: String, scaleConfidence: ScaleConfidence, sortOrder: Int) {
        self.elevationOffsetM = elevationOffsetM
        self.homeID = homeID
        self.id = id
        self.name = name
        self.scaleConfidence = scaleConfidence
        self.sortOrder = sortOrder
    }
}

// MARK: Level convenience initializers and mutators

public extension Level {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(Level.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        elevationOffsetM: Double? = nil,
        homeID: String? = nil,
        id: String? = nil,
        name: String? = nil,
        scaleConfidence: ScaleConfidence? = nil,
        sortOrder: Int? = nil
    ) -> Level {
        return Level(
            elevationOffsetM: elevationOffsetM ?? self.elevationOffsetM,
            homeID: homeID ?? self.homeID,
            id: id ?? self.id,
            name: name ?? self.name,
            scaleConfidence: scaleConfidence ?? self.scaleConfidence,
            sortOrder: sortOrder ?? self.sortOrder
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

public enum ScaleConfidence: String, Codable {
    case estimated = "estimated"
    case measured = "measured"
}

// MARK: - PlanElement
public struct PlanElement: Codable {
    /// Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
    /// 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
    public let geometry: GeometryClass
    public let hostElementID: String?
    public let id: String
    public let kind: PlanElementKind
    public let levelID: String

    public enum CodingKeys: String, CodingKey {
        case geometry = "geometry"
        case hostElementID = "host_element_id"
        case id = "id"
        case kind = "kind"
        case levelID = "level_id"
    }

    public init(geometry: GeometryClass, hostElementID: String?, id: String, kind: PlanElementKind, levelID: String) {
        self.geometry = geometry
        self.hostElementID = hostElementID
        self.id = id
        self.kind = kind
        self.levelID = levelID
    }
}

// MARK: PlanElement convenience initializers and mutators

public extension PlanElement {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(PlanElement.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        geometry: GeometryClass? = nil,
        hostElementID: String?? = nil,
        id: String? = nil,
        kind: PlanElementKind? = nil,
        levelID: String? = nil
    ) -> PlanElement {
        return PlanElement(
            geometry: geometry ?? self.geometry,
            hostElementID: hostElementID ?? self.hostElementID,
            id: id ?? self.id,
            kind: kind ?? self.kind,
            levelID: levelID ?? self.levelID
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

/// Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
/// 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
// MARK: - GeometryClass
public struct GeometryClass: Codable {
    public let coordinates: [[Double]]
    public let type: PlanGeometryType

    public enum CodingKeys: String, CodingKey {
        case coordinates = "coordinates"
        case type = "type"
    }

    public init(coordinates: [[Double]], type: PlanGeometryType) {
        self.coordinates = coordinates
        self.type = type
    }
}

// MARK: GeometryClass convenience initializers and mutators

public extension GeometryClass {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(GeometryClass.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        coordinates: [[Double]]? = nil,
        type: PlanGeometryType? = nil
    ) -> GeometryClass {
        return GeometryClass(
            coordinates: coordinates ?? self.coordinates,
            type: type ?? self.type
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

public enum PlanElementKind: String, Codable {
    case door = "door"
    case opening = "opening"
    case wall = "wall"
    case window = "window"
}

// MARK: - Room
public struct Room: Codable {
    public let areaComputedM2: Double?
    public let geometry: Geometry
    public let id: String
    public let levelID: String
    public let name: String
    public let roomType: RoomType

    public enum CodingKeys: String, CodingKey {
        case areaComputedM2 = "area_computed_m2"
        case geometry = "geometry"
        case id = "id"
        case levelID = "level_id"
        case name = "name"
        case roomType = "room_type"
    }

    public init(areaComputedM2: Double?, geometry: Geometry, id: String, levelID: String, name: String, roomType: RoomType) {
        self.areaComputedM2 = areaComputedM2
        self.geometry = geometry
        self.id = id
        self.levelID = levelID
        self.name = name
        self.roomType = roomType
    }
}

// MARK: Room convenience initializers and mutators

public extension Room {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(Room.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        areaComputedM2: Double?? = nil,
        geometry: Geometry? = nil,
        id: String? = nil,
        levelID: String? = nil,
        name: String? = nil,
        roomType: RoomType? = nil
    ) -> Room {
        return Room(
            areaComputedM2: areaComputedM2 ?? self.areaComputedM2,
            geometry: geometry ?? self.geometry,
            id: id ?? self.id,
            levelID: levelID ?? self.levelID,
            name: name ?? self.name,
            roomType: roomType ?? self.roomType
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

/// Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are
/// 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).
// MARK: - Geometry
public struct Geometry: Codable {
    public let coordinates: [[Double]]
    public let type: PurpleType

    public enum CodingKeys: String, CodingKey {
        case coordinates = "coordinates"
        case type = "type"
    }

    public init(coordinates: [[Double]], type: PurpleType) {
        self.coordinates = coordinates
        self.type = type
    }
}

// MARK: Geometry convenience initializers and mutators

public extension Geometry {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(Geometry.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        coordinates: [[Double]]? = nil,
        type: PurpleType? = nil
    ) -> Geometry {
        return Geometry(
            coordinates: coordinates ?? self.coordinates,
            type: type ?? self.type
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

public enum PurpleType: String, Codable {
    case polygon = "polygon"
}

public enum RoomType: String, Codable {
    case attic = "attic"
    case basement = "basement"
    case bathroom = "bathroom"
    case bedroom = "bedroom"
    case closet = "closet"
    case diningRoom = "dining_room"
    case garage = "garage"
    case hallway = "hallway"
    case kitchen = "kitchen"
    case laundry = "laundry"
    case livingRoom = "living_room"
    case office = "office"
    case other = "other"
}

// MARK: - SmartHomeReading
public struct SmartHomeReading: Codable {
    public let componentID: String
    public let id: String
    public let metric: String
    public let recordedAt: Date
    public let source: SmartHomeReadingSource
    public let unit: String
    public let value: Double

    public enum CodingKeys: String, CodingKey {
        case componentID = "component_id"
        case id = "id"
        case metric = "metric"
        case recordedAt = "recorded_at"
        case source = "source"
        case unit = "unit"
        case value = "value"
    }

    public init(componentID: String, id: String, metric: String, recordedAt: Date, source: SmartHomeReadingSource, unit: String, value: Double) {
        self.componentID = componentID
        self.id = id
        self.metric = metric
        self.recordedAt = recordedAt
        self.source = source
        self.unit = unit
        self.value = value
    }
}

// MARK: SmartHomeReading convenience initializers and mutators

public extension SmartHomeReading {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(SmartHomeReading.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        componentID: String? = nil,
        id: String? = nil,
        metric: String? = nil,
        recordedAt: Date? = nil,
        source: SmartHomeReadingSource? = nil,
        unit: String? = nil,
        value: Double? = nil
    ) -> SmartHomeReading {
        return SmartHomeReading(
            componentID: componentID ?? self.componentID,
            id: id ?? self.id,
            metric: metric ?? self.metric,
            recordedAt: recordedAt ?? self.recordedAt,
            source: source ?? self.source,
            unit: unit ?? self.unit,
            value: value ?? self.value
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

public enum SmartHomeReadingSource: String, Codable {
    case ecobee = "ecobee"
    case homekit = "homekit"
    case nest = "nest"
    case other = "other"
}

// MARK: - System
public struct System: Codable {
    public let category: Category
    public let homeID: String
    public let id: String
    public let name: String
    public let notes: String?

    public enum CodingKeys: String, CodingKey {
        case category = "category"
        case homeID = "home_id"
        case id = "id"
        case name = "name"
        case notes = "notes"
    }

    public init(category: Category, homeID: String, id: String, name: String, notes: String?) {
        self.category = category
        self.homeID = homeID
        self.id = id
        self.name = name
        self.notes = notes
    }
}

// MARK: System convenience initializers and mutators

public extension System {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(System.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        category: Category? = nil,
        homeID: String? = nil,
        id: String? = nil,
        name: String? = nil,
        notes: String?? = nil
    ) -> System {
        return System(
            category: category ?? self.category,
            homeID: homeID ?? self.homeID,
            id: id ?? self.id,
            name: name ?? self.name,
            notes: notes ?? self.notes
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

public enum Category: String, Codable {
    case appliancesAndWaterHeater = "appliances_and_water_heater"
    case electrical = "electrical"
    case exteriorAndSite = "exterior_and_site"
    case hvac = "hvac"
    case lowVoltageAndSmartHome = "low_voltage_and_smart_home"
    case plumbing = "plumbing"
    case roofStructure = "roof_structure"
}

// MARK: - UtilityBill
public struct UtilityBill: Codable {
    public let attachmentID: String?
    public let billingPeriodEnd: String
    public let billingPeriodStart: String
    public let costCents: Int?
    public let homeID: String
    public let id: String
    public let source: UtilityBillSource
    public let usageAmount: Double
    public let usageUnit: String
    public let utilityType: UtilityType

    public enum CodingKeys: String, CodingKey {
        case attachmentID = "attachment_id"
        case billingPeriodEnd = "billing_period_end"
        case billingPeriodStart = "billing_period_start"
        case costCents = "cost_cents"
        case homeID = "home_id"
        case id = "id"
        case source = "source"
        case usageAmount = "usage_amount"
        case usageUnit = "usage_unit"
        case utilityType = "utility_type"
    }

    public init(attachmentID: String?, billingPeriodEnd: String, billingPeriodStart: String, costCents: Int?, homeID: String, id: String, source: UtilityBillSource, usageAmount: Double, usageUnit: String, utilityType: UtilityType) {
        self.attachmentID = attachmentID
        self.billingPeriodEnd = billingPeriodEnd
        self.billingPeriodStart = billingPeriodStart
        self.costCents = costCents
        self.homeID = homeID
        self.id = id
        self.source = source
        self.usageAmount = usageAmount
        self.usageUnit = usageUnit
        self.utilityType = utilityType
    }
}

// MARK: UtilityBill convenience initializers and mutators

public extension UtilityBill {
    init(data: Data) throws {
        self = try newJSONDecoder().decode(UtilityBill.self, from: data)
    }

    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    func with(
        attachmentID: String?? = nil,
        billingPeriodEnd: String? = nil,
        billingPeriodStart: String? = nil,
        costCents: Int?? = nil,
        homeID: String? = nil,
        id: String? = nil,
        source: UtilityBillSource? = nil,
        usageAmount: Double? = nil,
        usageUnit: String? = nil,
        utilityType: UtilityType? = nil
    ) -> UtilityBill {
        return UtilityBill(
            attachmentID: attachmentID ?? self.attachmentID,
            billingPeriodEnd: billingPeriodEnd ?? self.billingPeriodEnd,
            billingPeriodStart: billingPeriodStart ?? self.billingPeriodStart,
            costCents: costCents ?? self.costCents,
            homeID: homeID ?? self.homeID,
            id: id ?? self.id,
            source: source ?? self.source,
            usageAmount: usageAmount ?? self.usageAmount,
            usageUnit: usageUnit ?? self.usageUnit,
            utilityType: utilityType ?? self.utilityType
        )
    }

    func jsonData() throws -> Data {
        return try newJSONEncoder().encode(self)
    }

    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}

public enum UtilityBillSource: String, Codable {
    case manual = "manual"
    case sourceImport = "import"
}

public enum UtilityType: String, Codable {
    case electric = "electric"
    case gas = "gas"
    case water = "water"
}

// MARK: - Helper functions for creating encoders and decoders

func newJSONDecoder() -> JSONDecoder {
    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .custom({ (decoder) -> Date in
        let container = try decoder.singleValueContainer()
        let dateStr = try container.decode(String.self)

        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .iso8601)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSXXXXX"
        if let date = formatter.date(from: dateStr) {
            return date
        }
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssXXXXX"
        if let date = formatter.date(from: dateStr) {
            return date
        }
        throw DecodingError.typeMismatch(Date.self, DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Could not decode date"))
    })
    return decoder
}

func newJSONEncoder() -> JSONEncoder {
    let encoder = JSONEncoder()
    let formatter = DateFormatter()
    formatter.calendar = Calendar(identifier: .iso8601)
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = TimeZone(secondsFromGMT: 0)
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssXXXXX"
    encoder.dateEncodingStrategy = .formatted(formatter)
    return encoder
}

// MARK: - Encode/decode helpers

public class JSONNull: Codable, Hashable {

    public static func == (lhs: JSONNull, rhs: JSONNull) -> Bool {
        return true
    }

    public var hashValue: Int {
        return 0
    }

    public func hash(into hasher: inout Hasher) {
        // No-op
    }

    public init() {}

    public required init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if !container.decodeNil() {
            throw DecodingError.typeMismatch(JSONNull.self, DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Wrong type for JSONNull"))
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encodeNil()
    }
}

class JSONCodingKey: CodingKey {
    let key: String

    required init?(intValue: Int) {
        return nil
    }

    required init?(stringValue: String) {
        key = stringValue
    }

    var intValue: Int? {
        return nil
    }

    var stringValue: String {
        return key
    }
}

public class JSONAny: Codable {

    public let value: Any

    static func decodingError(forCodingPath codingPath: [CodingKey]) -> DecodingError {
        let context = DecodingError.Context(codingPath: codingPath, debugDescription: "Cannot decode JSONAny")
        return DecodingError.typeMismatch(JSONAny.self, context)
    }

    static func encodingError(forValue value: Any, codingPath: [CodingKey]) -> EncodingError {
        let context = EncodingError.Context(codingPath: codingPath, debugDescription: "Cannot encode JSONAny")
        return EncodingError.invalidValue(value, context)
    }

    static func decode(from container: SingleValueDecodingContainer) throws -> Any {
        if let value = try? container.decode(Bool.self) {
            return value
        }
        if let value = try? container.decode(Int64.self) {
            return value
        }
        if let value = try? container.decode(Double.self) {
            return value
        }
        if let value = try? container.decode(String.self) {
            return value
        }
        if container.decodeNil() {
            return JSONNull()
        }
        throw decodingError(forCodingPath: container.codingPath)
    }

    static func decode(from container: inout UnkeyedDecodingContainer) throws -> Any {
        if let value = try? container.decode(Bool.self) {
            return value
        }
        if let value = try? container.decode(Int64.self) {
            return value
        }
        if let value = try? container.decode(Double.self) {
            return value
        }
        if let value = try? container.decode(String.self) {
            return value
        }
        if let value = try? container.decodeNil() {
            if value {
                return JSONNull()
            }
        }
        if var container = try? container.nestedUnkeyedContainer() {
            return try decodeArray(from: &container)
        }
        if var container = try? container.nestedContainer(keyedBy: JSONCodingKey.self) {
            return try decodeDictionary(from: &container)
        }
        throw decodingError(forCodingPath: container.codingPath)
    }

    static func decode(from container: inout KeyedDecodingContainer<JSONCodingKey>, forKey key: JSONCodingKey) throws -> Any {
        if let value = try? container.decode(Bool.self, forKey: key) {
            return value
        }
        if let value = try? container.decode(Int64.self, forKey: key) {
            return value
        }
        if let value = try? container.decode(Double.self, forKey: key) {
            return value
        }
        if let value = try? container.decode(String.self, forKey: key) {
            return value
        }
        if let value = try? container.decodeNil(forKey: key) {
            if value {
                return JSONNull()
            }
        }
        if var container = try? container.nestedUnkeyedContainer(forKey: key) {
            return try decodeArray(from: &container)
        }
        if var container = try? container.nestedContainer(keyedBy: JSONCodingKey.self, forKey: key) {
            return try decodeDictionary(from: &container)
        }
        throw decodingError(forCodingPath: container.codingPath)
    }

    static func decodeArray(from container: inout UnkeyedDecodingContainer) throws -> [Any] {
        var arr: [Any] = []
        while !container.isAtEnd {
            let value = try decode(from: &container)
            arr.append(value)
        }
        return arr
    }

    static func decodeDictionary(from container: inout KeyedDecodingContainer<JSONCodingKey>) throws -> [String: Any] {
        var dict = [String: Any]()
        for key in container.allKeys {
            let value = try decode(from: &container, forKey: key)
            dict[key.stringValue] = value
        }
        return dict
    }

    static func encode(to container: inout UnkeyedEncodingContainer, array: [Any]) throws {
        for value in array {
            if let value = value as? Bool {
                try container.encode(value)
            } else if let value = value as? Int64 {
                try container.encode(value)
            } else if let value = value as? Double {
                try container.encode(value)
            } else if let value = value as? String {
                try container.encode(value)
            } else if value is JSONNull {
                try container.encodeNil()
            } else if let value = value as? [Any] {
                var container = container.nestedUnkeyedContainer()
                try encode(to: &container, array: value)
            } else if let value = value as? [String: Any] {
                var container = container.nestedContainer(keyedBy: JSONCodingKey.self)
                try encode(to: &container, dictionary: value)
            } else {
                throw encodingError(forValue: value, codingPath: container.codingPath)
            }
        }
    }

    static func encode(to container: inout KeyedEncodingContainer<JSONCodingKey>, dictionary: [String: Any]) throws {
        for (key, value) in dictionary {
            let key = JSONCodingKey(stringValue: key)!
            if let value = value as? Bool {
                try container.encode(value, forKey: key)
            } else if let value = value as? Int64 {
                try container.encode(value, forKey: key)
            } else if let value = value as? Double {
                try container.encode(value, forKey: key)
            } else if let value = value as? String {
                try container.encode(value, forKey: key)
            } else if value is JSONNull {
                try container.encodeNil(forKey: key)
            } else if let value = value as? [Any] {
                var container = container.nestedUnkeyedContainer(forKey: key)
                try encode(to: &container, array: value)
            } else if let value = value as? [String: Any] {
                var container = container.nestedContainer(keyedBy: JSONCodingKey.self, forKey: key)
                try encode(to: &container, dictionary: value)
            } else {
                throw encodingError(forValue: value, codingPath: container.codingPath)
            }
        }
    }

    static func encode(to container: inout SingleValueEncodingContainer, value: Any) throws {
        if let value = value as? Bool {
            try container.encode(value)
        } else if let value = value as? Int64 {
            try container.encode(value)
        } else if let value = value as? Double {
            try container.encode(value)
        } else if let value = value as? String {
            try container.encode(value)
        } else if value is JSONNull {
            try container.encodeNil()
        } else {
            throw encodingError(forValue: value, codingPath: container.codingPath)
        }
    }

    public required init(from decoder: Decoder) throws {
        if var arrayContainer = try? decoder.unkeyedContainer() {
            self.value = try JSONAny.decodeArray(from: &arrayContainer)
        } else if var container = try? decoder.container(keyedBy: JSONCodingKey.self) {
            self.value = try JSONAny.decodeDictionary(from: &container)
        } else {
            let container = try decoder.singleValueContainer()
            self.value = try JSONAny.decode(from: container)
        }
    }

    public func encode(to encoder: Encoder) throws {
        if let arr = self.value as? [Any] {
            var container = encoder.unkeyedContainer()
            try JSONAny.encode(to: &container, array: arr)
        } else if let dict = self.value as? [String: Any] {
            var container = encoder.container(keyedBy: JSONCodingKey.self)
            try JSONAny.encode(to: &container, dictionary: dict)
        } else {
            var container = encoder.singleValueContainer()
            try JSONAny.encode(to: &container, value: self.value)
        }
    }
}
