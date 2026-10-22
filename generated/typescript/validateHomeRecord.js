// Generated from spec/schema. Do not edit directly.
"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema31 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://homebody.app/schema/home-record.schema.json","title":"HomeRecord","description":"Root document for a Home Record export. Flat, database-table-mirroring shape - one home, plus arrays of every other entity, each keyed by an id and its parent foreign keys rather than deep nesting.","type":"object","additionalProperties":false,"required":["schema_version","home","levels","rooms","plan_elements","systems","components","events","attachments","smart_home_readings","utility_bills"],"properties":{"schema_version":{"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$","enum":["0.1.0","0.1.1","0.2.0","0.3.0","0.4.0","0.5.0"],"description":"Semver of the Home Record spec this document conforms to, e.g. 0.2.0. Downstream import validation rejects unknown versions rather than duck-typing."},"home":{"title":"Home","type":"object","additionalProperties":false,"required":["id","owner_user_id","name","address","created_at"],"properties":{"id":{"type":"string","format":"uuid"},"owner_user_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"address":{"type":"string"},"parcel_id":{"type":["string","null"]},"year_built":{"type":["integer","null"]},"sq_ft":{"type":["number","null"]},"beds":{"type":["integer","null"]},"baths":{"type":["number","null"]},"lot_size_m2":{"type":["number","null"]},"created_at":{"type":"string","format":"date-time"}}},"levels":{"type":"array","items":{"title":"Level","type":"object","additionalProperties":false,"required":["id","home_id","name","sort_order","elevation_offset_m","scale_confidence"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"sort_order":{"type":"integer"},"elevation_offset_m":{"type":"number"},"scale_confidence":{"type":"string","enum":["measured","estimated"]},"import_attachment_id":{"type":["string","null"],"format":"uuid"},"import_origin_m":{"type":["array","null"],"items":{"type":"number"},"minItems":2,"maxItems":2},"import_scale_m_per_px":{"type":["number","null"]},"import_pixel_width":{"type":["integer","null"]},"import_pixel_height":{"type":["integer","null"]},"scan_usdz_attachment_id":{"type":["string","null"],"format":"uuid","description":"Soft reference (not a foreign key) to the usdz_mesh Attachment of a RoomPlan scan; the level patch can sync before the attachment row."},"scan_structure_attachment_id":{"type":["string","null"],"format":"uuid","description":"Soft reference (not a foreign key) to the roomplan_structure Attachment holding the captured structure JSON."},"scan_glb_attachment_id":{"type":["string","null"],"format":"uuid","description":"Soft reference (not a foreign key) to the gltf_mesh Attachment used by Android and web 3D viewers."},"scan_origin_m":{"type":["array","null"],"items":{"type":"number"},"minItems":2,"maxItems":2,"description":"Translation in meters from scan XZ (after rotation) to plan space."},"scan_rotation_rad":{"type":["number","null"],"description":"Rotation in radians from scan XZ to plan space. planPoint = R(rotation) * (X, Z) + scan_origin_m."},"scan_review_state":{"type":["string","null"],"enum":["pending_review","reviewed",null]}}},"default":[]},"rooms":{"type":"array","items":{"title":"Room","type":"object","additionalProperties":false,"required":["id","level_id","name","room_type","geometry"],"properties":{"id":{"type":"string","format":"uuid"},"level_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"room_type":{"type":"string","enum":["bedroom","bathroom","kitchen","living_room","dining_room","garage","basement","attic","hallway","closet","laundry","office","other"]},"geometry":{"allOf":[{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},{"type":"object","properties":{"type":{"const":"polygon"}}}]},"area_computed_m2":{"type":["number","null"]},"source":{"type":["string","null"],"enum":["hand","trace","roomplan",null],"description":"Provenance of the row. Null means hand."}}},"default":[]},"plan_elements":{"type":"array","items":{"title":"PlanElement","type":"object","additionalProperties":false,"required":["id","level_id","kind","geometry"],"properties":{"id":{"type":"string","format":"uuid"},"level_id":{"type":"string","format":"uuid"},"kind":{"type":"string","enum":["wall","door","window","opening"]},"geometry":{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},"host_element_id":{"type":["string","null"],"format":"uuid"},"source":{"type":["string","null"],"enum":["hand","trace","roomplan",null],"description":"Provenance of the row. Null means hand."}}},"default":[]},"systems":{"type":"array","items":{"title":"System","type":"object","additionalProperties":false,"required":["id","home_id","category","name"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"category":{"type":"string","enum":["plumbing","electrical","hvac","roof_structure","appliances_and_water_heater","exterior_and_site","low_voltage_and_smart_home"]},"name":{"type":"string"},"notes":{"type":["string","null"]}}},"default":[]},"components":{"type":"array","items":{"title":"Component","type":"object","additionalProperties":false,"required":["id","system_id","name","component_type","condition","room_ids","custom_fields"],"properties":{"id":{"type":"string","format":"uuid"},"system_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"component_type":{"type":"string","enum":["plumbing_fixture","toilet","sink","bathtub_shower","main_water_shutoff","gas_shutoff","water_supply_line","drain_waste_vent","sewer_lateral","sump_pump","water_treatment","electrical_panel","subpanel","electric_meter","service_conductors","branch_circuit","outlet","gfci_receptacle","light_fixture","smoke_detector","co_detector","generator","solar_pv_system","hvac_furnace","hvac_ac_unit","hvac_heat_pump","hvac_mini_split","hvac_boiler","hvac_air_handler","hvac_ductwork","thermostat","hvac_filter","hvac_ventilation_fan","hvac_fireplace","roof_covering","flashing","skylight","chimney","roof_vent","gutter","downspout","soffit_fascia","attic_insulation","foundation","structural_member","water_heater","refrigerator","dishwasher","range_oven","microwave","range_hood","clothes_washer","clothes_dryer","garbage_disposal","appliance_generic","exterior_wall_covering","window","exterior_door","garage_door","garage_door_opener","deck_porch_patio","driveway_walkway","fence_wall","irrigation_system","septic_system","well_pump","pool_spa","camera","video_doorbell","network_router","network_access_point","smart_hub","smart_lock","alarm_panel","leak_sensor","structured_wiring_panel","low_voltage_cabling","other"]},"make":{"type":["string","null"]},"model":{"type":["string","null"]},"manual_url":{"type":["string","null"],"format":"uri"},"location_note":{"type":["string","null"]},"serial_number":{"type":["string","null"]},"install_date":{"type":["string","null"],"format":"date"},"warranty_start":{"type":["string","null"],"format":"date"},"warranty_length_months":{"type":["integer","null"]},"manual_attachment_id":{"type":["string","null"],"format":"uuid"},"service_interval_days":{"type":["integer","null"]},"last_serviced_at":{"type":["string","null"],"format":"date"},"condition":{"title":"Condition","description":"Shared condition scale used by Component.condition and Event.condition_after, so the two cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for not-yet-assessed.","type":"string","enum":["good","fair","needs_attention","needs_replacement","unknown"]},"level_id":{"type":["string","null"],"format":"uuid"},"room_ids":{"type":"array","items":{"type":"string","format":"uuid"},"default":[]},"geometry":{"anyOf":[{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},{"type":"null"}],"default":null},"notes":{"type":["string","null"]},"linked_component_id":{"type":["string","null"],"format":"uuid"},"custom_fields":{"type":"object","additionalProperties":true,"default":{}}}},"default":[]},"events":{"type":"array","items":{"title":"Event","type":"object","additionalProperties":false,"required":["id","home_id","event_type","occurred_at","attachment_ids"],"anyOf":[{"required":["system_id"],"properties":{"system_id":{"type":"string","format":"uuid"}}},{"required":["component_id"],"properties":{"component_id":{"type":"string","format":"uuid"}}}],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"system_id":{"type":["string","null"],"format":"uuid"},"component_id":{"type":["string","null"],"format":"uuid"},"event_type":{"type":"string","enum":["inspection","service","repair","replacement","reading","note"]},"occurred_at":{"type":"string","format":"date-time"},"performed_by":{"type":["string","null"]},"cost_cents":{"type":["integer","null"]},"notes":{"type":["string","null"]},"condition_after":{"anyOf":[{"title":"Condition","description":"Shared condition scale used by Component.condition and Event.condition_after, so the two cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for not-yet-assessed.","type":"string","enum":["good","fair","needs_attention","needs_replacement","unknown"]},{"type":"null"}],"default":null},"reading_value":{"type":["number","null"]},"reading_unit":{"type":["string","null"]},"attachment_ids":{"type":"array","items":{"type":"string","format":"uuid"},"default":[]}}},"default":[]},"attachments":{"type":"array","items":{"title":"Attachment","type":"object","additionalProperties":false,"required":["id","home_id","kind","storage_path","mime_type","file_size_bytes"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"kind":{"type":"string","enum":["photo","receipt","manual_pdf","usdz_mesh","floor_plan_source","roomplan_structure","gltf_mesh"]},"storage_path":{"type":"string","pattern":"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$","description":"Canonical owner-scoped Storage key: {owner_user_id}/homes/{home_id}/attachments/{attachment_id}.ext."},"mime_type":{"type":"string"},"file_size_bytes":{"type":"integer"},"captured_at":{"type":["string","null"],"format":"date-time"},"linked_event_id":{"type":["string","null"],"format":"uuid"},"linked_component_id":{"type":["string","null"],"format":"uuid"}}},"default":[]},"smart_home_readings":{"type":"array","items":{"title":"SmartHomeReading","type":"object","additionalProperties":false,"required":["id","component_id","source","metric","value","unit","recorded_at"],"properties":{"id":{"type":"string","format":"uuid"},"component_id":{"type":"string","format":"uuid"},"source":{"type":"string","enum":["homekit","ecobee","nest","other"]},"metric":{"type":"string"},"value":{"type":"number"},"unit":{"type":"string"},"recorded_at":{"type":"string","format":"date-time"}}},"default":[]},"utility_bills":{"type":"array","items":{"title":"UtilityBill","type":"object","additionalProperties":false,"required":["id","home_id","utility_type","billing_period_start","billing_period_end","usage_amount","usage_unit","source"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"utility_type":{"type":"string","enum":["gas","electric","water"]},"billing_period_start":{"type":"string","format":"date"},"billing_period_end":{"type":"string","format":"date"},"usage_amount":{"type":"number"},"usage_unit":{"type":"string"},"cost_cents":{"type":["integer","null"]},"source":{"type":"string","enum":["manual","import"]},"attachment_id":{"type":["string","null"],"format":"uuid"}}},"default":[]}}};
const func1 = Object.prototype.hasOwnProperty;
const pattern4 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
const pattern5 = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$", "u");
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
if(!((((((data0 === "0.1.0") || (data0 === "0.1.1")) || (data0 === "0.2.0")) || (data0 === "0.3.0")) || (data0 === "0.4.0")) || (data0 === "0.5.0"))){
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
if(data1.created_at !== undefined){
let data12 = data1.created_at;
if(typeof data12 === "string"){
if(!(formats4.validate(data12))){
const err33 = {instancePath:instancePath+"/home/created_at",schemaPath:"#/properties/home/properties/created_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
else {
const err34 = {instancePath:instancePath+"/home/created_at",schemaPath:"#/properties/home/properties/created_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
}
else {
const err35 = {instancePath:instancePath+"/home",schemaPath:"#/properties/home/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.levels !== undefined){
let data13 = data.levels;
if(Array.isArray(data13)){
const len0 = data13.length;
for(let i0=0; i0<len0; i0++){
let data14 = data13[i0];
if(data14 && typeof data14 == "object" && !Array.isArray(data14)){
if(data14.id === undefined){
const err36 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data14.home_id === undefined){
const err37 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data14.name === undefined){
const err38 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data14.sort_order === undefined){
const err39 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "sort_order"},message:"must have required property '"+"sort_order"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data14.elevation_offset_m === undefined){
const err40 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "elevation_offset_m"},message:"must have required property '"+"elevation_offset_m"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data14.scale_confidence === undefined){
const err41 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/required",keyword:"required",params:{missingProperty: "scale_confidence"},message:"must have required property '"+"scale_confidence"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
for(const key2 in data14){
if(!(func1.call(schema31.properties.levels.items.properties, key2))){
const err42 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data14.id !== undefined){
let data15 = data14.id;
if(typeof data15 === "string"){
if(!(formats0.test(data15))){
const err43 = {instancePath:instancePath+"/levels/" + i0+"/id",schemaPath:"#/properties/levels/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
else {
const err44 = {instancePath:instancePath+"/levels/" + i0+"/id",schemaPath:"#/properties/levels/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data14.home_id !== undefined){
let data16 = data14.home_id;
if(typeof data16 === "string"){
if(!(formats0.test(data16))){
const err45 = {instancePath:instancePath+"/levels/" + i0+"/home_id",schemaPath:"#/properties/levels/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
else {
const err46 = {instancePath:instancePath+"/levels/" + i0+"/home_id",schemaPath:"#/properties/levels/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data14.name !== undefined){
if(typeof data14.name !== "string"){
const err47 = {instancePath:instancePath+"/levels/" + i0+"/name",schemaPath:"#/properties/levels/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data14.sort_order !== undefined){
let data18 = data14.sort_order;
if(!(((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18))) && (isFinite(data18)))){
const err48 = {instancePath:instancePath+"/levels/" + i0+"/sort_order",schemaPath:"#/properties/levels/items/properties/sort_order/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data14.elevation_offset_m !== undefined){
let data19 = data14.elevation_offset_m;
if(!((typeof data19 == "number") && (isFinite(data19)))){
const err49 = {instancePath:instancePath+"/levels/" + i0+"/elevation_offset_m",schemaPath:"#/properties/levels/items/properties/elevation_offset_m/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data14.scale_confidence !== undefined){
let data20 = data14.scale_confidence;
if(typeof data20 !== "string"){
const err50 = {instancePath:instancePath+"/levels/" + i0+"/scale_confidence",schemaPath:"#/properties/levels/items/properties/scale_confidence/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
if(!((data20 === "measured") || (data20 === "estimated"))){
const err51 = {instancePath:instancePath+"/levels/" + i0+"/scale_confidence",schemaPath:"#/properties/levels/items/properties/scale_confidence/enum",keyword:"enum",params:{allowedValues: schema31.properties.levels.items.properties.scale_confidence.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data14.import_attachment_id !== undefined){
let data21 = data14.import_attachment_id;
if((typeof data21 !== "string") && (data21 !== null)){
const err52 = {instancePath:instancePath+"/levels/" + i0+"/import_attachment_id",schemaPath:"#/properties/levels/items/properties/import_attachment_id/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.import_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(typeof data21 === "string"){
if(!(formats0.test(data21))){
const err53 = {instancePath:instancePath+"/levels/" + i0+"/import_attachment_id",schemaPath:"#/properties/levels/items/properties/import_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
}
if(data14.import_origin_m !== undefined){
let data22 = data14.import_origin_m;
if((!(Array.isArray(data22))) && (data22 !== null)){
const err54 = {instancePath:instancePath+"/levels/" + i0+"/import_origin_m",schemaPath:"#/properties/levels/items/properties/import_origin_m/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.import_origin_m.type},message:"must be array,null"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
if(Array.isArray(data22)){
if(data22.length > 2){
const err55 = {instancePath:instancePath+"/levels/" + i0+"/import_origin_m",schemaPath:"#/properties/levels/items/properties/import_origin_m/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
if(data22.length < 2){
const err56 = {instancePath:instancePath+"/levels/" + i0+"/import_origin_m",schemaPath:"#/properties/levels/items/properties/import_origin_m/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
const len1 = data22.length;
for(let i1=0; i1<len1; i1++){
let data23 = data22[i1];
if(!((typeof data23 == "number") && (isFinite(data23)))){
const err57 = {instancePath:instancePath+"/levels/" + i0+"/import_origin_m/" + i1,schemaPath:"#/properties/levels/items/properties/import_origin_m/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
}
}
if(data14.import_scale_m_per_px !== undefined){
let data24 = data14.import_scale_m_per_px;
if((!((typeof data24 == "number") && (isFinite(data24)))) && (data24 !== null)){
const err58 = {instancePath:instancePath+"/levels/" + i0+"/import_scale_m_per_px",schemaPath:"#/properties/levels/items/properties/import_scale_m_per_px/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.import_scale_m_per_px.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data14.import_pixel_width !== undefined){
let data25 = data14.import_pixel_width;
if((!(((typeof data25 == "number") && (!(data25 % 1) && !isNaN(data25))) && (isFinite(data25)))) && (data25 !== null)){
const err59 = {instancePath:instancePath+"/levels/" + i0+"/import_pixel_width",schemaPath:"#/properties/levels/items/properties/import_pixel_width/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.import_pixel_width.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data14.import_pixel_height !== undefined){
let data26 = data14.import_pixel_height;
if((!(((typeof data26 == "number") && (!(data26 % 1) && !isNaN(data26))) && (isFinite(data26)))) && (data26 !== null)){
const err60 = {instancePath:instancePath+"/levels/" + i0+"/import_pixel_height",schemaPath:"#/properties/levels/items/properties/import_pixel_height/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.import_pixel_height.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
if(data14.scan_usdz_attachment_id !== undefined){
let data27 = data14.scan_usdz_attachment_id;
if((typeof data27 !== "string") && (data27 !== null)){
const err61 = {instancePath:instancePath+"/levels/" + i0+"/scan_usdz_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_usdz_attachment_id/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_usdz_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(typeof data27 === "string"){
if(!(formats0.test(data27))){
const err62 = {instancePath:instancePath+"/levels/" + i0+"/scan_usdz_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_usdz_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
}
if(data14.scan_structure_attachment_id !== undefined){
let data28 = data14.scan_structure_attachment_id;
if((typeof data28 !== "string") && (data28 !== null)){
const err63 = {instancePath:instancePath+"/levels/" + i0+"/scan_structure_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_structure_attachment_id/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_structure_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(typeof data28 === "string"){
if(!(formats0.test(data28))){
const err64 = {instancePath:instancePath+"/levels/" + i0+"/scan_structure_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_structure_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
if(data14.scan_glb_attachment_id !== undefined){
let data29 = data14.scan_glb_attachment_id;
if((typeof data29 !== "string") && (data29 !== null)){
const err65 = {instancePath:instancePath+"/levels/" + i0+"/scan_glb_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_glb_attachment_id/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_glb_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(typeof data29 === "string"){
if(!(formats0.test(data29))){
const err66 = {instancePath:instancePath+"/levels/" + i0+"/scan_glb_attachment_id",schemaPath:"#/properties/levels/items/properties/scan_glb_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
}
if(data14.scan_origin_m !== undefined){
let data30 = data14.scan_origin_m;
if((!(Array.isArray(data30))) && (data30 !== null)){
const err67 = {instancePath:instancePath+"/levels/" + i0+"/scan_origin_m",schemaPath:"#/properties/levels/items/properties/scan_origin_m/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_origin_m.type},message:"must be array,null"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if(Array.isArray(data30)){
if(data30.length > 2){
const err68 = {instancePath:instancePath+"/levels/" + i0+"/scan_origin_m",schemaPath:"#/properties/levels/items/properties/scan_origin_m/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
if(data30.length < 2){
const err69 = {instancePath:instancePath+"/levels/" + i0+"/scan_origin_m",schemaPath:"#/properties/levels/items/properties/scan_origin_m/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
const len2 = data30.length;
for(let i2=0; i2<len2; i2++){
let data31 = data30[i2];
if(!((typeof data31 == "number") && (isFinite(data31)))){
const err70 = {instancePath:instancePath+"/levels/" + i0+"/scan_origin_m/" + i2,schemaPath:"#/properties/levels/items/properties/scan_origin_m/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
}
}
if(data14.scan_rotation_rad !== undefined){
let data32 = data14.scan_rotation_rad;
if((!((typeof data32 == "number") && (isFinite(data32)))) && (data32 !== null)){
const err71 = {instancePath:instancePath+"/levels/" + i0+"/scan_rotation_rad",schemaPath:"#/properties/levels/items/properties/scan_rotation_rad/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_rotation_rad.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
if(data14.scan_review_state !== undefined){
let data33 = data14.scan_review_state;
if((typeof data33 !== "string") && (data33 !== null)){
const err72 = {instancePath:instancePath+"/levels/" + i0+"/scan_review_state",schemaPath:"#/properties/levels/items/properties/scan_review_state/type",keyword:"type",params:{type: schema31.properties.levels.items.properties.scan_review_state.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(!(((data33 === "pending_review") || (data33 === "reviewed")) || (data33 === null))){
const err73 = {instancePath:instancePath+"/levels/" + i0+"/scan_review_state",schemaPath:"#/properties/levels/items/properties/scan_review_state/enum",keyword:"enum",params:{allowedValues: schema31.properties.levels.items.properties.scan_review_state.enum},message:"must be equal to one of the allowed values"};
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
else {
const err74 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
}
else {
const err75 = {instancePath:instancePath+"/levels",schemaPath:"#/properties/levels/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
if(data.rooms !== undefined){
let data34 = data.rooms;
if(Array.isArray(data34)){
const len3 = data34.length;
for(let i3=0; i3<len3; i3++){
let data35 = data34[i3];
if(data35 && typeof data35 == "object" && !Array.isArray(data35)){
if(data35.id === undefined){
const err76 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
if(data35.level_id === undefined){
const err77 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "level_id"},message:"must have required property '"+"level_id"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
if(data35.name === undefined){
const err78 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
if(data35.room_type === undefined){
const err79 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "room_type"},message:"must have required property '"+"room_type"+"'"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
if(data35.geometry === undefined){
const err80 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
for(const key3 in data35){
if(!(((((((key3 === "id") || (key3 === "level_id")) || (key3 === "name")) || (key3 === "room_type")) || (key3 === "geometry")) || (key3 === "area_computed_m2")) || (key3 === "source"))){
const err81 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data35.id !== undefined){
let data36 = data35.id;
if(typeof data36 === "string"){
if(!(formats0.test(data36))){
const err82 = {instancePath:instancePath+"/rooms/" + i3+"/id",schemaPath:"#/properties/rooms/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
else {
const err83 = {instancePath:instancePath+"/rooms/" + i3+"/id",schemaPath:"#/properties/rooms/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
if(data35.level_id !== undefined){
let data37 = data35.level_id;
if(typeof data37 === "string"){
if(!(formats0.test(data37))){
const err84 = {instancePath:instancePath+"/rooms/" + i3+"/level_id",schemaPath:"#/properties/rooms/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
else {
const err85 = {instancePath:instancePath+"/rooms/" + i3+"/level_id",schemaPath:"#/properties/rooms/items/properties/level_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data35.name !== undefined){
if(typeof data35.name !== "string"){
const err86 = {instancePath:instancePath+"/rooms/" + i3+"/name",schemaPath:"#/properties/rooms/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data35.room_type !== undefined){
let data39 = data35.room_type;
if(typeof data39 !== "string"){
const err87 = {instancePath:instancePath+"/rooms/" + i3+"/room_type",schemaPath:"#/properties/rooms/items/properties/room_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
if(!(((((((((((((data39 === "bedroom") || (data39 === "bathroom")) || (data39 === "kitchen")) || (data39 === "living_room")) || (data39 === "dining_room")) || (data39 === "garage")) || (data39 === "basement")) || (data39 === "attic")) || (data39 === "hallway")) || (data39 === "closet")) || (data39 === "laundry")) || (data39 === "office")) || (data39 === "other"))){
const err88 = {instancePath:instancePath+"/rooms/" + i3+"/room_type",schemaPath:"#/properties/rooms/items/properties/room_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.rooms.items.properties.room_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
if(data35.geometry !== undefined){
let data40 = data35.geometry;
const _errs89 = errors;
let valid14 = true;
const _errs90 = errors;
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
let missing0;
if((data40.type === undefined) && (missing0 = "type")){
const err89 = {};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
else {
if(data40.type !== undefined){
if("point" !== data40.type){
const err90 = {};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
}
}
var _valid0 = _errs90 === errors;
errors = _errs89;
if(vErrors !== null){
if(_errs89){
vErrors.length = _errs89;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs92 = errors;
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
if(data40.coordinates !== undefined){
let data42 = data40.coordinates;
if(Array.isArray(data42)){
if(data42.length > 1){
const err91 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
if(data42.length < 1){
const err92 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
else {
const err93 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
}
var _valid0 = _errs92 === errors;
valid14 = _valid0;
if(valid14){
var props0 = {};
props0.coordinates = true;
props0.type = true;
}
}
if(!valid14){
const err94 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
const _errs96 = errors;
let valid17 = true;
const _errs97 = errors;
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
let missing1;
if((data40.type === undefined) && (missing1 = "type")){
const err95 = {};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
else {
if(data40.type !== undefined){
if("polyline" !== data40.type){
const err96 = {};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
}
}
var _valid1 = _errs97 === errors;
errors = _errs96;
if(vErrors !== null){
if(_errs96){
vErrors.length = _errs96;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs99 = errors;
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
if(data40.coordinates !== undefined){
let data44 = data40.coordinates;
if(Array.isArray(data44)){
if(data44.length < 2){
const err97 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
else {
const err98 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
}
var _valid1 = _errs99 === errors;
valid17 = _valid1;
if(valid17){
var props1 = {};
props1.coordinates = true;
props1.type = true;
}
}
if(!valid17){
const err99 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
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
const _errs103 = errors;
let valid20 = true;
const _errs104 = errors;
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
let missing2;
if((data40.type === undefined) && (missing2 = "type")){
const err100 = {};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
else {
if(data40.type !== undefined){
if("polygon" !== data40.type){
const err101 = {};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
}
}
var _valid2 = _errs104 === errors;
errors = _errs103;
if(vErrors !== null){
if(_errs103){
vErrors.length = _errs103;
}
else {
vErrors = null;
}
}
if(_valid2){
const _errs106 = errors;
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
if(data40.coordinates !== undefined){
let data46 = data40.coordinates;
if(Array.isArray(data46)){
if(data46.length < 3){
const err102 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
else {
const err103 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid2 = _errs106 === errors;
valid20 = _valid2;
if(valid20){
var props2 = {};
props2.coordinates = true;
props2.type = true;
}
}
if(!valid20){
const err104 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
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
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
if(data40.type === undefined){
const err105 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(data40.coordinates === undefined){
const err106 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
for(const key4 in data40){
if(!((key4 === "type") || (key4 === "coordinates"))){
const err107 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
if(data40.type !== undefined){
let data47 = data40.type;
if(typeof data47 !== "string"){
const err108 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(!(((data47 === "point") || (data47 === "polyline")) || (data47 === "polygon"))){
const err109 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.rooms.items.properties.geometry.allOf[0].properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
if(data40.coordinates !== undefined){
let data48 = data40.coordinates;
if(Array.isArray(data48)){
const len4 = data48.length;
for(let i4=0; i4<len4; i4++){
let data49 = data48[i4];
if(Array.isArray(data49)){
if(data49.length > 2){
const err110 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates/" + i4,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data49.length < 2){
const err111 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates/" + i4,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
const len5 = data49.length;
for(let i5=0; i5<len5; i5++){
let data50 = data49[i5];
if(!((typeof data50 == "number") && (isFinite(data50)))){
const err112 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates/" + i4+"/" + i5,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
}
else {
const err113 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates/" + i4,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
}
else {
const err114 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
}
else {
const err115 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
if(data40.type !== undefined){
if("polygon" !== data40.type){
const err116 = {instancePath:instancePath+"/rooms/" + i3+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/1/properties/type/const",keyword:"const",params:{allowedValue: "polygon"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
}
else {
const err117 = {instancePath:instancePath+"/rooms/" + i3+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data35.area_computed_m2 !== undefined){
let data52 = data35.area_computed_m2;
if((!((typeof data52 == "number") && (isFinite(data52)))) && (data52 !== null)){
const err118 = {instancePath:instancePath+"/rooms/" + i3+"/area_computed_m2",schemaPath:"#/properties/rooms/items/properties/area_computed_m2/type",keyword:"type",params:{type: schema31.properties.rooms.items.properties.area_computed_m2.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
if(data35.source !== undefined){
let data53 = data35.source;
if((typeof data53 !== "string") && (data53 !== null)){
const err119 = {instancePath:instancePath+"/rooms/" + i3+"/source",schemaPath:"#/properties/rooms/items/properties/source/type",keyword:"type",params:{type: schema31.properties.rooms.items.properties.source.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
if(!((((data53 === "hand") || (data53 === "trace")) || (data53 === "roomplan")) || (data53 === null))){
const err120 = {instancePath:instancePath+"/rooms/" + i3+"/source",schemaPath:"#/properties/rooms/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.rooms.items.properties.source.enum},message:"must be equal to one of the allowed values"};
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
const err121 = {instancePath:instancePath+"/rooms/" + i3,schemaPath:"#/properties/rooms/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err122 = {instancePath:instancePath+"/rooms",schemaPath:"#/properties/rooms/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data.plan_elements !== undefined){
let data54 = data.plan_elements;
if(Array.isArray(data54)){
const len6 = data54.length;
for(let i6=0; i6<len6; i6++){
let data55 = data54[i6];
if(data55 && typeof data55 == "object" && !Array.isArray(data55)){
if(data55.id === undefined){
const err123 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
if(data55.level_id === undefined){
const err124 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "level_id"},message:"must have required property '"+"level_id"+"'"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
if(data55.kind === undefined){
const err125 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
if(data55.geometry === undefined){
const err126 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
for(const key5 in data55){
if(!((((((key5 === "id") || (key5 === "level_id")) || (key5 === "kind")) || (key5 === "geometry")) || (key5 === "host_element_id")) || (key5 === "source"))){
const err127 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
if(data55.id !== undefined){
let data56 = data55.id;
if(typeof data56 === "string"){
if(!(formats0.test(data56))){
const err128 = {instancePath:instancePath+"/plan_elements/" + i6+"/id",schemaPath:"#/properties/plan_elements/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
else {
const err129 = {instancePath:instancePath+"/plan_elements/" + i6+"/id",schemaPath:"#/properties/plan_elements/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data55.level_id !== undefined){
let data57 = data55.level_id;
if(typeof data57 === "string"){
if(!(formats0.test(data57))){
const err130 = {instancePath:instancePath+"/plan_elements/" + i6+"/level_id",schemaPath:"#/properties/plan_elements/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
}
else {
const err131 = {instancePath:instancePath+"/plan_elements/" + i6+"/level_id",schemaPath:"#/properties/plan_elements/items/properties/level_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
}
if(data55.kind !== undefined){
let data58 = data55.kind;
if(typeof data58 !== "string"){
const err132 = {instancePath:instancePath+"/plan_elements/" + i6+"/kind",schemaPath:"#/properties/plan_elements/items/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
if(!((((data58 === "wall") || (data58 === "door")) || (data58 === "window")) || (data58 === "opening"))){
const err133 = {instancePath:instancePath+"/plan_elements/" + i6+"/kind",schemaPath:"#/properties/plan_elements/items/properties/kind/enum",keyword:"enum",params:{allowedValues: schema31.properties.plan_elements.items.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
if(data55.geometry !== undefined){
let data59 = data55.geometry;
const _errs139 = errors;
let valid33 = true;
const _errs140 = errors;
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
let missing3;
if((data59.type === undefined) && (missing3 = "type")){
const err134 = {};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
else {
if(data59.type !== undefined){
if("point" !== data59.type){
const err135 = {};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
}
}
}
var _valid3 = _errs140 === errors;
errors = _errs139;
if(vErrors !== null){
if(_errs139){
vErrors.length = _errs139;
}
else {
vErrors = null;
}
}
if(_valid3){
const _errs142 = errors;
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
if(data59.coordinates !== undefined){
let data61 = data59.coordinates;
if(Array.isArray(data61)){
if(data61.length > 1){
const err136 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
if(data61.length < 1){
const err137 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
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
const err138 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
}
}
var _valid3 = _errs142 === errors;
valid33 = _valid3;
if(valid33){
var props3 = {};
props3.coordinates = true;
props3.type = true;
}
}
if(!valid33){
const err139 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
const _errs146 = errors;
let valid36 = true;
const _errs147 = errors;
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
let missing4;
if((data59.type === undefined) && (missing4 = "type")){
const err140 = {};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
else {
if(data59.type !== undefined){
if("polyline" !== data59.type){
const err141 = {};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
}
}
}
var _valid4 = _errs147 === errors;
errors = _errs146;
if(vErrors !== null){
if(_errs146){
vErrors.length = _errs146;
}
else {
vErrors = null;
}
}
if(_valid4){
const _errs149 = errors;
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
if(data59.coordinates !== undefined){
let data63 = data59.coordinates;
if(Array.isArray(data63)){
if(data63.length < 2){
const err142 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
else {
const err143 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
}
}
var _valid4 = _errs149 === errors;
valid36 = _valid4;
if(valid36){
var props4 = {};
props4.coordinates = true;
props4.type = true;
}
}
if(!valid36){
const err144 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
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
const _errs153 = errors;
let valid39 = true;
const _errs154 = errors;
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
let missing5;
if((data59.type === undefined) && (missing5 = "type")){
const err145 = {};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
else {
if(data59.type !== undefined){
if("polygon" !== data59.type){
const err146 = {};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
}
}
}
var _valid5 = _errs154 === errors;
errors = _errs153;
if(vErrors !== null){
if(_errs153){
vErrors.length = _errs153;
}
else {
vErrors = null;
}
}
if(_valid5){
const _errs156 = errors;
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
if(data59.coordinates !== undefined){
let data65 = data59.coordinates;
if(Array.isArray(data65)){
if(data65.length < 3){
const err147 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
else {
const err148 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid5 = _errs156 === errors;
valid39 = _valid5;
if(valid39){
var props5 = {};
props5.coordinates = true;
props5.type = true;
}
}
if(!valid39){
const err149 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
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
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
if(data59.type === undefined){
const err150 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
if(data59.coordinates === undefined){
const err151 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
for(const key6 in data59){
if(!((key6 === "type") || (key6 === "coordinates"))){
const err152 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
}
if(data59.type !== undefined){
let data66 = data59.type;
if(typeof data66 !== "string"){
const err153 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/type",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
if(!(((data66 === "point") || (data66 === "polyline")) || (data66 === "polygon"))){
const err154 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/type",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.plan_elements.items.properties.geometry.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
}
if(data59.coordinates !== undefined){
let data67 = data59.coordinates;
if(Array.isArray(data67)){
const len7 = data67.length;
for(let i7=0; i7<len7; i7++){
let data68 = data67[i7];
if(Array.isArray(data68)){
if(data68.length > 2){
const err155 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates/" + i7,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
if(data68.length < 2){
const err156 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates/" + i7,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
const len8 = data68.length;
for(let i8=0; i8<len8; i8++){
let data69 = data68[i8];
if(!((typeof data69 == "number") && (isFinite(data69)))){
const err157 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates/" + i7+"/" + i8,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
}
else {
const err158 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates/" + i7,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
}
else {
const err159 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
}
else {
const err160 = {instancePath:instancePath+"/plan_elements/" + i6+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
if(data55.host_element_id !== undefined){
let data70 = data55.host_element_id;
if((typeof data70 !== "string") && (data70 !== null)){
const err161 = {instancePath:instancePath+"/plan_elements/" + i6+"/host_element_id",schemaPath:"#/properties/plan_elements/items/properties/host_element_id/type",keyword:"type",params:{type: schema31.properties.plan_elements.items.properties.host_element_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
if(typeof data70 === "string"){
if(!(formats0.test(data70))){
const err162 = {instancePath:instancePath+"/plan_elements/" + i6+"/host_element_id",schemaPath:"#/properties/plan_elements/items/properties/host_element_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
}
if(data55.source !== undefined){
let data71 = data55.source;
if((typeof data71 !== "string") && (data71 !== null)){
const err163 = {instancePath:instancePath+"/plan_elements/" + i6+"/source",schemaPath:"#/properties/plan_elements/items/properties/source/type",keyword:"type",params:{type: schema31.properties.plan_elements.items.properties.source.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
if(!((((data71 === "hand") || (data71 === "trace")) || (data71 === "roomplan")) || (data71 === null))){
const err164 = {instancePath:instancePath+"/plan_elements/" + i6+"/source",schemaPath:"#/properties/plan_elements/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.plan_elements.items.properties.source.enum},message:"must be equal to one of the allowed values"};
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
const err165 = {instancePath:instancePath+"/plan_elements/" + i6,schemaPath:"#/properties/plan_elements/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err166 = {instancePath:instancePath+"/plan_elements",schemaPath:"#/properties/plan_elements/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
}
if(data.systems !== undefined){
let data72 = data.systems;
if(Array.isArray(data72)){
const len9 = data72.length;
for(let i9=0; i9<len9; i9++){
let data73 = data72[i9];
if(data73 && typeof data73 == "object" && !Array.isArray(data73)){
if(data73.id === undefined){
const err167 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
if(data73.home_id === undefined){
const err168 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
if(data73.category === undefined){
const err169 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "category"},message:"must have required property '"+"category"+"'"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if(data73.name === undefined){
const err170 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
for(const key7 in data73){
if(!(((((key7 === "id") || (key7 === "home_id")) || (key7 === "category")) || (key7 === "name")) || (key7 === "notes"))){
const err171 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
}
if(data73.id !== undefined){
let data74 = data73.id;
if(typeof data74 === "string"){
if(!(formats0.test(data74))){
const err172 = {instancePath:instancePath+"/systems/" + i9+"/id",schemaPath:"#/properties/systems/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
}
else {
const err173 = {instancePath:instancePath+"/systems/" + i9+"/id",schemaPath:"#/properties/systems/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
}
if(data73.home_id !== undefined){
let data75 = data73.home_id;
if(typeof data75 === "string"){
if(!(formats0.test(data75))){
const err174 = {instancePath:instancePath+"/systems/" + i9+"/home_id",schemaPath:"#/properties/systems/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
}
else {
const err175 = {instancePath:instancePath+"/systems/" + i9+"/home_id",schemaPath:"#/properties/systems/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
}
if(data73.category !== undefined){
let data76 = data73.category;
if(typeof data76 !== "string"){
const err176 = {instancePath:instancePath+"/systems/" + i9+"/category",schemaPath:"#/properties/systems/items/properties/category/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
if(!(((((((data76 === "plumbing") || (data76 === "electrical")) || (data76 === "hvac")) || (data76 === "roof_structure")) || (data76 === "appliances_and_water_heater")) || (data76 === "exterior_and_site")) || (data76 === "low_voltage_and_smart_home"))){
const err177 = {instancePath:instancePath+"/systems/" + i9+"/category",schemaPath:"#/properties/systems/items/properties/category/enum",keyword:"enum",params:{allowedValues: schema31.properties.systems.items.properties.category.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
}
if(data73.name !== undefined){
if(typeof data73.name !== "string"){
const err178 = {instancePath:instancePath+"/systems/" + i9+"/name",schemaPath:"#/properties/systems/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
}
if(data73.notes !== undefined){
let data78 = data73.notes;
if((typeof data78 !== "string") && (data78 !== null)){
const err179 = {instancePath:instancePath+"/systems/" + i9+"/notes",schemaPath:"#/properties/systems/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.systems.items.properties.notes.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
}
}
else {
const err180 = {instancePath:instancePath+"/systems/" + i9,schemaPath:"#/properties/systems/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
}
}
else {
const err181 = {instancePath:instancePath+"/systems",schemaPath:"#/properties/systems/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
}
if(data.components !== undefined){
let data79 = data.components;
if(Array.isArray(data79)){
const len10 = data79.length;
for(let i10=0; i10<len10; i10++){
let data80 = data79[i10];
if(data80 && typeof data80 == "object" && !Array.isArray(data80)){
if(data80.id === undefined){
const err182 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
if(data80.system_id === undefined){
const err183 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "system_id"},message:"must have required property '"+"system_id"+"'"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
if(data80.name === undefined){
const err184 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
if(data80.component_type === undefined){
const err185 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "component_type"},message:"must have required property '"+"component_type"+"'"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
if(data80.condition === undefined){
const err186 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "condition"},message:"must have required property '"+"condition"+"'"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
if(data80.room_ids === undefined){
const err187 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "room_ids"},message:"must have required property '"+"room_ids"+"'"};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
if(data80.custom_fields === undefined){
const err188 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "custom_fields"},message:"must have required property '"+"custom_fields"+"'"};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
for(const key8 in data80){
if(!(func1.call(schema31.properties.components.items.properties, key8))){
const err189 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
}
if(data80.id !== undefined){
let data81 = data80.id;
if(typeof data81 === "string"){
if(!(formats0.test(data81))){
const err190 = {instancePath:instancePath+"/components/" + i10+"/id",schemaPath:"#/properties/components/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
}
else {
const err191 = {instancePath:instancePath+"/components/" + i10+"/id",schemaPath:"#/properties/components/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
}
if(data80.system_id !== undefined){
let data82 = data80.system_id;
if(typeof data82 === "string"){
if(!(formats0.test(data82))){
const err192 = {instancePath:instancePath+"/components/" + i10+"/system_id",schemaPath:"#/properties/components/items/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
}
else {
const err193 = {instancePath:instancePath+"/components/" + i10+"/system_id",schemaPath:"#/properties/components/items/properties/system_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
}
if(data80.name !== undefined){
if(typeof data80.name !== "string"){
const err194 = {instancePath:instancePath+"/components/" + i10+"/name",schemaPath:"#/properties/components/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
}
if(data80.component_type !== undefined){
let data84 = data80.component_type;
if(typeof data84 !== "string"){
const err195 = {instancePath:instancePath+"/components/" + i10+"/component_type",schemaPath:"#/properties/components/items/properties/component_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
if(!((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((data84 === "plumbing_fixture") || (data84 === "toilet")) || (data84 === "sink")) || (data84 === "bathtub_shower")) || (data84 === "main_water_shutoff")) || (data84 === "gas_shutoff")) || (data84 === "water_supply_line")) || (data84 === "drain_waste_vent")) || (data84 === "sewer_lateral")) || (data84 === "sump_pump")) || (data84 === "water_treatment")) || (data84 === "electrical_panel")) || (data84 === "subpanel")) || (data84 === "electric_meter")) || (data84 === "service_conductors")) || (data84 === "branch_circuit")) || (data84 === "outlet")) || (data84 === "gfci_receptacle")) || (data84 === "light_fixture")) || (data84 === "smoke_detector")) || (data84 === "co_detector")) || (data84 === "generator")) || (data84 === "solar_pv_system")) || (data84 === "hvac_furnace")) || (data84 === "hvac_ac_unit")) || (data84 === "hvac_heat_pump")) || (data84 === "hvac_mini_split")) || (data84 === "hvac_boiler")) || (data84 === "hvac_air_handler")) || (data84 === "hvac_ductwork")) || (data84 === "thermostat")) || (data84 === "hvac_filter")) || (data84 === "hvac_ventilation_fan")) || (data84 === "hvac_fireplace")) || (data84 === "roof_covering")) || (data84 === "flashing")) || (data84 === "skylight")) || (data84 === "chimney")) || (data84 === "roof_vent")) || (data84 === "gutter")) || (data84 === "downspout")) || (data84 === "soffit_fascia")) || (data84 === "attic_insulation")) || (data84 === "foundation")) || (data84 === "structural_member")) || (data84 === "water_heater")) || (data84 === "refrigerator")) || (data84 === "dishwasher")) || (data84 === "range_oven")) || (data84 === "microwave")) || (data84 === "range_hood")) || (data84 === "clothes_washer")) || (data84 === "clothes_dryer")) || (data84 === "garbage_disposal")) || (data84 === "appliance_generic")) || (data84 === "exterior_wall_covering")) || (data84 === "window")) || (data84 === "exterior_door")) || (data84 === "garage_door")) || (data84 === "garage_door_opener")) || (data84 === "deck_porch_patio")) || (data84 === "driveway_walkway")) || (data84 === "fence_wall")) || (data84 === "irrigation_system")) || (data84 === "septic_system")) || (data84 === "well_pump")) || (data84 === "pool_spa")) || (data84 === "camera")) || (data84 === "video_doorbell")) || (data84 === "network_router")) || (data84 === "network_access_point")) || (data84 === "smart_hub")) || (data84 === "smart_lock")) || (data84 === "alarm_panel")) || (data84 === "leak_sensor")) || (data84 === "structured_wiring_panel")) || (data84 === "low_voltage_cabling")) || (data84 === "other"))){
const err196 = {instancePath:instancePath+"/components/" + i10+"/component_type",schemaPath:"#/properties/components/items/properties/component_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.component_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
}
if(data80.make !== undefined){
let data85 = data80.make;
if((typeof data85 !== "string") && (data85 !== null)){
const err197 = {instancePath:instancePath+"/components/" + i10+"/make",schemaPath:"#/properties/components/items/properties/make/type",keyword:"type",params:{type: schema31.properties.components.items.properties.make.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
}
if(data80.model !== undefined){
let data86 = data80.model;
if((typeof data86 !== "string") && (data86 !== null)){
const err198 = {instancePath:instancePath+"/components/" + i10+"/model",schemaPath:"#/properties/components/items/properties/model/type",keyword:"type",params:{type: schema31.properties.components.items.properties.model.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err198];
}
else {
vErrors.push(err198);
}
errors++;
}
}
if(data80.manual_url !== undefined){
let data87 = data80.manual_url;
if((typeof data87 !== "string") && (data87 !== null)){
const err199 = {instancePath:instancePath+"/components/" + i10+"/manual_url",schemaPath:"#/properties/components/items/properties/manual_url/type",keyword:"type",params:{type: schema31.properties.components.items.properties.manual_url.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
if(typeof data87 === "string"){
if(!(formats36(data87))){
const err200 = {instancePath:instancePath+"/components/" + i10+"/manual_url",schemaPath:"#/properties/components/items/properties/manual_url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err200];
}
else {
vErrors.push(err200);
}
errors++;
}
}
}
if(data80.location_note !== undefined){
let data88 = data80.location_note;
if((typeof data88 !== "string") && (data88 !== null)){
const err201 = {instancePath:instancePath+"/components/" + i10+"/location_note",schemaPath:"#/properties/components/items/properties/location_note/type",keyword:"type",params:{type: schema31.properties.components.items.properties.location_note.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
}
if(data80.serial_number !== undefined){
let data89 = data80.serial_number;
if((typeof data89 !== "string") && (data89 !== null)){
const err202 = {instancePath:instancePath+"/components/" + i10+"/serial_number",schemaPath:"#/properties/components/items/properties/serial_number/type",keyword:"type",params:{type: schema31.properties.components.items.properties.serial_number.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
}
if(data80.install_date !== undefined){
let data90 = data80.install_date;
if((typeof data90 !== "string") && (data90 !== null)){
const err203 = {instancePath:instancePath+"/components/" + i10+"/install_date",schemaPath:"#/properties/components/items/properties/install_date/type",keyword:"type",params:{type: schema31.properties.components.items.properties.install_date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
if(typeof data90 === "string"){
if(!(formats38.validate(data90))){
const err204 = {instancePath:instancePath+"/components/" + i10+"/install_date",schemaPath:"#/properties/components/items/properties/install_date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
}
}
if(data80.warranty_start !== undefined){
let data91 = data80.warranty_start;
if((typeof data91 !== "string") && (data91 !== null)){
const err205 = {instancePath:instancePath+"/components/" + i10+"/warranty_start",schemaPath:"#/properties/components/items/properties/warranty_start/type",keyword:"type",params:{type: schema31.properties.components.items.properties.warranty_start.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
if(typeof data91 === "string"){
if(!(formats38.validate(data91))){
const err206 = {instancePath:instancePath+"/components/" + i10+"/warranty_start",schemaPath:"#/properties/components/items/properties/warranty_start/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
}
}
if(data80.warranty_length_months !== undefined){
let data92 = data80.warranty_length_months;
if((!(((typeof data92 == "number") && (!(data92 % 1) && !isNaN(data92))) && (isFinite(data92)))) && (data92 !== null)){
const err207 = {instancePath:instancePath+"/components/" + i10+"/warranty_length_months",schemaPath:"#/properties/components/items/properties/warranty_length_months/type",keyword:"type",params:{type: schema31.properties.components.items.properties.warranty_length_months.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
}
if(data80.manual_attachment_id !== undefined){
let data93 = data80.manual_attachment_id;
if((typeof data93 !== "string") && (data93 !== null)){
const err208 = {instancePath:instancePath+"/components/" + i10+"/manual_attachment_id",schemaPath:"#/properties/components/items/properties/manual_attachment_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.manual_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
if(typeof data93 === "string"){
if(!(formats0.test(data93))){
const err209 = {instancePath:instancePath+"/components/" + i10+"/manual_attachment_id",schemaPath:"#/properties/components/items/properties/manual_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err209];
}
else {
vErrors.push(err209);
}
errors++;
}
}
}
if(data80.service_interval_days !== undefined){
let data94 = data80.service_interval_days;
if((!(((typeof data94 == "number") && (!(data94 % 1) && !isNaN(data94))) && (isFinite(data94)))) && (data94 !== null)){
const err210 = {instancePath:instancePath+"/components/" + i10+"/service_interval_days",schemaPath:"#/properties/components/items/properties/service_interval_days/type",keyword:"type",params:{type: schema31.properties.components.items.properties.service_interval_days.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
}
if(data80.last_serviced_at !== undefined){
let data95 = data80.last_serviced_at;
if((typeof data95 !== "string") && (data95 !== null)){
const err211 = {instancePath:instancePath+"/components/" + i10+"/last_serviced_at",schemaPath:"#/properties/components/items/properties/last_serviced_at/type",keyword:"type",params:{type: schema31.properties.components.items.properties.last_serviced_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
if(typeof data95 === "string"){
if(!(formats38.validate(data95))){
const err212 = {instancePath:instancePath+"/components/" + i10+"/last_serviced_at",schemaPath:"#/properties/components/items/properties/last_serviced_at/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err212];
}
else {
vErrors.push(err212);
}
errors++;
}
}
}
if(data80.condition !== undefined){
let data96 = data80.condition;
if(typeof data96 !== "string"){
const err213 = {instancePath:instancePath+"/components/" + i10+"/condition",schemaPath:"#/properties/components/items/properties/condition/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
if(!(((((data96 === "good") || (data96 === "fair")) || (data96 === "needs_attention")) || (data96 === "needs_replacement")) || (data96 === "unknown"))){
const err214 = {instancePath:instancePath+"/components/" + i10+"/condition",schemaPath:"#/properties/components/items/properties/condition/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.condition.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err214];
}
else {
vErrors.push(err214);
}
errors++;
}
}
if(data80.level_id !== undefined){
let data97 = data80.level_id;
if((typeof data97 !== "string") && (data97 !== null)){
const err215 = {instancePath:instancePath+"/components/" + i10+"/level_id",schemaPath:"#/properties/components/items/properties/level_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.level_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
}
errors++;
}
if(typeof data97 === "string"){
if(!(formats0.test(data97))){
const err216 = {instancePath:instancePath+"/components/" + i10+"/level_id",schemaPath:"#/properties/components/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
if(data80.room_ids !== undefined){
let data98 = data80.room_ids;
if(Array.isArray(data98)){
const len11 = data98.length;
for(let i11=0; i11<len11; i11++){
let data99 = data98[i11];
if(typeof data99 === "string"){
if(!(formats0.test(data99))){
const err217 = {instancePath:instancePath+"/components/" + i10+"/room_ids/" + i11,schemaPath:"#/properties/components/items/properties/room_ids/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
}
else {
const err218 = {instancePath:instancePath+"/components/" + i10+"/room_ids/" + i11,schemaPath:"#/properties/components/items/properties/room_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err218];
}
else {
vErrors.push(err218);
}
errors++;
}
}
}
else {
const err219 = {instancePath:instancePath+"/components/" + i10+"/room_ids",schemaPath:"#/properties/components/items/properties/room_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err219];
}
else {
vErrors.push(err219);
}
errors++;
}
}
if(data80.geometry !== undefined){
let data100 = data80.geometry;
const _errs231 = errors;
let valid55 = false;
const _errs232 = errors;
const _errs235 = errors;
let valid57 = true;
const _errs236 = errors;
if(data100 && typeof data100 == "object" && !Array.isArray(data100)){
let missing6;
if((data100.type === undefined) && (missing6 = "type")){
const err220 = {};
if(vErrors === null){
vErrors = [err220];
}
else {
vErrors.push(err220);
}
errors++;
}
else {
if(data100.type !== undefined){
if("point" !== data100.type){
const err221 = {};
if(vErrors === null){
vErrors = [err221];
}
else {
vErrors.push(err221);
}
errors++;
}
}
}
}
var _valid7 = _errs236 === errors;
errors = _errs235;
if(vErrors !== null){
if(_errs235){
vErrors.length = _errs235;
}
else {
vErrors = null;
}
}
if(_valid7){
const _errs238 = errors;
if(data100 && typeof data100 == "object" && !Array.isArray(data100)){
if(data100.coordinates !== undefined){
let data102 = data100.coordinates;
if(Array.isArray(data102)){
if(data102.length > 1){
const err222 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err222];
}
else {
vErrors.push(err222);
}
errors++;
}
if(data102.length < 1){
const err223 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err223];
}
else {
vErrors.push(err223);
}
errors++;
}
}
else {
const err224 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err224];
}
else {
vErrors.push(err224);
}
errors++;
}
}
}
var _valid7 = _errs238 === errors;
valid57 = _valid7;
if(valid57){
var props6 = {};
props6.coordinates = true;
props6.type = true;
}
}
if(!valid57){
const err225 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err225];
}
else {
vErrors.push(err225);
}
errors++;
}
const _errs242 = errors;
let valid60 = true;
const _errs243 = errors;
if(data100 && typeof data100 == "object" && !Array.isArray(data100)){
let missing7;
if((data100.type === undefined) && (missing7 = "type")){
const err226 = {};
if(vErrors === null){
vErrors = [err226];
}
else {
vErrors.push(err226);
}
errors++;
}
else {
if(data100.type !== undefined){
if("polyline" !== data100.type){
const err227 = {};
if(vErrors === null){
vErrors = [err227];
}
else {
vErrors.push(err227);
}
errors++;
}
}
}
}
var _valid8 = _errs243 === errors;
errors = _errs242;
if(vErrors !== null){
if(_errs242){
vErrors.length = _errs242;
}
else {
vErrors = null;
}
}
if(_valid8){
const _errs245 = errors;
if(data100 && typeof data100 == "object" && !Array.isArray(data100)){
if(data100.coordinates !== undefined){
let data104 = data100.coordinates;
if(Array.isArray(data104)){
if(data104.length < 2){
const err228 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err228];
}
else {
vErrors.push(err228);
}
errors++;
}
}
else {
const err229 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err229];
}
else {
vErrors.push(err229);
}
errors++;
}
}
}
var _valid8 = _errs245 === errors;
valid60 = _valid8;
if(valid60){
var props7 = {};
props7.coordinates = true;
props7.type = true;
}
}
if(!valid60){
const err230 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err230];
}
else {
vErrors.push(err230);
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
const _errs249 = errors;
let valid63 = true;
const _errs250 = errors;
if(data100 && typeof data100 == "object" && !Array.isArray(data100)){
let missing8;
if((data100.type === undefined) && (missing8 = "type")){
const err231 = {};
if(vErrors === null){
vErrors = [err231];
}
else {
vErrors.push(err231);
}
errors++;
}
else {
if(data100.type !== undefined){
if("polygon" !== data100.type){
const err232 = {};
if(vErrors === null){
vErrors = [err232];
}
else {
vErrors.push(err232);
}
errors++;
}
}
}
}
var _valid9 = _errs250 === errors;
errors = _errs249;
if(vErrors !== null){
if(_errs249){
vErrors.length = _errs249;
}
else {
vErrors = null;
}
}
if(_valid9){
const _errs252 = errors;
if(data100 && typeof data100 == "object" && !Array.isArray(data100)){
if(data100.coordinates !== undefined){
let data106 = data100.coordinates;
if(Array.isArray(data106)){
if(data106.length < 3){
const err233 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err233];
}
else {
vErrors.push(err233);
}
errors++;
}
}
else {
const err234 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid9 = _errs252 === errors;
valid63 = _valid9;
if(valid63){
var props8 = {};
props8.coordinates = true;
props8.type = true;
}
}
if(!valid63){
const err235 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err235];
}
else {
vErrors.push(err235);
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
if(data100 && typeof data100 == "object" && !Array.isArray(data100)){
if(data100.type === undefined){
const err236 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err236];
}
else {
vErrors.push(err236);
}
errors++;
}
if(data100.coordinates === undefined){
const err237 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err237];
}
else {
vErrors.push(err237);
}
errors++;
}
for(const key9 in data100){
if(!((key9 === "type") || (key9 === "coordinates"))){
const err238 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err238];
}
else {
vErrors.push(err238);
}
errors++;
}
}
if(data100.type !== undefined){
let data107 = data100.type;
if(typeof data107 !== "string"){
const err239 = {instancePath:instancePath+"/components/" + i10+"/geometry/type",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err239];
}
else {
vErrors.push(err239);
}
errors++;
}
if(!(((data107 === "point") || (data107 === "polyline")) || (data107 === "polygon"))){
const err240 = {instancePath:instancePath+"/components/" + i10+"/geometry/type",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.geometry.anyOf[0].properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err240];
}
else {
vErrors.push(err240);
}
errors++;
}
}
if(data100.coordinates !== undefined){
let data108 = data100.coordinates;
if(Array.isArray(data108)){
const len12 = data108.length;
for(let i12=0; i12<len12; i12++){
let data109 = data108[i12];
if(Array.isArray(data109)){
if(data109.length > 2){
const err241 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates/" + i12,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err241];
}
else {
vErrors.push(err241);
}
errors++;
}
if(data109.length < 2){
const err242 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates/" + i12,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err242];
}
else {
vErrors.push(err242);
}
errors++;
}
const len13 = data109.length;
for(let i13=0; i13<len13; i13++){
let data110 = data109[i13];
if(!((typeof data110 == "number") && (isFinite(data110)))){
const err243 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates/" + i12+"/" + i13,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err243];
}
else {
vErrors.push(err243);
}
errors++;
}
}
}
else {
const err244 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates/" + i12,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err244];
}
else {
vErrors.push(err244);
}
errors++;
}
}
}
else {
const err245 = {instancePath:instancePath+"/components/" + i10+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err245];
}
else {
vErrors.push(err245);
}
errors++;
}
}
}
else {
const err246 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err246];
}
else {
vErrors.push(err246);
}
errors++;
}
var _valid6 = _errs232 === errors;
valid55 = valid55 || _valid6;
const _errs264 = errors;
if(data100 !== null){
const err247 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err247];
}
else {
vErrors.push(err247);
}
errors++;
}
var _valid6 = _errs264 === errors;
valid55 = valid55 || _valid6;
if(!valid55){
const err248 = {instancePath:instancePath+"/components/" + i10+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err248];
}
else {
vErrors.push(err248);
}
errors++;
}
else {
errors = _errs231;
if(vErrors !== null){
if(_errs231){
vErrors.length = _errs231;
}
else {
vErrors = null;
}
}
}
}
if(data80.notes !== undefined){
let data111 = data80.notes;
if((typeof data111 !== "string") && (data111 !== null)){
const err249 = {instancePath:instancePath+"/components/" + i10+"/notes",schemaPath:"#/properties/components/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.components.items.properties.notes.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err249];
}
else {
vErrors.push(err249);
}
errors++;
}
}
if(data80.linked_component_id !== undefined){
let data112 = data80.linked_component_id;
if((typeof data112 !== "string") && (data112 !== null)){
const err250 = {instancePath:instancePath+"/components/" + i10+"/linked_component_id",schemaPath:"#/properties/components/items/properties/linked_component_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.linked_component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err250];
}
else {
vErrors.push(err250);
}
errors++;
}
if(typeof data112 === "string"){
if(!(formats0.test(data112))){
const err251 = {instancePath:instancePath+"/components/" + i10+"/linked_component_id",schemaPath:"#/properties/components/items/properties/linked_component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
if(data80.custom_fields !== undefined){
let data113 = data80.custom_fields;
if(data113 && typeof data113 == "object" && !Array.isArray(data113)){
}
else {
const err252 = {instancePath:instancePath+"/components/" + i10+"/custom_fields",schemaPath:"#/properties/components/items/properties/custom_fields/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err253 = {instancePath:instancePath+"/components/" + i10,schemaPath:"#/properties/components/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err253];
}
else {
vErrors.push(err253);
}
errors++;
}
}
}
else {
const err254 = {instancePath:instancePath+"/components",schemaPath:"#/properties/components/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err254];
}
else {
vErrors.push(err254);
}
errors++;
}
}
if(data.events !== undefined){
let data114 = data.events;
if(Array.isArray(data114)){
const len14 = data114.length;
for(let i14=0; i14<len14; i14++){
let data115 = data114[i14];
const _errs277 = errors;
let valid73 = false;
const _errs278 = errors;
if(data115 && typeof data115 == "object" && !Array.isArray(data115)){
if(data115.system_id === undefined){
const err255 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/anyOf/0/required",keyword:"required",params:{missingProperty: "system_id"},message:"must have required property '"+"system_id"+"'"};
if(vErrors === null){
vErrors = [err255];
}
else {
vErrors.push(err255);
}
errors++;
}
if(data115.system_id !== undefined){
let data116 = data115.system_id;
if(typeof data116 === "string"){
if(!(formats0.test(data116))){
const err256 = {instancePath:instancePath+"/events/" + i14+"/system_id",schemaPath:"#/properties/events/items/anyOf/0/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err256];
}
else {
vErrors.push(err256);
}
errors++;
}
}
else {
const err257 = {instancePath:instancePath+"/events/" + i14+"/system_id",schemaPath:"#/properties/events/items/anyOf/0/properties/system_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err257];
}
else {
vErrors.push(err257);
}
errors++;
}
}
}
var _valid10 = _errs278 === errors;
valid73 = valid73 || _valid10;
if(_valid10){
var props10 = {};
props10.system_id = true;
}
const _errs281 = errors;
if(data115 && typeof data115 == "object" && !Array.isArray(data115)){
if(data115.component_id === undefined){
const err258 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/anyOf/1/required",keyword:"required",params:{missingProperty: "component_id"},message:"must have required property '"+"component_id"+"'"};
if(vErrors === null){
vErrors = [err258];
}
else {
vErrors.push(err258);
}
errors++;
}
if(data115.component_id !== undefined){
let data117 = data115.component_id;
if(typeof data117 === "string"){
if(!(formats0.test(data117))){
const err259 = {instancePath:instancePath+"/events/" + i14+"/component_id",schemaPath:"#/properties/events/items/anyOf/1/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err259];
}
else {
vErrors.push(err259);
}
errors++;
}
}
else {
const err260 = {instancePath:instancePath+"/events/" + i14+"/component_id",schemaPath:"#/properties/events/items/anyOf/1/properties/component_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
var _valid10 = _errs281 === errors;
valid73 = valid73 || _valid10;
if(_valid10){
if(props10 !== true){
props10 = props10 || {};
props10.component_id = true;
}
}
if(!valid73){
const err261 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err261];
}
else {
vErrors.push(err261);
}
errors++;
}
else {
errors = _errs277;
if(vErrors !== null){
if(_errs277){
vErrors.length = _errs277;
}
else {
vErrors = null;
}
}
}
if(data115 && typeof data115 == "object" && !Array.isArray(data115)){
if(data115.id === undefined){
const err262 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err262];
}
else {
vErrors.push(err262);
}
errors++;
}
if(data115.home_id === undefined){
const err263 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err263];
}
else {
vErrors.push(err263);
}
errors++;
}
if(data115.event_type === undefined){
const err264 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "event_type"},message:"must have required property '"+"event_type"+"'"};
if(vErrors === null){
vErrors = [err264];
}
else {
vErrors.push(err264);
}
errors++;
}
if(data115.occurred_at === undefined){
const err265 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "occurred_at"},message:"must have required property '"+"occurred_at"+"'"};
if(vErrors === null){
vErrors = [err265];
}
else {
vErrors.push(err265);
}
errors++;
}
if(data115.attachment_ids === undefined){
const err266 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "attachment_ids"},message:"must have required property '"+"attachment_ids"+"'"};
if(vErrors === null){
vErrors = [err266];
}
else {
vErrors.push(err266);
}
errors++;
}
for(const key10 in data115){
if(!(func1.call(schema31.properties.events.items.properties, key10))){
const err267 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err267];
}
else {
vErrors.push(err267);
}
errors++;
}
}
if(data115.id !== undefined){
let data118 = data115.id;
if(typeof data118 === "string"){
if(!(formats0.test(data118))){
const err268 = {instancePath:instancePath+"/events/" + i14+"/id",schemaPath:"#/properties/events/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err268];
}
else {
vErrors.push(err268);
}
errors++;
}
}
else {
const err269 = {instancePath:instancePath+"/events/" + i14+"/id",schemaPath:"#/properties/events/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err269];
}
else {
vErrors.push(err269);
}
errors++;
}
}
if(data115.home_id !== undefined){
let data119 = data115.home_id;
if(typeof data119 === "string"){
if(!(formats0.test(data119))){
const err270 = {instancePath:instancePath+"/events/" + i14+"/home_id",schemaPath:"#/properties/events/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err270];
}
else {
vErrors.push(err270);
}
errors++;
}
}
else {
const err271 = {instancePath:instancePath+"/events/" + i14+"/home_id",schemaPath:"#/properties/events/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err271];
}
else {
vErrors.push(err271);
}
errors++;
}
}
if(data115.system_id !== undefined){
let data120 = data115.system_id;
if((typeof data120 !== "string") && (data120 !== null)){
const err272 = {instancePath:instancePath+"/events/" + i14+"/system_id",schemaPath:"#/properties/events/items/properties/system_id/type",keyword:"type",params:{type: schema31.properties.events.items.properties.system_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err272];
}
else {
vErrors.push(err272);
}
errors++;
}
if(typeof data120 === "string"){
if(!(formats0.test(data120))){
const err273 = {instancePath:instancePath+"/events/" + i14+"/system_id",schemaPath:"#/properties/events/items/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err273];
}
else {
vErrors.push(err273);
}
errors++;
}
}
}
if(data115.component_id !== undefined){
let data121 = data115.component_id;
if((typeof data121 !== "string") && (data121 !== null)){
const err274 = {instancePath:instancePath+"/events/" + i14+"/component_id",schemaPath:"#/properties/events/items/properties/component_id/type",keyword:"type",params:{type: schema31.properties.events.items.properties.component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err274];
}
else {
vErrors.push(err274);
}
errors++;
}
if(typeof data121 === "string"){
if(!(formats0.test(data121))){
const err275 = {instancePath:instancePath+"/events/" + i14+"/component_id",schemaPath:"#/properties/events/items/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err275];
}
else {
vErrors.push(err275);
}
errors++;
}
}
}
if(data115.event_type !== undefined){
let data122 = data115.event_type;
if(typeof data122 !== "string"){
const err276 = {instancePath:instancePath+"/events/" + i14+"/event_type",schemaPath:"#/properties/events/items/properties/event_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err276];
}
else {
vErrors.push(err276);
}
errors++;
}
if(!((((((data122 === "inspection") || (data122 === "service")) || (data122 === "repair")) || (data122 === "replacement")) || (data122 === "reading")) || (data122 === "note"))){
const err277 = {instancePath:instancePath+"/events/" + i14+"/event_type",schemaPath:"#/properties/events/items/properties/event_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.events.items.properties.event_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err277];
}
else {
vErrors.push(err277);
}
errors++;
}
}
if(data115.occurred_at !== undefined){
let data123 = data115.occurred_at;
if(typeof data123 === "string"){
if(!(formats4.validate(data123))){
const err278 = {instancePath:instancePath+"/events/" + i14+"/occurred_at",schemaPath:"#/properties/events/items/properties/occurred_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err278];
}
else {
vErrors.push(err278);
}
errors++;
}
}
else {
const err279 = {instancePath:instancePath+"/events/" + i14+"/occurred_at",schemaPath:"#/properties/events/items/properties/occurred_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err279];
}
else {
vErrors.push(err279);
}
errors++;
}
}
if(data115.performed_by !== undefined){
let data124 = data115.performed_by;
if((typeof data124 !== "string") && (data124 !== null)){
const err280 = {instancePath:instancePath+"/events/" + i14+"/performed_by",schemaPath:"#/properties/events/items/properties/performed_by/type",keyword:"type",params:{type: schema31.properties.events.items.properties.performed_by.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err280];
}
else {
vErrors.push(err280);
}
errors++;
}
}
if(data115.cost_cents !== undefined){
let data125 = data115.cost_cents;
if((!(((typeof data125 == "number") && (!(data125 % 1) && !isNaN(data125))) && (isFinite(data125)))) && (data125 !== null)){
const err281 = {instancePath:instancePath+"/events/" + i14+"/cost_cents",schemaPath:"#/properties/events/items/properties/cost_cents/type",keyword:"type",params:{type: schema31.properties.events.items.properties.cost_cents.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err281];
}
else {
vErrors.push(err281);
}
errors++;
}
}
if(data115.notes !== undefined){
let data126 = data115.notes;
if((typeof data126 !== "string") && (data126 !== null)){
const err282 = {instancePath:instancePath+"/events/" + i14+"/notes",schemaPath:"#/properties/events/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.events.items.properties.notes.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err282];
}
else {
vErrors.push(err282);
}
errors++;
}
}
if(data115.condition_after !== undefined){
let data127 = data115.condition_after;
const _errs304 = errors;
let valid77 = false;
const _errs305 = errors;
if(typeof data127 !== "string"){
const err283 = {instancePath:instancePath+"/events/" + i14+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err283];
}
else {
vErrors.push(err283);
}
errors++;
}
if(!(((((data127 === "good") || (data127 === "fair")) || (data127 === "needs_attention")) || (data127 === "needs_replacement")) || (data127 === "unknown"))){
const err284 = {instancePath:instancePath+"/events/" + i14+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/0/enum",keyword:"enum",params:{allowedValues: schema31.properties.events.items.properties.condition_after.anyOf[0].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err284];
}
else {
vErrors.push(err284);
}
errors++;
}
var _valid11 = _errs305 === errors;
valid77 = valid77 || _valid11;
const _errs307 = errors;
if(data127 !== null){
const err285 = {instancePath:instancePath+"/events/" + i14+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err285];
}
else {
vErrors.push(err285);
}
errors++;
}
var _valid11 = _errs307 === errors;
valid77 = valid77 || _valid11;
if(!valid77){
const err286 = {instancePath:instancePath+"/events/" + i14+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err286];
}
else {
vErrors.push(err286);
}
errors++;
}
else {
errors = _errs304;
if(vErrors !== null){
if(_errs304){
vErrors.length = _errs304;
}
else {
vErrors = null;
}
}
}
}
if(data115.reading_value !== undefined){
let data128 = data115.reading_value;
if((!((typeof data128 == "number") && (isFinite(data128)))) && (data128 !== null)){
const err287 = {instancePath:instancePath+"/events/" + i14+"/reading_value",schemaPath:"#/properties/events/items/properties/reading_value/type",keyword:"type",params:{type: schema31.properties.events.items.properties.reading_value.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err287];
}
else {
vErrors.push(err287);
}
errors++;
}
}
if(data115.reading_unit !== undefined){
let data129 = data115.reading_unit;
if((typeof data129 !== "string") && (data129 !== null)){
const err288 = {instancePath:instancePath+"/events/" + i14+"/reading_unit",schemaPath:"#/properties/events/items/properties/reading_unit/type",keyword:"type",params:{type: schema31.properties.events.items.properties.reading_unit.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err288];
}
else {
vErrors.push(err288);
}
errors++;
}
}
if(data115.attachment_ids !== undefined){
let data130 = data115.attachment_ids;
if(Array.isArray(data130)){
const len15 = data130.length;
for(let i15=0; i15<len15; i15++){
let data131 = data130[i15];
if(typeof data131 === "string"){
if(!(formats0.test(data131))){
const err289 = {instancePath:instancePath+"/events/" + i14+"/attachment_ids/" + i15,schemaPath:"#/properties/events/items/properties/attachment_ids/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err289];
}
else {
vErrors.push(err289);
}
errors++;
}
}
else {
const err290 = {instancePath:instancePath+"/events/" + i14+"/attachment_ids/" + i15,schemaPath:"#/properties/events/items/properties/attachment_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err290];
}
else {
vErrors.push(err290);
}
errors++;
}
}
}
else {
const err291 = {instancePath:instancePath+"/events/" + i14+"/attachment_ids",schemaPath:"#/properties/events/items/properties/attachment_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
else {
const err292 = {instancePath:instancePath+"/events/" + i14,schemaPath:"#/properties/events/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err292];
}
else {
vErrors.push(err292);
}
errors++;
}
}
}
else {
const err293 = {instancePath:instancePath+"/events",schemaPath:"#/properties/events/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err293];
}
else {
vErrors.push(err293);
}
errors++;
}
}
if(data.attachments !== undefined){
let data132 = data.attachments;
if(Array.isArray(data132)){
const len16 = data132.length;
for(let i16=0; i16<len16; i16++){
let data133 = data132[i16];
if(data133 && typeof data133 == "object" && !Array.isArray(data133)){
if(data133.id === undefined){
const err294 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err294];
}
else {
vErrors.push(err294);
}
errors++;
}
if(data133.home_id === undefined){
const err295 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err295];
}
else {
vErrors.push(err295);
}
errors++;
}
if(data133.kind === undefined){
const err296 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err296];
}
else {
vErrors.push(err296);
}
errors++;
}
if(data133.storage_path === undefined){
const err297 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "storage_path"},message:"must have required property '"+"storage_path"+"'"};
if(vErrors === null){
vErrors = [err297];
}
else {
vErrors.push(err297);
}
errors++;
}
if(data133.mime_type === undefined){
const err298 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "mime_type"},message:"must have required property '"+"mime_type"+"'"};
if(vErrors === null){
vErrors = [err298];
}
else {
vErrors.push(err298);
}
errors++;
}
if(data133.file_size_bytes === undefined){
const err299 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "file_size_bytes"},message:"must have required property '"+"file_size_bytes"+"'"};
if(vErrors === null){
vErrors = [err299];
}
else {
vErrors.push(err299);
}
errors++;
}
for(const key11 in data133){
if(!(func1.call(schema31.properties.attachments.items.properties, key11))){
const err300 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err300];
}
else {
vErrors.push(err300);
}
errors++;
}
}
if(data133.id !== undefined){
let data134 = data133.id;
if(typeof data134 === "string"){
if(!(formats0.test(data134))){
const err301 = {instancePath:instancePath+"/attachments/" + i16+"/id",schemaPath:"#/properties/attachments/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err301];
}
else {
vErrors.push(err301);
}
errors++;
}
}
else {
const err302 = {instancePath:instancePath+"/attachments/" + i16+"/id",schemaPath:"#/properties/attachments/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err302];
}
else {
vErrors.push(err302);
}
errors++;
}
}
if(data133.home_id !== undefined){
let data135 = data133.home_id;
if(typeof data135 === "string"){
if(!(formats0.test(data135))){
const err303 = {instancePath:instancePath+"/attachments/" + i16+"/home_id",schemaPath:"#/properties/attachments/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err303];
}
else {
vErrors.push(err303);
}
errors++;
}
}
else {
const err304 = {instancePath:instancePath+"/attachments/" + i16+"/home_id",schemaPath:"#/properties/attachments/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err304];
}
else {
vErrors.push(err304);
}
errors++;
}
}
if(data133.kind !== undefined){
let data136 = data133.kind;
if(typeof data136 !== "string"){
const err305 = {instancePath:instancePath+"/attachments/" + i16+"/kind",schemaPath:"#/properties/attachments/items/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err305];
}
else {
vErrors.push(err305);
}
errors++;
}
if(!(((((((data136 === "photo") || (data136 === "receipt")) || (data136 === "manual_pdf")) || (data136 === "usdz_mesh")) || (data136 === "floor_plan_source")) || (data136 === "roomplan_structure")) || (data136 === "gltf_mesh"))){
const err306 = {instancePath:instancePath+"/attachments/" + i16+"/kind",schemaPath:"#/properties/attachments/items/properties/kind/enum",keyword:"enum",params:{allowedValues: schema31.properties.attachments.items.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err306];
}
else {
vErrors.push(err306);
}
errors++;
}
}
if(data133.storage_path !== undefined){
let data137 = data133.storage_path;
if(typeof data137 === "string"){
if(!pattern5.test(data137)){
const err307 = {instancePath:instancePath+"/attachments/" + i16+"/storage_path",schemaPath:"#/properties/attachments/items/properties/storage_path/pattern",keyword:"pattern",params:{pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$"},message:"must match pattern \""+"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err307];
}
else {
vErrors.push(err307);
}
errors++;
}
}
else {
const err308 = {instancePath:instancePath+"/attachments/" + i16+"/storage_path",schemaPath:"#/properties/attachments/items/properties/storage_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err308];
}
else {
vErrors.push(err308);
}
errors++;
}
}
if(data133.mime_type !== undefined){
if(typeof data133.mime_type !== "string"){
const err309 = {instancePath:instancePath+"/attachments/" + i16+"/mime_type",schemaPath:"#/properties/attachments/items/properties/mime_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err309];
}
else {
vErrors.push(err309);
}
errors++;
}
}
if(data133.file_size_bytes !== undefined){
let data139 = data133.file_size_bytes;
if(!(((typeof data139 == "number") && (!(data139 % 1) && !isNaN(data139))) && (isFinite(data139)))){
const err310 = {instancePath:instancePath+"/attachments/" + i16+"/file_size_bytes",schemaPath:"#/properties/attachments/items/properties/file_size_bytes/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err310];
}
else {
vErrors.push(err310);
}
errors++;
}
}
if(data133.captured_at !== undefined){
let data140 = data133.captured_at;
if((typeof data140 !== "string") && (data140 !== null)){
const err311 = {instancePath:instancePath+"/attachments/" + i16+"/captured_at",schemaPath:"#/properties/attachments/items/properties/captured_at/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.captured_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err311];
}
else {
vErrors.push(err311);
}
errors++;
}
if(typeof data140 === "string"){
if(!(formats4.validate(data140))){
const err312 = {instancePath:instancePath+"/attachments/" + i16+"/captured_at",schemaPath:"#/properties/attachments/items/properties/captured_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err312];
}
else {
vErrors.push(err312);
}
errors++;
}
}
}
if(data133.linked_event_id !== undefined){
let data141 = data133.linked_event_id;
if((typeof data141 !== "string") && (data141 !== null)){
const err313 = {instancePath:instancePath+"/attachments/" + i16+"/linked_event_id",schemaPath:"#/properties/attachments/items/properties/linked_event_id/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.linked_event_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err313];
}
else {
vErrors.push(err313);
}
errors++;
}
if(typeof data141 === "string"){
if(!(formats0.test(data141))){
const err314 = {instancePath:instancePath+"/attachments/" + i16+"/linked_event_id",schemaPath:"#/properties/attachments/items/properties/linked_event_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err314];
}
else {
vErrors.push(err314);
}
errors++;
}
}
}
if(data133.linked_component_id !== undefined){
let data142 = data133.linked_component_id;
if((typeof data142 !== "string") && (data142 !== null)){
const err315 = {instancePath:instancePath+"/attachments/" + i16+"/linked_component_id",schemaPath:"#/properties/attachments/items/properties/linked_component_id/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.linked_component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err315];
}
else {
vErrors.push(err315);
}
errors++;
}
if(typeof data142 === "string"){
if(!(formats0.test(data142))){
const err316 = {instancePath:instancePath+"/attachments/" + i16+"/linked_component_id",schemaPath:"#/properties/attachments/items/properties/linked_component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err316];
}
else {
vErrors.push(err316);
}
errors++;
}
}
}
}
else {
const err317 = {instancePath:instancePath+"/attachments/" + i16,schemaPath:"#/properties/attachments/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err317];
}
else {
vErrors.push(err317);
}
errors++;
}
}
}
else {
const err318 = {instancePath:instancePath+"/attachments",schemaPath:"#/properties/attachments/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err318];
}
else {
vErrors.push(err318);
}
errors++;
}
}
if(data.smart_home_readings !== undefined){
let data143 = data.smart_home_readings;
if(Array.isArray(data143)){
const len17 = data143.length;
for(let i17=0; i17<len17; i17++){
let data144 = data143[i17];
if(data144 && typeof data144 == "object" && !Array.isArray(data144)){
if(data144.id === undefined){
const err319 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err319];
}
else {
vErrors.push(err319);
}
errors++;
}
if(data144.component_id === undefined){
const err320 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "component_id"},message:"must have required property '"+"component_id"+"'"};
if(vErrors === null){
vErrors = [err320];
}
else {
vErrors.push(err320);
}
errors++;
}
if(data144.source === undefined){
const err321 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err321];
}
else {
vErrors.push(err321);
}
errors++;
}
if(data144.metric === undefined){
const err322 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "metric"},message:"must have required property '"+"metric"+"'"};
if(vErrors === null){
vErrors = [err322];
}
else {
vErrors.push(err322);
}
errors++;
}
if(data144.value === undefined){
const err323 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err323];
}
else {
vErrors.push(err323);
}
errors++;
}
if(data144.unit === undefined){
const err324 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err324];
}
else {
vErrors.push(err324);
}
errors++;
}
if(data144.recorded_at === undefined){
const err325 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "recorded_at"},message:"must have required property '"+"recorded_at"+"'"};
if(vErrors === null){
vErrors = [err325];
}
else {
vErrors.push(err325);
}
errors++;
}
for(const key12 in data144){
if(!(((((((key12 === "id") || (key12 === "component_id")) || (key12 === "source")) || (key12 === "metric")) || (key12 === "value")) || (key12 === "unit")) || (key12 === "recorded_at"))){
const err326 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err326];
}
else {
vErrors.push(err326);
}
errors++;
}
}
if(data144.id !== undefined){
let data145 = data144.id;
if(typeof data145 === "string"){
if(!(formats0.test(data145))){
const err327 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/id",schemaPath:"#/properties/smart_home_readings/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err327];
}
else {
vErrors.push(err327);
}
errors++;
}
}
else {
const err328 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/id",schemaPath:"#/properties/smart_home_readings/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err328];
}
else {
vErrors.push(err328);
}
errors++;
}
}
if(data144.component_id !== undefined){
let data146 = data144.component_id;
if(typeof data146 === "string"){
if(!(formats0.test(data146))){
const err329 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/component_id",schemaPath:"#/properties/smart_home_readings/items/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err329];
}
else {
vErrors.push(err329);
}
errors++;
}
}
else {
const err330 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/component_id",schemaPath:"#/properties/smart_home_readings/items/properties/component_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err330];
}
else {
vErrors.push(err330);
}
errors++;
}
}
if(data144.source !== undefined){
let data147 = data144.source;
if(typeof data147 !== "string"){
const err331 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/source",schemaPath:"#/properties/smart_home_readings/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err331];
}
else {
vErrors.push(err331);
}
errors++;
}
if(!((((data147 === "homekit") || (data147 === "ecobee")) || (data147 === "nest")) || (data147 === "other"))){
const err332 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/source",schemaPath:"#/properties/smart_home_readings/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.smart_home_readings.items.properties.source.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err332];
}
else {
vErrors.push(err332);
}
errors++;
}
}
if(data144.metric !== undefined){
if(typeof data144.metric !== "string"){
const err333 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/metric",schemaPath:"#/properties/smart_home_readings/items/properties/metric/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err333];
}
else {
vErrors.push(err333);
}
errors++;
}
}
if(data144.value !== undefined){
let data149 = data144.value;
if(!((typeof data149 == "number") && (isFinite(data149)))){
const err334 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/value",schemaPath:"#/properties/smart_home_readings/items/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err334];
}
else {
vErrors.push(err334);
}
errors++;
}
}
if(data144.unit !== undefined){
if(typeof data144.unit !== "string"){
const err335 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/unit",schemaPath:"#/properties/smart_home_readings/items/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err335];
}
else {
vErrors.push(err335);
}
errors++;
}
}
if(data144.recorded_at !== undefined){
let data151 = data144.recorded_at;
if(typeof data151 === "string"){
if(!(formats4.validate(data151))){
const err336 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/recorded_at",schemaPath:"#/properties/smart_home_readings/items/properties/recorded_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err337 = {instancePath:instancePath+"/smart_home_readings/" + i17+"/recorded_at",schemaPath:"#/properties/smart_home_readings/items/properties/recorded_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err337];
}
else {
vErrors.push(err337);
}
errors++;
}
}
}
else {
const err338 = {instancePath:instancePath+"/smart_home_readings/" + i17,schemaPath:"#/properties/smart_home_readings/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err338];
}
else {
vErrors.push(err338);
}
errors++;
}
}
}
else {
const err339 = {instancePath:instancePath+"/smart_home_readings",schemaPath:"#/properties/smart_home_readings/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err339];
}
else {
vErrors.push(err339);
}
errors++;
}
}
if(data.utility_bills !== undefined){
let data152 = data.utility_bills;
if(Array.isArray(data152)){
const len18 = data152.length;
for(let i18=0; i18<len18; i18++){
let data153 = data152[i18];
if(data153 && typeof data153 == "object" && !Array.isArray(data153)){
if(data153.id === undefined){
const err340 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err340];
}
else {
vErrors.push(err340);
}
errors++;
}
if(data153.home_id === undefined){
const err341 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err341];
}
else {
vErrors.push(err341);
}
errors++;
}
if(data153.utility_type === undefined){
const err342 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "utility_type"},message:"must have required property '"+"utility_type"+"'"};
if(vErrors === null){
vErrors = [err342];
}
else {
vErrors.push(err342);
}
errors++;
}
if(data153.billing_period_start === undefined){
const err343 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "billing_period_start"},message:"must have required property '"+"billing_period_start"+"'"};
if(vErrors === null){
vErrors = [err343];
}
else {
vErrors.push(err343);
}
errors++;
}
if(data153.billing_period_end === undefined){
const err344 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "billing_period_end"},message:"must have required property '"+"billing_period_end"+"'"};
if(vErrors === null){
vErrors = [err344];
}
else {
vErrors.push(err344);
}
errors++;
}
if(data153.usage_amount === undefined){
const err345 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "usage_amount"},message:"must have required property '"+"usage_amount"+"'"};
if(vErrors === null){
vErrors = [err345];
}
else {
vErrors.push(err345);
}
errors++;
}
if(data153.usage_unit === undefined){
const err346 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "usage_unit"},message:"must have required property '"+"usage_unit"+"'"};
if(vErrors === null){
vErrors = [err346];
}
else {
vErrors.push(err346);
}
errors++;
}
if(data153.source === undefined){
const err347 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err347];
}
else {
vErrors.push(err347);
}
errors++;
}
for(const key13 in data153){
if(!(func1.call(schema31.properties.utility_bills.items.properties, key13))){
const err348 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err348];
}
else {
vErrors.push(err348);
}
errors++;
}
}
if(data153.id !== undefined){
let data154 = data153.id;
if(typeof data154 === "string"){
if(!(formats0.test(data154))){
const err349 = {instancePath:instancePath+"/utility_bills/" + i18+"/id",schemaPath:"#/properties/utility_bills/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err349];
}
else {
vErrors.push(err349);
}
errors++;
}
}
else {
const err350 = {instancePath:instancePath+"/utility_bills/" + i18+"/id",schemaPath:"#/properties/utility_bills/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err350];
}
else {
vErrors.push(err350);
}
errors++;
}
}
if(data153.home_id !== undefined){
let data155 = data153.home_id;
if(typeof data155 === "string"){
if(!(formats0.test(data155))){
const err351 = {instancePath:instancePath+"/utility_bills/" + i18+"/home_id",schemaPath:"#/properties/utility_bills/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err351];
}
else {
vErrors.push(err351);
}
errors++;
}
}
else {
const err352 = {instancePath:instancePath+"/utility_bills/" + i18+"/home_id",schemaPath:"#/properties/utility_bills/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err352];
}
else {
vErrors.push(err352);
}
errors++;
}
}
if(data153.utility_type !== undefined){
let data156 = data153.utility_type;
if(typeof data156 !== "string"){
const err353 = {instancePath:instancePath+"/utility_bills/" + i18+"/utility_type",schemaPath:"#/properties/utility_bills/items/properties/utility_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err353];
}
else {
vErrors.push(err353);
}
errors++;
}
if(!(((data156 === "gas") || (data156 === "electric")) || (data156 === "water"))){
const err354 = {instancePath:instancePath+"/utility_bills/" + i18+"/utility_type",schemaPath:"#/properties/utility_bills/items/properties/utility_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.utility_bills.items.properties.utility_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err354];
}
else {
vErrors.push(err354);
}
errors++;
}
}
if(data153.billing_period_start !== undefined){
let data157 = data153.billing_period_start;
if(typeof data157 === "string"){
if(!(formats38.validate(data157))){
const err355 = {instancePath:instancePath+"/utility_bills/" + i18+"/billing_period_start",schemaPath:"#/properties/utility_bills/items/properties/billing_period_start/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err355];
}
else {
vErrors.push(err355);
}
errors++;
}
}
else {
const err356 = {instancePath:instancePath+"/utility_bills/" + i18+"/billing_period_start",schemaPath:"#/properties/utility_bills/items/properties/billing_period_start/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err356];
}
else {
vErrors.push(err356);
}
errors++;
}
}
if(data153.billing_period_end !== undefined){
let data158 = data153.billing_period_end;
if(typeof data158 === "string"){
if(!(formats38.validate(data158))){
const err357 = {instancePath:instancePath+"/utility_bills/" + i18+"/billing_period_end",schemaPath:"#/properties/utility_bills/items/properties/billing_period_end/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err357];
}
else {
vErrors.push(err357);
}
errors++;
}
}
else {
const err358 = {instancePath:instancePath+"/utility_bills/" + i18+"/billing_period_end",schemaPath:"#/properties/utility_bills/items/properties/billing_period_end/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err358];
}
else {
vErrors.push(err358);
}
errors++;
}
}
if(data153.usage_amount !== undefined){
let data159 = data153.usage_amount;
if(!((typeof data159 == "number") && (isFinite(data159)))){
const err359 = {instancePath:instancePath+"/utility_bills/" + i18+"/usage_amount",schemaPath:"#/properties/utility_bills/items/properties/usage_amount/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err359];
}
else {
vErrors.push(err359);
}
errors++;
}
}
if(data153.usage_unit !== undefined){
if(typeof data153.usage_unit !== "string"){
const err360 = {instancePath:instancePath+"/utility_bills/" + i18+"/usage_unit",schemaPath:"#/properties/utility_bills/items/properties/usage_unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err360];
}
else {
vErrors.push(err360);
}
errors++;
}
}
if(data153.cost_cents !== undefined){
let data161 = data153.cost_cents;
if((!(((typeof data161 == "number") && (!(data161 % 1) && !isNaN(data161))) && (isFinite(data161)))) && (data161 !== null)){
const err361 = {instancePath:instancePath+"/utility_bills/" + i18+"/cost_cents",schemaPath:"#/properties/utility_bills/items/properties/cost_cents/type",keyword:"type",params:{type: schema31.properties.utility_bills.items.properties.cost_cents.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err361];
}
else {
vErrors.push(err361);
}
errors++;
}
}
if(data153.source !== undefined){
let data162 = data153.source;
if(typeof data162 !== "string"){
const err362 = {instancePath:instancePath+"/utility_bills/" + i18+"/source",schemaPath:"#/properties/utility_bills/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err362];
}
else {
vErrors.push(err362);
}
errors++;
}
if(!((data162 === "manual") || (data162 === "import"))){
const err363 = {instancePath:instancePath+"/utility_bills/" + i18+"/source",schemaPath:"#/properties/utility_bills/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.utility_bills.items.properties.source.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err363];
}
else {
vErrors.push(err363);
}
errors++;
}
}
if(data153.attachment_id !== undefined){
let data163 = data153.attachment_id;
if((typeof data163 !== "string") && (data163 !== null)){
const err364 = {instancePath:instancePath+"/utility_bills/" + i18+"/attachment_id",schemaPath:"#/properties/utility_bills/items/properties/attachment_id/type",keyword:"type",params:{type: schema31.properties.utility_bills.items.properties.attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err364];
}
else {
vErrors.push(err364);
}
errors++;
}
if(typeof data163 === "string"){
if(!(formats0.test(data163))){
const err365 = {instancePath:instancePath+"/utility_bills/" + i18+"/attachment_id",schemaPath:"#/properties/utility_bills/items/properties/attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err365];
}
else {
vErrors.push(err365);
}
errors++;
}
}
}
}
else {
const err366 = {instancePath:instancePath+"/utility_bills/" + i18,schemaPath:"#/properties/utility_bills/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err366];
}
else {
vErrors.push(err366);
}
errors++;
}
}
}
else {
const err367 = {instancePath:instancePath+"/utility_bills",schemaPath:"#/properties/utility_bills/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err367];
}
else {
vErrors.push(err367);
}
errors++;
}
}
}
else {
const err368 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err368];
}
else {
vErrors.push(err368);
}
errors++;
}
validate20.errors = vErrors;
return errors === 0;
}
validate20.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};
