import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateHomeRecord } from "homebody-spec";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

function readText(rel) {
  return readFileSync(join(repoRoot, rel), "utf-8");
}
function readJSON(rel) {
  return JSON.parse(readText(rel));
}
function fixture(name) {
  return readJSON(join("spec", "fixtures", name));
}
function valid(record) {
  return validateHomeRecord(record) === true;
}

// The 0.5.0 default_service_interval_days map (34 non-null entries), frozen.
const FROZEN_0_5_0 = {
  main_water_shutoff: 365, sewer_lateral: 1825, sump_pump: 180,
  water_treatment: 365, electrical_panel: 1095, subpanel: 1095,
  gfci_receptacle: 90, smoke_detector: 180, co_detector: 180,
  generator: 365, solar_pv_system: 365, hvac_furnace: 365,
  hvac_ac_unit: 365, hvac_heat_pump: 365, hvac_mini_split: 365,
  hvac_boiler: 365, hvac_air_handler: 365, hvac_filter: 90,
  hvac_ventilation_fan: 365, hvac_fireplace: 365, roof_covering: 365,
  chimney: 365, gutter: 180, downspout: 180, water_heater: 365,
  refrigerator: 180, range_hood: 180, clothes_dryer: 365,
  garage_door_opener: 365, deck_porch_patio: 365, irrigation_system: 365,
  septic_system: 1095, well_pump: 365, pool_spa: 90,
};
const NEW_365 = ["flashing", "skylight", "roof_vent", "soffit_fascia", "garage_door"];

test("[schema] event title is optional, nullable, max 200", () => {
  const s = readJSON("spec/schema/entities/event.schema.json");
  assert.deepEqual(s.properties.title.type, ["string", "null"]);
  assert.equal(s.properties.title.maxLength, 200);
  assert.ok(!s.required.includes("title"));
  assert.equal(s.additionalProperties, false);
});

test("[schema] home maintenance_defaults shape", () => {
  const s = readJSON("spec/schema/entities/home.schema.json");
  const m = s.properties.maintenance_defaults;
  assert.ok(m, "maintenance_defaults missing");
  assert.ok(JSON.stringify(m.type).includes("null"));
  assert.ok(JSON.stringify(m.type).includes("object"));
  assert.equal(m.additionalProperties.type, "integer");
  assert.equal(m.additionalProperties.minimum, 1);
  assert.equal(m.additionalProperties.maximum, 3650);
  assert.equal(m.propertyNames.pattern, "^[a-z][a-z0-9_]{0,63}$");
  assert.equal(m.maxProperties, 100);
  assert.ok(!s.required.includes("maintenance_defaults"));
});

test("[schema] recall-alert entity shape", () => {
  const s = readJSON("spec/schema/entities/recall-alert.schema.json");
  assert.equal(s.additionalProperties, false);
  assert.deepEqual([...s.required].sort(), [
    "id", "home_id", "component_id", "recall_number", "recall_id", "title",
    "url", "recall_date", "matched_on", "confidence", "status", "detected_at",
  ].sort());
  const p = s.properties;
  assert.ok(JSON.stringify(p.hazard.type).includes("null"));
  assert.ok(JSON.stringify(p.remedy.type).includes("null"));
  assert.ok(!s.required.includes("hazard") && !s.required.includes("remedy"));
  assert.deepEqual(p.matched_on.enum, ["model", "manufacturer"]);
  assert.deepEqual(p.confidence.enum, ["likely", "possible"]);
  assert.deepEqual(p.status.enum, ["open", "dismissed", "resolved"]);
  assert.equal(p.status.default, "open");
  assert.equal(p.recall_id.type, "integer");
  assert.equal(p.recall_date.format, "date");
  assert.equal(p.detected_at.format, "date-time");
  assert.equal(p.url.pattern, "^https://");
  assert.equal(p.url.maxLength, 2048);
  assert.equal(p.title.maxLength, 500);
});

test("[schema] root schema recall_alerts and schema_version", () => {
  const s = readJSON("spec/schema/home-record.schema.json");
  const r = s.properties.recall_alerts;
  assert.equal(r.type, "array");
  assert.match(r.items.$ref, /recall-alert\.schema\.json$/);
  assert.deepEqual(r.default, []);
  assert.ok(!s.required.includes("recall_alerts"));
  assert.deepEqual(s.properties.schema_version.enum, [
    "0.1.0", "0.1.1", "0.2.0", "0.3.0", "0.4.0", "0.5.0", "0.6.0",
  ]);
});

test("[schema] validator accepts fixtures and rejects bad values", () => {
  for (const n of ["minimal-home.json", "maximal-home.json"]) {
    assert.ok(valid(fixture(n)), JSON.stringify(validateHomeRecord.errors));
  }
  const bad = (mut) => {
    const r = fixture("maximal-home.json");
    mut(r);
    return valid(r);
  };
  assert.equal(bad((r) => { r.recall_alerts[0].status = "bogus"; }), false);
  assert.equal(bad((r) => { r.recall_alerts[0].url = "http://www.cpsc.gov/x"; }), false);
  assert.equal(bad((r) => { r.events[0].title = "x".repeat(201); }), false);
  assert.equal(bad((r) => { r.home.maintenance_defaults = { water_heater: 0 }; }), false);
  assert.equal(bad((r) => { r.home.maintenance_defaults = { water_heater: 3651 }; }), false);
  assert.equal(bad((r) => { r.home.maintenance_defaults = { water_heater: 1.5 }; }), false);
  assert.equal(bad((r) => { r.home.maintenance_defaults = { "Water Heater": 10 }; }), false);
  assert.equal(bad((r) => { r.home.maintenance_defaults = []; }), false);
  assert.equal(bad((r) => { r.home.maintenance_defaults = {}; }), true);
  assert.equal(bad((r) => { r.home.maintenance_defaults = { water_heater: 400 }; }), true);
  assert.equal(bad((r) => { delete r.recall_alerts; }), true);
});

