// Generated from spec/schema. Do not edit directly.
"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema31 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://homebody.app/schema/home-record.schema.json","title":"HomeRecord","description":"Root document for a Home Record export. Flat, database-table-mirroring shape - one home, plus arrays of every other entity, each keyed by an id and its parent foreign keys rather than deep nesting.","type":"object","additionalProperties":false,"required":["schema_version","home","levels","rooms","plan_elements","systems","components","events","attachments","smart_home_readings","utility_bills"],"properties":{"schema_version":{"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$","enum":["0.1.0","0.1.1","0.2.0","0.3.0"],"description":"Semver of the Home Record spec this document conforms to, e.g. 0.2.0. Downstream import validation rejects unknown versions rather than duck-typing."},"home":{"title":"Home","type":"object","additionalProperties":false,"required":["id","owner_user_id","name","address","created_at"],"properties":{"id":{"type":"string","format":"uuid"},"owner_user_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"address":{"type":"string"},"parcel_id":{"type":["string","null"]},"year_built":{"type":["integer","null"]},"sq_ft":{"type":["number","null"]},"beds":{"type":["integer","null"]},"baths":{"type":["number","null"]},"lot_size_m2":{"type":["number","null"]},"created_at":{"type":"string","format":"date-time"}}},"levels":{"type":"array","items":{"title":"Level","type":"object","additionalProperties":false,"required":["id","home_id","name","sort_order","elevation_offset_m","scale_confidence"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"sort_order":{"type":"integer"},"elevation_offset_m":{"type":"number"},"scale_confidence":{"type":"string","enum":["measured","estimated"]},"import_attachment_id":{"type":["string","null"],"format":"uuid"},"import_origin_m":{"type":["array","null"],"items":{"type":"number"},"minItems":2,"maxItems":2},"import_scale_m_per_px":{"type":["number","null"]},"import_pixel_width":{"type":["integer","null"]},"import_pixel_height":{"type":["integer","null"]}}},"default":[]},"rooms":{"type":"array","items":{"title":"Room","type":"object","additionalProperties":false,"required":["id","level_id","name","room_type","geometry"],"properties":{"id":{"type":"string","format":"uuid"},"level_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"room_type":{"type":"string","enum":["bedroom","bathroom","kitchen","living_room","dining_room","garage","basement","attic","hallway","closet","laundry","office","other"]},"geometry":{"allOf":[{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},{"type":"object","properties":{"type":{"const":"polygon"}}}]},"area_computed_m2":{"type":["number","null"]}}},"default":[]},"plan_elements":{"type":"array","items":{"title":"PlanElement","type":"object","additionalProperties":false,"required":["id","level_id","kind","geometry"],"properties":{"id":{"type":"string","format":"uuid"},"level_id":{"type":"string","format":"uuid"},"kind":{"type":"string","enum":["wall","door","window","opening"]},"geometry":{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},"host_element_id":{"type":["string","null"],"format":"uuid"}}},"default":[]},"systems":{"type":"array","items":{"title":"System","type":"object","additionalProperties":false,"required":["id","home_id","category","name"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"category":{"type":"string","enum":["plumbing","electrical","hvac","roof_structure","appliances_and_water_heater","exterior_and_site","low_voltage_and_smart_home"]},"name":{"type":"string"},"notes":{"type":["string","null"]}}},"default":[]},"components":{"type":"array","items":{"title":"Component","type":"object","additionalProperties":false,"required":["id","system_id","name","component_type","condition","room_ids","custom_fields"],"properties":{"id":{"type":"string","format":"uuid"},"system_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"component_type":{"type":"string","enum":["water_heater","hvac_furnace","hvac_ac_unit","electrical_panel","outlet","light_fixture","plumbing_fixture","gutter","downspout","smoke_detector","thermostat","camera","network_router","appliance_generic","other"]},"make":{"type":["string","null"]},"model":{"type":["string","null"]},"serial_number":{"type":["string","null"]},"install_date":{"type":["string","null"],"format":"date"},"warranty_start":{"type":["string","null"],"format":"date"},"warranty_length_months":{"type":["integer","null"]},"manual_attachment_id":{"type":["string","null"],"format":"uuid"},"service_interval_days":{"type":["integer","null"]},"last_serviced_at":{"type":["string","null"],"format":"date"},"condition":{"title":"Condition","description":"Shared condition scale used by Component.condition and Event.condition_after, so the two cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for not-yet-assessed.","type":"string","enum":["good","fair","needs_attention","needs_replacement","unknown"]},"level_id":{"type":["string","null"],"format":"uuid"},"room_ids":{"type":"array","items":{"type":"string","format":"uuid"},"default":[]},"geometry":{"anyOf":[{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},{"type":"null"}],"default":null},"notes":{"type":["string","null"]},"linked_component_id":{"type":["string","null"],"format":"uuid"},"custom_fields":{"type":"object","additionalProperties":true,"default":{}}}},"default":[]},"events":{"type":"array","items":{"title":"Event","type":"object","additionalProperties":false,"required":["id","home_id","event_type","occurred_at","attachment_ids"],"anyOf":[{"required":["system_id"],"properties":{"system_id":{"type":"string","format":"uuid"}}},{"required":["component_id"],"properties":{"component_id":{"type":"string","format":"uuid"}}}],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"system_id":{"type":["string","null"],"format":"uuid"},"component_id":{"type":["string","null"],"format":"uuid"},"event_type":{"type":"string","enum":["inspection","service","repair","replacement","reading","note"]},"occurred_at":{"type":"string","format":"date-time"},"performed_by":{"type":["string","null"]},"cost_cents":{"type":["integer","null"]},"notes":{"type":["string","null"]},"condition_after":{"anyOf":[{"title":"Condition","description":"Shared condition scale used by Component.condition and Event.condition_after, so the two cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for not-yet-assessed.","type":"string","enum":["good","fair","needs_attention","needs_replacement","unknown"]},{"type":"null"}],"default":null},"reading_value":{"type":["number","null"]},"reading_unit":{"type":["string","null"]},"attachment_ids":{"type":"array","items":{"type":"string","format":"uuid"},"default":[]}}},"default":[]},"attachments":{"type":"array","items":{"title":"Attachment","type":"object","additionalProperties":false,"required":["id","home_id","kind","storage_path","mime_type","file_size_bytes"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"kind":{"type":"string","enum":["photo","receipt","manual_pdf","usdz_mesh","floor_plan_source"]},"storage_path":{"type":"string","pattern":"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$","description":"Canonical owner-scoped Storage key: {owner_user_id}/homes/{home_id}/attachments/{attachment_id}.ext."},"mime_type":{"type":"string"},"file_size_bytes":{"type":"integer"},"captured_at":{"type":["string","null"],"format":"date-time"},"linked_event_id":{"type":["string","null"],"format":"uuid"},"linked_component_id":{"type":["string","null"],"format":"uuid"}}},"default":[]},"smart_home_readings":{"type":"array","items":{"title":"SmartHomeReading","type":"object","additionalProperties":false,"required":["id","component_id","source","metric","value","unit","recorded_at"],"properties":{"id":{"type":"string","format":"uuid"},"component_id":{"type":"string","format":"uuid"},"source":{"type":"string","enum":["homekit","ecobee","nest","other"]},"metric":{"type":"string"},"value":{"type":"number"},"unit":{"type":"string"},"recorded_at":{"type":"string","format":"date-time"}}},"default":[]},"utility_bills":{"type":"array","items":{"title":"UtilityBill","type":"object","additionalProperties":false,"required":["id","home_id","utility_type","billing_period_start","billing_period_end","usage_amount","usage_unit","source"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"utility_type":{"type":"string","enum":["gas","electric","water"]},"billing_period_start":{"type":"string","format":"date"},"billing_period_end":{"type":"string","format":"date"},"usage_amount":{"type":"number"},"usage_unit":{"type":"string"},"cost_cents":{"type":["integer","null"]},"source":{"type":"string","enum":["manual","import"]},"attachment_id":{"type":["string","null"],"format":"uuid"}}},"default":[]}}};
const func1 = Object.prototype.hasOwnProperty;
const pattern4 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
const pattern5 = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$", "u");
const formats0 = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const formats4 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const formats30 = require("ajv-formats/dist/formats").fullFormats.date;

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
if(!((((data0 === "0.1.0") || (data0 === "0.1.1")) || (data0 === "0.2.0")) || (data0 === "0.3.0"))){
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
}
else {
const err61 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
}
else {
const err62 = {instancePath:instancePath+"/levels",schemaPath:"#/properties/levels/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data.rooms !== undefined){
let data27 = data.rooms;
if(Array.isArray(data27)){
const len2 = data27.length;
for(let i2=0; i2<len2; i2++){
let data28 = data27[i2];
if(data28 && typeof data28 == "object" && !Array.isArray(data28)){
if(data28.id === undefined){
const err63 = {instancePath:instancePath+"/rooms/" + i2,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data28.level_id === undefined){
const err64 = {instancePath:instancePath+"/rooms/" + i2,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "level_id"},message:"must have required property '"+"level_id"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data28.name === undefined){
const err65 = {instancePath:instancePath+"/rooms/" + i2,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(data28.room_type === undefined){
const err66 = {instancePath:instancePath+"/rooms/" + i2,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "room_type"},message:"must have required property '"+"room_type"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data28.geometry === undefined){
const err67 = {instancePath:instancePath+"/rooms/" + i2,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
for(const key3 in data28){
if(!((((((key3 === "id") || (key3 === "level_id")) || (key3 === "name")) || (key3 === "room_type")) || (key3 === "geometry")) || (key3 === "area_computed_m2"))){
const err68 = {instancePath:instancePath+"/rooms/" + i2,schemaPath:"#/properties/rooms/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data28.id !== undefined){
let data29 = data28.id;
if(typeof data29 === "string"){
if(!(formats0.test(data29))){
const err69 = {instancePath:instancePath+"/rooms/" + i2+"/id",schemaPath:"#/properties/rooms/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
else {
const err70 = {instancePath:instancePath+"/rooms/" + i2+"/id",schemaPath:"#/properties/rooms/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
if(data28.level_id !== undefined){
let data30 = data28.level_id;
if(typeof data30 === "string"){
if(!(formats0.test(data30))){
const err71 = {instancePath:instancePath+"/rooms/" + i2+"/level_id",schemaPath:"#/properties/rooms/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
else {
const err72 = {instancePath:instancePath+"/rooms/" + i2+"/level_id",schemaPath:"#/properties/rooms/items/properties/level_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
if(data28.name !== undefined){
if(typeof data28.name !== "string"){
const err73 = {instancePath:instancePath+"/rooms/" + i2+"/name",schemaPath:"#/properties/rooms/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
if(data28.room_type !== undefined){
let data32 = data28.room_type;
if(typeof data32 !== "string"){
const err74 = {instancePath:instancePath+"/rooms/" + i2+"/room_type",schemaPath:"#/properties/rooms/items/properties/room_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
if(!(((((((((((((data32 === "bedroom") || (data32 === "bathroom")) || (data32 === "kitchen")) || (data32 === "living_room")) || (data32 === "dining_room")) || (data32 === "garage")) || (data32 === "basement")) || (data32 === "attic")) || (data32 === "hallway")) || (data32 === "closet")) || (data32 === "laundry")) || (data32 === "office")) || (data32 === "other"))){
const err75 = {instancePath:instancePath+"/rooms/" + i2+"/room_type",schemaPath:"#/properties/rooms/items/properties/room_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.rooms.items.properties.room_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
if(data28.geometry !== undefined){
let data33 = data28.geometry;
const _errs75 = errors;
let valid12 = true;
const _errs76 = errors;
if(data33 && typeof data33 == "object" && !Array.isArray(data33)){
let missing0;
if((data33.type === undefined) && (missing0 = "type")){
const err76 = {};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
else {
if(data33.type !== undefined){
if("point" !== data33.type){
const err77 = {};
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
var _valid0 = _errs76 === errors;
errors = _errs75;
if(vErrors !== null){
if(_errs75){
vErrors.length = _errs75;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs78 = errors;
if(data33 && typeof data33 == "object" && !Array.isArray(data33)){
if(data33.coordinates !== undefined){
let data35 = data33.coordinates;
if(Array.isArray(data35)){
if(data35.length > 1){
const err78 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
if(data35.length < 1){
const err79 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
else {
const err80 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid0 = _errs78 === errors;
valid12 = _valid0;
if(valid12){
var props0 = {};
props0.coordinates = true;
props0.type = true;
}
}
if(!valid12){
const err81 = {instancePath:instancePath+"/rooms/" + i2+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
const _errs82 = errors;
let valid15 = true;
const _errs83 = errors;
if(data33 && typeof data33 == "object" && !Array.isArray(data33)){
let missing1;
if((data33.type === undefined) && (missing1 = "type")){
const err82 = {};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
else {
if(data33.type !== undefined){
if("polyline" !== data33.type){
const err83 = {};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
}
}
var _valid1 = _errs83 === errors;
errors = _errs82;
if(vErrors !== null){
if(_errs82){
vErrors.length = _errs82;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs85 = errors;
if(data33 && typeof data33 == "object" && !Array.isArray(data33)){
if(data33.coordinates !== undefined){
let data37 = data33.coordinates;
if(Array.isArray(data37)){
if(data37.length < 2){
const err84 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
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
const err85 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
}
var _valid1 = _errs85 === errors;
valid15 = _valid1;
if(valid15){
var props1 = {};
props1.coordinates = true;
props1.type = true;
}
}
if(!valid15){
const err86 = {instancePath:instancePath+"/rooms/" + i2+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
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
const _errs89 = errors;
let valid18 = true;
const _errs90 = errors;
if(data33 && typeof data33 == "object" && !Array.isArray(data33)){
let missing2;
if((data33.type === undefined) && (missing2 = "type")){
const err87 = {};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
else {
if(data33.type !== undefined){
if("polygon" !== data33.type){
const err88 = {};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
}
}
var _valid2 = _errs90 === errors;
errors = _errs89;
if(vErrors !== null){
if(_errs89){
vErrors.length = _errs89;
}
else {
vErrors = null;
}
}
if(_valid2){
const _errs92 = errors;
if(data33 && typeof data33 == "object" && !Array.isArray(data33)){
if(data33.coordinates !== undefined){
let data39 = data33.coordinates;
if(Array.isArray(data39)){
if(data39.length < 3){
const err89 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
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
const err90 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid2 = _errs92 === errors;
valid18 = _valid2;
if(valid18){
var props2 = {};
props2.coordinates = true;
props2.type = true;
}
}
if(!valid18){
const err91 = {instancePath:instancePath+"/rooms/" + i2+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
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
if(data33 && typeof data33 == "object" && !Array.isArray(data33)){
if(data33.type === undefined){
const err92 = {instancePath:instancePath+"/rooms/" + i2+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if(data33.coordinates === undefined){
const err93 = {instancePath:instancePath+"/rooms/" + i2+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
for(const key4 in data33){
if(!((key4 === "type") || (key4 === "coordinates"))){
const err94 = {instancePath:instancePath+"/rooms/" + i2+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
if(data33.type !== undefined){
let data40 = data33.type;
if(typeof data40 !== "string"){
const err95 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
if(!(((data40 === "point") || (data40 === "polyline")) || (data40 === "polygon"))){
const err96 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.rooms.items.properties.geometry.allOf[0].properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
if(data33.coordinates !== undefined){
let data41 = data33.coordinates;
if(Array.isArray(data41)){
const len3 = data41.length;
for(let i3=0; i3<len3; i3++){
let data42 = data41[i3];
if(Array.isArray(data42)){
if(data42.length > 2){
const err97 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates/" + i3,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
if(data42.length < 2){
const err98 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates/" + i3,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
const len4 = data42.length;
for(let i4=0; i4<len4; i4++){
let data43 = data42[i4];
if(!((typeof data43 == "number") && (isFinite(data43)))){
const err99 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates/" + i3+"/" + i4,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
}
else {
const err100 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates/" + i3,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
else {
const err101 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
else {
const err102 = {instancePath:instancePath+"/rooms/" + i2+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
if(data33 && typeof data33 == "object" && !Array.isArray(data33)){
if(data33.type !== undefined){
if("polygon" !== data33.type){
const err103 = {instancePath:instancePath+"/rooms/" + i2+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/1/properties/type/const",keyword:"const",params:{allowedValue: "polygon"},message:"must be equal to constant"};
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
else {
const err104 = {instancePath:instancePath+"/rooms/" + i2+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
if(data28.area_computed_m2 !== undefined){
let data45 = data28.area_computed_m2;
if((!((typeof data45 == "number") && (isFinite(data45)))) && (data45 !== null)){
const err105 = {instancePath:instancePath+"/rooms/" + i2+"/area_computed_m2",schemaPath:"#/properties/rooms/items/properties/area_computed_m2/type",keyword:"type",params:{type: schema31.properties.rooms.items.properties.area_computed_m2.type},message:"must be number,null"};
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
else {
const err106 = {instancePath:instancePath+"/rooms/" + i2,schemaPath:"#/properties/rooms/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
}
else {
const err107 = {instancePath:instancePath+"/rooms",schemaPath:"#/properties/rooms/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
if(data.plan_elements !== undefined){
let data46 = data.plan_elements;
if(Array.isArray(data46)){
const len5 = data46.length;
for(let i5=0; i5<len5; i5++){
let data47 = data46[i5];
if(data47 && typeof data47 == "object" && !Array.isArray(data47)){
if(data47.id === undefined){
const err108 = {instancePath:instancePath+"/plan_elements/" + i5,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(data47.level_id === undefined){
const err109 = {instancePath:instancePath+"/plan_elements/" + i5,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "level_id"},message:"must have required property '"+"level_id"+"'"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
if(data47.kind === undefined){
const err110 = {instancePath:instancePath+"/plan_elements/" + i5,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data47.geometry === undefined){
const err111 = {instancePath:instancePath+"/plan_elements/" + i5,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
for(const key5 in data47){
if(!(((((key5 === "id") || (key5 === "level_id")) || (key5 === "kind")) || (key5 === "geometry")) || (key5 === "host_element_id"))){
const err112 = {instancePath:instancePath+"/plan_elements/" + i5,schemaPath:"#/properties/plan_elements/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
if(data47.id !== undefined){
let data48 = data47.id;
if(typeof data48 === "string"){
if(!(formats0.test(data48))){
const err113 = {instancePath:instancePath+"/plan_elements/" + i5+"/id",schemaPath:"#/properties/plan_elements/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
else {
const err114 = {instancePath:instancePath+"/plan_elements/" + i5+"/id",schemaPath:"#/properties/plan_elements/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
if(data47.level_id !== undefined){
let data49 = data47.level_id;
if(typeof data49 === "string"){
if(!(formats0.test(data49))){
const err115 = {instancePath:instancePath+"/plan_elements/" + i5+"/level_id",schemaPath:"#/properties/plan_elements/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
else {
const err116 = {instancePath:instancePath+"/plan_elements/" + i5+"/level_id",schemaPath:"#/properties/plan_elements/items/properties/level_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data47.kind !== undefined){
let data50 = data47.kind;
if(typeof data50 !== "string"){
const err117 = {instancePath:instancePath+"/plan_elements/" + i5+"/kind",schemaPath:"#/properties/plan_elements/items/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
if(!((((data50 === "wall") || (data50 === "door")) || (data50 === "window")) || (data50 === "opening"))){
const err118 = {instancePath:instancePath+"/plan_elements/" + i5+"/kind",schemaPath:"#/properties/plan_elements/items/properties/kind/enum",keyword:"enum",params:{allowedValues: schema31.properties.plan_elements.items.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
if(data47.geometry !== undefined){
let data51 = data47.geometry;
const _errs123 = errors;
let valid31 = true;
const _errs124 = errors;
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
let missing3;
if((data51.type === undefined) && (missing3 = "type")){
const err119 = {};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
else {
if(data51.type !== undefined){
if("point" !== data51.type){
const err120 = {};
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
}
var _valid3 = _errs124 === errors;
errors = _errs123;
if(vErrors !== null){
if(_errs123){
vErrors.length = _errs123;
}
else {
vErrors = null;
}
}
if(_valid3){
const _errs126 = errors;
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
if(data51.coordinates !== undefined){
let data53 = data51.coordinates;
if(Array.isArray(data53)){
if(data53.length > 1){
const err121 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
if(data53.length < 1){
const err122 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
else {
const err123 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid3 = _errs126 === errors;
valid31 = _valid3;
if(valid31){
var props3 = {};
props3.coordinates = true;
props3.type = true;
}
}
if(!valid31){
const err124 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
const _errs130 = errors;
let valid34 = true;
const _errs131 = errors;
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
let missing4;
if((data51.type === undefined) && (missing4 = "type")){
const err125 = {};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
else {
if(data51.type !== undefined){
if("polyline" !== data51.type){
const err126 = {};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
}
}
var _valid4 = _errs131 === errors;
errors = _errs130;
if(vErrors !== null){
if(_errs130){
vErrors.length = _errs130;
}
else {
vErrors = null;
}
}
if(_valid4){
const _errs133 = errors;
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
if(data51.coordinates !== undefined){
let data55 = data51.coordinates;
if(Array.isArray(data55)){
if(data55.length < 2){
const err127 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
else {
const err128 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid4 = _errs133 === errors;
valid34 = _valid4;
if(valid34){
var props4 = {};
props4.coordinates = true;
props4.type = true;
}
}
if(!valid34){
const err129 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
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
const _errs137 = errors;
let valid37 = true;
const _errs138 = errors;
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
let missing5;
if((data51.type === undefined) && (missing5 = "type")){
const err130 = {};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
else {
if(data51.type !== undefined){
if("polygon" !== data51.type){
const err131 = {};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
}
}
}
var _valid5 = _errs138 === errors;
errors = _errs137;
if(vErrors !== null){
if(_errs137){
vErrors.length = _errs137;
}
else {
vErrors = null;
}
}
if(_valid5){
const _errs140 = errors;
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
if(data51.coordinates !== undefined){
let data57 = data51.coordinates;
if(Array.isArray(data57)){
if(data57.length < 3){
const err132 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
}
else {
const err133 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
}
var _valid5 = _errs140 === errors;
valid37 = _valid5;
if(valid37){
var props5 = {};
props5.coordinates = true;
props5.type = true;
}
}
if(!valid37){
const err134 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
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
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
if(data51.type === undefined){
const err135 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
if(data51.coordinates === undefined){
const err136 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
for(const key6 in data51){
if(!((key6 === "type") || (key6 === "coordinates"))){
const err137 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
if(data51.type !== undefined){
let data58 = data51.type;
if(typeof data58 !== "string"){
const err138 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/type",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
if(!(((data58 === "point") || (data58 === "polyline")) || (data58 === "polygon"))){
const err139 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/type",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.plan_elements.items.properties.geometry.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
if(data51.coordinates !== undefined){
let data59 = data51.coordinates;
if(Array.isArray(data59)){
const len6 = data59.length;
for(let i6=0; i6<len6; i6++){
let data60 = data59[i6];
if(Array.isArray(data60)){
if(data60.length > 2){
const err140 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates/" + i6,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
if(data60.length < 2){
const err141 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates/" + i6,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
const len7 = data60.length;
for(let i7=0; i7<len7; i7++){
let data61 = data60[i7];
if(!((typeof data61 == "number") && (isFinite(data61)))){
const err142 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates/" + i6+"/" + i7,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
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
else {
const err143 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates/" + i6,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
else {
const err144 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
}
else {
const err145 = {instancePath:instancePath+"/plan_elements/" + i5+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data47.host_element_id !== undefined){
let data62 = data47.host_element_id;
if((typeof data62 !== "string") && (data62 !== null)){
const err146 = {instancePath:instancePath+"/plan_elements/" + i5+"/host_element_id",schemaPath:"#/properties/plan_elements/items/properties/host_element_id/type",keyword:"type",params:{type: schema31.properties.plan_elements.items.properties.host_element_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
if(typeof data62 === "string"){
if(!(formats0.test(data62))){
const err147 = {instancePath:instancePath+"/plan_elements/" + i5+"/host_element_id",schemaPath:"#/properties/plan_elements/items/properties/host_element_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
}
}
else {
const err148 = {instancePath:instancePath+"/plan_elements/" + i5,schemaPath:"#/properties/plan_elements/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
else {
const err149 = {instancePath:instancePath+"/plan_elements",schemaPath:"#/properties/plan_elements/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
if(data.systems !== undefined){
let data63 = data.systems;
if(Array.isArray(data63)){
const len8 = data63.length;
for(let i8=0; i8<len8; i8++){
let data64 = data63[i8];
if(data64 && typeof data64 == "object" && !Array.isArray(data64)){
if(data64.id === undefined){
const err150 = {instancePath:instancePath+"/systems/" + i8,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
if(data64.home_id === undefined){
const err151 = {instancePath:instancePath+"/systems/" + i8,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
if(data64.category === undefined){
const err152 = {instancePath:instancePath+"/systems/" + i8,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "category"},message:"must have required property '"+"category"+"'"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
if(data64.name === undefined){
const err153 = {instancePath:instancePath+"/systems/" + i8,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
for(const key7 in data64){
if(!(((((key7 === "id") || (key7 === "home_id")) || (key7 === "category")) || (key7 === "name")) || (key7 === "notes"))){
const err154 = {instancePath:instancePath+"/systems/" + i8,schemaPath:"#/properties/systems/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
}
if(data64.id !== undefined){
let data65 = data64.id;
if(typeof data65 === "string"){
if(!(formats0.test(data65))){
const err155 = {instancePath:instancePath+"/systems/" + i8+"/id",schemaPath:"#/properties/systems/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
}
else {
const err156 = {instancePath:instancePath+"/systems/" + i8+"/id",schemaPath:"#/properties/systems/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
}
if(data64.home_id !== undefined){
let data66 = data64.home_id;
if(typeof data66 === "string"){
if(!(formats0.test(data66))){
const err157 = {instancePath:instancePath+"/systems/" + i8+"/home_id",schemaPath:"#/properties/systems/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
else {
const err158 = {instancePath:instancePath+"/systems/" + i8+"/home_id",schemaPath:"#/properties/systems/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
if(data64.category !== undefined){
let data67 = data64.category;
if(typeof data67 !== "string"){
const err159 = {instancePath:instancePath+"/systems/" + i8+"/category",schemaPath:"#/properties/systems/items/properties/category/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
if(!(((((((data67 === "plumbing") || (data67 === "electrical")) || (data67 === "hvac")) || (data67 === "roof_structure")) || (data67 === "appliances_and_water_heater")) || (data67 === "exterior_and_site")) || (data67 === "low_voltage_and_smart_home"))){
const err160 = {instancePath:instancePath+"/systems/" + i8+"/category",schemaPath:"#/properties/systems/items/properties/category/enum",keyword:"enum",params:{allowedValues: schema31.properties.systems.items.properties.category.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
if(data64.name !== undefined){
if(typeof data64.name !== "string"){
const err161 = {instancePath:instancePath+"/systems/" + i8+"/name",schemaPath:"#/properties/systems/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
if(data64.notes !== undefined){
let data69 = data64.notes;
if((typeof data69 !== "string") && (data69 !== null)){
const err162 = {instancePath:instancePath+"/systems/" + i8+"/notes",schemaPath:"#/properties/systems/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.systems.items.properties.notes.type},message:"must be string,null"};
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
else {
const err163 = {instancePath:instancePath+"/systems/" + i8,schemaPath:"#/properties/systems/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
}
else {
const err164 = {instancePath:instancePath+"/systems",schemaPath:"#/properties/systems/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data.components !== undefined){
let data70 = data.components;
if(Array.isArray(data70)){
const len9 = data70.length;
for(let i9=0; i9<len9; i9++){
let data71 = data70[i9];
if(data71 && typeof data71 == "object" && !Array.isArray(data71)){
if(data71.id === undefined){
const err165 = {instancePath:instancePath+"/components/" + i9,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
if(data71.system_id === undefined){
const err166 = {instancePath:instancePath+"/components/" + i9,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "system_id"},message:"must have required property '"+"system_id"+"'"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
if(data71.name === undefined){
const err167 = {instancePath:instancePath+"/components/" + i9,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
if(data71.component_type === undefined){
const err168 = {instancePath:instancePath+"/components/" + i9,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "component_type"},message:"must have required property '"+"component_type"+"'"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
if(data71.condition === undefined){
const err169 = {instancePath:instancePath+"/components/" + i9,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "condition"},message:"must have required property '"+"condition"+"'"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if(data71.room_ids === undefined){
const err170 = {instancePath:instancePath+"/components/" + i9,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "room_ids"},message:"must have required property '"+"room_ids"+"'"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
if(data71.custom_fields === undefined){
const err171 = {instancePath:instancePath+"/components/" + i9,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "custom_fields"},message:"must have required property '"+"custom_fields"+"'"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
for(const key8 in data71){
if(!(func1.call(schema31.properties.components.items.properties, key8))){
const err172 = {instancePath:instancePath+"/components/" + i9,schemaPath:"#/properties/components/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
}
if(data71.id !== undefined){
let data72 = data71.id;
if(typeof data72 === "string"){
if(!(formats0.test(data72))){
const err173 = {instancePath:instancePath+"/components/" + i9+"/id",schemaPath:"#/properties/components/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
}
else {
const err174 = {instancePath:instancePath+"/components/" + i9+"/id",schemaPath:"#/properties/components/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
}
if(data71.system_id !== undefined){
let data73 = data71.system_id;
if(typeof data73 === "string"){
if(!(formats0.test(data73))){
const err175 = {instancePath:instancePath+"/components/" + i9+"/system_id",schemaPath:"#/properties/components/items/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
}
else {
const err176 = {instancePath:instancePath+"/components/" + i9+"/system_id",schemaPath:"#/properties/components/items/properties/system_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
}
if(data71.name !== undefined){
if(typeof data71.name !== "string"){
const err177 = {instancePath:instancePath+"/components/" + i9+"/name",schemaPath:"#/properties/components/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
}
if(data71.component_type !== undefined){
let data75 = data71.component_type;
if(typeof data75 !== "string"){
const err178 = {instancePath:instancePath+"/components/" + i9+"/component_type",schemaPath:"#/properties/components/items/properties/component_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
if(!(((((((((((((((data75 === "water_heater") || (data75 === "hvac_furnace")) || (data75 === "hvac_ac_unit")) || (data75 === "electrical_panel")) || (data75 === "outlet")) || (data75 === "light_fixture")) || (data75 === "plumbing_fixture")) || (data75 === "gutter")) || (data75 === "downspout")) || (data75 === "smoke_detector")) || (data75 === "thermostat")) || (data75 === "camera")) || (data75 === "network_router")) || (data75 === "appliance_generic")) || (data75 === "other"))){
const err179 = {instancePath:instancePath+"/components/" + i9+"/component_type",schemaPath:"#/properties/components/items/properties/component_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.component_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
}
if(data71.make !== undefined){
let data76 = data71.make;
if((typeof data76 !== "string") && (data76 !== null)){
const err180 = {instancePath:instancePath+"/components/" + i9+"/make",schemaPath:"#/properties/components/items/properties/make/type",keyword:"type",params:{type: schema31.properties.components.items.properties.make.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
}
if(data71.model !== undefined){
let data77 = data71.model;
if((typeof data77 !== "string") && (data77 !== null)){
const err181 = {instancePath:instancePath+"/components/" + i9+"/model",schemaPath:"#/properties/components/items/properties/model/type",keyword:"type",params:{type: schema31.properties.components.items.properties.model.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
}
if(data71.serial_number !== undefined){
let data78 = data71.serial_number;
if((typeof data78 !== "string") && (data78 !== null)){
const err182 = {instancePath:instancePath+"/components/" + i9+"/serial_number",schemaPath:"#/properties/components/items/properties/serial_number/type",keyword:"type",params:{type: schema31.properties.components.items.properties.serial_number.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
}
if(data71.install_date !== undefined){
let data79 = data71.install_date;
if((typeof data79 !== "string") && (data79 !== null)){
const err183 = {instancePath:instancePath+"/components/" + i9+"/install_date",schemaPath:"#/properties/components/items/properties/install_date/type",keyword:"type",params:{type: schema31.properties.components.items.properties.install_date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
if(typeof data79 === "string"){
if(!(formats30.validate(data79))){
const err184 = {instancePath:instancePath+"/components/" + i9+"/install_date",schemaPath:"#/properties/components/items/properties/install_date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
}
}
if(data71.warranty_start !== undefined){
let data80 = data71.warranty_start;
if((typeof data80 !== "string") && (data80 !== null)){
const err185 = {instancePath:instancePath+"/components/" + i9+"/warranty_start",schemaPath:"#/properties/components/items/properties/warranty_start/type",keyword:"type",params:{type: schema31.properties.components.items.properties.warranty_start.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
if(typeof data80 === "string"){
if(!(formats30.validate(data80))){
const err186 = {instancePath:instancePath+"/components/" + i9+"/warranty_start",schemaPath:"#/properties/components/items/properties/warranty_start/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
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
if(data71.warranty_length_months !== undefined){
let data81 = data71.warranty_length_months;
if((!(((typeof data81 == "number") && (!(data81 % 1) && !isNaN(data81))) && (isFinite(data81)))) && (data81 !== null)){
const err187 = {instancePath:instancePath+"/components/" + i9+"/warranty_length_months",schemaPath:"#/properties/components/items/properties/warranty_length_months/type",keyword:"type",params:{type: schema31.properties.components.items.properties.warranty_length_months.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
}
if(data71.manual_attachment_id !== undefined){
let data82 = data71.manual_attachment_id;
if((typeof data82 !== "string") && (data82 !== null)){
const err188 = {instancePath:instancePath+"/components/" + i9+"/manual_attachment_id",schemaPath:"#/properties/components/items/properties/manual_attachment_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.manual_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
if(typeof data82 === "string"){
if(!(formats0.test(data82))){
const err189 = {instancePath:instancePath+"/components/" + i9+"/manual_attachment_id",schemaPath:"#/properties/components/items/properties/manual_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
}
}
if(data71.service_interval_days !== undefined){
let data83 = data71.service_interval_days;
if((!(((typeof data83 == "number") && (!(data83 % 1) && !isNaN(data83))) && (isFinite(data83)))) && (data83 !== null)){
const err190 = {instancePath:instancePath+"/components/" + i9+"/service_interval_days",schemaPath:"#/properties/components/items/properties/service_interval_days/type",keyword:"type",params:{type: schema31.properties.components.items.properties.service_interval_days.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
}
if(data71.last_serviced_at !== undefined){
let data84 = data71.last_serviced_at;
if((typeof data84 !== "string") && (data84 !== null)){
const err191 = {instancePath:instancePath+"/components/" + i9+"/last_serviced_at",schemaPath:"#/properties/components/items/properties/last_serviced_at/type",keyword:"type",params:{type: schema31.properties.components.items.properties.last_serviced_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
if(typeof data84 === "string"){
if(!(formats30.validate(data84))){
const err192 = {instancePath:instancePath+"/components/" + i9+"/last_serviced_at",schemaPath:"#/properties/components/items/properties/last_serviced_at/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
}
}
if(data71.condition !== undefined){
let data85 = data71.condition;
if(typeof data85 !== "string"){
const err193 = {instancePath:instancePath+"/components/" + i9+"/condition",schemaPath:"#/properties/components/items/properties/condition/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
if(!(((((data85 === "good") || (data85 === "fair")) || (data85 === "needs_attention")) || (data85 === "needs_replacement")) || (data85 === "unknown"))){
const err194 = {instancePath:instancePath+"/components/" + i9+"/condition",schemaPath:"#/properties/components/items/properties/condition/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.condition.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
}
if(data71.level_id !== undefined){
let data86 = data71.level_id;
if((typeof data86 !== "string") && (data86 !== null)){
const err195 = {instancePath:instancePath+"/components/" + i9+"/level_id",schemaPath:"#/properties/components/items/properties/level_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.level_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
if(typeof data86 === "string"){
if(!(formats0.test(data86))){
const err196 = {instancePath:instancePath+"/components/" + i9+"/level_id",schemaPath:"#/properties/components/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
}
}
if(data71.room_ids !== undefined){
let data87 = data71.room_ids;
if(Array.isArray(data87)){
const len10 = data87.length;
for(let i10=0; i10<len10; i10++){
let data88 = data87[i10];
if(typeof data88 === "string"){
if(!(formats0.test(data88))){
const err197 = {instancePath:instancePath+"/components/" + i9+"/room_ids/" + i10,schemaPath:"#/properties/components/items/properties/room_ids/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
const err198 = {instancePath:instancePath+"/components/" + i9+"/room_ids/" + i10,schemaPath:"#/properties/components/items/properties/room_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err198];
}
else {
vErrors.push(err198);
}
errors++;
}
}
}
else {
const err199 = {instancePath:instancePath+"/components/" + i9+"/room_ids",schemaPath:"#/properties/components/items/properties/room_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
}
if(data71.geometry !== undefined){
let data89 = data71.geometry;
const _errs209 = errors;
let valid53 = false;
const _errs210 = errors;
const _errs213 = errors;
let valid55 = true;
const _errs214 = errors;
if(data89 && typeof data89 == "object" && !Array.isArray(data89)){
let missing6;
if((data89.type === undefined) && (missing6 = "type")){
const err200 = {};
if(vErrors === null){
vErrors = [err200];
}
else {
vErrors.push(err200);
}
errors++;
}
else {
if(data89.type !== undefined){
if("point" !== data89.type){
const err201 = {};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
}
}
}
var _valid7 = _errs214 === errors;
errors = _errs213;
if(vErrors !== null){
if(_errs213){
vErrors.length = _errs213;
}
else {
vErrors = null;
}
}
if(_valid7){
const _errs216 = errors;
if(data89 && typeof data89 == "object" && !Array.isArray(data89)){
if(data89.coordinates !== undefined){
let data91 = data89.coordinates;
if(Array.isArray(data91)){
if(data91.length > 1){
const err202 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
if(data91.length < 1){
const err203 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
}
else {
const err204 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid7 = _errs216 === errors;
valid55 = _valid7;
if(valid55){
var props6 = {};
props6.coordinates = true;
props6.type = true;
}
}
if(!valid55){
const err205 = {instancePath:instancePath+"/components/" + i9+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
const _errs220 = errors;
let valid58 = true;
const _errs221 = errors;
if(data89 && typeof data89 == "object" && !Array.isArray(data89)){
let missing7;
if((data89.type === undefined) && (missing7 = "type")){
const err206 = {};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
else {
if(data89.type !== undefined){
if("polyline" !== data89.type){
const err207 = {};
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
}
var _valid8 = _errs221 === errors;
errors = _errs220;
if(vErrors !== null){
if(_errs220){
vErrors.length = _errs220;
}
else {
vErrors = null;
}
}
if(_valid8){
const _errs223 = errors;
if(data89 && typeof data89 == "object" && !Array.isArray(data89)){
if(data89.coordinates !== undefined){
let data93 = data89.coordinates;
if(Array.isArray(data93)){
if(data93.length < 2){
const err208 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
}
else {
const err209 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid8 = _errs223 === errors;
valid58 = _valid8;
if(valid58){
var props7 = {};
props7.coordinates = true;
props7.type = true;
}
}
if(!valid58){
const err210 = {instancePath:instancePath+"/components/" + i9+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
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
const _errs227 = errors;
let valid61 = true;
const _errs228 = errors;
if(data89 && typeof data89 == "object" && !Array.isArray(data89)){
let missing8;
if((data89.type === undefined) && (missing8 = "type")){
const err211 = {};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
else {
if(data89.type !== undefined){
if("polygon" !== data89.type){
const err212 = {};
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
}
var _valid9 = _errs228 === errors;
errors = _errs227;
if(vErrors !== null){
if(_errs227){
vErrors.length = _errs227;
}
else {
vErrors = null;
}
}
if(_valid9){
const _errs230 = errors;
if(data89 && typeof data89 == "object" && !Array.isArray(data89)){
if(data89.coordinates !== undefined){
let data95 = data89.coordinates;
if(Array.isArray(data95)){
if(data95.length < 3){
const err213 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
}
else {
const err214 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err214];
}
else {
vErrors.push(err214);
}
errors++;
}
}
}
var _valid9 = _errs230 === errors;
valid61 = _valid9;
if(valid61){
var props8 = {};
props8.coordinates = true;
props8.type = true;
}
}
if(!valid61){
const err215 = {instancePath:instancePath+"/components/" + i9+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
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
if(data89 && typeof data89 == "object" && !Array.isArray(data89)){
if(data89.type === undefined){
const err216 = {instancePath:instancePath+"/components/" + i9+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err216];
}
else {
vErrors.push(err216);
}
errors++;
}
if(data89.coordinates === undefined){
const err217 = {instancePath:instancePath+"/components/" + i9+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
for(const key9 in data89){
if(!((key9 === "type") || (key9 === "coordinates"))){
const err218 = {instancePath:instancePath+"/components/" + i9+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err218];
}
else {
vErrors.push(err218);
}
errors++;
}
}
if(data89.type !== undefined){
let data96 = data89.type;
if(typeof data96 !== "string"){
const err219 = {instancePath:instancePath+"/components/" + i9+"/geometry/type",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err219];
}
else {
vErrors.push(err219);
}
errors++;
}
if(!(((data96 === "point") || (data96 === "polyline")) || (data96 === "polygon"))){
const err220 = {instancePath:instancePath+"/components/" + i9+"/geometry/type",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.geometry.anyOf[0].properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err220];
}
else {
vErrors.push(err220);
}
errors++;
}
}
if(data89.coordinates !== undefined){
let data97 = data89.coordinates;
if(Array.isArray(data97)){
const len11 = data97.length;
for(let i11=0; i11<len11; i11++){
let data98 = data97[i11];
if(Array.isArray(data98)){
if(data98.length > 2){
const err221 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates/" + i11,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err221];
}
else {
vErrors.push(err221);
}
errors++;
}
if(data98.length < 2){
const err222 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates/" + i11,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err222];
}
else {
vErrors.push(err222);
}
errors++;
}
const len12 = data98.length;
for(let i12=0; i12<len12; i12++){
let data99 = data98[i12];
if(!((typeof data99 == "number") && (isFinite(data99)))){
const err223 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates/" + i11+"/" + i12,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
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
else {
const err224 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates/" + i11,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
else {
const err225 = {instancePath:instancePath+"/components/" + i9+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
const err226 = {instancePath:instancePath+"/components/" + i9+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err226];
}
else {
vErrors.push(err226);
}
errors++;
}
var _valid6 = _errs210 === errors;
valid53 = valid53 || _valid6;
const _errs242 = errors;
if(data89 !== null){
const err227 = {instancePath:instancePath+"/components/" + i9+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err227];
}
else {
vErrors.push(err227);
}
errors++;
}
var _valid6 = _errs242 === errors;
valid53 = valid53 || _valid6;
if(!valid53){
const err228 = {instancePath:instancePath+"/components/" + i9+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err228];
}
else {
vErrors.push(err228);
}
errors++;
}
else {
errors = _errs209;
if(vErrors !== null){
if(_errs209){
vErrors.length = _errs209;
}
else {
vErrors = null;
}
}
}
}
if(data71.notes !== undefined){
let data100 = data71.notes;
if((typeof data100 !== "string") && (data100 !== null)){
const err229 = {instancePath:instancePath+"/components/" + i9+"/notes",schemaPath:"#/properties/components/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.components.items.properties.notes.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err229];
}
else {
vErrors.push(err229);
}
errors++;
}
}
if(data71.linked_component_id !== undefined){
let data101 = data71.linked_component_id;
if((typeof data101 !== "string") && (data101 !== null)){
const err230 = {instancePath:instancePath+"/components/" + i9+"/linked_component_id",schemaPath:"#/properties/components/items/properties/linked_component_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.linked_component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err230];
}
else {
vErrors.push(err230);
}
errors++;
}
if(typeof data101 === "string"){
if(!(formats0.test(data101))){
const err231 = {instancePath:instancePath+"/components/" + i9+"/linked_component_id",schemaPath:"#/properties/components/items/properties/linked_component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
if(data71.custom_fields !== undefined){
let data102 = data71.custom_fields;
if(data102 && typeof data102 == "object" && !Array.isArray(data102)){
}
else {
const err232 = {instancePath:instancePath+"/components/" + i9+"/custom_fields",schemaPath:"#/properties/components/items/properties/custom_fields/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
else {
const err233 = {instancePath:instancePath+"/components/" + i9,schemaPath:"#/properties/components/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err233];
}
else {
vErrors.push(err233);
}
errors++;
}
}
}
else {
const err234 = {instancePath:instancePath+"/components",schemaPath:"#/properties/components/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err234];
}
else {
vErrors.push(err234);
}
errors++;
}
}
if(data.events !== undefined){
let data103 = data.events;
if(Array.isArray(data103)){
const len13 = data103.length;
for(let i13=0; i13<len13; i13++){
let data104 = data103[i13];
const _errs255 = errors;
let valid71 = false;
const _errs256 = errors;
if(data104 && typeof data104 == "object" && !Array.isArray(data104)){
if(data104.system_id === undefined){
const err235 = {instancePath:instancePath+"/events/" + i13,schemaPath:"#/properties/events/items/anyOf/0/required",keyword:"required",params:{missingProperty: "system_id"},message:"must have required property '"+"system_id"+"'"};
if(vErrors === null){
vErrors = [err235];
}
else {
vErrors.push(err235);
}
errors++;
}
if(data104.system_id !== undefined){
let data105 = data104.system_id;
if(typeof data105 === "string"){
if(!(formats0.test(data105))){
const err236 = {instancePath:instancePath+"/events/" + i13+"/system_id",schemaPath:"#/properties/events/items/anyOf/0/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err236];
}
else {
vErrors.push(err236);
}
errors++;
}
}
else {
const err237 = {instancePath:instancePath+"/events/" + i13+"/system_id",schemaPath:"#/properties/events/items/anyOf/0/properties/system_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err237];
}
else {
vErrors.push(err237);
}
errors++;
}
}
}
var _valid10 = _errs256 === errors;
valid71 = valid71 || _valid10;
if(_valid10){
var props10 = {};
props10.system_id = true;
}
const _errs259 = errors;
if(data104 && typeof data104 == "object" && !Array.isArray(data104)){
if(data104.component_id === undefined){
const err238 = {instancePath:instancePath+"/events/" + i13,schemaPath:"#/properties/events/items/anyOf/1/required",keyword:"required",params:{missingProperty: "component_id"},message:"must have required property '"+"component_id"+"'"};
if(vErrors === null){
vErrors = [err238];
}
else {
vErrors.push(err238);
}
errors++;
}
if(data104.component_id !== undefined){
let data106 = data104.component_id;
if(typeof data106 === "string"){
if(!(formats0.test(data106))){
const err239 = {instancePath:instancePath+"/events/" + i13+"/component_id",schemaPath:"#/properties/events/items/anyOf/1/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err239];
}
else {
vErrors.push(err239);
}
errors++;
}
}
else {
const err240 = {instancePath:instancePath+"/events/" + i13+"/component_id",schemaPath:"#/properties/events/items/anyOf/1/properties/component_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err240];
}
else {
vErrors.push(err240);
}
errors++;
}
}
}
var _valid10 = _errs259 === errors;
valid71 = valid71 || _valid10;
if(_valid10){
if(props10 !== true){
props10 = props10 || {};
props10.component_id = true;
}
}
if(!valid71){
const err241 = {instancePath:instancePath+"/events/" + i13,schemaPath:"#/properties/events/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err241];
}
else {
vErrors.push(err241);
}
errors++;
}
else {
errors = _errs255;
if(vErrors !== null){
if(_errs255){
vErrors.length = _errs255;
}
else {
vErrors = null;
}
}
}
if(data104 && typeof data104 == "object" && !Array.isArray(data104)){
if(data104.id === undefined){
const err242 = {instancePath:instancePath+"/events/" + i13,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err242];
}
else {
vErrors.push(err242);
}
errors++;
}
if(data104.home_id === undefined){
const err243 = {instancePath:instancePath+"/events/" + i13,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err243];
}
else {
vErrors.push(err243);
}
errors++;
}
if(data104.event_type === undefined){
const err244 = {instancePath:instancePath+"/events/" + i13,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "event_type"},message:"must have required property '"+"event_type"+"'"};
if(vErrors === null){
vErrors = [err244];
}
else {
vErrors.push(err244);
}
errors++;
}
if(data104.occurred_at === undefined){
const err245 = {instancePath:instancePath+"/events/" + i13,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "occurred_at"},message:"must have required property '"+"occurred_at"+"'"};
if(vErrors === null){
vErrors = [err245];
}
else {
vErrors.push(err245);
}
errors++;
}
if(data104.attachment_ids === undefined){
const err246 = {instancePath:instancePath+"/events/" + i13,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "attachment_ids"},message:"must have required property '"+"attachment_ids"+"'"};
if(vErrors === null){
vErrors = [err246];
}
else {
vErrors.push(err246);
}
errors++;
}
for(const key10 in data104){
if(!(func1.call(schema31.properties.events.items.properties, key10))){
const err247 = {instancePath:instancePath+"/events/" + i13,schemaPath:"#/properties/events/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err247];
}
else {
vErrors.push(err247);
}
errors++;
}
}
if(data104.id !== undefined){
let data107 = data104.id;
if(typeof data107 === "string"){
if(!(formats0.test(data107))){
const err248 = {instancePath:instancePath+"/events/" + i13+"/id",schemaPath:"#/properties/events/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err248];
}
else {
vErrors.push(err248);
}
errors++;
}
}
else {
const err249 = {instancePath:instancePath+"/events/" + i13+"/id",schemaPath:"#/properties/events/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err249];
}
else {
vErrors.push(err249);
}
errors++;
}
}
if(data104.home_id !== undefined){
let data108 = data104.home_id;
if(typeof data108 === "string"){
if(!(formats0.test(data108))){
const err250 = {instancePath:instancePath+"/events/" + i13+"/home_id",schemaPath:"#/properties/events/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err250];
}
else {
vErrors.push(err250);
}
errors++;
}
}
else {
const err251 = {instancePath:instancePath+"/events/" + i13+"/home_id",schemaPath:"#/properties/events/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err251];
}
else {
vErrors.push(err251);
}
errors++;
}
}
if(data104.system_id !== undefined){
let data109 = data104.system_id;
if((typeof data109 !== "string") && (data109 !== null)){
const err252 = {instancePath:instancePath+"/events/" + i13+"/system_id",schemaPath:"#/properties/events/items/properties/system_id/type",keyword:"type",params:{type: schema31.properties.events.items.properties.system_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err252];
}
else {
vErrors.push(err252);
}
errors++;
}
if(typeof data109 === "string"){
if(!(formats0.test(data109))){
const err253 = {instancePath:instancePath+"/events/" + i13+"/system_id",schemaPath:"#/properties/events/items/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
if(data104.component_id !== undefined){
let data110 = data104.component_id;
if((typeof data110 !== "string") && (data110 !== null)){
const err254 = {instancePath:instancePath+"/events/" + i13+"/component_id",schemaPath:"#/properties/events/items/properties/component_id/type",keyword:"type",params:{type: schema31.properties.events.items.properties.component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err254];
}
else {
vErrors.push(err254);
}
errors++;
}
if(typeof data110 === "string"){
if(!(formats0.test(data110))){
const err255 = {instancePath:instancePath+"/events/" + i13+"/component_id",schemaPath:"#/properties/events/items/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err255];
}
else {
vErrors.push(err255);
}
errors++;
}
}
}
if(data104.event_type !== undefined){
let data111 = data104.event_type;
if(typeof data111 !== "string"){
const err256 = {instancePath:instancePath+"/events/" + i13+"/event_type",schemaPath:"#/properties/events/items/properties/event_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err256];
}
else {
vErrors.push(err256);
}
errors++;
}
if(!((((((data111 === "inspection") || (data111 === "service")) || (data111 === "repair")) || (data111 === "replacement")) || (data111 === "reading")) || (data111 === "note"))){
const err257 = {instancePath:instancePath+"/events/" + i13+"/event_type",schemaPath:"#/properties/events/items/properties/event_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.events.items.properties.event_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err257];
}
else {
vErrors.push(err257);
}
errors++;
}
}
if(data104.occurred_at !== undefined){
let data112 = data104.occurred_at;
if(typeof data112 === "string"){
if(!(formats4.validate(data112))){
const err258 = {instancePath:instancePath+"/events/" + i13+"/occurred_at",schemaPath:"#/properties/events/items/properties/occurred_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err258];
}
else {
vErrors.push(err258);
}
errors++;
}
}
else {
const err259 = {instancePath:instancePath+"/events/" + i13+"/occurred_at",schemaPath:"#/properties/events/items/properties/occurred_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err259];
}
else {
vErrors.push(err259);
}
errors++;
}
}
if(data104.performed_by !== undefined){
let data113 = data104.performed_by;
if((typeof data113 !== "string") && (data113 !== null)){
const err260 = {instancePath:instancePath+"/events/" + i13+"/performed_by",schemaPath:"#/properties/events/items/properties/performed_by/type",keyword:"type",params:{type: schema31.properties.events.items.properties.performed_by.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err260];
}
else {
vErrors.push(err260);
}
errors++;
}
}
if(data104.cost_cents !== undefined){
let data114 = data104.cost_cents;
if((!(((typeof data114 == "number") && (!(data114 % 1) && !isNaN(data114))) && (isFinite(data114)))) && (data114 !== null)){
const err261 = {instancePath:instancePath+"/events/" + i13+"/cost_cents",schemaPath:"#/properties/events/items/properties/cost_cents/type",keyword:"type",params:{type: schema31.properties.events.items.properties.cost_cents.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err261];
}
else {
vErrors.push(err261);
}
errors++;
}
}
if(data104.notes !== undefined){
let data115 = data104.notes;
if((typeof data115 !== "string") && (data115 !== null)){
const err262 = {instancePath:instancePath+"/events/" + i13+"/notes",schemaPath:"#/properties/events/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.events.items.properties.notes.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err262];
}
else {
vErrors.push(err262);
}
errors++;
}
}
if(data104.condition_after !== undefined){
let data116 = data104.condition_after;
const _errs282 = errors;
let valid75 = false;
const _errs283 = errors;
if(typeof data116 !== "string"){
const err263 = {instancePath:instancePath+"/events/" + i13+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err263];
}
else {
vErrors.push(err263);
}
errors++;
}
if(!(((((data116 === "good") || (data116 === "fair")) || (data116 === "needs_attention")) || (data116 === "needs_replacement")) || (data116 === "unknown"))){
const err264 = {instancePath:instancePath+"/events/" + i13+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/0/enum",keyword:"enum",params:{allowedValues: schema31.properties.events.items.properties.condition_after.anyOf[0].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err264];
}
else {
vErrors.push(err264);
}
errors++;
}
var _valid11 = _errs283 === errors;
valid75 = valid75 || _valid11;
const _errs285 = errors;
if(data116 !== null){
const err265 = {instancePath:instancePath+"/events/" + i13+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err265];
}
else {
vErrors.push(err265);
}
errors++;
}
var _valid11 = _errs285 === errors;
valid75 = valid75 || _valid11;
if(!valid75){
const err266 = {instancePath:instancePath+"/events/" + i13+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err266];
}
else {
vErrors.push(err266);
}
errors++;
}
else {
errors = _errs282;
if(vErrors !== null){
if(_errs282){
vErrors.length = _errs282;
}
else {
vErrors = null;
}
}
}
}
if(data104.reading_value !== undefined){
let data117 = data104.reading_value;
if((!((typeof data117 == "number") && (isFinite(data117)))) && (data117 !== null)){
const err267 = {instancePath:instancePath+"/events/" + i13+"/reading_value",schemaPath:"#/properties/events/items/properties/reading_value/type",keyword:"type",params:{type: schema31.properties.events.items.properties.reading_value.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err267];
}
else {
vErrors.push(err267);
}
errors++;
}
}
if(data104.reading_unit !== undefined){
let data118 = data104.reading_unit;
if((typeof data118 !== "string") && (data118 !== null)){
const err268 = {instancePath:instancePath+"/events/" + i13+"/reading_unit",schemaPath:"#/properties/events/items/properties/reading_unit/type",keyword:"type",params:{type: schema31.properties.events.items.properties.reading_unit.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err268];
}
else {
vErrors.push(err268);
}
errors++;
}
}
if(data104.attachment_ids !== undefined){
let data119 = data104.attachment_ids;
if(Array.isArray(data119)){
const len14 = data119.length;
for(let i14=0; i14<len14; i14++){
let data120 = data119[i14];
if(typeof data120 === "string"){
if(!(formats0.test(data120))){
const err269 = {instancePath:instancePath+"/events/" + i13+"/attachment_ids/" + i14,schemaPath:"#/properties/events/items/properties/attachment_ids/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err269];
}
else {
vErrors.push(err269);
}
errors++;
}
}
else {
const err270 = {instancePath:instancePath+"/events/" + i13+"/attachment_ids/" + i14,schemaPath:"#/properties/events/items/properties/attachment_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err270];
}
else {
vErrors.push(err270);
}
errors++;
}
}
}
else {
const err271 = {instancePath:instancePath+"/events/" + i13+"/attachment_ids",schemaPath:"#/properties/events/items/properties/attachment_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err271];
}
else {
vErrors.push(err271);
}
errors++;
}
}
}
else {
const err272 = {instancePath:instancePath+"/events/" + i13,schemaPath:"#/properties/events/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err272];
}
else {
vErrors.push(err272);
}
errors++;
}
}
}
else {
const err273 = {instancePath:instancePath+"/events",schemaPath:"#/properties/events/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err273];
}
else {
vErrors.push(err273);
}
errors++;
}
}
if(data.attachments !== undefined){
let data121 = data.attachments;
if(Array.isArray(data121)){
const len15 = data121.length;
for(let i15=0; i15<len15; i15++){
let data122 = data121[i15];
if(data122 && typeof data122 == "object" && !Array.isArray(data122)){
if(data122.id === undefined){
const err274 = {instancePath:instancePath+"/attachments/" + i15,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err274];
}
else {
vErrors.push(err274);
}
errors++;
}
if(data122.home_id === undefined){
const err275 = {instancePath:instancePath+"/attachments/" + i15,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err275];
}
else {
vErrors.push(err275);
}
errors++;
}
if(data122.kind === undefined){
const err276 = {instancePath:instancePath+"/attachments/" + i15,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err276];
}
else {
vErrors.push(err276);
}
errors++;
}
if(data122.storage_path === undefined){
const err277 = {instancePath:instancePath+"/attachments/" + i15,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "storage_path"},message:"must have required property '"+"storage_path"+"'"};
if(vErrors === null){
vErrors = [err277];
}
else {
vErrors.push(err277);
}
errors++;
}
if(data122.mime_type === undefined){
const err278 = {instancePath:instancePath+"/attachments/" + i15,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "mime_type"},message:"must have required property '"+"mime_type"+"'"};
if(vErrors === null){
vErrors = [err278];
}
else {
vErrors.push(err278);
}
errors++;
}
if(data122.file_size_bytes === undefined){
const err279 = {instancePath:instancePath+"/attachments/" + i15,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "file_size_bytes"},message:"must have required property '"+"file_size_bytes"+"'"};
if(vErrors === null){
vErrors = [err279];
}
else {
vErrors.push(err279);
}
errors++;
}
for(const key11 in data122){
if(!(func1.call(schema31.properties.attachments.items.properties, key11))){
const err280 = {instancePath:instancePath+"/attachments/" + i15,schemaPath:"#/properties/attachments/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err280];
}
else {
vErrors.push(err280);
}
errors++;
}
}
if(data122.id !== undefined){
let data123 = data122.id;
if(typeof data123 === "string"){
if(!(formats0.test(data123))){
const err281 = {instancePath:instancePath+"/attachments/" + i15+"/id",schemaPath:"#/properties/attachments/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err281];
}
else {
vErrors.push(err281);
}
errors++;
}
}
else {
const err282 = {instancePath:instancePath+"/attachments/" + i15+"/id",schemaPath:"#/properties/attachments/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err282];
}
else {
vErrors.push(err282);
}
errors++;
}
}
if(data122.home_id !== undefined){
let data124 = data122.home_id;
if(typeof data124 === "string"){
if(!(formats0.test(data124))){
const err283 = {instancePath:instancePath+"/attachments/" + i15+"/home_id",schemaPath:"#/properties/attachments/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err283];
}
else {
vErrors.push(err283);
}
errors++;
}
}
else {
const err284 = {instancePath:instancePath+"/attachments/" + i15+"/home_id",schemaPath:"#/properties/attachments/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err284];
}
else {
vErrors.push(err284);
}
errors++;
}
}
if(data122.kind !== undefined){
let data125 = data122.kind;
if(typeof data125 !== "string"){
const err285 = {instancePath:instancePath+"/attachments/" + i15+"/kind",schemaPath:"#/properties/attachments/items/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err285];
}
else {
vErrors.push(err285);
}
errors++;
}
if(!(((((data125 === "photo") || (data125 === "receipt")) || (data125 === "manual_pdf")) || (data125 === "usdz_mesh")) || (data125 === "floor_plan_source"))){
const err286 = {instancePath:instancePath+"/attachments/" + i15+"/kind",schemaPath:"#/properties/attachments/items/properties/kind/enum",keyword:"enum",params:{allowedValues: schema31.properties.attachments.items.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err286];
}
else {
vErrors.push(err286);
}
errors++;
}
}
if(data122.storage_path !== undefined){
let data126 = data122.storage_path;
if(typeof data126 === "string"){
if(!pattern5.test(data126)){
const err287 = {instancePath:instancePath+"/attachments/" + i15+"/storage_path",schemaPath:"#/properties/attachments/items/properties/storage_path/pattern",keyword:"pattern",params:{pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$"},message:"must match pattern \""+"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err287];
}
else {
vErrors.push(err287);
}
errors++;
}
}
else {
const err288 = {instancePath:instancePath+"/attachments/" + i15+"/storage_path",schemaPath:"#/properties/attachments/items/properties/storage_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err288];
}
else {
vErrors.push(err288);
}
errors++;
}
}
if(data122.mime_type !== undefined){
if(typeof data122.mime_type !== "string"){
const err289 = {instancePath:instancePath+"/attachments/" + i15+"/mime_type",schemaPath:"#/properties/attachments/items/properties/mime_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err289];
}
else {
vErrors.push(err289);
}
errors++;
}
}
if(data122.file_size_bytes !== undefined){
let data128 = data122.file_size_bytes;
if(!(((typeof data128 == "number") && (!(data128 % 1) && !isNaN(data128))) && (isFinite(data128)))){
const err290 = {instancePath:instancePath+"/attachments/" + i15+"/file_size_bytes",schemaPath:"#/properties/attachments/items/properties/file_size_bytes/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err290];
}
else {
vErrors.push(err290);
}
errors++;
}
}
if(data122.captured_at !== undefined){
let data129 = data122.captured_at;
if((typeof data129 !== "string") && (data129 !== null)){
const err291 = {instancePath:instancePath+"/attachments/" + i15+"/captured_at",schemaPath:"#/properties/attachments/items/properties/captured_at/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.captured_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err291];
}
else {
vErrors.push(err291);
}
errors++;
}
if(typeof data129 === "string"){
if(!(formats4.validate(data129))){
const err292 = {instancePath:instancePath+"/attachments/" + i15+"/captured_at",schemaPath:"#/properties/attachments/items/properties/captured_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
if(data122.linked_event_id !== undefined){
let data130 = data122.linked_event_id;
if((typeof data130 !== "string") && (data130 !== null)){
const err293 = {instancePath:instancePath+"/attachments/" + i15+"/linked_event_id",schemaPath:"#/properties/attachments/items/properties/linked_event_id/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.linked_event_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err293];
}
else {
vErrors.push(err293);
}
errors++;
}
if(typeof data130 === "string"){
if(!(formats0.test(data130))){
const err294 = {instancePath:instancePath+"/attachments/" + i15+"/linked_event_id",schemaPath:"#/properties/attachments/items/properties/linked_event_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err294];
}
else {
vErrors.push(err294);
}
errors++;
}
}
}
if(data122.linked_component_id !== undefined){
let data131 = data122.linked_component_id;
if((typeof data131 !== "string") && (data131 !== null)){
const err295 = {instancePath:instancePath+"/attachments/" + i15+"/linked_component_id",schemaPath:"#/properties/attachments/items/properties/linked_component_id/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.linked_component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err295];
}
else {
vErrors.push(err295);
}
errors++;
}
if(typeof data131 === "string"){
if(!(formats0.test(data131))){
const err296 = {instancePath:instancePath+"/attachments/" + i15+"/linked_component_id",schemaPath:"#/properties/attachments/items/properties/linked_component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err296];
}
else {
vErrors.push(err296);
}
errors++;
}
}
}
}
else {
const err297 = {instancePath:instancePath+"/attachments/" + i15,schemaPath:"#/properties/attachments/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err297];
}
else {
vErrors.push(err297);
}
errors++;
}
}
}
else {
const err298 = {instancePath:instancePath+"/attachments",schemaPath:"#/properties/attachments/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err298];
}
else {
vErrors.push(err298);
}
errors++;
}
}
if(data.smart_home_readings !== undefined){
let data132 = data.smart_home_readings;
if(Array.isArray(data132)){
const len16 = data132.length;
for(let i16=0; i16<len16; i16++){
let data133 = data132[i16];
if(data133 && typeof data133 == "object" && !Array.isArray(data133)){
if(data133.id === undefined){
const err299 = {instancePath:instancePath+"/smart_home_readings/" + i16,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err299];
}
else {
vErrors.push(err299);
}
errors++;
}
if(data133.component_id === undefined){
const err300 = {instancePath:instancePath+"/smart_home_readings/" + i16,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "component_id"},message:"must have required property '"+"component_id"+"'"};
if(vErrors === null){
vErrors = [err300];
}
else {
vErrors.push(err300);
}
errors++;
}
if(data133.source === undefined){
const err301 = {instancePath:instancePath+"/smart_home_readings/" + i16,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err301];
}
else {
vErrors.push(err301);
}
errors++;
}
if(data133.metric === undefined){
const err302 = {instancePath:instancePath+"/smart_home_readings/" + i16,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "metric"},message:"must have required property '"+"metric"+"'"};
if(vErrors === null){
vErrors = [err302];
}
else {
vErrors.push(err302);
}
errors++;
}
if(data133.value === undefined){
const err303 = {instancePath:instancePath+"/smart_home_readings/" + i16,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err303];
}
else {
vErrors.push(err303);
}
errors++;
}
if(data133.unit === undefined){
const err304 = {instancePath:instancePath+"/smart_home_readings/" + i16,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err304];
}
else {
vErrors.push(err304);
}
errors++;
}
if(data133.recorded_at === undefined){
const err305 = {instancePath:instancePath+"/smart_home_readings/" + i16,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "recorded_at"},message:"must have required property '"+"recorded_at"+"'"};
if(vErrors === null){
vErrors = [err305];
}
else {
vErrors.push(err305);
}
errors++;
}
for(const key12 in data133){
if(!(((((((key12 === "id") || (key12 === "component_id")) || (key12 === "source")) || (key12 === "metric")) || (key12 === "value")) || (key12 === "unit")) || (key12 === "recorded_at"))){
const err306 = {instancePath:instancePath+"/smart_home_readings/" + i16,schemaPath:"#/properties/smart_home_readings/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err306];
}
else {
vErrors.push(err306);
}
errors++;
}
}
if(data133.id !== undefined){
let data134 = data133.id;
if(typeof data134 === "string"){
if(!(formats0.test(data134))){
const err307 = {instancePath:instancePath+"/smart_home_readings/" + i16+"/id",schemaPath:"#/properties/smart_home_readings/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
const err308 = {instancePath:instancePath+"/smart_home_readings/" + i16+"/id",schemaPath:"#/properties/smart_home_readings/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err308];
}
else {
vErrors.push(err308);
}
errors++;
}
}
if(data133.component_id !== undefined){
let data135 = data133.component_id;
if(typeof data135 === "string"){
if(!(formats0.test(data135))){
const err309 = {instancePath:instancePath+"/smart_home_readings/" + i16+"/component_id",schemaPath:"#/properties/smart_home_readings/items/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err309];
}
else {
vErrors.push(err309);
}
errors++;
}
}
else {
const err310 = {instancePath:instancePath+"/smart_home_readings/" + i16+"/component_id",schemaPath:"#/properties/smart_home_readings/items/properties/component_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err310];
}
else {
vErrors.push(err310);
}
errors++;
}
}
if(data133.source !== undefined){
let data136 = data133.source;
if(typeof data136 !== "string"){
const err311 = {instancePath:instancePath+"/smart_home_readings/" + i16+"/source",schemaPath:"#/properties/smart_home_readings/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err311];
}
else {
vErrors.push(err311);
}
errors++;
}
if(!((((data136 === "homekit") || (data136 === "ecobee")) || (data136 === "nest")) || (data136 === "other"))){
const err312 = {instancePath:instancePath+"/smart_home_readings/" + i16+"/source",schemaPath:"#/properties/smart_home_readings/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.smart_home_readings.items.properties.source.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err312];
}
else {
vErrors.push(err312);
}
errors++;
}
}
if(data133.metric !== undefined){
if(typeof data133.metric !== "string"){
const err313 = {instancePath:instancePath+"/smart_home_readings/" + i16+"/metric",schemaPath:"#/properties/smart_home_readings/items/properties/metric/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err313];
}
else {
vErrors.push(err313);
}
errors++;
}
}
if(data133.value !== undefined){
let data138 = data133.value;
if(!((typeof data138 == "number") && (isFinite(data138)))){
const err314 = {instancePath:instancePath+"/smart_home_readings/" + i16+"/value",schemaPath:"#/properties/smart_home_readings/items/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err314];
}
else {
vErrors.push(err314);
}
errors++;
}
}
if(data133.unit !== undefined){
if(typeof data133.unit !== "string"){
const err315 = {instancePath:instancePath+"/smart_home_readings/" + i16+"/unit",schemaPath:"#/properties/smart_home_readings/items/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err315];
}
else {
vErrors.push(err315);
}
errors++;
}
}
if(data133.recorded_at !== undefined){
let data140 = data133.recorded_at;
if(typeof data140 === "string"){
if(!(formats4.validate(data140))){
const err316 = {instancePath:instancePath+"/smart_home_readings/" + i16+"/recorded_at",schemaPath:"#/properties/smart_home_readings/items/properties/recorded_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err317 = {instancePath:instancePath+"/smart_home_readings/" + i16+"/recorded_at",schemaPath:"#/properties/smart_home_readings/items/properties/recorded_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
const err318 = {instancePath:instancePath+"/smart_home_readings/" + i16,schemaPath:"#/properties/smart_home_readings/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err318];
}
else {
vErrors.push(err318);
}
errors++;
}
}
}
else {
const err319 = {instancePath:instancePath+"/smart_home_readings",schemaPath:"#/properties/smart_home_readings/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err319];
}
else {
vErrors.push(err319);
}
errors++;
}
}
if(data.utility_bills !== undefined){
let data141 = data.utility_bills;
if(Array.isArray(data141)){
const len17 = data141.length;
for(let i17=0; i17<len17; i17++){
let data142 = data141[i17];
if(data142 && typeof data142 == "object" && !Array.isArray(data142)){
if(data142.id === undefined){
const err320 = {instancePath:instancePath+"/utility_bills/" + i17,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err320];
}
else {
vErrors.push(err320);
}
errors++;
}
if(data142.home_id === undefined){
const err321 = {instancePath:instancePath+"/utility_bills/" + i17,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err321];
}
else {
vErrors.push(err321);
}
errors++;
}
if(data142.utility_type === undefined){
const err322 = {instancePath:instancePath+"/utility_bills/" + i17,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "utility_type"},message:"must have required property '"+"utility_type"+"'"};
if(vErrors === null){
vErrors = [err322];
}
else {
vErrors.push(err322);
}
errors++;
}
if(data142.billing_period_start === undefined){
const err323 = {instancePath:instancePath+"/utility_bills/" + i17,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "billing_period_start"},message:"must have required property '"+"billing_period_start"+"'"};
if(vErrors === null){
vErrors = [err323];
}
else {
vErrors.push(err323);
}
errors++;
}
if(data142.billing_period_end === undefined){
const err324 = {instancePath:instancePath+"/utility_bills/" + i17,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "billing_period_end"},message:"must have required property '"+"billing_period_end"+"'"};
if(vErrors === null){
vErrors = [err324];
}
else {
vErrors.push(err324);
}
errors++;
}
if(data142.usage_amount === undefined){
const err325 = {instancePath:instancePath+"/utility_bills/" + i17,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "usage_amount"},message:"must have required property '"+"usage_amount"+"'"};
if(vErrors === null){
vErrors = [err325];
}
else {
vErrors.push(err325);
}
errors++;
}
if(data142.usage_unit === undefined){
const err326 = {instancePath:instancePath+"/utility_bills/" + i17,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "usage_unit"},message:"must have required property '"+"usage_unit"+"'"};
if(vErrors === null){
vErrors = [err326];
}
else {
vErrors.push(err326);
}
errors++;
}
if(data142.source === undefined){
const err327 = {instancePath:instancePath+"/utility_bills/" + i17,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err327];
}
else {
vErrors.push(err327);
}
errors++;
}
for(const key13 in data142){
if(!(func1.call(schema31.properties.utility_bills.items.properties, key13))){
const err328 = {instancePath:instancePath+"/utility_bills/" + i17,schemaPath:"#/properties/utility_bills/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err328];
}
else {
vErrors.push(err328);
}
errors++;
}
}
if(data142.id !== undefined){
let data143 = data142.id;
if(typeof data143 === "string"){
if(!(formats0.test(data143))){
const err329 = {instancePath:instancePath+"/utility_bills/" + i17+"/id",schemaPath:"#/properties/utility_bills/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
const err330 = {instancePath:instancePath+"/utility_bills/" + i17+"/id",schemaPath:"#/properties/utility_bills/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err330];
}
else {
vErrors.push(err330);
}
errors++;
}
}
if(data142.home_id !== undefined){
let data144 = data142.home_id;
if(typeof data144 === "string"){
if(!(formats0.test(data144))){
const err331 = {instancePath:instancePath+"/utility_bills/" + i17+"/home_id",schemaPath:"#/properties/utility_bills/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err331];
}
else {
vErrors.push(err331);
}
errors++;
}
}
else {
const err332 = {instancePath:instancePath+"/utility_bills/" + i17+"/home_id",schemaPath:"#/properties/utility_bills/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err332];
}
else {
vErrors.push(err332);
}
errors++;
}
}
if(data142.utility_type !== undefined){
let data145 = data142.utility_type;
if(typeof data145 !== "string"){
const err333 = {instancePath:instancePath+"/utility_bills/" + i17+"/utility_type",schemaPath:"#/properties/utility_bills/items/properties/utility_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err333];
}
else {
vErrors.push(err333);
}
errors++;
}
if(!(((data145 === "gas") || (data145 === "electric")) || (data145 === "water"))){
const err334 = {instancePath:instancePath+"/utility_bills/" + i17+"/utility_type",schemaPath:"#/properties/utility_bills/items/properties/utility_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.utility_bills.items.properties.utility_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err334];
}
else {
vErrors.push(err334);
}
errors++;
}
}
if(data142.billing_period_start !== undefined){
let data146 = data142.billing_period_start;
if(typeof data146 === "string"){
if(!(formats30.validate(data146))){
const err335 = {instancePath:instancePath+"/utility_bills/" + i17+"/billing_period_start",schemaPath:"#/properties/utility_bills/items/properties/billing_period_start/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err335];
}
else {
vErrors.push(err335);
}
errors++;
}
}
else {
const err336 = {instancePath:instancePath+"/utility_bills/" + i17+"/billing_period_start",schemaPath:"#/properties/utility_bills/items/properties/billing_period_start/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err336];
}
else {
vErrors.push(err336);
}
errors++;
}
}
if(data142.billing_period_end !== undefined){
let data147 = data142.billing_period_end;
if(typeof data147 === "string"){
if(!(formats30.validate(data147))){
const err337 = {instancePath:instancePath+"/utility_bills/" + i17+"/billing_period_end",schemaPath:"#/properties/utility_bills/items/properties/billing_period_end/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err337];
}
else {
vErrors.push(err337);
}
errors++;
}
}
else {
const err338 = {instancePath:instancePath+"/utility_bills/" + i17+"/billing_period_end",schemaPath:"#/properties/utility_bills/items/properties/billing_period_end/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err338];
}
else {
vErrors.push(err338);
}
errors++;
}
}
if(data142.usage_amount !== undefined){
let data148 = data142.usage_amount;
if(!((typeof data148 == "number") && (isFinite(data148)))){
const err339 = {instancePath:instancePath+"/utility_bills/" + i17+"/usage_amount",schemaPath:"#/properties/utility_bills/items/properties/usage_amount/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err339];
}
else {
vErrors.push(err339);
}
errors++;
}
}
if(data142.usage_unit !== undefined){
if(typeof data142.usage_unit !== "string"){
const err340 = {instancePath:instancePath+"/utility_bills/" + i17+"/usage_unit",schemaPath:"#/properties/utility_bills/items/properties/usage_unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err340];
}
else {
vErrors.push(err340);
}
errors++;
}
}
if(data142.cost_cents !== undefined){
let data150 = data142.cost_cents;
if((!(((typeof data150 == "number") && (!(data150 % 1) && !isNaN(data150))) && (isFinite(data150)))) && (data150 !== null)){
const err341 = {instancePath:instancePath+"/utility_bills/" + i17+"/cost_cents",schemaPath:"#/properties/utility_bills/items/properties/cost_cents/type",keyword:"type",params:{type: schema31.properties.utility_bills.items.properties.cost_cents.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err341];
}
else {
vErrors.push(err341);
}
errors++;
}
}
if(data142.source !== undefined){
let data151 = data142.source;
if(typeof data151 !== "string"){
const err342 = {instancePath:instancePath+"/utility_bills/" + i17+"/source",schemaPath:"#/properties/utility_bills/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err342];
}
else {
vErrors.push(err342);
}
errors++;
}
if(!((data151 === "manual") || (data151 === "import"))){
const err343 = {instancePath:instancePath+"/utility_bills/" + i17+"/source",schemaPath:"#/properties/utility_bills/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.utility_bills.items.properties.source.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err343];
}
else {
vErrors.push(err343);
}
errors++;
}
}
if(data142.attachment_id !== undefined){
let data152 = data142.attachment_id;
if((typeof data152 !== "string") && (data152 !== null)){
const err344 = {instancePath:instancePath+"/utility_bills/" + i17+"/attachment_id",schemaPath:"#/properties/utility_bills/items/properties/attachment_id/type",keyword:"type",params:{type: schema31.properties.utility_bills.items.properties.attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err344];
}
else {
vErrors.push(err344);
}
errors++;
}
if(typeof data152 === "string"){
if(!(formats0.test(data152))){
const err345 = {instancePath:instancePath+"/utility_bills/" + i17+"/attachment_id",schemaPath:"#/properties/utility_bills/items/properties/attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err345];
}
else {
vErrors.push(err345);
}
errors++;
}
}
}
}
else {
const err346 = {instancePath:instancePath+"/utility_bills/" + i17,schemaPath:"#/properties/utility_bills/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err347 = {instancePath:instancePath+"/utility_bills",schemaPath:"#/properties/utility_bills/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
const err348 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err348];
}
else {
vErrors.push(err348);
}
errors++;
}
validate20.errors = vErrors;
return errors === 0;
}
validate20.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};
