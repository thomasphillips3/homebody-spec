// Generated from spec/schema. Do not edit directly.
"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema31 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://homebody.app/schema/home-record.schema.json","title":"HomeRecord","description":"Root document for a Home Record export. Flat, database-table-mirroring shape - one home, plus arrays of every other entity, each keyed by an id and its parent foreign keys rather than deep nesting.","type":"object","additionalProperties":false,"required":["schema_version","home","levels","rooms","plan_elements","systems","components","events","attachments","smart_home_readings","utility_bills"],"properties":{"schema_version":{"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$","enum":["0.1.0","0.1.1"],"description":"Semver of the Home Record spec this document conforms to, e.g. 0.1.1. Downstream import validation rejects unknown versions rather than duck-typing."},"home":{"title":"Home","type":"object","additionalProperties":false,"required":["id","owner_user_id","name","address","created_at"],"properties":{"id":{"type":"string","format":"uuid"},"owner_user_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"address":{"type":"string"},"parcel_id":{"type":["string","null"]},"year_built":{"type":["integer","null"]},"sq_ft":{"type":["number","null"]},"beds":{"type":["integer","null"]},"baths":{"type":["number","null"]},"lot_size_m2":{"type":["number","null"]},"created_at":{"type":"string","format":"date-time"}}},"levels":{"type":"array","items":{"title":"Level","type":"object","additionalProperties":false,"required":["id","home_id","name","sort_order","elevation_offset_m","scale_confidence"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"sort_order":{"type":"integer"},"elevation_offset_m":{"type":"number"},"scale_confidence":{"type":"string","enum":["measured","estimated"]}}},"default":[]},"rooms":{"type":"array","items":{"title":"Room","type":"object","additionalProperties":false,"required":["id","level_id","name","room_type","geometry"],"properties":{"id":{"type":"string","format":"uuid"},"level_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"room_type":{"type":"string","enum":["bedroom","bathroom","kitchen","living_room","dining_room","garage","basement","attic","hallway","closet","laundry","office","other"]},"geometry":{"allOf":[{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},{"type":"object","properties":{"type":{"const":"polygon"}}}]},"area_computed_m2":{"type":["number","null"]}}},"default":[]},"plan_elements":{"type":"array","items":{"title":"PlanElement","type":"object","additionalProperties":false,"required":["id","level_id","kind","geometry"],"properties":{"id":{"type":"string","format":"uuid"},"level_id":{"type":"string","format":"uuid"},"kind":{"type":"string","enum":["wall","door","window","opening"]},"geometry":{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},"host_element_id":{"type":["string","null"],"format":"uuid"}}},"default":[]},"systems":{"type":"array","items":{"title":"System","type":"object","additionalProperties":false,"required":["id","home_id","category","name"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"category":{"type":"string","enum":["plumbing","electrical","hvac","roof_structure","appliances_and_water_heater","exterior_and_site","low_voltage_and_smart_home"]},"name":{"type":"string"},"notes":{"type":["string","null"]}}},"default":[]},"components":{"type":"array","items":{"title":"Component","type":"object","additionalProperties":false,"required":["id","system_id","name","component_type","condition","room_ids","custom_fields"],"properties":{"id":{"type":"string","format":"uuid"},"system_id":{"type":"string","format":"uuid"},"name":{"type":"string"},"component_type":{"type":"string","enum":["water_heater","hvac_furnace","hvac_ac_unit","electrical_panel","outlet","light_fixture","plumbing_fixture","gutter","downspout","smoke_detector","thermostat","camera","network_router","appliance_generic","other"]},"make":{"type":["string","null"]},"model":{"type":["string","null"]},"serial_number":{"type":["string","null"]},"install_date":{"type":["string","null"],"format":"date"},"warranty_start":{"type":["string","null"],"format":"date"},"warranty_length_months":{"type":["integer","null"]},"manual_attachment_id":{"type":["string","null"],"format":"uuid"},"service_interval_days":{"type":["integer","null"]},"last_serviced_at":{"type":["string","null"],"format":"date"},"condition":{"title":"Condition","description":"Shared condition scale used by Component.condition and Event.condition_after, so the two cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for not-yet-assessed.","type":"string","enum":["good","fair","needs_attention","needs_replacement","unknown"]},"level_id":{"type":["string","null"],"format":"uuid"},"room_ids":{"type":"array","items":{"type":"string","format":"uuid"},"default":[]},"geometry":{"anyOf":[{"title":"PlanGeometry","description":"Shared geometry type embedded by Room, PlanElement, and Component. Coordinates are 2-element [x, y] pairs in meters, in per-level plan space (Y-down convention).","type":"object","additionalProperties":false,"required":["type","coordinates"],"allOf":[{"if":{"properties":{"type":{"const":"point"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":1,"maxItems":1}}}},{"if":{"properties":{"type":{"const":"polyline"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":2}}}},{"if":{"properties":{"type":{"const":"polygon"}},"required":["type"]},"then":{"properties":{"coordinates":{"type":"array","minItems":3}}}}],"properties":{"type":{"type":"string","enum":["point","polyline","polygon"]},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":2}}}},{"type":"null"}],"default":null},"notes":{"type":["string","null"]},"linked_component_id":{"type":["string","null"],"format":"uuid"},"custom_fields":{"type":"object","additionalProperties":true,"default":{}}}},"default":[]},"events":{"type":"array","items":{"title":"Event","type":"object","additionalProperties":false,"required":["id","home_id","event_type","occurred_at","attachment_ids"],"anyOf":[{"required":["system_id"],"properties":{"system_id":{"type":"string","format":"uuid"}}},{"required":["component_id"],"properties":{"component_id":{"type":"string","format":"uuid"}}}],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"system_id":{"type":["string","null"],"format":"uuid"},"component_id":{"type":["string","null"],"format":"uuid"},"event_type":{"type":"string","enum":["inspection","service","repair","replacement","reading","note"]},"occurred_at":{"type":"string","format":"date-time"},"performed_by":{"type":["string","null"]},"cost_cents":{"type":["integer","null"]},"notes":{"type":["string","null"]},"condition_after":{"anyOf":[{"title":"Condition","description":"Shared condition scale used by Component.condition and Event.condition_after, so the two cannot drift. Matches REQUIREMENTS.md SYS-08's four-value scale plus unknown for not-yet-assessed.","type":"string","enum":["good","fair","needs_attention","needs_replacement","unknown"]},{"type":"null"}],"default":null},"reading_value":{"type":["number","null"]},"reading_unit":{"type":["string","null"]},"attachment_ids":{"type":"array","items":{"type":"string","format":"uuid"},"default":[]}}},"default":[]},"attachments":{"type":"array","items":{"title":"Attachment","type":"object","additionalProperties":false,"required":["id","home_id","kind","storage_path","mime_type","file_size_bytes"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"kind":{"type":"string","enum":["photo","receipt","manual_pdf","usdz_mesh"]},"storage_path":{"type":"string","pattern":"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$","description":"Canonical owner-scoped Storage key: {owner_user_id}/homes/{home_id}/attachments/{attachment_id}.ext."},"mime_type":{"type":"string"},"file_size_bytes":{"type":"integer"},"captured_at":{"type":["string","null"],"format":"date-time"},"linked_event_id":{"type":["string","null"],"format":"uuid"},"linked_component_id":{"type":["string","null"],"format":"uuid"}}},"default":[]},"smart_home_readings":{"type":"array","items":{"title":"SmartHomeReading","type":"object","additionalProperties":false,"required":["id","component_id","source","metric","value","unit","recorded_at"],"properties":{"id":{"type":"string","format":"uuid"},"component_id":{"type":"string","format":"uuid"},"source":{"type":"string","enum":["homekit","ecobee","nest","other"]},"metric":{"type":"string"},"value":{"type":"number"},"unit":{"type":"string"},"recorded_at":{"type":"string","format":"date-time"}}},"default":[]},"utility_bills":{"type":"array","items":{"title":"UtilityBill","type":"object","additionalProperties":false,"required":["id","home_id","utility_type","billing_period_start","billing_period_end","usage_amount","usage_unit","source"],"properties":{"id":{"type":"string","format":"uuid"},"home_id":{"type":"string","format":"uuid"},"utility_type":{"type":"string","enum":["gas","electric","water"]},"billing_period_start":{"type":"string","format":"date"},"billing_period_end":{"type":"string","format":"date"},"usage_amount":{"type":"number"},"usage_unit":{"type":"string"},"cost_cents":{"type":["integer","null"]},"source":{"type":"string","enum":["manual","import"]},"attachment_id":{"type":["string","null"],"format":"uuid"}}},"default":[]}}};
const func1 = Object.prototype.hasOwnProperty;
const pattern4 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
const pattern5 = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$", "u");
const formats0 = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const formats4 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const formats28 = require("ajv-formats/dist/formats").fullFormats.date;

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
if(!((data0 === "0.1.0") || (data0 === "0.1.1"))){
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
if(!((((((key2 === "id") || (key2 === "home_id")) || (key2 === "name")) || (key2 === "sort_order")) || (key2 === "elevation_offset_m")) || (key2 === "scale_confidence"))){
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
}
else {
const err52 = {instancePath:instancePath+"/levels/" + i0,schemaPath:"#/properties/levels/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
}
else {
const err53 = {instancePath:instancePath+"/levels",schemaPath:"#/properties/levels/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data.rooms !== undefined){
let data21 = data.rooms;
if(Array.isArray(data21)){
const len1 = data21.length;
for(let i1=0; i1<len1; i1++){
let data22 = data21[i1];
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
if(data22.id === undefined){
const err54 = {instancePath:instancePath+"/rooms/" + i1,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
if(data22.level_id === undefined){
const err55 = {instancePath:instancePath+"/rooms/" + i1,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "level_id"},message:"must have required property '"+"level_id"+"'"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
if(data22.name === undefined){
const err56 = {instancePath:instancePath+"/rooms/" + i1,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
if(data22.room_type === undefined){
const err57 = {instancePath:instancePath+"/rooms/" + i1,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "room_type"},message:"must have required property '"+"room_type"+"'"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
if(data22.geometry === undefined){
const err58 = {instancePath:instancePath+"/rooms/" + i1,schemaPath:"#/properties/rooms/items/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
for(const key3 in data22){
if(!((((((key3 === "id") || (key3 === "level_id")) || (key3 === "name")) || (key3 === "room_type")) || (key3 === "geometry")) || (key3 === "area_computed_m2"))){
const err59 = {instancePath:instancePath+"/rooms/" + i1,schemaPath:"#/properties/rooms/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data22.id !== undefined){
let data23 = data22.id;
if(typeof data23 === "string"){
if(!(formats0.test(data23))){
const err60 = {instancePath:instancePath+"/rooms/" + i1+"/id",schemaPath:"#/properties/rooms/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
else {
const err61 = {instancePath:instancePath+"/rooms/" + i1+"/id",schemaPath:"#/properties/rooms/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
if(data22.level_id !== undefined){
let data24 = data22.level_id;
if(typeof data24 === "string"){
if(!(formats0.test(data24))){
const err62 = {instancePath:instancePath+"/rooms/" + i1+"/level_id",schemaPath:"#/properties/rooms/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
else {
const err63 = {instancePath:instancePath+"/rooms/" + i1+"/level_id",schemaPath:"#/properties/rooms/items/properties/level_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data22.name !== undefined){
if(typeof data22.name !== "string"){
const err64 = {instancePath:instancePath+"/rooms/" + i1+"/name",schemaPath:"#/properties/rooms/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data22.room_type !== undefined){
let data26 = data22.room_type;
if(typeof data26 !== "string"){
const err65 = {instancePath:instancePath+"/rooms/" + i1+"/room_type",schemaPath:"#/properties/rooms/items/properties/room_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(!(((((((((((((data26 === "bedroom") || (data26 === "bathroom")) || (data26 === "kitchen")) || (data26 === "living_room")) || (data26 === "dining_room")) || (data26 === "garage")) || (data26 === "basement")) || (data26 === "attic")) || (data26 === "hallway")) || (data26 === "closet")) || (data26 === "laundry")) || (data26 === "office")) || (data26 === "other"))){
const err66 = {instancePath:instancePath+"/rooms/" + i1+"/room_type",schemaPath:"#/properties/rooms/items/properties/room_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.rooms.items.properties.room_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data22.geometry !== undefined){
let data27 = data22.geometry;
const _errs63 = errors;
let valid10 = true;
const _errs64 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
let missing0;
if((data27.type === undefined) && (missing0 = "type")){
const err67 = {};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
else {
if(data27.type !== undefined){
if("point" !== data27.type){
const err68 = {};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
}
}
var _valid0 = _errs64 === errors;
errors = _errs63;
if(vErrors !== null){
if(_errs63){
vErrors.length = _errs63;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs66 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.coordinates !== undefined){
let data29 = data27.coordinates;
if(Array.isArray(data29)){
if(data29.length > 1){
const err69 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
if(data29.length < 1){
const err70 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
else {
const err71 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid0 = _errs66 === errors;
valid10 = _valid0;
if(valid10){
var props0 = {};
props0.coordinates = true;
props0.type = true;
}
}
if(!valid10){
const err72 = {instancePath:instancePath+"/rooms/" + i1+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
const _errs70 = errors;
let valid13 = true;
const _errs71 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
let missing1;
if((data27.type === undefined) && (missing1 = "type")){
const err73 = {};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
else {
if(data27.type !== undefined){
if("polyline" !== data27.type){
const err74 = {};
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
}
var _valid1 = _errs71 === errors;
errors = _errs70;
if(vErrors !== null){
if(_errs70){
vErrors.length = _errs70;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs73 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.coordinates !== undefined){
let data31 = data27.coordinates;
if(Array.isArray(data31)){
if(data31.length < 2){
const err75 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
else {
const err76 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
}
var _valid1 = _errs73 === errors;
valid13 = _valid1;
if(valid13){
var props1 = {};
props1.coordinates = true;
props1.type = true;
}
}
if(!valid13){
const err77 = {instancePath:instancePath+"/rooms/" + i1+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
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
const _errs77 = errors;
let valid16 = true;
const _errs78 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
let missing2;
if((data27.type === undefined) && (missing2 = "type")){
const err78 = {};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
else {
if(data27.type !== undefined){
if("polygon" !== data27.type){
const err79 = {};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
}
}
var _valid2 = _errs78 === errors;
errors = _errs77;
if(vErrors !== null){
if(_errs77){
vErrors.length = _errs77;
}
else {
vErrors = null;
}
}
if(_valid2){
const _errs80 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.coordinates !== undefined){
let data33 = data27.coordinates;
if(Array.isArray(data33)){
if(data33.length < 3){
const err80 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
else {
const err81 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid2 = _errs80 === errors;
valid16 = _valid2;
if(valid16){
var props2 = {};
props2.coordinates = true;
props2.type = true;
}
}
if(!valid16){
const err82 = {instancePath:instancePath+"/rooms/" + i1+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
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
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.type === undefined){
const err83 = {instancePath:instancePath+"/rooms/" + i1+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
if(data27.coordinates === undefined){
const err84 = {instancePath:instancePath+"/rooms/" + i1+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
for(const key4 in data27){
if(!((key4 === "type") || (key4 === "coordinates"))){
const err85 = {instancePath:instancePath+"/rooms/" + i1+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data27.type !== undefined){
let data34 = data27.type;
if(typeof data34 !== "string"){
const err86 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
if(!(((data34 === "point") || (data34 === "polyline")) || (data34 === "polygon"))){
const err87 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.rooms.items.properties.geometry.allOf[0].properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
if(data27.coordinates !== undefined){
let data35 = data27.coordinates;
if(Array.isArray(data35)){
const len2 = data35.length;
for(let i2=0; i2<len2; i2++){
let data36 = data35[i2];
if(Array.isArray(data36)){
if(data36.length > 2){
const err88 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates/" + i2,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data36.length < 2){
const err89 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates/" + i2,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
const len3 = data36.length;
for(let i3=0; i3<len3; i3++){
let data37 = data36[i3];
if(!((typeof data37 == "number") && (isFinite(data37)))){
const err90 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates/" + i2+"/" + i3,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
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
else {
const err91 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates/" + i2,schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
}
else {
const err92 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/coordinates",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
}
else {
const err93 = {instancePath:instancePath+"/rooms/" + i1+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.type !== undefined){
if("polygon" !== data27.type){
const err94 = {instancePath:instancePath+"/rooms/" + i1+"/geometry/type",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/1/properties/type/const",keyword:"const",params:{allowedValue: "polygon"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
}
else {
const err95 = {instancePath:instancePath+"/rooms/" + i1+"/geometry",schemaPath:"#/properties/rooms/items/properties/geometry/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
if(data22.area_computed_m2 !== undefined){
let data39 = data22.area_computed_m2;
if((!((typeof data39 == "number") && (isFinite(data39)))) && (data39 !== null)){
const err96 = {instancePath:instancePath+"/rooms/" + i1+"/area_computed_m2",schemaPath:"#/properties/rooms/items/properties/area_computed_m2/type",keyword:"type",params:{type: schema31.properties.rooms.items.properties.area_computed_m2.type},message:"must be number,null"};
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
else {
const err97 = {instancePath:instancePath+"/rooms/" + i1,schemaPath:"#/properties/rooms/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
else {
const err98 = {instancePath:instancePath+"/rooms",schemaPath:"#/properties/rooms/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
if(data.plan_elements !== undefined){
let data40 = data.plan_elements;
if(Array.isArray(data40)){
const len4 = data40.length;
for(let i4=0; i4<len4; i4++){
let data41 = data40[i4];
if(data41 && typeof data41 == "object" && !Array.isArray(data41)){
if(data41.id === undefined){
const err99 = {instancePath:instancePath+"/plan_elements/" + i4,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
if(data41.level_id === undefined){
const err100 = {instancePath:instancePath+"/plan_elements/" + i4,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "level_id"},message:"must have required property '"+"level_id"+"'"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
if(data41.kind === undefined){
const err101 = {instancePath:instancePath+"/plan_elements/" + i4,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
if(data41.geometry === undefined){
const err102 = {instancePath:instancePath+"/plan_elements/" + i4,schemaPath:"#/properties/plan_elements/items/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
for(const key5 in data41){
if(!(((((key5 === "id") || (key5 === "level_id")) || (key5 === "kind")) || (key5 === "geometry")) || (key5 === "host_element_id"))){
const err103 = {instancePath:instancePath+"/plan_elements/" + i4,schemaPath:"#/properties/plan_elements/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
if(data41.id !== undefined){
let data42 = data41.id;
if(typeof data42 === "string"){
if(!(formats0.test(data42))){
const err104 = {instancePath:instancePath+"/plan_elements/" + i4+"/id",schemaPath:"#/properties/plan_elements/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
const err105 = {instancePath:instancePath+"/plan_elements/" + i4+"/id",schemaPath:"#/properties/plan_elements/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
if(data41.level_id !== undefined){
let data43 = data41.level_id;
if(typeof data43 === "string"){
if(!(formats0.test(data43))){
const err106 = {instancePath:instancePath+"/plan_elements/" + i4+"/level_id",schemaPath:"#/properties/plan_elements/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
else {
const err107 = {instancePath:instancePath+"/plan_elements/" + i4+"/level_id",schemaPath:"#/properties/plan_elements/items/properties/level_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
if(data41.kind !== undefined){
let data44 = data41.kind;
if(typeof data44 !== "string"){
const err108 = {instancePath:instancePath+"/plan_elements/" + i4+"/kind",schemaPath:"#/properties/plan_elements/items/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(!((((data44 === "wall") || (data44 === "door")) || (data44 === "window")) || (data44 === "opening"))){
const err109 = {instancePath:instancePath+"/plan_elements/" + i4+"/kind",schemaPath:"#/properties/plan_elements/items/properties/kind/enum",keyword:"enum",params:{allowedValues: schema31.properties.plan_elements.items.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
if(data41.geometry !== undefined){
let data45 = data41.geometry;
const _errs111 = errors;
let valid29 = true;
const _errs112 = errors;
if(data45 && typeof data45 == "object" && !Array.isArray(data45)){
let missing3;
if((data45.type === undefined) && (missing3 = "type")){
const err110 = {};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
else {
if(data45.type !== undefined){
if("point" !== data45.type){
const err111 = {};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
}
}
var _valid3 = _errs112 === errors;
errors = _errs111;
if(vErrors !== null){
if(_errs111){
vErrors.length = _errs111;
}
else {
vErrors = null;
}
}
if(_valid3){
const _errs114 = errors;
if(data45 && typeof data45 == "object" && !Array.isArray(data45)){
if(data45.coordinates !== undefined){
let data47 = data45.coordinates;
if(Array.isArray(data47)){
if(data47.length > 1){
const err112 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
if(data47.length < 1){
const err113 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
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
const err114 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid3 = _errs114 === errors;
valid29 = _valid3;
if(valid29){
var props3 = {};
props3.coordinates = true;
props3.type = true;
}
}
if(!valid29){
const err115 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
const _errs118 = errors;
let valid32 = true;
const _errs119 = errors;
if(data45 && typeof data45 == "object" && !Array.isArray(data45)){
let missing4;
if((data45.type === undefined) && (missing4 = "type")){
const err116 = {};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
else {
if(data45.type !== undefined){
if("polyline" !== data45.type){
const err117 = {};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
}
}
var _valid4 = _errs119 === errors;
errors = _errs118;
if(vErrors !== null){
if(_errs118){
vErrors.length = _errs118;
}
else {
vErrors = null;
}
}
if(_valid4){
const _errs121 = errors;
if(data45 && typeof data45 == "object" && !Array.isArray(data45)){
if(data45.coordinates !== undefined){
let data49 = data45.coordinates;
if(Array.isArray(data49)){
if(data49.length < 2){
const err118 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
else {
const err119 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid4 = _errs121 === errors;
valid32 = _valid4;
if(valid32){
var props4 = {};
props4.coordinates = true;
props4.type = true;
}
}
if(!valid32){
const err120 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
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
const _errs125 = errors;
let valid35 = true;
const _errs126 = errors;
if(data45 && typeof data45 == "object" && !Array.isArray(data45)){
let missing5;
if((data45.type === undefined) && (missing5 = "type")){
const err121 = {};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
else {
if(data45.type !== undefined){
if("polygon" !== data45.type){
const err122 = {};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
}
}
var _valid5 = _errs126 === errors;
errors = _errs125;
if(vErrors !== null){
if(_errs125){
vErrors.length = _errs125;
}
else {
vErrors = null;
}
}
if(_valid5){
const _errs128 = errors;
if(data45 && typeof data45 == "object" && !Array.isArray(data45)){
if(data45.coordinates !== undefined){
let data51 = data45.coordinates;
if(Array.isArray(data51)){
if(data51.length < 3){
const err123 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
else {
const err124 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
}
var _valid5 = _errs128 === errors;
valid35 = _valid5;
if(valid35){
var props5 = {};
props5.coordinates = true;
props5.type = true;
}
}
if(!valid35){
const err125 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
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
if(data45 && typeof data45 == "object" && !Array.isArray(data45)){
if(data45.type === undefined){
const err126 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
if(data45.coordinates === undefined){
const err127 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
for(const key6 in data45){
if(!((key6 === "type") || (key6 === "coordinates"))){
const err128 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
if(data45.type !== undefined){
let data52 = data45.type;
if(typeof data52 !== "string"){
const err129 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/type",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
if(!(((data52 === "point") || (data52 === "polyline")) || (data52 === "polygon"))){
const err130 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/type",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.plan_elements.items.properties.geometry.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
}
if(data45.coordinates !== undefined){
let data53 = data45.coordinates;
if(Array.isArray(data53)){
const len5 = data53.length;
for(let i5=0; i5<len5; i5++){
let data54 = data53[i5];
if(Array.isArray(data54)){
if(data54.length > 2){
const err131 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates/" + i5,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(data54.length < 2){
const err132 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates/" + i5,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
const len6 = data54.length;
for(let i6=0; i6<len6; i6++){
let data55 = data54[i6];
if(!((typeof data55 == "number") && (isFinite(data55)))){
const err133 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates/" + i5+"/" + i6,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
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
else {
const err134 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates/" + i5,schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
}
else {
const err135 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry/coordinates",schemaPath:"#/properties/plan_elements/items/properties/geometry/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
else {
const err136 = {instancePath:instancePath+"/plan_elements/" + i4+"/geometry",schemaPath:"#/properties/plan_elements/items/properties/geometry/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
}
if(data41.host_element_id !== undefined){
let data56 = data41.host_element_id;
if((typeof data56 !== "string") && (data56 !== null)){
const err137 = {instancePath:instancePath+"/plan_elements/" + i4+"/host_element_id",schemaPath:"#/properties/plan_elements/items/properties/host_element_id/type",keyword:"type",params:{type: schema31.properties.plan_elements.items.properties.host_element_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
if(typeof data56 === "string"){
if(!(formats0.test(data56))){
const err138 = {instancePath:instancePath+"/plan_elements/" + i4+"/host_element_id",schemaPath:"#/properties/plan_elements/items/properties/host_element_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
}
else {
const err139 = {instancePath:instancePath+"/plan_elements/" + i4,schemaPath:"#/properties/plan_elements/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
}
else {
const err140 = {instancePath:instancePath+"/plan_elements",schemaPath:"#/properties/plan_elements/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
if(data.systems !== undefined){
let data57 = data.systems;
if(Array.isArray(data57)){
const len7 = data57.length;
for(let i7=0; i7<len7; i7++){
let data58 = data57[i7];
if(data58 && typeof data58 == "object" && !Array.isArray(data58)){
if(data58.id === undefined){
const err141 = {instancePath:instancePath+"/systems/" + i7,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
if(data58.home_id === undefined){
const err142 = {instancePath:instancePath+"/systems/" + i7,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
if(data58.category === undefined){
const err143 = {instancePath:instancePath+"/systems/" + i7,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "category"},message:"must have required property '"+"category"+"'"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
if(data58.name === undefined){
const err144 = {instancePath:instancePath+"/systems/" + i7,schemaPath:"#/properties/systems/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
for(const key7 in data58){
if(!(((((key7 === "id") || (key7 === "home_id")) || (key7 === "category")) || (key7 === "name")) || (key7 === "notes"))){
const err145 = {instancePath:instancePath+"/systems/" + i7,schemaPath:"#/properties/systems/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data58.id !== undefined){
let data59 = data58.id;
if(typeof data59 === "string"){
if(!(formats0.test(data59))){
const err146 = {instancePath:instancePath+"/systems/" + i7+"/id",schemaPath:"#/properties/systems/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
}
else {
const err147 = {instancePath:instancePath+"/systems/" + i7+"/id",schemaPath:"#/properties/systems/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
if(data58.home_id !== undefined){
let data60 = data58.home_id;
if(typeof data60 === "string"){
if(!(formats0.test(data60))){
const err148 = {instancePath:instancePath+"/systems/" + i7+"/home_id",schemaPath:"#/properties/systems/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
}
else {
const err149 = {instancePath:instancePath+"/systems/" + i7+"/home_id",schemaPath:"#/properties/systems/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
if(data58.category !== undefined){
let data61 = data58.category;
if(typeof data61 !== "string"){
const err150 = {instancePath:instancePath+"/systems/" + i7+"/category",schemaPath:"#/properties/systems/items/properties/category/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
if(!(((((((data61 === "plumbing") || (data61 === "electrical")) || (data61 === "hvac")) || (data61 === "roof_structure")) || (data61 === "appliances_and_water_heater")) || (data61 === "exterior_and_site")) || (data61 === "low_voltage_and_smart_home"))){
const err151 = {instancePath:instancePath+"/systems/" + i7+"/category",schemaPath:"#/properties/systems/items/properties/category/enum",keyword:"enum",params:{allowedValues: schema31.properties.systems.items.properties.category.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
}
if(data58.name !== undefined){
if(typeof data58.name !== "string"){
const err152 = {instancePath:instancePath+"/systems/" + i7+"/name",schemaPath:"#/properties/systems/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
}
if(data58.notes !== undefined){
let data63 = data58.notes;
if((typeof data63 !== "string") && (data63 !== null)){
const err153 = {instancePath:instancePath+"/systems/" + i7+"/notes",schemaPath:"#/properties/systems/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.systems.items.properties.notes.type},message:"must be string,null"};
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
else {
const err154 = {instancePath:instancePath+"/systems/" + i7,schemaPath:"#/properties/systems/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
}
}
else {
const err155 = {instancePath:instancePath+"/systems",schemaPath:"#/properties/systems/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
}
if(data.components !== undefined){
let data64 = data.components;
if(Array.isArray(data64)){
const len8 = data64.length;
for(let i8=0; i8<len8; i8++){
let data65 = data64[i8];
if(data65 && typeof data65 == "object" && !Array.isArray(data65)){
if(data65.id === undefined){
const err156 = {instancePath:instancePath+"/components/" + i8,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
if(data65.system_id === undefined){
const err157 = {instancePath:instancePath+"/components/" + i8,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "system_id"},message:"must have required property '"+"system_id"+"'"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
if(data65.name === undefined){
const err158 = {instancePath:instancePath+"/components/" + i8,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
if(data65.component_type === undefined){
const err159 = {instancePath:instancePath+"/components/" + i8,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "component_type"},message:"must have required property '"+"component_type"+"'"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
if(data65.condition === undefined){
const err160 = {instancePath:instancePath+"/components/" + i8,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "condition"},message:"must have required property '"+"condition"+"'"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
if(data65.room_ids === undefined){
const err161 = {instancePath:instancePath+"/components/" + i8,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "room_ids"},message:"must have required property '"+"room_ids"+"'"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
if(data65.custom_fields === undefined){
const err162 = {instancePath:instancePath+"/components/" + i8,schemaPath:"#/properties/components/items/required",keyword:"required",params:{missingProperty: "custom_fields"},message:"must have required property '"+"custom_fields"+"'"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
for(const key8 in data65){
if(!(func1.call(schema31.properties.components.items.properties, key8))){
const err163 = {instancePath:instancePath+"/components/" + i8,schemaPath:"#/properties/components/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
if(data65.id !== undefined){
let data66 = data65.id;
if(typeof data66 === "string"){
if(!(formats0.test(data66))){
const err164 = {instancePath:instancePath+"/components/" + i8+"/id",schemaPath:"#/properties/components/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
else {
const err165 = {instancePath:instancePath+"/components/" + i8+"/id",schemaPath:"#/properties/components/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
if(data65.system_id !== undefined){
let data67 = data65.system_id;
if(typeof data67 === "string"){
if(!(formats0.test(data67))){
const err166 = {instancePath:instancePath+"/components/" + i8+"/system_id",schemaPath:"#/properties/components/items/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
}
else {
const err167 = {instancePath:instancePath+"/components/" + i8+"/system_id",schemaPath:"#/properties/components/items/properties/system_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
}
if(data65.name !== undefined){
if(typeof data65.name !== "string"){
const err168 = {instancePath:instancePath+"/components/" + i8+"/name",schemaPath:"#/properties/components/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
}
if(data65.component_type !== undefined){
let data69 = data65.component_type;
if(typeof data69 !== "string"){
const err169 = {instancePath:instancePath+"/components/" + i8+"/component_type",schemaPath:"#/properties/components/items/properties/component_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if(!(((((((((((((((data69 === "water_heater") || (data69 === "hvac_furnace")) || (data69 === "hvac_ac_unit")) || (data69 === "electrical_panel")) || (data69 === "outlet")) || (data69 === "light_fixture")) || (data69 === "plumbing_fixture")) || (data69 === "gutter")) || (data69 === "downspout")) || (data69 === "smoke_detector")) || (data69 === "thermostat")) || (data69 === "camera")) || (data69 === "network_router")) || (data69 === "appliance_generic")) || (data69 === "other"))){
const err170 = {instancePath:instancePath+"/components/" + i8+"/component_type",schemaPath:"#/properties/components/items/properties/component_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.component_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
}
if(data65.make !== undefined){
let data70 = data65.make;
if((typeof data70 !== "string") && (data70 !== null)){
const err171 = {instancePath:instancePath+"/components/" + i8+"/make",schemaPath:"#/properties/components/items/properties/make/type",keyword:"type",params:{type: schema31.properties.components.items.properties.make.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
}
if(data65.model !== undefined){
let data71 = data65.model;
if((typeof data71 !== "string") && (data71 !== null)){
const err172 = {instancePath:instancePath+"/components/" + i8+"/model",schemaPath:"#/properties/components/items/properties/model/type",keyword:"type",params:{type: schema31.properties.components.items.properties.model.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
}
if(data65.serial_number !== undefined){
let data72 = data65.serial_number;
if((typeof data72 !== "string") && (data72 !== null)){
const err173 = {instancePath:instancePath+"/components/" + i8+"/serial_number",schemaPath:"#/properties/components/items/properties/serial_number/type",keyword:"type",params:{type: schema31.properties.components.items.properties.serial_number.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
}
if(data65.install_date !== undefined){
let data73 = data65.install_date;
if((typeof data73 !== "string") && (data73 !== null)){
const err174 = {instancePath:instancePath+"/components/" + i8+"/install_date",schemaPath:"#/properties/components/items/properties/install_date/type",keyword:"type",params:{type: schema31.properties.components.items.properties.install_date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
if(typeof data73 === "string"){
if(!(formats28.validate(data73))){
const err175 = {instancePath:instancePath+"/components/" + i8+"/install_date",schemaPath:"#/properties/components/items/properties/install_date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
}
}
if(data65.warranty_start !== undefined){
let data74 = data65.warranty_start;
if((typeof data74 !== "string") && (data74 !== null)){
const err176 = {instancePath:instancePath+"/components/" + i8+"/warranty_start",schemaPath:"#/properties/components/items/properties/warranty_start/type",keyword:"type",params:{type: schema31.properties.components.items.properties.warranty_start.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
if(typeof data74 === "string"){
if(!(formats28.validate(data74))){
const err177 = {instancePath:instancePath+"/components/" + i8+"/warranty_start",schemaPath:"#/properties/components/items/properties/warranty_start/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
}
}
if(data65.warranty_length_months !== undefined){
let data75 = data65.warranty_length_months;
if((!(((typeof data75 == "number") && (!(data75 % 1) && !isNaN(data75))) && (isFinite(data75)))) && (data75 !== null)){
const err178 = {instancePath:instancePath+"/components/" + i8+"/warranty_length_months",schemaPath:"#/properties/components/items/properties/warranty_length_months/type",keyword:"type",params:{type: schema31.properties.components.items.properties.warranty_length_months.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
}
if(data65.manual_attachment_id !== undefined){
let data76 = data65.manual_attachment_id;
if((typeof data76 !== "string") && (data76 !== null)){
const err179 = {instancePath:instancePath+"/components/" + i8+"/manual_attachment_id",schemaPath:"#/properties/components/items/properties/manual_attachment_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.manual_attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
if(typeof data76 === "string"){
if(!(formats0.test(data76))){
const err180 = {instancePath:instancePath+"/components/" + i8+"/manual_attachment_id",schemaPath:"#/properties/components/items/properties/manual_attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
if(data65.service_interval_days !== undefined){
let data77 = data65.service_interval_days;
if((!(((typeof data77 == "number") && (!(data77 % 1) && !isNaN(data77))) && (isFinite(data77)))) && (data77 !== null)){
const err181 = {instancePath:instancePath+"/components/" + i8+"/service_interval_days",schemaPath:"#/properties/components/items/properties/service_interval_days/type",keyword:"type",params:{type: schema31.properties.components.items.properties.service_interval_days.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
}
if(data65.last_serviced_at !== undefined){
let data78 = data65.last_serviced_at;
if((typeof data78 !== "string") && (data78 !== null)){
const err182 = {instancePath:instancePath+"/components/" + i8+"/last_serviced_at",schemaPath:"#/properties/components/items/properties/last_serviced_at/type",keyword:"type",params:{type: schema31.properties.components.items.properties.last_serviced_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
if(typeof data78 === "string"){
if(!(formats28.validate(data78))){
const err183 = {instancePath:instancePath+"/components/" + i8+"/last_serviced_at",schemaPath:"#/properties/components/items/properties/last_serviced_at/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
}
}
if(data65.condition !== undefined){
let data79 = data65.condition;
if(typeof data79 !== "string"){
const err184 = {instancePath:instancePath+"/components/" + i8+"/condition",schemaPath:"#/properties/components/items/properties/condition/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
if(!(((((data79 === "good") || (data79 === "fair")) || (data79 === "needs_attention")) || (data79 === "needs_replacement")) || (data79 === "unknown"))){
const err185 = {instancePath:instancePath+"/components/" + i8+"/condition",schemaPath:"#/properties/components/items/properties/condition/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.condition.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
}
if(data65.level_id !== undefined){
let data80 = data65.level_id;
if((typeof data80 !== "string") && (data80 !== null)){
const err186 = {instancePath:instancePath+"/components/" + i8+"/level_id",schemaPath:"#/properties/components/items/properties/level_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.level_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
if(typeof data80 === "string"){
if(!(formats0.test(data80))){
const err187 = {instancePath:instancePath+"/components/" + i8+"/level_id",schemaPath:"#/properties/components/items/properties/level_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
if(data65.room_ids !== undefined){
let data81 = data65.room_ids;
if(Array.isArray(data81)){
const len9 = data81.length;
for(let i9=0; i9<len9; i9++){
let data82 = data81[i9];
if(typeof data82 === "string"){
if(!(formats0.test(data82))){
const err188 = {instancePath:instancePath+"/components/" + i8+"/room_ids/" + i9,schemaPath:"#/properties/components/items/properties/room_ids/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
}
else {
const err189 = {instancePath:instancePath+"/components/" + i8+"/room_ids/" + i9,schemaPath:"#/properties/components/items/properties/room_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
else {
const err190 = {instancePath:instancePath+"/components/" + i8+"/room_ids",schemaPath:"#/properties/components/items/properties/room_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
}
if(data65.geometry !== undefined){
let data83 = data65.geometry;
const _errs197 = errors;
let valid51 = false;
const _errs198 = errors;
const _errs201 = errors;
let valid53 = true;
const _errs202 = errors;
if(data83 && typeof data83 == "object" && !Array.isArray(data83)){
let missing6;
if((data83.type === undefined) && (missing6 = "type")){
const err191 = {};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
else {
if(data83.type !== undefined){
if("point" !== data83.type){
const err192 = {};
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
}
var _valid7 = _errs202 === errors;
errors = _errs201;
if(vErrors !== null){
if(_errs201){
vErrors.length = _errs201;
}
else {
vErrors = null;
}
}
if(_valid7){
const _errs204 = errors;
if(data83 && typeof data83 == "object" && !Array.isArray(data83)){
if(data83.coordinates !== undefined){
let data85 = data83.coordinates;
if(Array.isArray(data85)){
if(data85.length > 1){
const err193 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
if(data85.length < 1){
const err194 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
}
else {
const err195 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
}
}
var _valid7 = _errs204 === errors;
valid53 = _valid7;
if(valid53){
var props6 = {};
props6.coordinates = true;
props6.type = true;
}
}
if(!valid53){
const err196 = {instancePath:instancePath+"/components/" + i8+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
const _errs208 = errors;
let valid56 = true;
const _errs209 = errors;
if(data83 && typeof data83 == "object" && !Array.isArray(data83)){
let missing7;
if((data83.type === undefined) && (missing7 = "type")){
const err197 = {};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
else {
if(data83.type !== undefined){
if("polyline" !== data83.type){
const err198 = {};
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
}
var _valid8 = _errs209 === errors;
errors = _errs208;
if(vErrors !== null){
if(_errs208){
vErrors.length = _errs208;
}
else {
vErrors = null;
}
}
if(_valid8){
const _errs211 = errors;
if(data83 && typeof data83 == "object" && !Array.isArray(data83)){
if(data83.coordinates !== undefined){
let data87 = data83.coordinates;
if(Array.isArray(data87)){
if(data87.length < 2){
const err199 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
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
const err200 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
var _valid8 = _errs211 === errors;
valid56 = _valid8;
if(valid56){
var props7 = {};
props7.coordinates = true;
props7.type = true;
}
}
if(!valid56){
const err201 = {instancePath:instancePath+"/components/" + i8+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
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
const _errs215 = errors;
let valid59 = true;
const _errs216 = errors;
if(data83 && typeof data83 == "object" && !Array.isArray(data83)){
let missing8;
if((data83.type === undefined) && (missing8 = "type")){
const err202 = {};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
else {
if(data83.type !== undefined){
if("polygon" !== data83.type){
const err203 = {};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
}
}
}
var _valid9 = _errs216 === errors;
errors = _errs215;
if(vErrors !== null){
if(_errs215){
vErrors.length = _errs215;
}
else {
vErrors = null;
}
}
if(_valid9){
const _errs218 = errors;
if(data83 && typeof data83 == "object" && !Array.isArray(data83)){
if(data83.coordinates !== undefined){
let data89 = data83.coordinates;
if(Array.isArray(data89)){
if(data89.length < 3){
const err204 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/then/properties/coordinates/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
}
else {
const err205 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/then/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
}
}
var _valid9 = _errs218 === errors;
valid59 = _valid9;
if(valid59){
var props8 = {};
props8.coordinates = true;
props8.type = true;
}
}
if(!valid59){
const err206 = {instancePath:instancePath+"/components/" + i8+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
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
if(data83 && typeof data83 == "object" && !Array.isArray(data83)){
if(data83.type === undefined){
const err207 = {instancePath:instancePath+"/components/" + i8+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
if(data83.coordinates === undefined){
const err208 = {instancePath:instancePath+"/components/" + i8+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
for(const key9 in data83){
if(!((key9 === "type") || (key9 === "coordinates"))){
const err209 = {instancePath:instancePath+"/components/" + i8+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err209];
}
else {
vErrors.push(err209);
}
errors++;
}
}
if(data83.type !== undefined){
let data90 = data83.type;
if(typeof data90 !== "string"){
const err210 = {instancePath:instancePath+"/components/" + i8+"/geometry/type",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
if(!(((data90 === "point") || (data90 === "polyline")) || (data90 === "polygon"))){
const err211 = {instancePath:instancePath+"/components/" + i8+"/geometry/type",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/type/enum",keyword:"enum",params:{allowedValues: schema31.properties.components.items.properties.geometry.anyOf[0].properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
}
if(data83.coordinates !== undefined){
let data91 = data83.coordinates;
if(Array.isArray(data91)){
const len10 = data91.length;
for(let i10=0; i10<len10; i10++){
let data92 = data91[i10];
if(Array.isArray(data92)){
if(data92.length > 2){
const err212 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates/" + i10,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err212];
}
else {
vErrors.push(err212);
}
errors++;
}
if(data92.length < 2){
const err213 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates/" + i10,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
const len11 = data92.length;
for(let i11=0; i11<len11; i11++){
let data93 = data92[i11];
if(!((typeof data93 == "number") && (isFinite(data93)))){
const err214 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates/" + i10+"/" + i11,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
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
else {
const err215 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates/" + i10,schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
}
errors++;
}
}
}
else {
const err216 = {instancePath:instancePath+"/components/" + i8+"/geometry/coordinates",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
else {
const err217 = {instancePath:instancePath+"/components/" + i8+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
var _valid6 = _errs198 === errors;
valid51 = valid51 || _valid6;
const _errs230 = errors;
if(data83 !== null){
const err218 = {instancePath:instancePath+"/components/" + i8+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err218];
}
else {
vErrors.push(err218);
}
errors++;
}
var _valid6 = _errs230 === errors;
valid51 = valid51 || _valid6;
if(!valid51){
const err219 = {instancePath:instancePath+"/components/" + i8+"/geometry",schemaPath:"#/properties/components/items/properties/geometry/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err219];
}
else {
vErrors.push(err219);
}
errors++;
}
else {
errors = _errs197;
if(vErrors !== null){
if(_errs197){
vErrors.length = _errs197;
}
else {
vErrors = null;
}
}
}
}
if(data65.notes !== undefined){
let data94 = data65.notes;
if((typeof data94 !== "string") && (data94 !== null)){
const err220 = {instancePath:instancePath+"/components/" + i8+"/notes",schemaPath:"#/properties/components/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.components.items.properties.notes.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err220];
}
else {
vErrors.push(err220);
}
errors++;
}
}
if(data65.linked_component_id !== undefined){
let data95 = data65.linked_component_id;
if((typeof data95 !== "string") && (data95 !== null)){
const err221 = {instancePath:instancePath+"/components/" + i8+"/linked_component_id",schemaPath:"#/properties/components/items/properties/linked_component_id/type",keyword:"type",params:{type: schema31.properties.components.items.properties.linked_component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err221];
}
else {
vErrors.push(err221);
}
errors++;
}
if(typeof data95 === "string"){
if(!(formats0.test(data95))){
const err222 = {instancePath:instancePath+"/components/" + i8+"/linked_component_id",schemaPath:"#/properties/components/items/properties/linked_component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err222];
}
else {
vErrors.push(err222);
}
errors++;
}
}
}
if(data65.custom_fields !== undefined){
let data96 = data65.custom_fields;
if(data96 && typeof data96 == "object" && !Array.isArray(data96)){
}
else {
const err223 = {instancePath:instancePath+"/components/" + i8+"/custom_fields",schemaPath:"#/properties/components/items/properties/custom_fields/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err224 = {instancePath:instancePath+"/components/" + i8,schemaPath:"#/properties/components/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err225 = {instancePath:instancePath+"/components",schemaPath:"#/properties/components/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err225];
}
else {
vErrors.push(err225);
}
errors++;
}
}
if(data.events !== undefined){
let data97 = data.events;
if(Array.isArray(data97)){
const len12 = data97.length;
for(let i12=0; i12<len12; i12++){
let data98 = data97[i12];
const _errs243 = errors;
let valid69 = false;
const _errs244 = errors;
if(data98 && typeof data98 == "object" && !Array.isArray(data98)){
if(data98.system_id === undefined){
const err226 = {instancePath:instancePath+"/events/" + i12,schemaPath:"#/properties/events/items/anyOf/0/required",keyword:"required",params:{missingProperty: "system_id"},message:"must have required property '"+"system_id"+"'"};
if(vErrors === null){
vErrors = [err226];
}
else {
vErrors.push(err226);
}
errors++;
}
if(data98.system_id !== undefined){
let data99 = data98.system_id;
if(typeof data99 === "string"){
if(!(formats0.test(data99))){
const err227 = {instancePath:instancePath+"/events/" + i12+"/system_id",schemaPath:"#/properties/events/items/anyOf/0/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err227];
}
else {
vErrors.push(err227);
}
errors++;
}
}
else {
const err228 = {instancePath:instancePath+"/events/" + i12+"/system_id",schemaPath:"#/properties/events/items/anyOf/0/properties/system_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
var _valid10 = _errs244 === errors;
valid69 = valid69 || _valid10;
if(_valid10){
var props10 = {};
props10.system_id = true;
}
const _errs247 = errors;
if(data98 && typeof data98 == "object" && !Array.isArray(data98)){
if(data98.component_id === undefined){
const err229 = {instancePath:instancePath+"/events/" + i12,schemaPath:"#/properties/events/items/anyOf/1/required",keyword:"required",params:{missingProperty: "component_id"},message:"must have required property '"+"component_id"+"'"};
if(vErrors === null){
vErrors = [err229];
}
else {
vErrors.push(err229);
}
errors++;
}
if(data98.component_id !== undefined){
let data100 = data98.component_id;
if(typeof data100 === "string"){
if(!(formats0.test(data100))){
const err230 = {instancePath:instancePath+"/events/" + i12+"/component_id",schemaPath:"#/properties/events/items/anyOf/1/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
const err231 = {instancePath:instancePath+"/events/" + i12+"/component_id",schemaPath:"#/properties/events/items/anyOf/1/properties/component_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
var _valid10 = _errs247 === errors;
valid69 = valid69 || _valid10;
if(_valid10){
if(props10 !== true){
props10 = props10 || {};
props10.component_id = true;
}
}
if(!valid69){
const err232 = {instancePath:instancePath+"/events/" + i12,schemaPath:"#/properties/events/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err232];
}
else {
vErrors.push(err232);
}
errors++;
}
else {
errors = _errs243;
if(vErrors !== null){
if(_errs243){
vErrors.length = _errs243;
}
else {
vErrors = null;
}
}
}
if(data98 && typeof data98 == "object" && !Array.isArray(data98)){
if(data98.id === undefined){
const err233 = {instancePath:instancePath+"/events/" + i12,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err233];
}
else {
vErrors.push(err233);
}
errors++;
}
if(data98.home_id === undefined){
const err234 = {instancePath:instancePath+"/events/" + i12,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err234];
}
else {
vErrors.push(err234);
}
errors++;
}
if(data98.event_type === undefined){
const err235 = {instancePath:instancePath+"/events/" + i12,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "event_type"},message:"must have required property '"+"event_type"+"'"};
if(vErrors === null){
vErrors = [err235];
}
else {
vErrors.push(err235);
}
errors++;
}
if(data98.occurred_at === undefined){
const err236 = {instancePath:instancePath+"/events/" + i12,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "occurred_at"},message:"must have required property '"+"occurred_at"+"'"};
if(vErrors === null){
vErrors = [err236];
}
else {
vErrors.push(err236);
}
errors++;
}
if(data98.attachment_ids === undefined){
const err237 = {instancePath:instancePath+"/events/" + i12,schemaPath:"#/properties/events/items/required",keyword:"required",params:{missingProperty: "attachment_ids"},message:"must have required property '"+"attachment_ids"+"'"};
if(vErrors === null){
vErrors = [err237];
}
else {
vErrors.push(err237);
}
errors++;
}
for(const key10 in data98){
if(!(func1.call(schema31.properties.events.items.properties, key10))){
const err238 = {instancePath:instancePath+"/events/" + i12,schemaPath:"#/properties/events/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err238];
}
else {
vErrors.push(err238);
}
errors++;
}
}
if(data98.id !== undefined){
let data101 = data98.id;
if(typeof data101 === "string"){
if(!(formats0.test(data101))){
const err239 = {instancePath:instancePath+"/events/" + i12+"/id",schemaPath:"#/properties/events/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
const err240 = {instancePath:instancePath+"/events/" + i12+"/id",schemaPath:"#/properties/events/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err240];
}
else {
vErrors.push(err240);
}
errors++;
}
}
if(data98.home_id !== undefined){
let data102 = data98.home_id;
if(typeof data102 === "string"){
if(!(formats0.test(data102))){
const err241 = {instancePath:instancePath+"/events/" + i12+"/home_id",schemaPath:"#/properties/events/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err241];
}
else {
vErrors.push(err241);
}
errors++;
}
}
else {
const err242 = {instancePath:instancePath+"/events/" + i12+"/home_id",schemaPath:"#/properties/events/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err242];
}
else {
vErrors.push(err242);
}
errors++;
}
}
if(data98.system_id !== undefined){
let data103 = data98.system_id;
if((typeof data103 !== "string") && (data103 !== null)){
const err243 = {instancePath:instancePath+"/events/" + i12+"/system_id",schemaPath:"#/properties/events/items/properties/system_id/type",keyword:"type",params:{type: schema31.properties.events.items.properties.system_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err243];
}
else {
vErrors.push(err243);
}
errors++;
}
if(typeof data103 === "string"){
if(!(formats0.test(data103))){
const err244 = {instancePath:instancePath+"/events/" + i12+"/system_id",schemaPath:"#/properties/events/items/properties/system_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
if(data98.component_id !== undefined){
let data104 = data98.component_id;
if((typeof data104 !== "string") && (data104 !== null)){
const err245 = {instancePath:instancePath+"/events/" + i12+"/component_id",schemaPath:"#/properties/events/items/properties/component_id/type",keyword:"type",params:{type: schema31.properties.events.items.properties.component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err245];
}
else {
vErrors.push(err245);
}
errors++;
}
if(typeof data104 === "string"){
if(!(formats0.test(data104))){
const err246 = {instancePath:instancePath+"/events/" + i12+"/component_id",schemaPath:"#/properties/events/items/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err246];
}
else {
vErrors.push(err246);
}
errors++;
}
}
}
if(data98.event_type !== undefined){
let data105 = data98.event_type;
if(typeof data105 !== "string"){
const err247 = {instancePath:instancePath+"/events/" + i12+"/event_type",schemaPath:"#/properties/events/items/properties/event_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err247];
}
else {
vErrors.push(err247);
}
errors++;
}
if(!((((((data105 === "inspection") || (data105 === "service")) || (data105 === "repair")) || (data105 === "replacement")) || (data105 === "reading")) || (data105 === "note"))){
const err248 = {instancePath:instancePath+"/events/" + i12+"/event_type",schemaPath:"#/properties/events/items/properties/event_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.events.items.properties.event_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err248];
}
else {
vErrors.push(err248);
}
errors++;
}
}
if(data98.occurred_at !== undefined){
let data106 = data98.occurred_at;
if(typeof data106 === "string"){
if(!(formats4.validate(data106))){
const err249 = {instancePath:instancePath+"/events/" + i12+"/occurred_at",schemaPath:"#/properties/events/items/properties/occurred_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err249];
}
else {
vErrors.push(err249);
}
errors++;
}
}
else {
const err250 = {instancePath:instancePath+"/events/" + i12+"/occurred_at",schemaPath:"#/properties/events/items/properties/occurred_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err250];
}
else {
vErrors.push(err250);
}
errors++;
}
}
if(data98.performed_by !== undefined){
let data107 = data98.performed_by;
if((typeof data107 !== "string") && (data107 !== null)){
const err251 = {instancePath:instancePath+"/events/" + i12+"/performed_by",schemaPath:"#/properties/events/items/properties/performed_by/type",keyword:"type",params:{type: schema31.properties.events.items.properties.performed_by.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err251];
}
else {
vErrors.push(err251);
}
errors++;
}
}
if(data98.cost_cents !== undefined){
let data108 = data98.cost_cents;
if((!(((typeof data108 == "number") && (!(data108 % 1) && !isNaN(data108))) && (isFinite(data108)))) && (data108 !== null)){
const err252 = {instancePath:instancePath+"/events/" + i12+"/cost_cents",schemaPath:"#/properties/events/items/properties/cost_cents/type",keyword:"type",params:{type: schema31.properties.events.items.properties.cost_cents.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err252];
}
else {
vErrors.push(err252);
}
errors++;
}
}
if(data98.notes !== undefined){
let data109 = data98.notes;
if((typeof data109 !== "string") && (data109 !== null)){
const err253 = {instancePath:instancePath+"/events/" + i12+"/notes",schemaPath:"#/properties/events/items/properties/notes/type",keyword:"type",params:{type: schema31.properties.events.items.properties.notes.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err253];
}
else {
vErrors.push(err253);
}
errors++;
}
}
if(data98.condition_after !== undefined){
let data110 = data98.condition_after;
const _errs270 = errors;
let valid73 = false;
const _errs271 = errors;
if(typeof data110 !== "string"){
const err254 = {instancePath:instancePath+"/events/" + i12+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err254];
}
else {
vErrors.push(err254);
}
errors++;
}
if(!(((((data110 === "good") || (data110 === "fair")) || (data110 === "needs_attention")) || (data110 === "needs_replacement")) || (data110 === "unknown"))){
const err255 = {instancePath:instancePath+"/events/" + i12+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/0/enum",keyword:"enum",params:{allowedValues: schema31.properties.events.items.properties.condition_after.anyOf[0].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err255];
}
else {
vErrors.push(err255);
}
errors++;
}
var _valid11 = _errs271 === errors;
valid73 = valid73 || _valid11;
const _errs273 = errors;
if(data110 !== null){
const err256 = {instancePath:instancePath+"/events/" + i12+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err256];
}
else {
vErrors.push(err256);
}
errors++;
}
var _valid11 = _errs273 === errors;
valid73 = valid73 || _valid11;
if(!valid73){
const err257 = {instancePath:instancePath+"/events/" + i12+"/condition_after",schemaPath:"#/properties/events/items/properties/condition_after/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err257];
}
else {
vErrors.push(err257);
}
errors++;
}
else {
errors = _errs270;
if(vErrors !== null){
if(_errs270){
vErrors.length = _errs270;
}
else {
vErrors = null;
}
}
}
}
if(data98.reading_value !== undefined){
let data111 = data98.reading_value;
if((!((typeof data111 == "number") && (isFinite(data111)))) && (data111 !== null)){
const err258 = {instancePath:instancePath+"/events/" + i12+"/reading_value",schemaPath:"#/properties/events/items/properties/reading_value/type",keyword:"type",params:{type: schema31.properties.events.items.properties.reading_value.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err258];
}
else {
vErrors.push(err258);
}
errors++;
}
}
if(data98.reading_unit !== undefined){
let data112 = data98.reading_unit;
if((typeof data112 !== "string") && (data112 !== null)){
const err259 = {instancePath:instancePath+"/events/" + i12+"/reading_unit",schemaPath:"#/properties/events/items/properties/reading_unit/type",keyword:"type",params:{type: schema31.properties.events.items.properties.reading_unit.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err259];
}
else {
vErrors.push(err259);
}
errors++;
}
}
if(data98.attachment_ids !== undefined){
let data113 = data98.attachment_ids;
if(Array.isArray(data113)){
const len13 = data113.length;
for(let i13=0; i13<len13; i13++){
let data114 = data113[i13];
if(typeof data114 === "string"){
if(!(formats0.test(data114))){
const err260 = {instancePath:instancePath+"/events/" + i12+"/attachment_ids/" + i13,schemaPath:"#/properties/events/items/properties/attachment_ids/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err260];
}
else {
vErrors.push(err260);
}
errors++;
}
}
else {
const err261 = {instancePath:instancePath+"/events/" + i12+"/attachment_ids/" + i13,schemaPath:"#/properties/events/items/properties/attachment_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err261];
}
else {
vErrors.push(err261);
}
errors++;
}
}
}
else {
const err262 = {instancePath:instancePath+"/events/" + i12+"/attachment_ids",schemaPath:"#/properties/events/items/properties/attachment_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err262];
}
else {
vErrors.push(err262);
}
errors++;
}
}
}
else {
const err263 = {instancePath:instancePath+"/events/" + i12,schemaPath:"#/properties/events/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err263];
}
else {
vErrors.push(err263);
}
errors++;
}
}
}
else {
const err264 = {instancePath:instancePath+"/events",schemaPath:"#/properties/events/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err264];
}
else {
vErrors.push(err264);
}
errors++;
}
}
if(data.attachments !== undefined){
let data115 = data.attachments;
if(Array.isArray(data115)){
const len14 = data115.length;
for(let i14=0; i14<len14; i14++){
let data116 = data115[i14];
if(data116 && typeof data116 == "object" && !Array.isArray(data116)){
if(data116.id === undefined){
const err265 = {instancePath:instancePath+"/attachments/" + i14,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err265];
}
else {
vErrors.push(err265);
}
errors++;
}
if(data116.home_id === undefined){
const err266 = {instancePath:instancePath+"/attachments/" + i14,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err266];
}
else {
vErrors.push(err266);
}
errors++;
}
if(data116.kind === undefined){
const err267 = {instancePath:instancePath+"/attachments/" + i14,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err267];
}
else {
vErrors.push(err267);
}
errors++;
}
if(data116.storage_path === undefined){
const err268 = {instancePath:instancePath+"/attachments/" + i14,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "storage_path"},message:"must have required property '"+"storage_path"+"'"};
if(vErrors === null){
vErrors = [err268];
}
else {
vErrors.push(err268);
}
errors++;
}
if(data116.mime_type === undefined){
const err269 = {instancePath:instancePath+"/attachments/" + i14,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "mime_type"},message:"must have required property '"+"mime_type"+"'"};
if(vErrors === null){
vErrors = [err269];
}
else {
vErrors.push(err269);
}
errors++;
}
if(data116.file_size_bytes === undefined){
const err270 = {instancePath:instancePath+"/attachments/" + i14,schemaPath:"#/properties/attachments/items/required",keyword:"required",params:{missingProperty: "file_size_bytes"},message:"must have required property '"+"file_size_bytes"+"'"};
if(vErrors === null){
vErrors = [err270];
}
else {
vErrors.push(err270);
}
errors++;
}
for(const key11 in data116){
if(!(func1.call(schema31.properties.attachments.items.properties, key11))){
const err271 = {instancePath:instancePath+"/attachments/" + i14,schemaPath:"#/properties/attachments/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err271];
}
else {
vErrors.push(err271);
}
errors++;
}
}
if(data116.id !== undefined){
let data117 = data116.id;
if(typeof data117 === "string"){
if(!(formats0.test(data117))){
const err272 = {instancePath:instancePath+"/attachments/" + i14+"/id",schemaPath:"#/properties/attachments/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err272];
}
else {
vErrors.push(err272);
}
errors++;
}
}
else {
const err273 = {instancePath:instancePath+"/attachments/" + i14+"/id",schemaPath:"#/properties/attachments/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err273];
}
else {
vErrors.push(err273);
}
errors++;
}
}
if(data116.home_id !== undefined){
let data118 = data116.home_id;
if(typeof data118 === "string"){
if(!(formats0.test(data118))){
const err274 = {instancePath:instancePath+"/attachments/" + i14+"/home_id",schemaPath:"#/properties/attachments/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err274];
}
else {
vErrors.push(err274);
}
errors++;
}
}
else {
const err275 = {instancePath:instancePath+"/attachments/" + i14+"/home_id",schemaPath:"#/properties/attachments/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err275];
}
else {
vErrors.push(err275);
}
errors++;
}
}
if(data116.kind !== undefined){
let data119 = data116.kind;
if(typeof data119 !== "string"){
const err276 = {instancePath:instancePath+"/attachments/" + i14+"/kind",schemaPath:"#/properties/attachments/items/properties/kind/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err276];
}
else {
vErrors.push(err276);
}
errors++;
}
if(!((((data119 === "photo") || (data119 === "receipt")) || (data119 === "manual_pdf")) || (data119 === "usdz_mesh"))){
const err277 = {instancePath:instancePath+"/attachments/" + i14+"/kind",schemaPath:"#/properties/attachments/items/properties/kind/enum",keyword:"enum",params:{allowedValues: schema31.properties.attachments.items.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err277];
}
else {
vErrors.push(err277);
}
errors++;
}
}
if(data116.storage_path !== undefined){
let data120 = data116.storage_path;
if(typeof data120 === "string"){
if(!pattern5.test(data120)){
const err278 = {instancePath:instancePath+"/attachments/" + i14+"/storage_path",schemaPath:"#/properties/attachments/items/properties/storage_path/pattern",keyword:"pattern",params:{pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$"},message:"must match pattern \""+"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/homes/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/attachments/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\.[A-Za-z0-9]+$"+"\""};
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
const err279 = {instancePath:instancePath+"/attachments/" + i14+"/storage_path",schemaPath:"#/properties/attachments/items/properties/storage_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err279];
}
else {
vErrors.push(err279);
}
errors++;
}
}
if(data116.mime_type !== undefined){
if(typeof data116.mime_type !== "string"){
const err280 = {instancePath:instancePath+"/attachments/" + i14+"/mime_type",schemaPath:"#/properties/attachments/items/properties/mime_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err280];
}
else {
vErrors.push(err280);
}
errors++;
}
}
if(data116.file_size_bytes !== undefined){
let data122 = data116.file_size_bytes;
if(!(((typeof data122 == "number") && (!(data122 % 1) && !isNaN(data122))) && (isFinite(data122)))){
const err281 = {instancePath:instancePath+"/attachments/" + i14+"/file_size_bytes",schemaPath:"#/properties/attachments/items/properties/file_size_bytes/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err281];
}
else {
vErrors.push(err281);
}
errors++;
}
}
if(data116.captured_at !== undefined){
let data123 = data116.captured_at;
if((typeof data123 !== "string") && (data123 !== null)){
const err282 = {instancePath:instancePath+"/attachments/" + i14+"/captured_at",schemaPath:"#/properties/attachments/items/properties/captured_at/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.captured_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err282];
}
else {
vErrors.push(err282);
}
errors++;
}
if(typeof data123 === "string"){
if(!(formats4.validate(data123))){
const err283 = {instancePath:instancePath+"/attachments/" + i14+"/captured_at",schemaPath:"#/properties/attachments/items/properties/captured_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err283];
}
else {
vErrors.push(err283);
}
errors++;
}
}
}
if(data116.linked_event_id !== undefined){
let data124 = data116.linked_event_id;
if((typeof data124 !== "string") && (data124 !== null)){
const err284 = {instancePath:instancePath+"/attachments/" + i14+"/linked_event_id",schemaPath:"#/properties/attachments/items/properties/linked_event_id/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.linked_event_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err284];
}
else {
vErrors.push(err284);
}
errors++;
}
if(typeof data124 === "string"){
if(!(formats0.test(data124))){
const err285 = {instancePath:instancePath+"/attachments/" + i14+"/linked_event_id",schemaPath:"#/properties/attachments/items/properties/linked_event_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err285];
}
else {
vErrors.push(err285);
}
errors++;
}
}
}
if(data116.linked_component_id !== undefined){
let data125 = data116.linked_component_id;
if((typeof data125 !== "string") && (data125 !== null)){
const err286 = {instancePath:instancePath+"/attachments/" + i14+"/linked_component_id",schemaPath:"#/properties/attachments/items/properties/linked_component_id/type",keyword:"type",params:{type: schema31.properties.attachments.items.properties.linked_component_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err286];
}
else {
vErrors.push(err286);
}
errors++;
}
if(typeof data125 === "string"){
if(!(formats0.test(data125))){
const err287 = {instancePath:instancePath+"/attachments/" + i14+"/linked_component_id",schemaPath:"#/properties/attachments/items/properties/linked_component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err287];
}
else {
vErrors.push(err287);
}
errors++;
}
}
}
}
else {
const err288 = {instancePath:instancePath+"/attachments/" + i14,schemaPath:"#/properties/attachments/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err288];
}
else {
vErrors.push(err288);
}
errors++;
}
}
}
else {
const err289 = {instancePath:instancePath+"/attachments",schemaPath:"#/properties/attachments/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err289];
}
else {
vErrors.push(err289);
}
errors++;
}
}
if(data.smart_home_readings !== undefined){
let data126 = data.smart_home_readings;
if(Array.isArray(data126)){
const len15 = data126.length;
for(let i15=0; i15<len15; i15++){
let data127 = data126[i15];
if(data127 && typeof data127 == "object" && !Array.isArray(data127)){
if(data127.id === undefined){
const err290 = {instancePath:instancePath+"/smart_home_readings/" + i15,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err290];
}
else {
vErrors.push(err290);
}
errors++;
}
if(data127.component_id === undefined){
const err291 = {instancePath:instancePath+"/smart_home_readings/" + i15,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "component_id"},message:"must have required property '"+"component_id"+"'"};
if(vErrors === null){
vErrors = [err291];
}
else {
vErrors.push(err291);
}
errors++;
}
if(data127.source === undefined){
const err292 = {instancePath:instancePath+"/smart_home_readings/" + i15,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err292];
}
else {
vErrors.push(err292);
}
errors++;
}
if(data127.metric === undefined){
const err293 = {instancePath:instancePath+"/smart_home_readings/" + i15,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "metric"},message:"must have required property '"+"metric"+"'"};
if(vErrors === null){
vErrors = [err293];
}
else {
vErrors.push(err293);
}
errors++;
}
if(data127.value === undefined){
const err294 = {instancePath:instancePath+"/smart_home_readings/" + i15,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err294];
}
else {
vErrors.push(err294);
}
errors++;
}
if(data127.unit === undefined){
const err295 = {instancePath:instancePath+"/smart_home_readings/" + i15,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err295];
}
else {
vErrors.push(err295);
}
errors++;
}
if(data127.recorded_at === undefined){
const err296 = {instancePath:instancePath+"/smart_home_readings/" + i15,schemaPath:"#/properties/smart_home_readings/items/required",keyword:"required",params:{missingProperty: "recorded_at"},message:"must have required property '"+"recorded_at"+"'"};
if(vErrors === null){
vErrors = [err296];
}
else {
vErrors.push(err296);
}
errors++;
}
for(const key12 in data127){
if(!(((((((key12 === "id") || (key12 === "component_id")) || (key12 === "source")) || (key12 === "metric")) || (key12 === "value")) || (key12 === "unit")) || (key12 === "recorded_at"))){
const err297 = {instancePath:instancePath+"/smart_home_readings/" + i15,schemaPath:"#/properties/smart_home_readings/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err297];
}
else {
vErrors.push(err297);
}
errors++;
}
}
if(data127.id !== undefined){
let data128 = data127.id;
if(typeof data128 === "string"){
if(!(formats0.test(data128))){
const err298 = {instancePath:instancePath+"/smart_home_readings/" + i15+"/id",schemaPath:"#/properties/smart_home_readings/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
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
const err299 = {instancePath:instancePath+"/smart_home_readings/" + i15+"/id",schemaPath:"#/properties/smart_home_readings/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err299];
}
else {
vErrors.push(err299);
}
errors++;
}
}
if(data127.component_id !== undefined){
let data129 = data127.component_id;
if(typeof data129 === "string"){
if(!(formats0.test(data129))){
const err300 = {instancePath:instancePath+"/smart_home_readings/" + i15+"/component_id",schemaPath:"#/properties/smart_home_readings/items/properties/component_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err300];
}
else {
vErrors.push(err300);
}
errors++;
}
}
else {
const err301 = {instancePath:instancePath+"/smart_home_readings/" + i15+"/component_id",schemaPath:"#/properties/smart_home_readings/items/properties/component_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err301];
}
else {
vErrors.push(err301);
}
errors++;
}
}
if(data127.source !== undefined){
let data130 = data127.source;
if(typeof data130 !== "string"){
const err302 = {instancePath:instancePath+"/smart_home_readings/" + i15+"/source",schemaPath:"#/properties/smart_home_readings/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err302];
}
else {
vErrors.push(err302);
}
errors++;
}
if(!((((data130 === "homekit") || (data130 === "ecobee")) || (data130 === "nest")) || (data130 === "other"))){
const err303 = {instancePath:instancePath+"/smart_home_readings/" + i15+"/source",schemaPath:"#/properties/smart_home_readings/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.smart_home_readings.items.properties.source.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err303];
}
else {
vErrors.push(err303);
}
errors++;
}
}
if(data127.metric !== undefined){
if(typeof data127.metric !== "string"){
const err304 = {instancePath:instancePath+"/smart_home_readings/" + i15+"/metric",schemaPath:"#/properties/smart_home_readings/items/properties/metric/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err304];
}
else {
vErrors.push(err304);
}
errors++;
}
}
if(data127.value !== undefined){
let data132 = data127.value;
if(!((typeof data132 == "number") && (isFinite(data132)))){
const err305 = {instancePath:instancePath+"/smart_home_readings/" + i15+"/value",schemaPath:"#/properties/smart_home_readings/items/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err305];
}
else {
vErrors.push(err305);
}
errors++;
}
}
if(data127.unit !== undefined){
if(typeof data127.unit !== "string"){
const err306 = {instancePath:instancePath+"/smart_home_readings/" + i15+"/unit",schemaPath:"#/properties/smart_home_readings/items/properties/unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err306];
}
else {
vErrors.push(err306);
}
errors++;
}
}
if(data127.recorded_at !== undefined){
let data134 = data127.recorded_at;
if(typeof data134 === "string"){
if(!(formats4.validate(data134))){
const err307 = {instancePath:instancePath+"/smart_home_readings/" + i15+"/recorded_at",schemaPath:"#/properties/smart_home_readings/items/properties/recorded_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err308 = {instancePath:instancePath+"/smart_home_readings/" + i15+"/recorded_at",schemaPath:"#/properties/smart_home_readings/items/properties/recorded_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err308];
}
else {
vErrors.push(err308);
}
errors++;
}
}
}
else {
const err309 = {instancePath:instancePath+"/smart_home_readings/" + i15,schemaPath:"#/properties/smart_home_readings/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err309];
}
else {
vErrors.push(err309);
}
errors++;
}
}
}
else {
const err310 = {instancePath:instancePath+"/smart_home_readings",schemaPath:"#/properties/smart_home_readings/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err310];
}
else {
vErrors.push(err310);
}
errors++;
}
}
if(data.utility_bills !== undefined){
let data135 = data.utility_bills;
if(Array.isArray(data135)){
const len16 = data135.length;
for(let i16=0; i16<len16; i16++){
let data136 = data135[i16];
if(data136 && typeof data136 == "object" && !Array.isArray(data136)){
if(data136.id === undefined){
const err311 = {instancePath:instancePath+"/utility_bills/" + i16,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err311];
}
else {
vErrors.push(err311);
}
errors++;
}
if(data136.home_id === undefined){
const err312 = {instancePath:instancePath+"/utility_bills/" + i16,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "home_id"},message:"must have required property '"+"home_id"+"'"};
if(vErrors === null){
vErrors = [err312];
}
else {
vErrors.push(err312);
}
errors++;
}
if(data136.utility_type === undefined){
const err313 = {instancePath:instancePath+"/utility_bills/" + i16,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "utility_type"},message:"must have required property '"+"utility_type"+"'"};
if(vErrors === null){
vErrors = [err313];
}
else {
vErrors.push(err313);
}
errors++;
}
if(data136.billing_period_start === undefined){
const err314 = {instancePath:instancePath+"/utility_bills/" + i16,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "billing_period_start"},message:"must have required property '"+"billing_period_start"+"'"};
if(vErrors === null){
vErrors = [err314];
}
else {
vErrors.push(err314);
}
errors++;
}
if(data136.billing_period_end === undefined){
const err315 = {instancePath:instancePath+"/utility_bills/" + i16,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "billing_period_end"},message:"must have required property '"+"billing_period_end"+"'"};
if(vErrors === null){
vErrors = [err315];
}
else {
vErrors.push(err315);
}
errors++;
}
if(data136.usage_amount === undefined){
const err316 = {instancePath:instancePath+"/utility_bills/" + i16,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "usage_amount"},message:"must have required property '"+"usage_amount"+"'"};
if(vErrors === null){
vErrors = [err316];
}
else {
vErrors.push(err316);
}
errors++;
}
if(data136.usage_unit === undefined){
const err317 = {instancePath:instancePath+"/utility_bills/" + i16,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "usage_unit"},message:"must have required property '"+"usage_unit"+"'"};
if(vErrors === null){
vErrors = [err317];
}
else {
vErrors.push(err317);
}
errors++;
}
if(data136.source === undefined){
const err318 = {instancePath:instancePath+"/utility_bills/" + i16,schemaPath:"#/properties/utility_bills/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err318];
}
else {
vErrors.push(err318);
}
errors++;
}
for(const key13 in data136){
if(!(func1.call(schema31.properties.utility_bills.items.properties, key13))){
const err319 = {instancePath:instancePath+"/utility_bills/" + i16,schemaPath:"#/properties/utility_bills/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err319];
}
else {
vErrors.push(err319);
}
errors++;
}
}
if(data136.id !== undefined){
let data137 = data136.id;
if(typeof data137 === "string"){
if(!(formats0.test(data137))){
const err320 = {instancePath:instancePath+"/utility_bills/" + i16+"/id",schemaPath:"#/properties/utility_bills/items/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err320];
}
else {
vErrors.push(err320);
}
errors++;
}
}
else {
const err321 = {instancePath:instancePath+"/utility_bills/" + i16+"/id",schemaPath:"#/properties/utility_bills/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err321];
}
else {
vErrors.push(err321);
}
errors++;
}
}
if(data136.home_id !== undefined){
let data138 = data136.home_id;
if(typeof data138 === "string"){
if(!(formats0.test(data138))){
const err322 = {instancePath:instancePath+"/utility_bills/" + i16+"/home_id",schemaPath:"#/properties/utility_bills/items/properties/home_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err322];
}
else {
vErrors.push(err322);
}
errors++;
}
}
else {
const err323 = {instancePath:instancePath+"/utility_bills/" + i16+"/home_id",schemaPath:"#/properties/utility_bills/items/properties/home_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err323];
}
else {
vErrors.push(err323);
}
errors++;
}
}
if(data136.utility_type !== undefined){
let data139 = data136.utility_type;
if(typeof data139 !== "string"){
const err324 = {instancePath:instancePath+"/utility_bills/" + i16+"/utility_type",schemaPath:"#/properties/utility_bills/items/properties/utility_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err324];
}
else {
vErrors.push(err324);
}
errors++;
}
if(!(((data139 === "gas") || (data139 === "electric")) || (data139 === "water"))){
const err325 = {instancePath:instancePath+"/utility_bills/" + i16+"/utility_type",schemaPath:"#/properties/utility_bills/items/properties/utility_type/enum",keyword:"enum",params:{allowedValues: schema31.properties.utility_bills.items.properties.utility_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err325];
}
else {
vErrors.push(err325);
}
errors++;
}
}
if(data136.billing_period_start !== undefined){
let data140 = data136.billing_period_start;
if(typeof data140 === "string"){
if(!(formats28.validate(data140))){
const err326 = {instancePath:instancePath+"/utility_bills/" + i16+"/billing_period_start",schemaPath:"#/properties/utility_bills/items/properties/billing_period_start/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err326];
}
else {
vErrors.push(err326);
}
errors++;
}
}
else {
const err327 = {instancePath:instancePath+"/utility_bills/" + i16+"/billing_period_start",schemaPath:"#/properties/utility_bills/items/properties/billing_period_start/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err327];
}
else {
vErrors.push(err327);
}
errors++;
}
}
if(data136.billing_period_end !== undefined){
let data141 = data136.billing_period_end;
if(typeof data141 === "string"){
if(!(formats28.validate(data141))){
const err328 = {instancePath:instancePath+"/utility_bills/" + i16+"/billing_period_end",schemaPath:"#/properties/utility_bills/items/properties/billing_period_end/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err328];
}
else {
vErrors.push(err328);
}
errors++;
}
}
else {
const err329 = {instancePath:instancePath+"/utility_bills/" + i16+"/billing_period_end",schemaPath:"#/properties/utility_bills/items/properties/billing_period_end/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err329];
}
else {
vErrors.push(err329);
}
errors++;
}
}
if(data136.usage_amount !== undefined){
let data142 = data136.usage_amount;
if(!((typeof data142 == "number") && (isFinite(data142)))){
const err330 = {instancePath:instancePath+"/utility_bills/" + i16+"/usage_amount",schemaPath:"#/properties/utility_bills/items/properties/usage_amount/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err330];
}
else {
vErrors.push(err330);
}
errors++;
}
}
if(data136.usage_unit !== undefined){
if(typeof data136.usage_unit !== "string"){
const err331 = {instancePath:instancePath+"/utility_bills/" + i16+"/usage_unit",schemaPath:"#/properties/utility_bills/items/properties/usage_unit/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err331];
}
else {
vErrors.push(err331);
}
errors++;
}
}
if(data136.cost_cents !== undefined){
let data144 = data136.cost_cents;
if((!(((typeof data144 == "number") && (!(data144 % 1) && !isNaN(data144))) && (isFinite(data144)))) && (data144 !== null)){
const err332 = {instancePath:instancePath+"/utility_bills/" + i16+"/cost_cents",schemaPath:"#/properties/utility_bills/items/properties/cost_cents/type",keyword:"type",params:{type: schema31.properties.utility_bills.items.properties.cost_cents.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err332];
}
else {
vErrors.push(err332);
}
errors++;
}
}
if(data136.source !== undefined){
let data145 = data136.source;
if(typeof data145 !== "string"){
const err333 = {instancePath:instancePath+"/utility_bills/" + i16+"/source",schemaPath:"#/properties/utility_bills/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err333];
}
else {
vErrors.push(err333);
}
errors++;
}
if(!((data145 === "manual") || (data145 === "import"))){
const err334 = {instancePath:instancePath+"/utility_bills/" + i16+"/source",schemaPath:"#/properties/utility_bills/items/properties/source/enum",keyword:"enum",params:{allowedValues: schema31.properties.utility_bills.items.properties.source.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err334];
}
else {
vErrors.push(err334);
}
errors++;
}
}
if(data136.attachment_id !== undefined){
let data146 = data136.attachment_id;
if((typeof data146 !== "string") && (data146 !== null)){
const err335 = {instancePath:instancePath+"/utility_bills/" + i16+"/attachment_id",schemaPath:"#/properties/utility_bills/items/properties/attachment_id/type",keyword:"type",params:{type: schema31.properties.utility_bills.items.properties.attachment_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err335];
}
else {
vErrors.push(err335);
}
errors++;
}
if(typeof data146 === "string"){
if(!(formats0.test(data146))){
const err336 = {instancePath:instancePath+"/utility_bills/" + i16+"/attachment_id",schemaPath:"#/properties/utility_bills/items/properties/attachment_id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err336];
}
else {
vErrors.push(err336);
}
errors++;
}
}
}
}
else {
const err337 = {instancePath:instancePath+"/utility_bills/" + i16,schemaPath:"#/properties/utility_bills/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err338 = {instancePath:instancePath+"/utility_bills",schemaPath:"#/properties/utility_bills/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
const err339 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err339];
}
else {
vErrors.push(err339);
}
errors++;
}
validate20.errors = vErrors;
return errors === 0;
}
validate20.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};