test("[schema] maximal fixture exercises the new fields", () => {
  const r = fixture("maximal-home.json");
  assert.ok(r.recall_alerts.length >= 2);
  assert.ok(r.recall_alerts.some((a) => a.confidence === "likely" && a.status === "open" && a.matched_on === "model" && a.hazard && a.remedy));
  assert.ok(r.recall_alerts.some((a) => a.confidence === "possible" && a.status === "dismissed" && a.matched_on === "manufacturer" && a.hazard === null && a.remedy === null));
  const compIds = new Set(r.components.map((c) => c.id));
  for (const a of r.recall_alerts) {
    assert.equal(a.home_id, r.home.id);
    assert.ok(compIds.has(a.component_id));
  }
  const alertIds = r.recall_alerts.map((a) => a.id);
  assert.equal(new Set(alertIds).size, alertIds.length);
  const others = new Set();
  for (const [k, v] of Object.entries(r)) {
    if (Array.isArray(v) && k !== "recall_alerts") v.forEach((x) => x && x.id && others.add(x.id));
  }
  for (const id of alertIds) assert.ok(!others.has(id));
  assert.ok(r.home.maintenance_defaults !== null && r.home.maintenance_defaults !== undefined);
  assert.ok(r.events.filter((e) => typeof e.title === "string" && e.title.length > 0).length >= 2);
});

test("[schema] generated models carry the new names", () => {
  const ts = readText("generated/typescript/homeRecord.ts");
  for (const n of ["recall_alerts", "RecallAlert", "maintenance_defaults"]) assert.ok(ts.includes(n), n);
  for (const f of ["generated/swift/HomeRecord.swift", "generated/kotlin/HomeRecord.kt"]) {
    const t = readText(f);
    assert.ok(t.includes("RecallAlert"), f);
    assert.ok(t.includes("maintenance_defaults"), f);
  }
});

test("[taxonomy] five new 365-day defaults, nothing else moved", () => {
  const t = readJSON("spec/taxonomy/components.json");
  assert.equal(t.version, "0.6.0");
  const g = (id) => t.types.find((x) => x.id === id).default_service_interval_days;
  for (const id of NEW_365) assert.equal(g(id), 365, id);
  assert.equal(g("smoke_detector"), 180);
  assert.equal(g("co_detector"), 180);
  assert.equal(t.types.length, 78);
  assert.equal(t.types.filter((x) => x.default_service_interval_days === null).length, 39);
  for (const x of t.types) {
    if (NEW_365.includes(x.id)) continue;
    assert.equal(x.default_service_interval_days, FROZEN_0_5_0[x.id] ?? null, x.id);
  }
});

test("[docs] taxonomy sources section", () => {
  const d = readText("spec/docs/taxonomy.md");
  assert.ok(d.includes("Default service interval sources"));
  for (const id of NEW_365) assert.ok(d.includes(id), id);
  assert.ok(d.includes("https://www.energy.wsu.edu/Documents/XtrMntChklst.pdf"));
  assert.ok(d.includes("support.chamberlaingroup.com"));
  assert.ok(d.includes("homes.maintenance_defaults"));
});

test("[docs] attachment ordering section", () => {
  const d = readText("spec/docs/attachment-referencing.md");
  assert.ok(d.includes("Event attachment ordering"));
  assert.ok(d.includes("attachment_ids = []"));
  assert.ok(d.includes("linked_event_id"));
  assert.ok(d.includes("source of truth"));
});

test("[version] version surface reads 0.6.0 (CHANGELOG is plan 06-04)", () => {
  const v = "0.6.0";
  assert.equal(readText("spec/VERSION").trim(), v);
  assert.equal(readJSON("package.json").version, v);
  const lock = readJSON("package-lock.json");
  assert.equal(lock.version, v);
  assert.equal(lock.packages[""].version, v);
  assert.match(readText("build.gradle.kts"), /version = "0\.6\.0"/);
  assert.ok(readJSON("spec/schema/home-record.schema.json").properties.schema_version.enum.includes(v));
  for (const n of ["minimal-home.json", "maximal-home.json"]) assert.equal(fixture(n).schema_version, v);
});

test("[package] phase6 script and files entries", () => {
  const p = readJSON("package.json");
  assert.equal(p.scripts["test:phase6"], "node --test tests/phase6-*.test.mjs");
  assert.ok(p.scripts.test.includes("npm run test:phase6"));
  for (const f of [
    "spec/fixtures/event-application.json", "spec/fixtures/maintenance-schedule.json",
    "spec/fixtures/history-scopes.json", "spec/fixtures/notification-plan.json",
    "spec/fixtures/quick-log/", "spec/fixtures/recalls/",
  ]) assert.ok(p.files.includes(f), f);
});

test("[dashes] no em or en dashes in touched files", () => {
  const files = [
    "spec/schema/entities/event.schema.json", "spec/schema/entities/home.schema.json",
    "spec/schema/entities/recall-alert.schema.json", "spec/schema/home-record.schema.json",
    "spec/taxonomy/components.json", "spec/docs/taxonomy.md",
    "spec/docs/attachment-referencing.md", "spec/fixtures/maximal-home.json",
    "spec/fixtures/minimal-home.json", "tests/phase6-schema.test.mjs", "package.json",
  ];
  const bad = new RegExp("[" + String.fromCharCode(0x2013, 0x2014) + "]");
  for (const f of files) assert.ok(!bad.test(readText(f)), f);
});
