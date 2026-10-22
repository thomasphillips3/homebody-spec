// Generated from spec/schema. Do not edit directly.
"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema31 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://homebody.app/schema/home-record.schema.json","title":"HomeRecord","description":"Root document for a Home Record export. Flat, database-table-mirroring shape - one home, plus arrays of every other entity, each keyed by an id and its parent foreign keys rather than deep nesting.","type":"object","additionalProperties":false,"required":["schema_version","home","levels","rooms","plan_elements","systems","components","events","attachments","smart_home_readings","utility_bills"],"properties":{"schema_version":{"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$","enum":["0.1.0","0.1.1","0.2.0","0.3.0","0.4.0","0.5.0","0.6.0"],"description":"Semver of the Home Record spec this document conforms to, e.g. 0.2.0. Downstream import validation rejects unknown versions rather than duck-typing."},"home":{"title":"Home","type":"object","additionalProperties":false,"required":["id","owner_user_id","name","address","created_at"],"properties":{"id":{"type":"string","format":"uuid"},"owner_user_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"address":{"type":"string"},"parcel_id":{"type":["string","null"]},"year_built":{"type":["integer","null"]},"sq_ft":{"type":["number","null"]},"beds":{"type":["integer","null"]},"baths":{"type":["number","null"]},"lot_size_m2":{"type":["number","null"]},"maintenance_defaults":{"type":["object","null"],"description":"Per-home service interval overrides. Keys are component_type ids; a value is a whole number of days that overrides the taxonomy default_service_interval_days for that type in this home. A component's own service_interval_days still wins over both (D-03 resolution order).","propertyNames":{"pattern":"^[a-z][a-z0-9_]{0,63}$"},"maxProperties":100,"additionalProperties":{"type":"integer","minimum":1,"maximum":3650}},"created_at":{"type":"string","format":"date-time"}}},"levels":{"type":"array","items":{"title":"Level","type":"object","additionalProperties":false,"required":["id","home_id","name","sort_order","elevation_offset_m","scale_confidence"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"sort_order":{"type":"integer"},"elevation_offset_m":{"type":"number"},"scale_confidence":{"type":"string","enum":["measured","estimated"]},"import_attachment_id":{"type":["string","null"],"format":"uuid"},"import_origin_m":{"type":["array","null"],"items":{"type":"number"},"minItems":2,"maxItems":2},"import_scale_m_per_px":{"type":["number","null"]},"import_pixel_width":{"type":["integer","null"]},"import_pixel_height":{"type":["integer","null"]},"scan_usdz_attachment_id":{"type":["string","null"],"format":"uuid","description":"Soft reference (not a foreign key) to the usdz_mesh Attachment of a RoomPlan scan; the level patch can sync before the attachment row."},"scan_structure_attachment_id":{"type":["string","null"],"format":"uuid","description":"Soft reference (not a foreign key) to the roomplan_structure Attachment holding the captured structure JSON."},"scan_glb_attachment_id":{"type":["string","null"],"format":"uuid","description":"Soft reference (not a foreign key) to the gltf_mesh Attachment used by Android and web 3D viewers."},"scan_origin_m":{"type":["array","null"],"items":{"type":"number"},"minItems":2,"maxItems":2,"description":"Translation in meters from scan XZ (after rotation) to plan space."},"scan_rotation_rad":{"type":["number","null"],"description":"Rotation in radians from scan XZ to plan space. planPoint = R(rotation) * (X, Z) + scan_origin_m."},"scan_review_state":{"type":["string","null"],"enum":["pending_review","reviewed",null]}}},"default":[]},"rooms":{"type":"array","items":{"title":"Room","type":"object","additionalProperties":false,"required":["id","level_id","name","room_type","geometry"],"properties":{"id":{"type":"string","format":"uuid"},"level_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"room_type":{"type":"string","enum":["bedroom","bathroom","kitchen","living_room","dining_room","garage","basement","attic","hallway","closet","laundry","office","other"]},"geometry":{"allOf":[{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},{"type":"object","properties":{"type":{"const":"polygon"}}}]},"area_computed_m2":{"type":["number","null"]},"source":{"type":["string","null"],"enum":["hand","trace","roomplan",null],"description":"Provenance of the row. Null means hand."}}},"default":[]},"plan_elements":{"type":"array","items":{"title":"PlanElement","type":"object","additionalProperties":false,"required":["id","level_id","kind","geometry"],"properties":{"id":{"type":"string","format":"uuid"},"level_id":{"type":"string","format":"uuid"},"kind":{"type":"string","enum":["wall","door","window","opening"]},"geometry":{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},"host_element_id":{"type":["string","null"],"format":"uuid"},"source":{"type":["string","null"],"enum":["hand","trace","roomplan",null],"description":"Provenance of the row. Null means hand."}}},"default":[]},"systems":{"type":"array","items":{"title":"System","type":"object","additionalProperties":false,"required":["id","home_id","category","name"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"category":{"type":"string","enum":["plumbing","electrical","hvac","roof_structure","appliances_and_water_heater","exterior_and_site","low_voltage_and_smart_home"]},"name":{"type":"string"},"notes":{"type":["string","null"]}}},"default":[]},"components":{"type":"array","items":{"title":"Component","type":"object","additionalProperties":false,"required":["id","system_id","name","component_type","condition","room_ids","custom_fields"],"properties":{"id":{"type":"string","format":"uuid"},"system_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"component_type":{"type":"string","enum":["plumbing_fixture","toilet","sink","bathtub_shower","main_water_shutoff","gas_shutoff","water_supply_line","drain_waste_vent","sewer_lateral","sump_pump","water_treatment","electrical_panel","subpanel","electric_meter","service_conductors","branch_circuit","outlet","gfci_receptacle","light_fixture","smoke_detector","co_detector","generator","solar_pv_system","hvac_furnace","hvac_ac_unit","hvac_heat_pump","hvac_mini_split","hvac_boiler","hvac_air_handler","hvac_ductwork","thermostat","hvac_filter","hvac_ventilation_fan","hvac_fireplace","roof_covering","flashing","skylight","chimney","roof_vent","gutter","downspout","soffit_fascia","attic_insulation","foundation","structural_member","water_heater","refrigerator","dishwasher","range_oven","microwave","range_hood","clothes_washer","clothes_dryer","garbage_disposal","appliance_generic","exterior_wall_covering","window","exterior_door","garage_door","garage_door_opener","deck_porch_patio","driveway_walkway","fence_wall","irrigation_system","septic_system","well_pump","pool_spa","camera","video_doorbell","network_router","network_access_point","smart_hub","smart_lock","alarm_panel","leak_sensor","structured_wiring_panel","low_voltage_cabling","other"]},"make":{"type":["string","null"]},"model":{"type":["string","null"]},"manual_url":{"type":["string","null"],"format":"uri"},"location_note":{"type":["string","null"]},"serial_number":{"type":["string","null"]},"install_date":{"type":["string","null"],"format":"date"},"warranty_start":{"type":["string","null"],"format":"date"},"warranty_length_months":{"type":["integer","null"]},"manual_attachment_id":{"type":["string","null"],"format":"uuid"},"service_interval_days":{"type":["integer","null"]},"last_serviced_at":{"type":["string","null"],"format":"date"},"condition":{"title":"Condition","description":"Shared condition scale used by Component.condition and Event.condition_after, so the two cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for not-yet-assessed.","type":"string","enum":["good","fair","needs_attention","needs_replacement","unknown"]},"level_id":{"type":["string","null"],"format":"uuid"},"room_ids":{"type":"array","items":{"type":"string","format":"uuid"},"default":[]},"geometry":{"anyOf":[{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},{"type":"null"}],"default":null},"notes":{"type":["string","null"]},"linked_component_id":{"type":["string","null"],"format":"uuid"},"custom_fields":{"type":"object","additionalProperties":true,"default":{}}}},"default":[]},"events":{"type":"array","items":{"title":"Event","type":"object","additionalProperties":false,"required":["id","home_id","event_type","occurred_at","attachment_ids"],"anyOf":[{"required":["system_id"],"properties":{"system_id":{"type":"string","format":"uuid"}}},{"required":["component_id"],"properties":{"component_id":{"type":"string","format":"uuid"}}}],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"system_id":{"type":["string","null"],"format":"uuid"},"component_id":{"type":["string","null"],"format":"uuid"},"event_type":{"type":"string","enum":["inspection","service","repair","replacement","reading","note"]},"occurred_at":{"type":"string","format":"date-time"},"performed_by":{"type":["string","null"]},"cost_cents":{"type":["integer","null"]},"notes":{"type":["string","null"]},"title":{"type":["string","null"],"maxLength":200,"description":"Optional short label for the event, at most 200 characters. Shown in history lists ahead of the notes."},"condition_after":{"anyOf":[{"title":"Condition","description":"Shared condition scale used by Component.condition and Event.condition_after, so the two cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for not-yet-assessed.","type":"string","enum":["good","fair","needs_attention","needs_replacement","unknown"]},{"type":"null"}],"default":null},"reading_value":{"type":["number","null"]},"reading_unit":{"type":["string","null"]},"attachment_ids":{"type":"array","items":{"type":"string","format":"uuid"},"default":[]}}},"default":[]},"attachments":{"type":"array","items":{"title":"Attachment","type":"object","additionalProperties":false,"required":["id","home_id","kind","storage_path","mime_type","file_size_bytes"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"kind":{"type":"string","enum":["photo","receipt","manual_pdf","usdz_mesh","floor_plan_source","roomplan_structure","gltf_mesh"]},"storage_path":{"type":"string","pattern":"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$","description":"Canonical owner-scoped Storage key: {owner_user_id}/homes/{home_id}/attachments/{attachment_id}.ext."},"mime_type":{"type":"string"},"file_size_bytes":{"type":"integer"},"captured_at":{"type":["string","null"],"format":"date-time"},"linked_event_id":{"type":["string","null"],"format":"uuid"},"linked_component_id":{"type":["string","null"],"format":"uuid"}}},"default":[]},"smart_home_readings":{"type":"array","items":{"title":"SmartHomeReading","type":"object","additionalProperties":false,"required":["id","component_id","source","metric","value","unit","recorded_at"],"properties":{"id":{"type":"string","format":"uuid"},"component_id":{"type":"string","format":"uuid"},"source":{"type":"string","enum":["homekit","ecobee","nest","other"]},"metric":{"type":"string"},"value":{"type":"number"},"unit":{"type":"string"},"recorded_at":{"type":"string","format":"date-time"}}},"default":[]},"utility_bills":{"type":"array","items":{"title":"UtilityBill","type":"object","additionalProperties":false,"required":["id","home_id","utility_type","billing_period_start","billing_period_end","usage_amount","usage_unit","source"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"utility_type":{"type":"string","enum":["gas","electric","water"]},"billing_period_start":{"type":"string","format":"date"},"billing_period_end":{"type":"string","format":"date"},"usage_amount":{"type":"number"},"usage_unit":{"type":"string"},"cost_cents":{"type":["integer","null"]},"source":{"type":"string","enum":["manual","import"]},"attachment_id":{"type":["string","null"],"format":"uuid"}}},"default":[]},"recall_alerts":{"type":"array","items":{"title":"RecallAlert","description":"A possible CPSC recall match for one component. The server writes alerts (the recall Edge Function inserts them); clients may change only status.","type":"object","additionalProperties":false,"required":["id","home_id","component_id","recall_number","recall_id","title","url","recall_date","matched_on","confidence","status","detected_at"],"properties":{"id":{"type":"string","format":"uuid","description":"UUIDv5 over \"{component_id}:{recall_number}\" in namespace 5f3c9a2e-7b1d-4e68-9c04-2a8d6e1b7f35, so re-running the matcher never duplicates an alert."},"home_id":{"type":"string","format":"uuid"},"component_id":{"type":"string","format":"uuid"},"recall_number":{"type":"string","description":"CPSC recall number, e.g. 26123."},"recall_id":{"type":"integer","description":"CPSC numeric RecallID."},"title":{"type":"string","maxLength":500},"hazard":{"type":["string","null"]},"remedy":{"type":["string","null"]},"url":{"type":"string","pattern":"^https://","maxLength":2048,"description":"Link to the recall on cpsc.gov. Clients open it only when its scheme is https and its host ends with cpsc.gov."},"recall_date":{"type":"string","format":"date"},"matched_on":{"type":"string","enum":["model","manufacturer"]},"confidence":{"type":"string","enum":["likely","possible"]},"status":{"type":"string","enum":["open","dismissed","resolved"],"default":"open"},"detected_at":{"type":"string","format":"date-time"}}},"default":[],"description":"Recall matches the server wrote for this home's components. Optional: records without it stay valid."}}};
const func1 = Object.prototype.hasOwnProperty;
const func6 = require("ajv/dist/runtime/ucs2length").default;
const pattern4 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
const pattern5 = new RegExp("^[a-z][a-z0-9_]{0,63}$", "u");
const pattern6 = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$", "u");
const pattern7 = new RegExp("^https://", "u");
const formats0 = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const formats4 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const formats36 = require("ajv-formats/dist/formats").fullFormats.uri;
const formats38 = require("ajv-formats/dist/formats").fullFormats.date;

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://homebody.app/schema/home-record.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate20.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.schema_version === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.home === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "home"},message:"must have required property '"+"home"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.levels === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "levels"},message:"must have required property '"+"levels"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.rooms === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "rooms"},message:"must have required property '"+"rooms"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.plan_elements === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "plan_elements"},message:"must have required property '"+"plan_elements"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.systems === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "systems"},message:"must have required property '"+"systems"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.components === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "components"},message:"must have required property '"+"components"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.events === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "events"},message:"must have required property '"+"events"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.attachments === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "attachments"},message:"must have required property '"+"attachments"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.smart_home_readings === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "smart_home_readings"},message:"must have required property '"+"smart_home_readings"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.utility_bills === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "utility_bills"},message:"must have required property '"+"utility_bills"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
for(const key0 in data){
if(!(func1.call(schema31.properties, key0))){
const err11 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.schema_version !== undefined){
let data0 = data.schema_version;
if(!(((((((data0 === "0.1.0") || (data0 === "0.1.1")) || (data0 === "0.2.0")) || (data0 === "0.3.0")) || (data0 === "0.4.0")) || (data0 === "0.5.0")) || (data0 === "0.6.0"))){
const err12 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/enum",keyword:"enum",params:{allowedValues: schema31.properties.schema_version.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err13 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/pattern",keyword:"pattern",params:{pattern: "^\\d+\\.\\d+\\.\\d+$"},message:"must match pattern \""+"^\\d+\\.\\d+\\.\\d+$"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.home !== undefined){
let data1 = data.home;
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.id === undefined){
const err15 = {instancePath:instancePath+"/home",schemaPath:"#/properties/home/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data1.owner_user_id === undefined){
const err16 = {instancePath:instancePath+"/home",schemaPath:"#/properties/home/required",keyword:"required",params:{missingProperty: "owner_user_id"},message:"must have required property '"+"owner_user_id"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data1.name === undefined){
const err17 = {instancePath:instancePath+"/home",schemaPath:"#/properties/home/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data1.address === undefined){
const err18 = {instancePath:instancePath+"/home",schemaPath:"#/properties/home/required",keyword:"required",params:{missingProperty: "address"},message:"must have required property '"+"address"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data1.created_at === undefined){
const err19 = {instancePath:instancePath+"/home",schemaPath:"#/properties/home/required",keyword:"required",params:{missingProperty: "created_at"},message:"must have required property '"+"created_at"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
for(const key1 in data1){
if(!(func1.call(schema31.properties.home.properties, key1))){
const err20 = {instancePath:instancePath+"/home",schemaPath:"#/properties/home/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data1.id !== undefined){
let data2 = data1.id;
if(typeof data2 === "string"){
if(!(formats0.test(data2))){
const err21 = {instancePath:instancePath+"/home/id",schemaPath:"#/properties/home/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
else {
const err22 = {instancePath:instancePath+"/home/id",schemaPath:"#/properties/home/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data1.owner_user_id !== undefined){
let data3 = data1.owner_user_id;
if(typeof data3 === "string"){
if(!(formats0.test(data3))){
const err23 = {instancePath:instancePath+"/home/owner_user_id",schemaPath:"#/properties/home/properties/owner_user_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
else {
const err24 = {instancePath:instancePath+"/home/owner_user_id",schemaPath:"#/properties/home/properties/owner_user_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data1.name !== undefined){
if(typeof data1.name !== "string"){
const err25 = {instancePath:instancePath+"/home/name",schemaPath:"#/properties/home/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data1.address !== undefined){
if(typeof data1.address !== "string"){
const err26 = {instancePath:instancePath+"/home/address",schemaPath:"#/properties/home/properties/address/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data1.parcel_id !== undefined){
let data6 = data1.parcel_id;
if((typeof data6 !== "string") && (data6 !== null)){
const err27 = {instancePath:instancePath+"/home/parcel_id",schemaPath:"#/properties/home/properties/parcel_id/type",keyword:"type",params:{type: schema31.properties.home.properties.parcel_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data1.year_built !== undefined){
let data7 = data1.year_built;
if((!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))) && (data7 !== null)){
const err28 = {instancePath:instancePath+"/home/year_built",schemaPath:"#/properties/home/properties/year_built/type",keyword:"type",params:{type: schema31.properties.home.properties.year_built.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data1.sq_ft !== undefined){
let data8 = data1.sq_ft;
if((!((typeof data8 == "number") && (isFinite(data8)))) && (data8 !== null)){
const err29 = {instancePath:instancePath+"/home/sq_ft",schemaPath:"#/properties/home/properties/sq_ft/type",keyword:"type",params:{type: schema31.properties.home.properties.sq_ft.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data1.beds !== undefined){
let data9 = data1.beds;
if((!(((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9)))) && (data9 !== null)){
const err30 = {instancePath:instancePath+"/home/beds",schemaPath:"#/properties/home/properties/beds/type",keyword:"type",params:{type: schema31.properties.home.properties.beds.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data1.baths !== undefined){
let data10 = data1.baths;
if((!((typeof data10 == "number") && (isFinite(data10)))) && (data10 !== null)){
const err31 = {instancePath:instancePath+"/home/baths",schemaPath:"#/properties/home/properties/baths/type",keyword:"type",params:{type: schema31.properties.home.properties.baths.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data1.lot_size_m2 !== undefined){
let data11 = data1.lot_size_m2;
if((!((typeof data11 == "number") && (isFinite(data11)))) && (data11 !== null)){
const err32 = {instancePath:instancePath+"/home/lot_size_m2",schemaPath:"#/properties/home/properties/lot_size_m2/type",keyword:"type",params:{type: schema31.properties.home.properties.lot_size_m2.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data1.maintenance_defaults !== undefined){
let data12 = data1.maintenance_defaults;
if((!(data12 && typeof data12 == "object" && !Array.isArray(data12))) && (data12 !== null)){
const err33 = {instancePath:instancePath+"/home/maintenance_defaults",schemaPath:"#/properties/home/properties/maintenance_defaults/type",keyword:"type",params:{type: schema31.properties.home.properties.maintenance_defaults.type},message:"must be object,null"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
if(Object.keys(data12).length > 100){
const err34 = {instancePath:instancePath+"/home/maintenance_defaults",schemaPath:"#/properties/home/properties/maintenance_defaults/maxProperties",keyword:"maxProperties",params:{limit: 100},message:"must NOT have more than 100 properties"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
for(const key2 in data12){
const _errs29 = errors;
if(typeof key2 === "string"){
if(!pattern5.test(key2)){
const err35 = {instancePath:instancePath+"/home/maintenance_defaults",schemaPath:"#/properties/home/properties/maintenance_defaults/propertyNames/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-z0-9_]{0,63}$"},message:"must match pattern \""+"^[a-z][a-z0-9_]{0,63}$"+"\"",propertyName:key2};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
var valid2 = _errs29 === errors;
if(!valid2){
const err36 = {instancePath:instancePath+"/home/maintenance_defaults",schemaPath:"#/properties/home/properties/maintenance_defaults/propertyNames",keyword:"propertyNames",params:{propertyName: key2},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
for(const key3 in data12){
let data13 = data12[key3];
if(!(((typeof data13 == "number") && (!(data13 % 1) && !isNaN(data13))) && (isFinite(data13)))){
const err37 = {instancePath:instancePath+"/home/maintenance_defaults/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/home/properties/maintenance_defaults/additionalProperties/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if((typeof data13 == "number") && (isFinite(data13))){
if(data13 > 3650 || isNaN(data13)){
const err38 = {instancePath:instancePath+"/home/maintenance_defaults/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/home/properties/maintenance_defaults/additionalProperties/maximum",keyword:"maximum",params:{comparison: "<=", limit: 3650},message:"must be <= 3650"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data13 < 1 || isNaN(data13)){
const err39 = {instancePath:instancePath+"/home/maintenance_defaults/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/home/properties/maintenance_defaults/additionalProperties/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
}
}
}
if(data1.created_at !== undefined){
let data14 = data1.created_at;
if(typeof data14 === "string"){
if(!(formats4.validate(data14))){
const err40 = {instancePath:instancePath+"/home/created_at",schemaPath:"#/properties/home/properties/created_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
else {
const err41 = {instancePath:instancePath+"/home/created_at",schemaPath:"#/properties/home/properties/created_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
}
else {
const err42 = {instancePath:instancePath+"/home",schemaPath:"#/properties/home/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data.levels !== undefined){
let data15 = data.levels;
if(Array.isArray(data15)){
const len0 = data15.length;
for(let i0=0; i0<len0; i0++){
let data16 = data15[i0];
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.id === undefined){
const err43 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data16.home_id === undefined){
const err44 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data16.name === undefined){
const err45 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data16.sort_order === undefined){
const err46 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "sort_order"},message:"must have required property '"+"sort_order"+"'"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(data16.elevation_offset_m === undefined){
const err47 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "elevation_offset_m"},message:"must have required property '"+"elevation_offset_m"+"'"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if(data16.scale_confidence === undefined){
const err48 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "scale_confidence"},message:"must have required property '"+"scale_confidence"+"'"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
for(const key4 in data16){
if(!(func1.call(schema31.properties.levels.items.properties, key4))){
const err49 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data16.id !== undefined){
let data17 = data16.id;
if(typeof data17 === "string"){
if(!(formats0.test(data17))){
const err50 = {instancePath:instancePath+"/levels/" + i0+"/id",schemaPath:"#/properties/levels/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
else {
const err51 = {instancePath:instancePath+"/levels/" + i0+"/id",schemaPath:"#/properties/levels/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data16.home_id !== undefined){
let data18 = data16.home_id;
if(typeof data18 === "string"){
if(!(formats0.test(data18))){
const err52 = {instancePath:instancePath+"/levels/" + i0+"/home_id",schemaPath:"#/properties/levels/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
else {
const err53 = {instancePath:instancePath+"/levels/" + i0+"/home_id",schemaPath:"#/properties/levels/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data16.name !== undefined){
if(typeof data16.name !== "string"){
const err54 = {instancePath:instancePath+"/levels/" + i0+"/name",schemaPath:"#/properties/levels/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data16.sort_order !== undefined){
let data20 = data16.sort_order;
if(!(((typeof data20 == "number") && (!(data20 % 1) && !isNaN(data20))) && (isFinite(data20)))){
const err55 = {instancePath:instancePath+"/levels/" + i0+"/sort_order",schemaPath:"#/properties/levels/items/properties/sort_order/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data16.elevation_offset_m !== undefined){
let data21 = data16.elevation_offset_m;
if(!((typeof data21 == "number") && (isFinite(data21)))){
const err56 = {instancePath:instancePath+"/levels/" + i0+"/elevation_offset_m",schemaPath:"#/properties/levels/items/properties/elevation_offset_m/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data16.scale_confidence !== undefined){
let data22 = data16.scale_confidence;
if(typeof data22 !== "string"){
const err57 = {instancePath:instancePath+"/levels/" + i0+"/scale_confidence",schemaPath:"#/properties/levels/items/properties/scale_confidence/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
if(!((data22 === "measured") || (data22 === "estimated"))){
const err58 = {instancePath:instancePath+"/levels/" + i0+"/scale_confidence",schemaPath:"#/properties/levels/items/properties/scale_confidence/enum",keyword:"enum",params:{allowedValues: schema31.properties.levels.items.properties.scale_confidence.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data16.import_attachment_id !== undefined){
let data23 = data16.import_attachment_id;
if((typeof data23 !== "string") && (data23 !== null)){
const err59 = {instancePath:instancePath+"/levels/" + i0+"/import_attachment_id",schemaPath:"#/properties/levels/items/properties/import_attachment_id/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.import_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(typeof data23 === "string"){
if(!(formats0.test(data23))){
const err60 = {instancePath:instancePath+"/levels/" + i0+"/import_attachment_id",schemaPath:"#/properties/levels/items/properties/import_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
}
if(data16.import_origin_m !== undefined){
let data24 = data16.import_origin_m;
if((!(Array.isArray(data24))) && (data24 !== null)){
const err61 = {instancePath:instancePath+"/levels/" + i0+"/import_origin_m",schemaPath:"#/properties/levels/items/properties/import_origin_m/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.import_origin_m.type},message:"must be array,null"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(Array.isArray(data24)){
if(data24.length > 2){
const err62 = {instancePath:instancePath+"/levels/" + i0+"/import_origin_m",schemaPath:"#/properties/levels/items/properties/import_origin_m/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(data24.length < 2){
const err63 = {instancePath:instancePath+"/levels/" + i0+"/import_origin_m",schemaPath:"#/properties/levels/items/properties/import_origin_m/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
const len1 = data24.length;
for(let i1=0; i1<len1; i1++){
let data25 = data24[i1];
if(!((typeof data25 == "number") && (isFinite(data25)))){
const err64 = {instancePath:instancePath+"/levels/" + i0+"/import_origin_m/" + i1,schemaPath:"#/properties/levels/items/properties/import_origin_m/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
}
}
if(data16.import_scale_m_per_px !== undefined){
let data26 = data16.import_scale_m_per_px;
if((!((typeof data26 == "number") && (isFinite(data26)))) && (data26 !== null)){
const err65 = {instancePath:instancePath+"/levels/" + i0+"/import_scale_m_per_px",schemaPath:"#/properties/levels/items/properties/import_scale_m_per_px/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.import_scale_m_per_px.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data16.import_pixel_width !== undefined){
let data27 = data16.import_pixel_width;
if((!(((typeof data27 == "number") && (!(data27 % 1) && !isNaN(data27))) && (isFinite(data27)))) && (data27 !== null)){
const err66 = {instancePath:instancePath+"/levels/" + i0+"/import_pixel_width",schemaPath:"#/properties/levels/items/properties/import_pixel_width/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.import_pixel_width.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data16.import_pixel_height !== undefined){
let data28 = data16.import_pixel_height;
if((!(((typeof data28 == "number") && (!(data28 % 1) && !isNaN(data28))) && (isFinite(data28)))) && (data28 !== null)){
const err67 = {instancePath:instancePath+"/levels/" + i0+"/import_pixel_height",schemaPath:"#/properties/levels/items/properties/import_pixel_height/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.import_pixel_height.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
if(data16.scan_usdz_attachment_id !== undefined){
let data29 = data16.scan_usdz_attachment_id;
if((typeof data29 !== "string") && (data29 !== null)){
const err68 = {instancePath:instancePath+"/levels/" + i0+"/scan_usdz_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_usdz_attachment_id/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_usdz_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
if(typeof data29 === "string"){
if(!(formats0.test(data29))){
const err69 = {instancePath:instancePath+"/levels/" + i0+"/scan_usdz_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_usdz_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
}
if(data16.scan_structure_attachment_id !== undefined){
let data30 = data16.scan_structure_attachment_id;
if((typeof data30 !== "string") && (data30 !== null)){
const err70 = {instancePath:instancePath+"/levels/" + i0+"/scan_structure_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_structure_attachment_id/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_structure_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if(typeof data30 === "string"){
if(!(formats0.test(data30))){
const err71 = {instancePath:instancePath+"/levels/" + i0+"/scan_structure_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_structure_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
}
if(data16.scan_glb_attachment_id !== undefined){
let data31 = data16.scan_glb_attachment_id;
if((typeof data31 !== "string") && (data31 !== null)){
const err72 = {instancePath:instancePath+"/levels/" + i0+"/scan_glb_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_glb_attachment_id/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_glb_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(typeof data31 === "string"){
if(!(formats0.test(data31))){
const err73 = {instancePath:instancePath+"/levels/" + i0+"/scan_glb_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_glb_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
}
if(data16.scan_origin_m !== undefined){
let data32 = data16.scan_origin_m;
if((!(Array.isArray(data32))) && (data32 !== null)){
const err74 = {instancePath:instancePath+"/levels/" + i0+"/scan_origin_m",schemaPath:"#/properties/levels/items/properties/scan_origin_m/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_origin_m.type},message:"must be array,null"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
if(Array.isArray(data32)){
if(data32.length > 2){
const err75 = {instancePath:instancePath+"/levels/" + i0+"/scan_origin_m",schemaPath:"#/properties/levels/items/properties/scan_origin_m/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
if(data32.length < 2){
const err76 = {instancePath:instancePath+"/levels/" + i0+"/scan_origin_m",schemaPath:"#/properties/levels/items/properties/scan_origin_m/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
const len2 = data32.length;
for(let i2=0; i2<len2; i2++){
let data33 = data32[i2];
if(!((typeof data33 == "number") && (isFinite(data33)))){
const err77 = {instancePath:instancePath+"/levels/" + i0+"/scan_origin_m/" + i2,schemaPath:"#/properties/levels/items/properties/scan_origin_m/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
}
}
if(data16.scan_rotation_rad !== undefined){
let data34 = data16.scan_rotation_rad;
if((!((typeof data34 == "number") && (isFinite(data34)))) && (data34 !== null)){
const err78 = {instancePath:instancePath+"/levels/" + i0+"/scan_rotation_rad",schemaPath:"#/properties/levels/items/properties/scan_rotation_rad/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_rotation_rad.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data16.scan_review_state !== undefined){
let data35 = data16.scan_review_state;
if((typeof data35 !== "string") && (data35 !== null)){
const err79 = {instancePath:instancePath+"/levels/" + i0+"/scan_review_state",schemaPath:"#/properties/levels/items/properties/scan_review_state/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_review_state.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
if(!(((data35 === "pending_review") || (data35 === "reviewed")) || (data35 === null))){
const err80 = {instancePath:instancePath+"/levels/" + i0+"/scan_review_state",schemaPath:"#/properties/levels/items/properties/scan_review_state/enum",keyword:"enum",params:{allowedValues: schema31.properties.levels.items.properties.scan_review_state.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
}
else {
const err81 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
}
else {
const err82 = {instancePath:instancePath+"/levels",schemaPath:"#/properties/levels/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data.rooms !== undefined){
let data36 = data.rooms;
if(Array.isArray(data36)){
const len3 = data36.length;
for(let i3=0; i3<len3; i3++){
let data37 = data36[i3];
if(data37 && typeof data37 == "object" && !Array.isArray(data37)){
if(data37.id === undefined){
const err83 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
if(data37.level_id === undefined){
const err84 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "level_id"},message:"must have required property '"+"level_id"+"'"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
if(data37.name === undefined){
const err85 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
if(data37.room_type === undefined){
const err86 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "room_type"},message:"must have required property '"+"room_type"+"'"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
if(data37.geometry === undefined){
const err87 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
for(const key5 in data37){
if(!(((((((key5 === "id") || (key5 === "level_id")) || (key5 === "name")) || (key5 === "room_type")) || (key5 === "geometry")) || (key5 === "area_computed_m2")) || (key5 === "source"))){
const err88 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
if(data37.id !== undefined){
let data38 = data37.id;
if(typeof data38 === "string"){
if(!(formats0.test(data38))){
const err89 = {instancePath:instancePath+"/rooms/" + i3+"/id",schemaPath:"#/properties/rooms/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
else {
const err90 = {instancePath:instancePath+"/rooms/" + i3+"/id",schemaPath:"#/properties/rooms/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
if(data37.level_id !== undefined){
let data39 = data37.level_id;
if(typeof data39 === "string"){
if(!(formats0.test(data39))){
const err91 = {instancePath:instancePath+"/rooms/" + i3+"/level_id",schemaPath:"#/properties/rooms/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
else {
const err92 = {instancePath:instancePath+"/rooms/" + i3+"/level_id",schemaPath:"#/properties/rooms/items/properties/level_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
if(data37.name !== undefined){
if(typeof data37.name !== "string"){
const err93 = {instancePath:instancePath+"/rooms/" + i3+"/name",schemaPath:"#/properties/rooms/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
if(data37.room_type !== undefined){
let data41 = data37.room_type;
if(typeof data41 !== "string"){
const err94 = {instancePath:instancePath+"/rooms/" + i3+"/room_type",schemaPath:"#/properties/rooms/items/properties/room_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
if(!(((((((((((((data41 === "bedroom") || (data41 === "bathroom")) || (data41 === "kitchen")) || (data41 === "living_room")) || (data41 === "dining_room")) || (data41 === "garage")) || (data41 === "basement")) || (data41 === "attic")) || (data41 === "hallway")) || (data41 === "closet")) || (data41 === "laundry")) || (data41 === "office")) || (data41 === "other"))){
const err95 = {instancePath:instancePath+"/rooms/" + i3+"/room_type",schemaPath:"#/properties/rooms/items/properties/room_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.rooms.items.properties.room_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
if(data37.geometry !== undefined){
let data42 = data37.geometry;
const _errs95 = errors;
let valid16 = true;
const _errs96 = errors;
if(data42 && typeof data42 == "object" && !Array.isArray(data42)){
let missing0;
if((data42.type === undefined) && (missing0 = "type")){
const err96 = {};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
else {
if(data42.type !== undefined){
if("point" !== data42.type){
const err97 = {};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
}
}
var _valid0 = _errs96 === errors;
errors = _errs95;
if(vErrors !== null){
if(_errs95){
vErrors.length = _errs95;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs98 = errors;
if(data42 && typeof data42 == "object" && !Array.isArray(data42)){
if(data42.coordinates !== undefined){
let data44 = data42.coordinates;
if(Array.isArray(data44)){
if(data44.length > 1){
const err98 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
if(data44.length < 1){
const err99 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
else {
const err100 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
}
var _valid0 = _errs98 === errors;
valid16 = _valid0;
if(valid16){
var props0 = {};
props0.coordinates = true;
props0.type = true;
}
}
if(!valid16){
const err101 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
const _errs102 = errors;
let valid19 = true;
const _errs103 = errors;
if(data42 && typeof data42 == "object" && !Array.isArray(data42)){
let missing1;
if((data42.type === undefined) && (missing1 = "type")){
const err102 = {};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
else {
if(data42.type !== undefined){
if("polyline" !== data42.type){
const err103 = {};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
}
}
var _valid1 = _errs103 === errors;
errors = _errs102;
if(vErrors !== null){
if(_errs102){
vErrors.length = _errs102;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs105 = errors;
if(data42 && typeof data42 == "object" && !Array.isArray(data42)){
if(data42.coordinates !== undefined){
let data46 = data42.coordinates;
if(Array.isArray(data46)){
if(data46.length < 2){
const err104 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
else {
const err105 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
}
var _valid1 = _errs105 === errors;
valid19 = _valid1;
if(valid19){
var props1 = {};
props1.coordinates = true;
props1.type = true;
}
}
if(!valid19){
const err106 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
if(props0 !== true && props1 !== undefined){
if(props1 === true){
props0 = true;
}
else {
props0 = props0 || {};
Object.assign(props0, props1);
}
}
const _errs109 = errors;
let valid22 = true;
const _errs110 = errors;
if(data42 && typeof data42 == "object" && !Array.isArray(data42)){
let missing2;
if((data42.type === undefined) && (missing2 = "type")){
const err107 = {};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
else {
if(data42.type !== undefined){
if("polygon" !== data42.type){
const err108 = {};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
}
}
var _valid2 = _errs110 === errors;
errors = _errs109;
if(vErrors !== null){
if(_errs109){
vErrors.length = _errs109;
}
else {
vErrors = null;
}
}
if(_valid2){
const _errs112 = errors;
if(data42 && typeof data42 == "object" && !Array.isArray(data42)){
if(data42.coordinates !== undefined){
let data48 = data42.coordinates;
if(Array.isArray(data48)){
if(data48.length < 3){
const err109 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
else {
const err110 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
}
}
var _valid2 = _errs112 === errors;
valid22 = _valid2;
if(valid22){
var props2 = {};
props2.coordinates = true;
props2.type = true;
}
}
if(!valid22){
const err111 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
if(props0 !== true && props2 !== undefined){
if(props2 === true){
props0 = true;
}
else {
props0 = props0 || {};
Object.assign(props0, props2);
}
}
if(data42 && typeof data42 == "object" && !Array.isArray(data42)){
if(data42.type === undefined){
const err112 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
if(data42.coordinates === undefined){
const err113 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
for(const key6 in data42){
if(!((key6 === "type") || (key6 === "coordinates"))){
const err114 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
if(data42.type !== undefined){
let data49 = data42.type;
if(typeof data49 !== "string"){
const err115 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
if(!(((data49 === "point") || (data49 === "polyline")) || (data49 === "polygon"))){
const err116 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.rooms.items.properties.geometry.allOf[0].properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data42.coordinates !== undefined){
let data50 = data42.coordinates;
if(Array.isArray(data50)){
const len4 = data50.length;
for(let i4=0; i4<len4; i4++){
let data51 = data50[i4];
if(Array.isArray(data51)){
if(data51.length > 2){
const err117 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates/" + i4,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
if(data51.length < 2){
const err118 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates/" + i4,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
const len5 = data51.length;
for(let i5=0; i5<len5; i5++){
let data52 = data51[i5];
if(!((typeof data52 == "number") && (isFinite(data52)))){
const err119 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates/" + i4+"/" + i5,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
}
}
else {
const err120 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates/" + i4,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
}
else {
const err121 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
}
else {
const err122 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
if(data42 && typeof data42 == "object" && !Array.isArray(data42)){
if(data42.type !== undefined){
if("polygon" !== data42.type){
const err123 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/1/properties/type/const",keyword:"const",params:{allowedValue: "polygon"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
}
else {
const err124 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data37.area_computed_m2 !== undefined){
let data54 = data37.area_computed_m2;
if((!((typeof data54 == "number") && (isFinite(data54)))) && (data54 !== null)){
const err125 = {instancePath:instancePath+"/rooms/" + i3+"/area_computed_m2",schemaPath:"#/properties/rooms/items/properties/area_computed_m2/type",keyword:"type",params:{type: schema31.properties.rooms.items.properties.area_computed_m2.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data37.source !== undefined){
let data55 = data37.source;
if((typeof data55 !== "string") && (data55 !== null)){
const err126 = {instancePath:instancePath+"/rooms/" + i3+"/source",schemaPath:"#/properties/rooms/items/properties/source/type",keyword:"type",params:{type: schema31.properties.rooms.items.properties.source.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
if(!((((data55 === "hand") || (data55 === "trace")) || (data55 === "roomplan")) || (data55 === null))){
const err127 = {instancePath:instancePath+"/rooms/" + i3+"/source",schemaPath:"#/properties/rooms/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.rooms.items.properties.source.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
}
else {
const err128 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
}
else {
const err129 = {instancePath:instancePath+"/rooms",schemaPath:"#/properties/rooms/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data.plan_elements !== undefined){
let data56 = data.plan_elements;
if(Array.isArray(data56)){
const len6 = data56.length;
for(let i6=0; i6<len6; i6++){
let data57 = data56[i6];
if(data57 && typeof data57 == "object" && !Array.isArray(data57)){
if(data57.id === undefined){
const err130 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
if(data57.level_id === undefined){
const err131 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "level_id"},message:"must have required property '"+"level_id"+"'"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(data57.kind === undefined){
const err132 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
if(data57.geometry === undefined){
const err133 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
for(const key7 in data57){
if(!((((((key7 === "id") || (key7 === "level_id")) || (key7 === "kind")) || (key7 === "geometry")) || (key7 === "host_element_id")) || (key7 === "source"))){
const err134 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
if(data57.id !== undefined){
let data58 = data57.id;
if(typeof data58 === "string"){
if(!(formats0.test(data58))){
const err135 = {instancePath:instancePath+"/plan_elements/" + i6+"/id",schemaPath:"#/properties/plan_elements/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
}
else {
const err136 = {instancePath:instancePath+"/plan_elements/" + i6+"/id",schemaPath:"#/properties/plan_elements/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
}
if(data57.level_id !== undefined){
let data59 = data57.level_id;
if(typeof data59 === "string"){
if(!(formats0.test(data59))){
const err137 = {instancePath:instancePath+"/plan_elements/" + i6+"/level_id",schemaPath:"#/properties/plan_elements/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
else {
const err138 = {instancePath:instancePath+"/plan_elements/" + i6+"/level_id",schemaPath:"#/properties/plan_elements/items/properties/level_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
}
if(data57.kind !== undefined){
let data60 = data57.kind;
if(typeof data60 !== "string"){
const err139 = {instancePath:instancePath+"/plan_elements/" + i6+"/kind",schemaPath:"#/properties/plan_elements/items/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
if(!((((data60 === "wall") || (data60 === "door")) || (data60 === "window")) || (data60 === "opening"))){
const err140 = {instancePath:instancePath+"/plan_elements/" + i6+"/kind",schemaPath:"#/properties/plan_elements/items/properties/kind/enum",keyword:"enum",params:{allowedValues: schema31.properties.plan_elements.items.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
if(data57.geometry !== undefined){
let data61 = data57.geometry;
const _errs145 = errors;
let valid35 = true;
const _errs146 = errors;
if(data61 && typeof data61 == "object" && !Array.isArray(data61)){
let missing3;
if((data61.type === undefined) && (missing3 = "type")){
const err141 = {};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
else {
if(data61.type !== undefined){
if("point" !== data61.type){
const err142 = {};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
}
}
var _valid3 = _errs146 === errors;
errors = _errs145;
if(vErrors !== null){
if(_errs145){
vErrors.length = _errs145;
}
else {
vErrors = null;
}
}
if(_valid3){
const _errs148 = errors;
if(data61 && typeof data61 == "object" && !Array.isArray(data61)){
if(data61.coordinates !== undefined){
let data63 = data61.coordinates;
if(Array.isArray(data63)){
if(data63.length > 1){
const err143 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
if(data63.length < 1){
const err144 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
else {
const err145 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
}
var _valid3 = _errs148 === errors;
valid35 = _valid3;
if(valid35){
var props3 = {};
props3.coordinates = true;
props3.type = true;
}
}
if(!valid35){
const err146 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
const _errs152 = errors;
let valid38 = true;
const _errs153 = errors;
if(data61 && typeof data61 == "object" && !Array.isArray(data61)){
let missing4;
if((data61.type === undefined) && (missing4 = "type")){
const err147 = {};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
else {
if(data61.type !== undefined){
if("polyline" !== data61.type){
const err148 = {};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
}
}
}
var _valid4 = _errs153 === errors;
errors = _errs152;
if(vErrors !== null){
if(_errs152){
vErrors.length = _errs152;
}
else {
vErrors = null;
}
}
if(_valid4){
const _errs155 = errors;
if(data61 && typeof data61 == "object" && !Array.isArray(data61)){
if(data61.coordinates !== undefined){
let data65 = data61.coordinates;
if(Array.isArray(data65)){
if(data65.length < 2){
const err149 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
else {
const err150 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
}
}
var _valid4 = _errs155 === errors;
valid38 = _valid4;
if(valid38){
var props4 = {};
props4.coordinates = true;
props4.type = true;
}
}
if(!valid38){
const err151 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
if(props3 !== true && props4 !== undefined){
if(props4 === true){
props3 = true;
}
else {
props3 = props3 || {};
Object.assign(props3, props4);
}
}
const _errs159 = errors;
let valid41 = true;
const _errs160 = errors;
if(data61 && typeof data61 == "object" && !Array.isArray(data61)){
let missing5;
if((data61.type === undefined) && (missing5 = "type")){
const err152 = {};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
else {
if(data61.type !== undefined){
if("polygon" !== data61.type){
const err153 = {};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
}
}
}
var _valid5 = _errs160 === errors;
errors = _errs159;
if(vErrors !== null){
if(_errs159){
vErrors.length = _errs159;
}
else {
vErrors = null;
}
}
if(_valid5){
const _errs162 = errors;
if(data61 && typeof data61 == "object" && !Array.isArray(data61)){
if(data61.coordinates !== undefined){
let data67 = data61.coordinates;
if(Array.isArray(data67)){
if(data67.length < 3){
const err154 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
}
else {
const err155 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
}
}
var _valid5 = _errs162 === errors;
valid41 = _valid5;
if(valid41){
var props5 = {};
props5.coordinates = true;
props5.type = true;
}
}
if(!valid41){
const err156 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
if(props3 !== true && props5 !== undefined){
if(props5 === true){
props3 = true;
}
else {
props3 = props3 || {};
Object.assign(props3, props5);
}
}
if(data61 && typeof data61 == "object" && !Array.isArray(data61)){
if(data61.type === undefined){
const err157 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
if(data61.coordinates === undefined){
const err158 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
for(const key8 in data61){
if(!((key8 === "type") || (key8 === "coordinates"))){
const err159 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
if(data61.type !== undefined){
let data68 = data61.type;
if(typeof data68 !== "string"){
const err160 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/type",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
if(!(((data68 === "point") || (data68 === "polyline")) || (data68 === "polygon"))){
const err161 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/type",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.plan_elements.items.properties.geometry.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
if(data61.coordinates !== undefined){
let data69 = data61.coordinates;
if(Array.isArray(data69)){
const len7 = data69.length;
for(let i7=0; i7<len7; i7++){
let data70 = data69[i7];
if(Array.isArray(data70)){
if(data70.length > 2){
const err162 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates/" + i7,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
if(data70.length < 2){
const err163 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates/" + i7,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
const len8 = data70.length;
for(let i8=0; i8<len8; i8++){
let data71 = data70[i8];
if(!((typeof data71 == "number") && (isFinite(data71)))){
const err164 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates/" + i7+"/" + i8,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
}
else {
const err165 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates/" + i7,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
}
else {
const err166 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
}
}
else {
const err167 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
}
if(data57.host_element_id !== undefined){
let data72 = data57.host_element_id;
if((typeof data72 !== "string") && (data72 !== null)){
const err168 = {instancePath:instancePath+"/plan_elements/" + i6+"/host_element_id",schemaPath:"#/properties/plan_elements/items/properties/host_element_id/type",keyword:"type",params:{type: schema31.properties.plan_elements.items.properties.host_element_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
if(typeof data72 === "string"){
if(!(formats0.test(data72))){
const err169 = {instancePath:instancePath+"/plan_elements/" + i6+"/host_element_id",schemaPath:"#/properties/plan_elements/items/properties/host_element_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
}
}
if(data57.source !== undefined){
let data73 = data57.source;
if((typeof data73 !== "string") && (data73 !== null)){
const err170 = {instancePath:instancePath+"/plan_elements/" + i6+"/source",schemaPath:"#/properties/plan_elements/items/properties/source/type",keyword:"type",params:{type: schema31.properties.plan_elements.items.properties.source.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
if(!((((data73 === "hand") || (data73 === "trace")) || (data73 === "roomplan")) || (data73 === null))){
const err171 = {instancePath:instancePath+"/plan_elements/" + i6+"/source",schemaPath:"#/properties/plan_elements/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.plan_elements.items.properties.source.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
}
}
else {
const err172 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
}
}
else {
const err173 = {instancePath:instancePath+"/plan_elements",schemaPath:"#/properties/plan_elements/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
}
if(data.systems !== undefined){
let data74 = data.systems;
if(Array.isArray(data74)){
const len9 = data74.length;
for(let i9=0; i9<len9; i9++){
let data75 = data74[i9];
if(data75 && typeof data75 == "object" && !Array.isArray(data75)){
if(data75.id === undefined){
const err174 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
if(data75.home_id === undefined){
const err175 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
if(data75.category === undefined){
const err176 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "category"},message:"must have required property '"+"category"+"'"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
if(data75.name === undefined){
const err177 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
for(const key9 in data75){
if(!(((((key9 === "id") || (key9 === "home_id")) || (key9 === "category")) || (key9 === "name")) || (key9 === "notes"))){
const err178 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
}
if(data75.id !== undefined){
let data76 = data75.id;
if(typeof data76 === "string"){
if(!(formats0.test(data76))){
const err179 = {instancePath:instancePath+"/systems/" + i9+"/id",schemaPath:"#/properties/systems/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
}
else {
const err180 = {instancePath:instancePath+"/systems/" + i9+"/id",schemaPath:"#/properties/systems/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
}
if(data75.home_id !== undefined){
let data77 = data75.home_id;
if(typeof data77 === "string"){
if(!(formats0.test(data77))){
const err181 = {instancePath:instancePath+"/systems/" + i9+"/home_id",schemaPath:"#/properties/systems/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
}
else {
const err182 = {instancePath:instancePath+"/systems/" + i9+"/home_id",schemaPath:"#/properties/systems/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
}
if(data75.category !== undefined){
let data78 = data75.category;
if(typeof data78 !== "string"){
const err183 = {instancePath:instancePath+"/systems/" + i9+"/category",schemaPath:"#/properties/systems/items/properties/category/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
if(!(((((((data78 === "plumbing") || (data78 === "electrical")) || (data78 === "hvac")) || (data78 === "roof_structure")) || (data78 === "appliances_and_water_heater")) || (data78 === "exterior_and_site")) || (data78 === "low_voltage_and_smart_home"))){
const err184 = {instancePath:instancePath+"/systems/" + i9+"/category",schemaPath:"#/properties/systems/items/properties/category/enum",keyword:"enum",params:{allowedValues: schema31.properties.systems.items.properties.category.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
}
if(data75.name !== undefined){
if(typeof data75.name !== "string"){
const err185 = {instancePath:instancePath+"/systems/" + i9+"/name",schemaPath:"#/properties/systems/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
}
if(data75.notes !== undefined){
let data80 = data75.notes;
if((typeof data80 !== "string") && (data80 !== null)){
const err186 = {instancePath:instancePath+"/systems/" + i9+"/notes",schemaPath:"#/properties/systems/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.systems.items.properties.notes.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
}
}
else {
const err187 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
}
}
else {
const err188 = {instancePath:instancePath+"/systems",schemaPath:"#/properties/systems/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
}
if(data.components !== undefined){
let data81 = data.components;
if(Array.isArray(data81)){
const len10 = data81.length;
for(let i10=0; i10<len10; i10++){
let data82 = data81[i10];
if(data82 && typeof data82 == "object" && !Array.isArray(data82)){
if(data82.id === undefined){
const err189 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
if(data82.system_id === undefined){
const err190 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "system_id"},message:"must have required property '"+"system_id"+"'"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
if(data82.name === undefined){
const err191 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
if(data82.component_type === undefined){
const err192 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "component_type"},message:"must have required property '"+"component_type"+"'"};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
if(data82.condition === undefined){
const err193 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "condition"},message:"must have required property '"+"condition"+"'"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
if(data82.room_ids === undefined){
const err194 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "room_ids"},message:"must have required property '"+"room_ids"+"'"};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
if(data82.custom_fields === undefined){
const err195 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "custom_fields"},message:"must have required property '"+"custom_fields"+"'"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
for(const key10 in data82){
if(!(func1.call(schema31.properties.components.items.properties, key10))){
const err196 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
}
if(data82.id !== undefined){
let data83 = data82.id;
if(typeof data83 === "string"){
if(!(formats0.test(data83))){
const err197 = {instancePath:instancePath+"/components/" + i10+"/id",schemaPath:"#/properties/components/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
}
else {
const err198 = {instancePath:instancePath+"/components/" + i10+"/id",schemaPath:"#/properties/components/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err198];
}
else {
vErrors.push(err198);
}
errors++;
}
}
if(data82.system_id !== undefined){
let data84 = data82.system_id;
if(typeof data84 === "string"){
if(!(formats0.test(data84))){
const err199 = {instancePath:instancePath+"/components/" + i10+"/system_id",schemaPath:"#/properties/components/items/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
}
else {
const err200 = {instancePath:instancePath+"/components/" + i10+"/system_id",schemaPath:"#/properties/components/items/properties/system_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err200];
}
else {
vErrors.push(err200);
}
errors++;
}
}
if(data82.name !== undefined){
if(typeof data82.name !== "string"){
const err201 = {instancePath:instancePath+"/components/" + i10+"/name",schemaPath:"#/properties/components/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
}
if(data82.component_type !== undefined){
let data86 = data82.component_type;
if(typeof data86 !== "string"){
const err202 = {instancePath:instancePath+"/components/" + i10+"/component_type",schemaPath:"#/properties/components/items/properties/component_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
if(!((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((data86 === "plumbing_fixture") || (data86 === "toilet")) || (data86 === "sink")) || (data86 === "bathtub_shower")) || (data86 === "main_water_shutoff")) || (data86 === "gas_shutoff")) || (data86 === "water_supply_line")) || (data86 === "drain_waste_vent")) || (data86 === "sewer_lateral")) || (data86 === "sump_pump")) || (data86 === "water_treatment")) || (data86 === "electrical_panel")) || (data86 === "subpanel")) || (data86 === "electric_meter")) || (data86 === "service_conductors")) || (data86 === "branch_circuit")) || (data86 === "outlet")) || (data86 === "gfci_receptacle")) || (data86 === "light_fixture")) || (data86 === "smoke_detector")) || (data86 === "co_detector")) || (data86 === "generator")) || (data86 === "solar_pv_system")) || (data86 === "hvac_furnace")) || (data86 === "hvac_ac_unit")) || (data86 === "hvac_heat_pump")) || (data86 === "hvac_mini_split")) || (data86 === "hvac_boiler")) || (data86 === "hvac_air_handler")) || (data86 === "hvac_ductwork")) || (data86 === "thermostat")) || (data86 === "hvac_filter")) || (data86 === "hvac_ventilation_fan")) || (data86 === "hvac_fireplace")) || (data86 === "roof_covering")) || (data86 === "flashing")) || (data86 === "skylight")) || (data86 === "chimney")) || (data86 === "roof_vent")) || (data86 === "gutter")) || (data86 === "downspout")) || (data86 === "soffit_fascia")) || (data86 === "attic_insulation")) || (data86 === "foundation")) || (data86 === "structural_member")) || (data86 === "water_heater")) || (data86 === "refrigerator")) || (data86 === "dishwasher")) || (data86 === "range_oven")) || (data86 === "microwave")) || (data86 === "range_hood")) || (data86 === "clothes_washer")) || (data86 === "clothes_dryer")) || (data86 === "garbage_disposal")) || (data86 === "appliance_generic")) || (data86 === "exterior_wall_covering")) || (data86 === "window")) || (data86 === "exterior_door")) || (data86 === "garage_door")) || (data86 === "garage_door_opener")) || (data86 === "deck_porch_patio")) || (data86 === "driveway_walkway")) || (data86 === "fence_wall")) || (data86 === "irrigation_system")) || (data86 === "septic_system")) || (data86 === "well_pump")) || (data86 === "pool_spa")) || (data86 === "camera")) || (data86 === "video_doorbell")) || (data86 === "network_router")) || (data86 === "network_access_point")) || (data86 === "smart_hub")) || (data86 === "smart_lock")) || (data86 === "alarm_panel")) || (data86 === "leak_sensor")) || (data86 === "structured_wiring_panel")) || (data86 === "low_voltage_cabling")) || (data86 === "other"))){
const err203 = {instancePath:instancePath+"/components/" + i10+"/component_type",schemaPath:"#/properties/components/items/properties/component_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.component_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
}
if(data82.make !== undefined){
let data87 = data82.make;
if((typeof data87 !== "string") && (data87 !== null)){
const err204 = {instancePath:instancePath+"/components/" + i10+"/make",schemaPath:"#/properties/components/items/properties/make/type",keyword:"type",params:{type: schema31.properties.components.items.properties.make.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
}
if(data82.model !== undefined){
let data88 = data82.model;
if((typeof data88 !== "string") && (data88 !== null)){
const err205 = {instancePath:instancePath+"/components/" + i10+"/model",schemaPath:"#/properties/components/items/properties/model/type",keyword:"type",params:{type: schema31.properties.components.items.properties.model.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
}
if(data82.manual_url !== undefined){
let data89 = data82.manual_url;
if((typeof data89 !== "string") && (data89 !== null)){
const err206 = {instancePath:instancePath+"/components/" + i10+"/manual_url",schemaPath:"#/properties/components/items/properties/manual_url/type",keyword:"type",params:{type: schema31.properties.components.items.properties.manual_url.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
if(typeof data89 === "string"){
if(!(formats36(data89))){
const err207 = {instancePath:instancePath+"/components/" + i10+"/manual_url",schemaPath:"#/properties/components/items/properties/manual_url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
}
}
if(data82.location_note !== undefined){
let data90 = data82.location_note;
if((typeof data90 !== "string") && (data90 !== null)){
const err208 = {instancePath:instancePath+"/components/" + i10+"/location_note",schemaPath:"#/properties/components/items/properties/location_note/type",keyword:"type",params:{type: schema31.properties.components.items.properties.location_note.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
}
if(data82.serial_number !== undefined){
let data91 = data82.serial_number;
if((typeof data91 !== "string") && (data91 !== null)){
const err209 = {instancePath:instancePath+"/components/" + i10+"/serial_number",schemaPath:"#/properties/components/items/properties/serial_number/type",keyword:"type",params:{type: schema31.properties.components.items.properties.serial_number.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err209];
}
else {
vErrors.push(err209);
}
errors++;
}
}
if(data82.install_date !== undefined){
let data92 = data82.install_date;
if((typeof data92 !== "string") && (data92 !== null)){
const err210 = {instancePath:instancePath+"/components/" + i10+"/install_date",schemaPath:"#/properties/components/items/properties/install_date/type",keyword:"type",params:{type: schema31.properties.components.items.properties.install_date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
if(typeof data92 === "string"){
if(!(formats38.validate(data92))){
const err211 = {instancePath:instancePath+"/components/" + i10+"/install_date",schemaPath:"#/properties/components/items/properties/install_date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
}
}
if(data82.warranty_start !== undefined){
let data93 = data82.warranty_start;
if((typeof data93 !== "string") && (data93 !== null)){
const err212 = {instancePath:instancePath+"/components/" + i10+"/warranty_start",schemaPath:"#/properties/components/items/properties/warranty_start/type",keyword:"type",params:{type: schema31.properties.components.items.properties.warranty_start.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err212];
}
else {
vErrors.push(err212);
}
errors++;
}
if(typeof data93 === "string"){
if(!(formats38.validate(data93))){
const err213 = {instancePath:instancePath+"/components/" + i10+"/warranty_start",schemaPath:"#/properties/components/items/properties/warranty_start/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
}
}
if(data82.warranty_length_months !== undefined){
let data94 = data82.warranty_length_months;
if((!(((typeof data94 == "number") && (!(data94 % 1) && !isNaN(data94))) && (isFinite(data94)))) && (data94 !== null)){
const err214 = {instancePath:instancePath+"/components/" + i10+"/warranty_length_months",schemaPath:"#/properties/components/items/properties/warranty_length_months/type",keyword:"type",params:{type: schema31.properties.components.items.properties.warranty_length_months.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err214];
}
else {
vErrors.push(err214);
}
errors++;
}
}
if(data82.manual_attachment_id !== undefined){
let data95 = data82.manual_attachment_id;
if((typeof data95 !== "string") && (data95 !== null)){
const err215 = {instancePath:instancePath+"/components/" + i10+"/manual_attachment_id",schemaPath:"#/properties/components/items/properties/manual_attachment_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.manual_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
}
errors++;
}
if(typeof data95 === "string"){
if(!(formats0.test(data95))){
const err216 = {instancePath:instancePath+"/components/" + i10+"/manual_attachment_id",schemaPath:"#/properties/components/items/properties/manual_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err216];
}
else {
vErrors.push(err216);
}
errors++;
}
}
}
if(data82.service_interval_days !== undefined){
let data96 = data82.service_interval_days;
if((!(((typeof data96 == "number") && (!(data96 % 1) && !isNaN(data96))) && (isFinite(data96)))) && (data96 !== null)){
const err217 = {instancePath:instancePath+"/components/" + i10+"/service_interval_days",schemaPath:"#/properties/components/items/properties/service_interval_days/type",keyword:"type",params:{type: schema31.properties.components.items.properties.service_interval_days.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
}
if(data82.last_serviced_at !== undefined){
let data97 = data82.last_serviced_at;
if((typeof data97 !== "string") && (data97 !== null)){
const err218 = {instancePath:instancePath+"/components/" + i10+"/last_serviced_at",schemaPath:"#/properties/components/items/properties/last_serviced_at/type",keyword:"type",params:{type: schema31.properties.components.items.properties.last_serviced_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err218];
}
else {
vErrors.push(err218);
}
errors++;
}
if(typeof data97 === "string"){
if(!(formats38.validate(data97))){
const err219 = {instancePath:instancePath+"/components/" + i10+"/last_serviced_at",schemaPath:"#/properties/components/items/properties/last_serviced_at/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err219];
}
else {
vErrors.push(err219);
}
errors++;
}
}
}
if(data82.condition !== undefined){
let data98 = data82.condition;
if(typeof data98 !== "string"){
const err220 = {instancePath:instancePath+"/components/" + i10+"/condition",schemaPath:"#/properties/components/items/properties/condition/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err220];
}
else {
vErrors.push(err220);
}
errors++;
}
if(!(((((data98 === "good") || (data98 === "fair")) || (data98 === "needs_attention")) || (data98 === "needs_replacement")) || (data98 === "unknown"))){
const err221 = {instancePath:instancePath+"/components/" + i10+"/condition",schemaPath:"#/properties/components/items/properties/condition/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.condition.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err221];
}
else {
vErrors.push(err221);
}
errors++;
}
}
if(data82.level_id !== undefined){
let data99 = data82.level_id;
if((typeof data99 !== "string") && (data99 !== null)){
const err222 = {instancePath:instancePath+"/components/" + i10+"/level_id",schemaPath:"#/properties/components/items/properties/level_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.level_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err222];
}
else {
vErrors.push(err222);
}
errors++;
}
if(typeof data99 === "string"){
if(!(formats0.test(data99))){
const err223 = {instancePath:instancePath+"/components/" + i10+"/level_id",schemaPath:"#/properties/components/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err223];
}
else {
vErrors.push(err223);
}
errors++;
}
}
}
if(data82.room_ids !== undefined){
let data100 = data82.room_ids;
if(Array.isArray(data100)){
const len11 = data100.length;
for(let i11=0; i11<len11; i11++){
let data101 = data100[i11];
if(typeof data101 === "string"){
if(!(formats0.test(data101))){
const err224 = {instancePath:instancePath+"/components/" + i10+"/room_ids/" + i11,schemaPath:"#/properties/components/items/properties/room_ids/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err224];
}
else {
vErrors.push(err224);
}
errors++;
}
}
else {
const err225 = {instancePath:instancePath+"/components/" + i10+"/room_ids/" + i11,schemaPath:"#/properties/components/items/properties/room_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err225];
}
else {
vErrors.push(err225);
}
errors++;
}
}
}
else {
const err226 = {instancePath:instancePath+"/components/" + i10+"/room_ids",schemaPath:"#/properties/components/items/properties/room_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err226];
}
else {
vErrors.push(err226);
}
errors++;
}
}
if(data82.geometry !== undefined){
let data102 = data82.geometry;
const _errs237 = errors;
let valid57 = false;
const _errs238 = errors;
const _errs241 = errors;
let valid59 = true;
const _errs242 = errors;
if(data102 && typeof data102 == "object" && !Array.isArray(data102)){
let missing6;
if((data102.type === undefined) && (missing6 = "type")){
const err227 = {};
if(vErrors === null){
vErrors = [err227];
}
else {
vErrors.push(err227);
}
errors++;
}
else {
if(data102.type !== undefined){
if("point" !== data102.type){
const err228 = {};
if(vErrors === null){
vErrors = [err228];
}
else {
vErrors.push(err228);
}
errors++;
}
}
}
}
var _valid7 = _errs242 === errors;
errors = _errs241;
if(vErrors !== null){
if(_errs241){
vErrors.length = _errs241;
}
else {
vErrors = null;
}
}
if(_valid7){
const _errs244 = errors;
if(data102 && typeof data102 == "object" && !Array.isArray(data102)){
if(data102.coordinates !== undefined){
let data104 = data102.coordinates;
if(Array.isArray(data104)){
if(data104.length > 1){
const err229 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err229];
}
else {
vErrors.push(err229);
}
errors++;
}
if(data104.length < 1){
const err230 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err230];
}
else {
vErrors.push(err230);
}
errors++;
}
}
else {
const err231 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err231];
}
else {
vErrors.push(err231);
}
errors++;
}
}
}
var _valid7 = _errs244 === errors;
valid59 = _valid7;
if(valid59){
var props6 = {};
props6.coordinates = true;
props6.type = true;
}
}
if(!valid59){
const err232 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err232];
}
else {
vErrors.push(err232);
}
errors++;
}
const _errs248 = errors;
let valid62 = true;
const _errs249 = errors;
if(data102 && typeof data102 == "object" && !Array.isArray(data102)){
let missing7;
if((data102.type === undefined) && (missing7 = "type")){
const err233 = {};
if(vErrors === null){
vErrors = [err233];
}
else {
vErrors.push(err233);
}
errors++;
}
else {
if(data102.type !== undefined){
if("polyline" !== data102.type){
const err234 = {};
if(vErrors === null){
vErrors = [err234];
}
else {
vErrors.push(err234);
}
errors++;
}
}
}
}
var _valid8 = _errs249 === errors;
errors = _errs248;
if(vErrors !== null){
if(_errs248){
vErrors.length = _errs248;
}
else {
vErrors = null;
}
}
if(_valid8){
const _errs251 = errors;
if(data102 && typeof data102 == "object" && !Array.isArray(data102)){
if(data102.coordinates !== undefined){
let data106 = data102.coordinates;
if(Array.isArray(data106)){
if(data106.length < 2){
const err235 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err235];
}
else {
vErrors.push(err235);
}
errors++;
}
}
else {
const err236 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err236];
}
else {
vErrors.push(err236);
}
errors++;
}
}
}
var _valid8 = _errs251 === errors;
valid62 = _valid8;
if(valid62){
var props7 = {};
props7.coordinates = true;
props7.type = true;
}
}
if(!valid62){
const err237 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err237];
}
else {
vErrors.push(err237);
}
errors++;
}
if(props6 !== true && props7 !== undefined){
if(props7 === true){
props6 = true;
}
else {
props6 = props6 || {};
Object.assign(props6, props7);
}
}
const _errs255 = errors;
let valid65 = true;
const _errs256 = errors;
if(data102 && typeof data102 == "object" && !Array.isArray(data102)){
let missing8;
if((data102.type === undefined) && (missing8 = "type")){
const err238 = {};
if(vErrors === null){
vErrors = [err238];
}
else {
vErrors.push(err238);
}
errors++;
}
else {
if(data102.type !== undefined){
if("polygon" !== data102.type){
const err239 = {};
if(vErrors === null){
vErrors = [err239];
}
else {
vErrors.push(err239);
}
errors++;
}
}
}
}
var _valid9 = _errs256 === errors;
errors = _errs255;
if(vErrors !== null){
if(_errs255){
vErrors.length = _errs255;
}
else {
vErrors = null;
}
}
if(_valid9){
const _errs258 = errors;
if(data102 && typeof data102 == "object" && !Array.isArray(data102)){
if(data102.coordinates !== undefined){
let data108 = data102.coordinates;
if(Array.isArray(data108)){
if(data108.length < 3){
const err240 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err240];
}
else {
vErrors.push(err240);
}
errors++;
}
}
else {
const err241 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err241];
}
else {
vErrors.push(err241);
}
errors++;
}
}
}
var _valid9 = _errs258 === errors;
valid65 = _valid9;
if(valid65){
var props8 = {};
props8.coordinates = true;
props8.type = true;
}
}
if(!valid65){
const err242 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err242];
}
else {
vErrors.push(err242);
}
errors++;
}
if(props6 !== true && props8 !== undefined){
if(props8 === true){
props6 = true;
}
else {
props6 = props6 || {};
Object.assign(props6, props8);
}
}
if(data102 && typeof data102 == "object" && !Array.isArray(data102)){
if(data102.type === undefined){
const err243 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err243];
}
else {
vErrors.push(err243);
}
errors++;
}
if(data102.coordinates === undefined){
const err244 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err244];
}
else {
vErrors.push(err244);
}
errors++;
}
for(const key11 in data102){
if(!((key11 === "type") || (key11 === "coordinates"))){
const err245 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err245];
}
else {
vErrors.push(err245);
}
errors++;
}
}
if(data102.type !== undefined){
let data109 = data102.type;
if(typeof data109 !== "string"){
const err246 = {instancePath:instancePath+"/components/" + i10+"/geometry/type",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err246];
}
else {
vErrors.push(err246);
}
errors++;
}
if(!(((data109 === "point") || (data109 === "polyline")) || (data109 === "polygon"))){
const err247 = {instancePath:instancePath+"/components/" + i10+"/geometry/type",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.geometry.anyOf[0].properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err247];
}
else {
vErrors.push(err247);
}
errors++;
}
}
if(data102.coordinates !== undefined){
let data110 = data102.coordinates;
if(Array.isArray(data110)){
const len12 = data110.length;
for(let i12=0; i12<len12; i12++){
let data111 = data110[i12];
if(Array.isArray(data111)){
if(data111.length > 2){
const err248 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates/" + i12,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err248];
}
else {
vErrors.push(err248);
}
errors++;
}
if(data111.length < 2){
const err249 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates/" + i12,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err249];
}
else {
vErrors.push(err249);
}
errors++;
}
const len13 = data111.length;
for(let i13=0; i13<len13; i13++){
let data112 = data111[i13];
if(!((typeof data112 == "number") && (isFinite(data112)))){
const err250 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates/" + i12+"/" + i13,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err250];
}
else {
vErrors.push(err250);
}
errors++;
}
}
}
else {
const err251 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates/" + i12,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err251];
}
else {
vErrors.push(err251);
}
errors++;
}
}
}
else {
const err252 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err252];
}
else {
vErrors.push(err252);
}
errors++;
}
}
}
else {
const err253 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err253];
}
else {
vErrors.push(err253);
}
errors++;
}
var _valid6 = _errs238 === errors;
valid57 = valid57 || _valid6;
const _errs270 = errors;
if(data102 !== null){
const err254 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err254];
}
else {
vErrors.push(err254);
}
errors++;
}
var _valid6 = _errs270 === errors;
valid57 = valid57 || _valid6;
if(!valid57){
const err255 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err255];
}
else {
vErrors.push(err255);
}
errors++;
}
else {
errors = _errs237;
if(vErrors !== null){
if(_errs237){
vErrors.length = _errs237;
}
else {
vErrors = null;
}
}
}
}
if(data82.notes !== undefined){
let data113 = data82.notes;
if((typeof data113 !== "string") && (data113 !== null)){
const err256 = {instancePath:instancePath+"/components/" + i10+"/notes",schemaPath:"#/properties/components/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.components.items.properties.notes.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err256];
}
else {
vErrors.push(err256);
}
errors++;
}
}
if(data82.linked_component_id !== undefined){
let data114 = data82.linked_component_id;
if((typeof data114 !== "string") && (data114 !== null)){
const err257 = {instancePath:instancePath+"/components/" + i10+"/linked_component_id",schemaPath:"#/properties/components/items/properties/linked_component_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.linked_component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err257];
}
else {
vErrors.push(err257);
}
errors++;
}
if(typeof data114 === "string"){
if(!(formats0.test(data114))){
const err258 = {instancePath:instancePath+"/components/" + i10+"/linked_component_id",schemaPath:"#/properties/components/items/properties/linked_component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err258];
}
else {
vErrors.push(err258);
}
errors++;
}
}
}
if(data82.custom_fields !== undefined){
let data115 = data82.custom_fields;
if(data115 && typeof data115 == "object" && !Array.isArray(data115)){
}
else {
const err259 = {instancePath:instancePath+"/components/" + i10+"/custom_fields",schemaPath:"#/properties/components/items/properties/custom_fields/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err259];
}
else {
vErrors.push(err259);
}
errors++;
}
}
}
else {
const err260 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err260];
}
else {
vErrors.push(err260);
}
errors++;
}
}
}
else {
const err261 = {instancePath:instancePath+"/components",schemaPath:"#/properties/components/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err261];
}
else {
vErrors.push(err261);
}
errors++;
}
}
if(data.events !== undefined){
let data116 = data.events;
if(Array.isArray(data116)){
const len14 = data116.length;
for(let i14=0; i14<len14; i14++){
let data117 = data116[i14];
const _errs283 = errors;
let valid75 = false;
const _errs284 = errors;
if(data117 && typeof data117 == "object" && !Array.isArray(data117)){
if(data117.system_id === undefined){
const err262 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/anyOf/0/required",keyword:"required",params:{missingProperty: "system_id"},message:"must have required property '"+"system_id"+"'"};
if(vErrors === null){
vErrors = [err262];
}
else {
vErrors.push(err262);
}
errors++;
}
if(data117.system_id !== undefined){
let data118 = data117.system_id;
if(typeof data118 === "string"){
if(!(formats0.test(data118))){
const err263 = {instancePath:instancePath+"/events/" + i14+"/system_id",schemaPath:"#/properties/events/items/anyOf/0/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err263];
}
else {
vErrors.push(err263);
}
errors++;
}
}
else {
const err264 = {instancePath:instancePath+"/events/" + i14+"/system_id",schemaPath:"#/properties/events/items/anyOf/0/properties/system_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err264];
}
else {
vErrors.push(err264);
}
errors++;
}
}
}
var _valid10 = _errs284 === errors;
valid75 = valid75 || _valid10;
if(_valid10){
var props10 = {};
props10.system_id = true;
}
const _errs287 = errors;
if(data117 && typeof data117 == "object" && !Array.isArray(data117)){
if(data117.component_id === undefined){
const err265 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/anyOf/1/required",keyword:"required",params:{missingProperty: "component_id"},message:"must have required property '"+"component_id"+"'"};
if(vErrors === null){
vErrors = [err265];
}
else {
vErrors.push(err265);
}
errors++;
}
if(data117.component_id !== undefined){
let data119 = data117.component_id;
if(typeof data119 === "string"){
if(!(formats0.test(data119))){
const err266 = {instancePath:instancePath+"/events/" + i14+"/component_id",schemaPath:"#/properties/events/items/anyOf/1/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err266];
}
else {
vErrors.push(err266);
}
errors++;
}
}
else {
const err267 = {instancePath:instancePath+"/events/" + i14+"/component_id",schemaPath:"#/properties/events/items/anyOf/1/properties/component_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err267];
}
else {
vErrors.push(err267);
}
errors++;
}
}
}
var _valid10 = _errs287 === errors;
valid75 = valid75 || _valid10;
if(_valid10){
if(props10 !== true){
props10 = props10 || {};
props10.component_id = true;
}
}
if(!valid75){
const err268 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err268];
}
else {
vErrors.push(err268);
}
errors++;
}
else {
errors = _errs283;
if(vErrors !== null){
if(_errs283){
vErrors.length = _errs283;
}
else {
vErrors = null;
}
}
}
if(data117 && typeof data117 == "object" && !Array.isArray(data117)){
if(data117.id === undefined){
const err269 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err269];
}
else {
vErrors.push(err269);
}
errors++;
}
if(data117.home_id === undefined){
const err270 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err270];
}
else {
vErrors.push(err270);
}
errors++;
}
if(data117.event_type === undefined){
const err271 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "event_type"},message:"must have required property '"+"event_type"+"'"};
if(vErrors === null){
vErrors = [err271];
}
else {
vErrors.push(err271);
}
errors++;
}
if(data117.occurred_at === undefined){
const err272 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "occurred_at"},message:"must have required property '"+"occurred_at"+"'"};
if(vErrors === null){
vErrors = [err272];
}
else {
vErrors.push(err272);
}
errors++;
}
if(data117.attachment_ids === undefined){
const err273 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "attachment_ids"},message:"must have required property '"+"attachment_ids"+"'"};
if(vErrors === null){
vErrors = [err273];
}
else {
vErrors.push(err273);
}
errors++;
}
for(const key12 in data117){
if(!(func1.call(schema31.properties.events.items.properties, key12))){
const err274 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err274];
}
else {
vErrors.push(err274);
}
errors++;
}
}
if(data117.id !== undefined){
let data120 = data117.id;
if(typeof data120 === "string"){
if(!(formats0.test(data120))){
const err275 = {instancePath:instancePath+"/events/" + i14+"/id",schemaPath:"#/properties/events/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err275];
}
else {
vErrors.push(err275);
}
errors++;
}
}
else {
const err276 = {instancePath:instancePath+"/events/" + i14+"/id",schemaPath:"#/properties/events/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err276];
}
else {
vErrors.push(err276);
}
errors++;
}
}
if(data117.home_id !== undefined){
let data121 = data117.home_id;
if(typeof data121 === "string"){
if(!(formats0.test(data121))){
const err277 = {instancePath:instancePath+"/events/" + i14+"/home_id",schemaPath:"#/properties/events/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err277];
}
else {
vErrors.push(err277);
}
errors++;
}
}
else {
const err278 = {instancePath:instancePath+"/events/" + i14+"/home_id",schemaPath:"#/properties/events/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err278];
}
else {
vErrors.push(err278);
}
errors++;
}
}
if(data117.system_id !== undefined){
let data122 = data117.system_id;
if((typeof data122 !== "string") && (data122 !== null)){
const err279 = {instancePath:instancePath+"/events/" + i14+"/system_id",schemaPath:"#/properties/events/items/properties/system_id/type",keyword:"type",params:{type: schema31.properties.events.items.properties.system_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err279];
}
else {
vErrors.push(err279);
}
errors++;
}
if(typeof data122 === "string"){
if(!(formats0.test(data122))){
const err280 = {instancePath:instancePath+"/events/" + i14+"/system_id",schemaPath:"#/properties/events/items/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err280];
}
else {
vErrors.push(err280);
}
errors++;
}
}
}
if(data117.component_id !== undefined){
let data123 = data117.component_id;
if((typeof data123 !== "string") && (data123 !== null)){
const err281 = {instancePath:instancePath+"/events/" + i14+"/component_id",schemaPath:"#/properties/events/items/properties/component_id/type",keyword:"type",params:{type: schema31.properties.events.items.properties.component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err281];
}
else {
vErrors.push(err281);
}
errors++;
}
if(typeof data123 === "string"){
if(!(formats0.test(data123))){
const err282 = {instancePath:instancePath+"/events/" + i14+"/component_id",schemaPath:"#/properties/events/items/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err282];
}
else {
vErrors.push(err282);
}
errors++;
}
}
}
if(data117.event_type !== undefined){
let data124 = data117.event_type;
if(typeof data124 !== "string"){
const err283 = {instancePath:instancePath+"/events/" + i14+"/event_type",schemaPath:"#/properties/events/items/properties/event_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err283];
}
else {
vErrors.push(err283);
}
errors++;
}
if(!((((((data124 === "inspection") || (data124 === "service")) || (data124 === "repair")) || (data124 === "replacement")) || (data124 === "reading")) || (data124 === "note"))){
const err284 = {instancePath:instancePath+"/events/" + i14+"/event_type",schemaPath:"#/properties/events/items/properties/event_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.events.items.properties.event_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err284];
}
else {
vErrors.push(err284);
}
errors++;
}
}
if(data117.occurred_at !== undefined){
let data125 = data117.occurred_at;
if(typeof data125 === "string"){
if(!(formats4.validate(data125))){
const err285 = {instancePath:instancePath+"/events/" + i14+"/occurred_at",schemaPath:"#/properties/events/items/properties/occurred_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err285];
}
else {
vErrors.push(err285);
}
errors++;
}
}
else {
const err286 = {instancePath:instancePath+"/events/" + i14+"/occurred_at",schemaPath:"#/properties/events/items/properties/occurred_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err286];
}
else {
vErrors.push(err286);
}
errors++;
}
}
if(data117.performed_by !== undefined){
let data126 = data117.performed_by;
if((typeof data126 !== "string") && (data126 !== null)){
const err287 = {instancePath:instancePath+"/events/" + i14+"/performed_by",schemaPath:"#/properties/events/items/properties/performed_by/type",keyword:"type",params:{type: schema31.properties.events.items.properties.performed_by.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err287];
}
else {
vErrors.push(err287);
}
errors++;
}
}
if(data117.cost_cents !== undefined){
let data127 = data117.cost_cents;
if((!(((typeof data127 == "number") && (!(data127 % 1) && !isNaN(data127))) && (isFinite(data127)))) && (data127 !== null)){
const err288 = {instancePath:instancePath+"/events/" + i14+"/cost_cents",schemaPath:"#/properties/events/items/properties/cost_cents/type",keyword:"type",params:{type: schema31.properties.events.items.properties.cost_cents.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err288];
}
else {
vErrors.push(err288);
}
errors++;
}
}
if(data117.notes !== undefined){
let data128 = data117.notes;
if((typeof data128 !== "string") && (data128 !== null)){
const err289 = {instancePath:instancePath+"/events/" + i14+"/notes",schemaPath:"#/properties/events/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.events.items.properties.notes.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err289];
}
else {
vErrors.push(err289);
}
errors++;
}
}
if(data117.title !== undefined){
let data129 = data117.title;
if((typeof data129 !== "string") && (data129 !== null)){
const err290 = {instancePath:instancePath+"/events/" + i14+"/title",schemaPath:"#/properties/events/items/properties/title/type",keyword:"type",params:{type: schema31.properties.events.items.properties.title.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err290];
}
else {
vErrors.push(err290);
}
errors++;
}
if(typeof data129 === "string"){
if(func6(data129) > 200){
const err291 = {instancePath:instancePath+"/events/" + i14+"/title",schemaPath:"#/properties/events/items/properties/title/maxLength",keyword:"maxLength",params:{limit: 200},message:"must NOT have more than 200 characters"};
if(vErrors === null){
vErrors = [err291];
}
else {
vErrors.push(err291);
}
errors++;
}
}
}
if(data117.condition_after !== undefined){
let data130 = data117.condition_after;
const _errs312 = errors;
let valid79 = false;
const _errs313 = errors;
if(typeof data130 !== "string"){
const err292 = {instancePath:instancePath+"/events/" + i14+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err292];
}
else {
vErrors.push(err292);
}
errors++;
}
if(!(((((data130 === "good") || (data130 === "fair")) || (data130 === "needs_attention")) || (data130 === "needs_replacement")) || (data130 === "unknown"))){
const err293 = {instancePath:instancePath+"/events/" + i14+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/0/enum",keyword:"enum",params:{allowedValues: schema31.properties.events.items.properties.condition_after.anyOf[0].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err293];
}
else {
vErrors.push(err293);
}
errors++;
}
var _valid11 = _errs313 === errors;
valid79 = valid79 || _valid11;
const _errs315 = errors;
if(data130 !== null){
const err294 = {instancePath:instancePath+"/events/" + i14+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err294];
}
else {
vErrors.push(err294);
}
errors++;
}
var _valid11 = _errs315 === errors;
valid79 = valid79 || _valid11;
if(!valid79){
const err295 = {instancePath:instancePath+"/events/" + i14+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err295];
}
else {
vErrors.push(err295);
}
errors++;
}
else {
errors = _errs312;
if(vErrors !== null){
if(_errs312){
vErrors.length = _errs312;
}
else {
vErrors = null;
}
}
}
}
if(data117.reading_value !== undefined){
let data131 = data117.reading_value;
if((!((typeof data131 == "number") && (isFinite(data131)))) && (data131 !== null)){
const err296 = {instancePath:instancePath+"/events/" + i14+"/reading_value",schemaPath:"#/properties/events/items/properties/reading_value/type",keyword:"type",params:{type: schema31.properties.events.items.properties.reading_value.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err296];
}
else {
vErrors.push(err296);
}
errors++;
}
}
if(data117.reading_unit !== undefined){
let data132 = data117.reading_unit;
if((typeof data132 !== "string") && (data132 !== null)){
const err297 = {instancePath:instancePath+"/events/" + i14+"/reading_unit",schemaPath:"#/properties/events/items/properties/reading_unit/type",keyword:"type",params:{type: schema31.properties.events.items.properties.reading_unit.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err297];
}
else {
vErrors.push(err297);
}
errors++;
}
}
if(data117.attachment_ids !== undefined){
let data133 = data117.attachment_ids;
if(Array.isArray(data133)){
const len15 = data133.length;
for(let i15=0; i15<len15; i15++){
let data134 = data133[i15];
if(typeof data134 === "string"){
if(!(formats0.test(data134))){
const err298 = {instancePath:instancePath+"/events/" + i14+"/attachment_ids/" + i15,schemaPath:"#/properties/events/items/properties/attachment_ids/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err298];
}
else {
vErrors.push(err298);
}
errors++;
}
}
else {
const err299 = {instancePath:instancePath+"/events/" + i14+"/attachment_ids/" + i15,schemaPath:"#/properties/events/items/properties/attachment_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err299];
}
else {
vErrors.push(err299);
}
errors++;
}
}
}
else {
const err300 = {instancePath:instancePath+"/events/" + i14+"/attachment_ids",schemaPath:"#/properties/events/items/properties/attachment_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err300];
}
else {
vErrors.push(err300);
}
errors++;
}
}
}
else {
const err301 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err301];
}
else {
vErrors.push(err301);
}
errors++;
}
}
}
else {
const err302 = {instancePath:instancePath+"/events",schemaPath:"#/properties/events/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err302];
}
else {
vErrors.push(err302);
}
errors++;
}
}
if(data.attachments !== undefined){
let data135 = data.attachments;
if(Array.isArray(data135)){
const len16 = data135.length;
for(let i16=0; i16<len16; i16++){
let data136 = data135[i16];
if(data136 && typeof data136 == "object" && !Array.isArray(data136)){
if(data136.id === undefined){
const err303 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err303];
}
else {
vErrors.push(err303);
}
errors++;
}
if(data136.home_id === undefined){
const err304 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err304];
}
else {
vErrors.push(err304);
}
errors++;
}
if(data136.kind === undefined){
const err305 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err305];
}
else {
vErrors.push(err305);
}
errors++;
}
if(data136.storage_path === undefined){
const err306 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "storage_path"},message:"must have required property '"+"storage_path"+"'"};
if(vErrors === null){
vErrors = [err306];
}
else {
vErrors.push(err306);
}
errors++;
}
if(data136.mime_type === undefined){
const err307 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "mime_type"},message:"must have required property '"+"mime_type"+"'"};
if(vErrors === null){
vErrors = [err307];
}
else {
vErrors.push(err307);
}
errors++;
}
if(data136.file_size_bytes === undefined){
const err308 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "file_size_bytes"},message:"must have required property '"+"file_size_bytes"+"'"};
if(vErrors === null){
vErrors = [err308];
}
else {
vErrors.push(err308);
}
errors++;
}
for(const key13 in data136){
if(!(func1.call(schema31.properties.attachments.items.properties, key13))){
const err309 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err309];
}
else {
vErrors.push(err309);
}
errors++;
}
}
if(data136.id !== undefined){
let data137 = data136.id;
if(typeof data137 === "string"){
if(!(formats0.test(data137))){
const err310 = {instancePath:instancePath+"/attachments/" + i16+"/id",schemaPath:"#/properties/attachments/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err310];
}
else {
vErrors.push(err310);
}
errors++;
}
}
else {
const err311 = {instancePath:instancePath+"/attachments/" + i16+"/id",schemaPath:"#/properties/attachments/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err311];
}
else {
vErrors.push(err311);
}
errors++;
}
}
if(data136.home_id !== undefined){
let data138 = data136.home_id;
if(typeof data138 === "string"){
if(!(formats0.test(data138))){
const err312 = {instancePath:instancePath+"/attachments/" + i16+"/home_id",schemaPath:"#/properties/attachments/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err312];
}
else {
vErrors.push(err312);
}
errors++;
}
}
else {
const err313 = {instancePath:instancePath+"/attachments/" + i16+"/home_id",schemaPath:"#/properties/attachments/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err313];
}
else {
vErrors.push(err313);
}
errors++;
}
}
if(data136.kind !== undefined){
let data139 = data136.kind;
if(typeof data139 !== "string"){
const err314 = {instancePath:instancePath+"/attachments/" + i16+"/kind",schemaPath:"#/properties/attachments/items/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err314];
}
else {
vErrors.push(err314);
}
errors++;
}
if(!(((((((data139 === "photo") || (data139 === "receipt")) || (data139 === "manual_pdf")) || (data139 === "usdz_mesh")) || (data139 === "floor_plan_source")) || (data139 === "roomplan_structure")) || (data139 === "gltf_mesh"))){
const err315 = {instancePath:instancePath+"/attachments/" + i16+"/kind",schemaPath:"#/properties/attachments/items/properties/kind/enum",keyword:"enum",params:{allowedValues: schema31.properties.attachments.items.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err315];
}
else {
vErrors.push(err315);
}
errors++;
}
}
if(data136.storage_path !== undefined){
let data140 = data136.storage_path;
if(typeof data140 === "string"){
if(!pattern6.test(data140)){
const err316 = {instancePath:instancePath+"/attachments/" + i16+"/storage_path",schemaPath:"#/properties/attachments/items/properties/storage_path/pattern",keyword:"pattern",params:{pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$"},message:"must match pattern \""+"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err316];
}
else {
vErrors.push(err316);
}
errors++;
}
}
else {
const err317 = {instancePath:instancePath+"/attachments/" + i16+"/storage_path",schemaPath:"#/properties/attachments/items/properties/storage_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err317];
}
else {
vErrors.push(err317);
}
errors++;
}
}
if(data136.mime_type !== undefined){
if(typeof data136.mime_type !== "string"){
const err318 = {instancePath:instancePath+"/attachments/" + i16+"/mime_type",schemaPath:"#/properties/attachments/items/properties/mime_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err318];
}
else {
vErrors.push(err318);
}
errors++;
}
}
if(data136.file_size_bytes !== undefined){
let data142 = data136.file_size_bytes;
if(!(((typeof data142 == "number") && (!(data142 % 1) && !isNaN(data142))) && (isFinite(data142)))){
const err319 = {instancePath:instancePath+"/attachments/" + i16+"/file_size_bytes",schemaPath:"#/properties/attachments/items/properties/file_size_bytes/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err319];
}
else {
vErrors.push(err319);
}
errors++;
}
}
if(data136.captured_at !== undefined){
let data143 = data136.captured_at;
if((typeof data143 !== "string") && (data143 !== null)){
const err320 = {instancePath:instancePath+"/attachments/" + i16+"/captured_at",schemaPath:"#/properties/attachments/items/properties/captured_at/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.captured_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err320];
}
else {
vErrors.push(err320);
}
errors++;
}
if(typeof data143 === "string"){
if(!(formats4.validate(data143))){
const err321 = {instancePath:instancePath+"/attachments/" + i16+"/captured_at",schemaPath:"#/properties/attachments/items/properties/captured_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err321];
}
else {
vErrors.push(err321);
}
errors++;
}
}
}
if(data136.linked_event_id !== undefined){
let data144 = data136.linked_event_id;
if((typeof data144 !== "string") && (data144 !== null)){
const err322 = {instancePath:instancePath+"/attachments/" + i16+"/linked_event_id",schemaPath:"#/properties/attachments/items/properties/linked_event_id/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.linked_event_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err322];
}
else {
vErrors.push(err322);
}
errors++;
}
if(typeof data144 === "string"){
if(!(formats0.test(data144))){
const err323 = {instancePath:instancePath+"/attachments/" + i16+"/linked_event_id",schemaPath:"#/properties/attachments/items/properties/linked_event_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err323];
}
else {
vErrors.push(err323);
}
errors++;
}
}
}
if(data136.linked_component_id !== undefined){
let data145 = data136.linked_component_id;
if((typeof data145 !== "string") && (data145 !== null)){
const err324 = {instancePath:instancePath+"/attachments/" + i16+"/linked_component_id",schemaPath:"#/properties/attachments/items/properties/linked_component_id/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.linked_component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err324];
}
else {
vErrors.push(err324);
}
errors++;
}
if(typeof data145 === "string"){
if(!(formats0.test(data145))){
const err325 = {instancePath:instancePath+"/attachments/" + i16+"/linked_component_id",schemaPath:"#/properties/attachments/items/properties/linked_component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err325];
}
else {
vErrors.push(err325);
}
errors++;
}
}
}
}
else {
const err326 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err326];
}
else {
vErrors.push(err326);
}
errors++;
}
}
}
else {
const err327 = {instancePath:instancePath+"/attachments",schemaPath:"#/properties/attachments/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err327];
}
else {
vErrors.push(err327);
}
errors++;
}
}
if(data.smart_home_readings !== undefined){
let data146 = data.smart_home_readings;
if(Array.isArray(data146)){
const len17 = data146.length;
for(let i17=0; i17<len17; i17++){
let data147 = data146[i17];
if(data147 && typeof data147 == "object" && !Array.isArray(data147)){
if(data147.id === undefined){
const err328 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err328];
}
else {
vErrors.push(err328);
}
errors++;
}
if(data147.component_id === undefined){
const err329 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "component_id"},message:"must have required property '"+"component_id"+"'"};
if(vErrors === null){
vErrors = [err329];
}
else {
vErrors.push(err329);
}
errors++;
}
if(data147.source === undefined){
const err330 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err330];
}
else {
vErrors.push(err330);
}
errors++;
}
if(data147.metric === undefined){
const err331 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "metric"},message:"must have required property '"+"metric"+"'"};
if(vErrors === null){
vErrors = [err331];
}
else {
vErrors.push(err331);
}
errors++;
}
if(data147.value === undefined){
const err332 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err332];
}
else {
vErrors.push(err332);
}
errors++;
}
if(data147.unit === undefined){
const err333 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err333];
}
else {
vErrors.push(err333);
}
errors++;
}
if(data147.recorded_at === undefined){
const err334 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "recorded_at"},message:"must have required property '"+"recorded_at"+"'"};
if(vErrors === null){
vErrors = [err334];
}
else {
vErrors.push(err334);
}
errors++;
}
for(const key14 in data147){
if(!(((((((key14 === "id") || (key14 === "component_id")) || (key14 === "source")) || (key14 === "metric")) || (key14 === "value")) || (key14 === "unit")) || (key14 === "recorded_at"))){
const err335 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key14},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err335];
}
else {
vErrors.push(err335);
}
errors++;
}
}
if(data147.id !== undefined){
let data148 = data147.id;
if(typeof data148 === "string"){
if(!(formats0.test(data148))){
const err336 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/id",schemaPath:"#/properties/smart_home_readings/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err336];
}
else {
vErrors.push(err336);
}
errors++;
}
}
else {
const err337 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/id",schemaPath:"#/properties/smart_home_readings/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err337];
}
else {
vErrors.push(err337);
}
errors++;
}
}
if(data147.component_id !== undefined){
let data149 = data147.component_id;
if(typeof data149 === "string"){
if(!(formats0.test(data149))){
const err338 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/component_id",schemaPath:"#/properties/smart_home_readings/items/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err338];
}
else {
vErrors.push(err338);
}
errors++;
}
}
else {
const err339 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/component_id",schemaPath:"#/properties/smart_home_readings/items/properties/component_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err339];
}
else {
vErrors.push(err339);
}
errors++;
}
}
if(data147.source !== undefined){
let data150 = data147.source;
if(typeof data150 !== "string"){
const err340 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/source",schemaPath:"#/properties/smart_home_readings/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err340];
}
else {
vErrors.push(err340);
}
errors++;
}
if(!((((data150 === "homekit") || (data150 === "ecobee")) || (data150 === "nest")) || (data150 === "other"))){
const err341 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/source",schemaPath:"#/properties/smart_home_readings/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.smart_home_readings.items.properties.source.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err341];
}
else {
vErrors.push(err341);
}
errors++;
}
}
if(data147.metric !== undefined){
if(typeof data147.metric !== "string"){
const err342 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/metric",schemaPath:"#/properties/smart_home_readings/items/properties/metric/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err342];
}
else {
vErrors.push(err342);
}
errors++;
}
}
if(data147.value !== undefined){
let data152 = data147.value;
if(!((typeof data152 == "number") && (isFinite(data152)))){
const err343 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/value",schemaPath:"#/properties/smart_home_readings/items/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err343];
}
else {
vErrors.push(err343);
}
errors++;
}
}
if(data147.unit !== undefined){
if(typeof data147.unit !== "string"){
const err344 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/unit",schemaPath:"#/properties/smart_home_readings/items/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err344];
}
else {
vErrors.push(err344);
}
errors++;
}
}
if(data147.recorded_at !== undefined){
let data154 = data147.recorded_at;
if(typeof data154 === "string"){
if(!(formats4.validate(data154))){
const err345 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/recorded_at",schemaPath:"#/properties/smart_home_readings/items/properties/recorded_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err345];
}
else {
vErrors.push(err345);
}
errors++;
}
}
else {
const err346 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/recorded_at",schemaPath:"#/properties/smart_home_readings/items/properties/recorded_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err346];
}
else {
vErrors.push(err346);
}
errors++;
}
}
}
else {
const err347 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err347];
}
else {
vErrors.push(err347);
}
errors++;
}
}
}
else {
const err348 = {instancePath:instancePath+"/smart_home_readings",schemaPath:"#/properties/smart_home_readings/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err348];
}
else {
vErrors.push(err348);
}
errors++;
}
}
if(data.utility_bills !== undefined){
let data155 = data.utility_bills;
if(Array.isArray(data155)){
const len18 = data155.length;
for(let i18=0; i18<len18; i18++){
let data156 = data155[i18];
if(data156 && typeof data156 == "object" && !Array.isArray(data156)){
if(data156.id === undefined){
const err349 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err349];
}
else {
vErrors.push(err349);
}
errors++;
}
if(data156.home_id === undefined){
const err350 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err350];
}
else {
vErrors.push(err350);
}
errors++;
}
if(data156.utility_type === undefined){
const err351 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "utility_type"},message:"must have required property '"+"utility_type"+"'"};
if(vErrors === null){
vErrors = [err351];
}
else {
vErrors.push(err351);
}
errors++;
}
if(data156.billing_period_start === undefined){
const err352 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "billing_period_start"},message:"must have required property '"+"billing_period_start"+"'"};
if(vErrors === null){
vErrors = [err352];
}
else {
vErrors.push(err352);
}
errors++;
}
if(data156.billing_period_end === undefined){
const err353 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "billing_period_end"},message:"must have required property '"+"billing_period_end"+"'"};
if(vErrors === null){
vErrors = [err353];
}
else {
vErrors.push(err353);
}
errors++;
}
if(data156.usage_amount === undefined){
const err354 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "usage_amount"},message:"must have required property '"+"usage_amount"+"'"};
if(vErrors === null){
vErrors = [err354];
}
else {
vErrors.push(err354);
}
errors++;
}
if(data156.usage_unit === undefined){
const err355 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "usage_unit"},message:"must have required property '"+"usage_unit"+"'"};
if(vErrors === null){
vErrors = [err355];
}
else {
vErrors.push(err355);
}
errors++;
}
if(data156.source === undefined){
const err356 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err356];
}
else {
vErrors.push(err356);
}
errors++;
}
for(const key15 in data156){
if(!(func1.call(schema31.properties.utility_bills.items.properties, key15))){
const err357 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key15},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err357];
}
else {
vErrors.push(err357);
}
errors++;
}
}
if(data156.id !== undefined){
let data157 = data156.id;
if(typeof data157 === "string"){
if(!(formats0.test(data157))){
const err358 = {instancePath:instancePath+"/utility_bills/" + i18+"/id",schemaPath:"#/properties/utility_bills/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err358];
}
else {
vErrors.push(err358);
}
errors++;
}
}
else {
const err359 = {instancePath:instancePath+"/utility_bills/" + i18+"/id",schemaPath:"#/properties/utility_bills/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err359];
}
else {
vErrors.push(err359);
}
errors++;
}
}
if(data156.home_id !== undefined){
let data158 = data156.home_id;
if(typeof data158 === "string"){
if(!(formats0.test(data158))){
const err360 = {instancePath:instancePath+"/utility_bills/" + i18+"/home_id",schemaPath:"#/properties/utility_bills/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err360];
}
else {
vErrors.push(err360);
}
errors++;
}
}
else {
const err361 = {instancePath:instancePath+"/utility_bills/" + i18+"/home_id",schemaPath:"#/properties/utility_bills/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err361];
}
else {
vErrors.push(err361);
}
errors++;
}
}
if(data156.utility_type !== undefined){
let data159 = data156.utility_type;
if(typeof data159 !== "string"){
const err362 = {instancePath:instancePath+"/utility_bills/" + i18+"/utility_type",schemaPath:"#/properties/utility_bills/items/properties/utility_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err362];
}
else {
vErrors.push(err362);
}
errors++;
}
if(!(((data159 === "gas") || (data159 === "electric")) || (data159 === "water"))){
const err363 = {instancePath:instancePath+"/utility_bills/" + i18+"/utility_type",schemaPath:"#/properties/utility_bills/items/properties/utility_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.utility_bills.items.properties.utility_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err363];
}
else {
vErrors.push(err363);
}
errors++;
}
}
if(data156.billing_period_start !== undefined){
let data160 = data156.billing_period_start;
if(typeof data160 === "string"){
if(!(formats38.validate(data160))){
const err364 = {instancePath:instancePath+"/utility_bills/" + i18+"/billing_period_start",schemaPath:"#/properties/utility_bills/items/properties/billing_period_start/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err364];
}
else {
vErrors.push(err364);
}
errors++;
}
}
else {
const err365 = {instancePath:instancePath+"/utility_bills/" + i18+"/billing_period_start",schemaPath:"#/properties/utility_bills/items/properties/billing_period_start/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err365];
}
else {
vErrors.push(err365);
}
errors++;
}
}
if(data156.billing_period_end !== undefined){
let data161 = data156.billing_period_end;
if(typeof data161 === "string"){
if(!(formats38.validate(data161))){
const err366 = {instancePath:instancePath+"/utility_bills/" + i18+"/billing_period_end",schemaPath:"#/properties/utility_bills/items/properties/billing_period_end/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err366];
}
else {
vErrors.push(err366);
}
errors++;
}
}
else {
const err367 = {instancePath:instancePath+"/utility_bills/" + i18+"/billing_period_end",schemaPath:"#/properties/utility_bills/items/properties/billing_period_end/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err367];
}
else {
vErrors.push(err367);
}
errors++;
}
}
if(data156.usage_amount !== undefined){
let data162 = data156.usage_amount;
if(!((typeof data162 == "number") && (isFinite(data162)))){
const err368 = {instancePath:instancePath+"/utility_bills/" + i18+"/usage_amount",schemaPath:"#/properties/utility_bills/items/properties/usage_amount/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err368];
}
else {
vErrors.push(err368);
}
errors++;
}
}
if(data156.usage_unit !== undefined){
if(typeof data156.usage_unit !== "string"){
const err369 = {instancePath:instancePath+"/utility_bills/" + i18+"/usage_unit",schemaPath:"#/properties/utility_bills/items/properties/usage_unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err369];
}
else {
vErrors.push(err369);
}
errors++;
}
}
if(data156.cost_cents !== undefined){
let data164 = data156.cost_cents;
if((!(((typeof data164 == "number") && (!(data164 % 1) && !isNaN(data164))) && (isFinite(data164)))) && (data164 !== null)){
const err370 = {instancePath:instancePath+"/utility_bills/" + i18+"/cost_cents",schemaPath:"#/properties/utility_bills/items/properties/cost_cents/type",keyword:"type",params:{type: schema31.properties.utility_bills.items.properties.cost_cents.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err370];
}
else {
vErrors.push(err370);
}
errors++;
}
}
if(data156.source !== undefined){
let data165 = data156.source;
if(typeof data165 !== "string"){
const err371 = {instancePath:instancePath+"/utility_bills/" + i18+"/source",schemaPath:"#/properties/utility_bills/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err371];
}
else {
vErrors.push(err371);
}
errors++;
}
if(!((data165 === "manual") || (data165 === "import"))){
const err372 = {instancePath:instancePath+"/utility_bills/" + i18+"/source",schemaPath:"#/properties/utility_bills/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.utility_bills.items.properties.source.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err372];
}
else {
vErrors.push(err372);
}
errors++;
}
}
if(data156.attachment_id !== undefined){
let data166 = data156.attachment_id;
if((typeof data166 !== "string") && (data166 !== null)){
const err373 = {instancePath:instancePath+"/utility_bills/" + i18+"/attachment_id",schemaPath:"#/properties/utility_bills/items/properties/attachment_id/type",keyword:"type",params:{type: schema31.properties.utility_bills.items.properties.attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err373];
}
else {
vErrors.push(err373);
}
errors++;
}
if(typeof data166 === "string"){
if(!(formats0.test(data166))){
const err374 = {instancePath:instancePath+"/utility_bills/" + i18+"/attachment_id",schemaPath:"#/properties/utility_bills/items/properties/attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err374];
}
else {
vErrors.push(err374);
}
errors++;
}
}
}
}
else {
const err375 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err375];
}
else {
vErrors.push(err375);
}
errors++;
}
}
}
else {
const err376 = {instancePath:instancePath+"/utility_bills",schemaPath:"#/properties/utility_bills/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err376];
}
else {
vErrors.push(err376);
}
errors++;
}
}
if(data.recall_alerts !== undefined){
let data167 = data.recall_alerts;
if(Array.isArray(data167)){
const len19 = data167.length;
for(let i19=0; i19<len19; i19++){
let data168 = data167[i19];
if(data168 && typeof data168 == "object" && !Array.isArray(data168)){
if(data168.id === undefined){
const err377 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err377];
}
else {
vErrors.push(err377);
}
errors++;
}
if(data168.home_id === undefined){
const err378 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err378];
}
else {
vErrors.push(err378);
}
errors++;
}
if(data168.component_id === undefined){
const err379 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "component_id"},message:"must have required property '"+"component_id"+"'"};
if(vErrors === null){
vErrors = [err379];
}
else {
vErrors.push(err379);
}
errors++;
}
if(data168.recall_number === undefined){
const err380 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "recall_number"},message:"must have required property '"+"recall_number"+"'"};
if(vErrors === null){
vErrors = [err380];
}
else {
vErrors.push(err380);
}
errors++;
}
if(data168.recall_id === undefined){
const err381 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "recall_id"},message:"must have required property '"+"recall_id"+"'"};
if(vErrors === null){
vErrors = [err381];
}
else {
vErrors.push(err381);
}
errors++;
}
if(data168.title === undefined){
const err382 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err382];
}
else {
vErrors.push(err382);
}
errors++;
}
if(data168.url === undefined){
const err383 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "url"},message:"must have required property '"+"url"+"'"};
if(vErrors === null){
vErrors = [err383];
}
else {
vErrors.push(err383);
}
errors++;
}
if(data168.recall_date === undefined){
const err384 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "recall_date"},message:"must have required property '"+"recall_date"+"'"};
if(vErrors === null){
vErrors = [err384];
}
else {
vErrors.push(err384);
}
errors++;
}
if(data168.matched_on === undefined){
const err385 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "matched_on"},message:"must have required property '"+"matched_on"+"'"};
if(vErrors === null){
vErrors = [err385];
}
else {
vErrors.push(err385);
}
errors++;
}
if(data168.confidence === undefined){
const err386 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err386];
}
else {
vErrors.push(err386);
}
errors++;
}
if(data168.status === undefined){
const err387 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err387];
}
else {
vErrors.push(err387);
}
errors++;
}
if(data168.detected_at === undefined){
const err388 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/required",keyword:"required",params:{missingProperty: "detected_at"},message:"must have required property '"+"detected_at"+"'"};
if(vErrors === null){
vErrors = [err388];
}
else {
vErrors.push(err388);
}
errors++;
}
for(const key16 in data168){
if(!(func1.call(schema31.properties.recall_alerts.items.properties, key16))){
const err389 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key16},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err389];
}
else {
vErrors.push(err389);
}
errors++;
}
}
if(data168.id !== undefined){
let data169 = data168.id;
if(typeof data169 === "string"){
if(!(formats0.test(data169))){
const err390 = {instancePath:instancePath+"/recall_alerts/" + i19+"/id",schemaPath:"#/properties/recall_alerts/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err390];
}
else {
vErrors.push(err390);
}
errors++;
}
}
else {
const err391 = {instancePath:instancePath+"/recall_alerts/" + i19+"/id",schemaPath:"#/properties/recall_alerts/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err391];
}
else {
vErrors.push(err391);
}
errors++;
}
}
if(data168.home_id !== undefined){
let data170 = data168.home_id;
if(typeof data170 === "string"){
if(!(formats0.test(data170))){
const err392 = {instancePath:instancePath+"/recall_alerts/" + i19+"/home_id",schemaPath:"#/properties/recall_alerts/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err392];
}
else {
vErrors.push(err392);
}
errors++;
}
}
else {
const err393 = {instancePath:instancePath+"/recall_alerts/" + i19+"/home_id",schemaPath:"#/properties/recall_alerts/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err393];
}
else {
vErrors.push(err393);
}
errors++;
}
}
if(data168.component_id !== undefined){
let data171 = data168.component_id;
if(typeof data171 === "string"){
if(!(formats0.test(data171))){
const err394 = {instancePath:instancePath+"/recall_alerts/" + i19+"/component_id",schemaPath:"#/properties/recall_alerts/items/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err394];
}
else {
vErrors.push(err394);
}
errors++;
}
}
else {
const err395 = {instancePath:instancePath+"/recall_alerts/" + i19+"/component_id",schemaPath:"#/properties/recall_alerts/items/properties/component_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err395];
}
else {
vErrors.push(err395);
}
errors++;
}
}
if(data168.recall_number !== undefined){
if(typeof data168.recall_number !== "string"){
const err396 = {instancePath:instancePath+"/recall_alerts/" + i19+"/recall_number",schemaPath:"#/properties/recall_alerts/items/properties/recall_number/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err396];
}
else {
vErrors.push(err396);
}
errors++;
}
}
if(data168.recall_id !== undefined){
let data173 = data168.recall_id;
if(!(((typeof data173 == "number") && (!(data173 % 1) && !isNaN(data173))) && (isFinite(data173)))){
const err397 = {instancePath:instancePath+"/recall_alerts/" + i19+"/recall_id",schemaPath:"#/properties/recall_alerts/items/properties/recall_id/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err397];
}
else {
vErrors.push(err397);
}
errors++;
}
}
if(data168.title !== undefined){
let data174 = data168.title;
if(typeof data174 === "string"){
if(func6(data174) > 500){
const err398 = {instancePath:instancePath+"/recall_alerts/" + i19+"/title",schemaPath:"#/properties/recall_alerts/items/properties/title/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err398];
}
else {
vErrors.push(err398);
}
errors++;
}
}
else {
const err399 = {instancePath:instancePath+"/recall_alerts/" + i19+"/title",schemaPath:"#/properties/recall_alerts/items/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err399];
}
else {
vErrors.push(err399);
}
errors++;
}
}
if(data168.hazard !== undefined){
let data175 = data168.hazard;
if((typeof data175 !== "string") && (data175 !== null)){
const err400 = {instancePath:instancePath+"/recall_alerts/" + i19+"/hazard",schemaPath:"#/properties/recall_alerts/items/properties/hazard/type",keyword:"type",params:{type: schema31.properties.recall_alerts.items.properties.hazard.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err400];
}
else {
vErrors.push(err400);
}
errors++;
}
}
if(data168.remedy !== undefined){
let data176 = data168.remedy;
if((typeof data176 !== "string") && (data176 !== null)){
const err401 = {instancePath:instancePath+"/recall_alerts/" + i19+"/remedy",schemaPath:"#/properties/recall_alerts/items/properties/remedy/type",keyword:"type",params:{type: schema31.properties.recall_alerts.items.properties.remedy.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err401];
}
else {
vErrors.push(err401);
}
errors++;
}
}
if(data168.url !== undefined){
let data177 = data168.url;
if(typeof data177 === "string"){
if(func6(data177) > 2048){
const err402 = {instancePath:instancePath+"/recall_alerts/" + i19+"/url",schemaPath:"#/properties/recall_alerts/items/properties/url/maxLength",keyword:"maxLength",params:{limit: 2048},message:"must NOT have more than 2048 characters"};
if(vErrors === null){
vErrors = [err402];
}
else {
vErrors.push(err402);
}
errors++;
}
if(!pattern7.test(data177)){
const err403 = {instancePath:instancePath+"/recall_alerts/" + i19+"/url",schemaPath:"#/properties/recall_alerts/items/properties/url/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err403];
}
else {
vErrors.push(err403);
}
errors++;
}
}
else {
const err404 = {instancePath:instancePath+"/recall_alerts/" + i19+"/url",schemaPath:"#/properties/recall_alerts/items/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err404];
}
else {
vErrors.push(err404);
}
errors++;
}
}
if(data168.recall_date !== undefined){
let data178 = data168.recall_date;
if(typeof data178 === "string"){
if(!(formats38.validate(data178))){
const err405 = {instancePath:instancePath+"/recall_alerts/" + i19+"/recall_date",schemaPath:"#/properties/recall_alerts/items/properties/recall_date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err405];
}
else {
vErrors.push(err405);
}
errors++;
}
}
else {
const err406 = {instancePath:instancePath+"/recall_alerts/" + i19+"/recall_date",schemaPath:"#/properties/recall_alerts/items/properties/recall_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err406];
}
else {
vErrors.push(err406);
}
errors++;
}
}
if(data168.matched_on !== undefined){
let data179 = data168.matched_on;
if(typeof data179 !== "string"){
const err407 = {instancePath:instancePath+"/recall_alerts/" + i19+"/matched_on",schemaPath:"#/properties/recall_alerts/items/properties/matched_on/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err407];
}
else {
vErrors.push(err407);
}
errors++;
}
if(!((data179 === "model") || (data179 === "manufacturer"))){
const err408 = {instancePath:instancePath+"/recall_alerts/" + i19+"/matched_on",schemaPath:"#/properties/recall_alerts/items/properties/matched_on/enum",keyword:"enum",params:{allowedValues: schema31.properties.recall_alerts.items.properties.matched_on.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err408];
}
else {
vErrors.push(err408);
}
errors++;
}
}
if(data168.confidence !== undefined){
let data180 = data168.confidence;
if(typeof data180 !== "string"){
const err409 = {instancePath:instancePath+"/recall_alerts/" + i19+"/confidence",schemaPath:"#/properties/recall_alerts/items/properties/confidence/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err409];
}
else {
vErrors.push(err409);
}
errors++;
}
if(!((data180 === "likely") || (data180 === "possible"))){
const err410 = {instancePath:instancePath+"/recall_alerts/" + i19+"/confidence",schemaPath:"#/properties/recall_alerts/items/properties/confidence/enum",keyword:"enum",params:{allowedValues: schema31.properties.recall_alerts.items.properties.confidence.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err410];
}
else {
vErrors.push(err410);
}
errors++;
}
}
if(data168.status !== undefined){
let data181 = data168.status;
if(typeof data181 !== "string"){
const err411 = {instancePath:instancePath+"/recall_alerts/" + i19+"/status",schemaPath:"#/properties/recall_alerts/items/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err411];
}
else {
vErrors.push(err411);
}
errors++;
}
if(!(((data181 === "open") || (data181 === "dismissed")) || (data181 === "resolved"))){
const err412 = {instancePath:instancePath+"/recall_alerts/" + i19+"/status",schemaPath:"#/properties/recall_alerts/items/properties/status/enum",keyword:"enum",params:{allowedValues: schema31.properties.recall_alerts.items.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err412];
}
else {
vErrors.push(err412);
}
errors++;
}
}
if(data168.detected_at !== undefined){
let data182 = data168.detected_at;
if(typeof data182 === "string"){
if(!(formats4.validate(data182))){
const err413 = {instancePath:instancePath+"/recall_alerts/" + i19+"/detected_at",schemaPath:"#/properties/recall_alerts/items/properties/detected_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err413];
}
else {
vErrors.push(err413);
}
errors++;
}
}
else {
const err414 = {instancePath:instancePath+"/recall_alerts/" + i19+"/detected_at",schemaPath:"#/properties/recall_alerts/items/properties/detected_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err414];
}
else {
vErrors.push(err414);
}
errors++;
}
}
}
else {
const err415 = {instancePath:instancePath+"/recall_alerts/" + i19,schemaPath:"#/properties/recall_alerts/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err415];
}
else {
vErrors.push(err415);
}
errors++;
}
}
}
else {
const err416 = {instancePath:instancePath+"/recall_alerts",schemaPath:"#/properties/recall_alerts/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err416];
}
else {
vErrors.push(err416);
}
errors++;
}
}
}
else {
const err417 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err417];
}
else {
vErrors.push(err417);
}
errors++;
}
validate20.errors = vErrors;
return errors === 0;
}
validate20.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};
