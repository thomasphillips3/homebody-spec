import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const recallsDir = join(repoRoot, "spec", "fixtures", "recalls");
const readJSON = (rel) => JSON.parse(readFileSync(join(repoRoot, rel), "utf-8"));
const readRecall = (file) => JSON.parse(readFileSync(join(recallsDir, file), "utf-8"));

const brands = readJSON("spec/taxonomy/brands.json").brands;
const NAMESPACE = "5f3c9a2e-7b1d-4e68-9c04-2a8d6e1b7f35";
const FALLBACK_URL = "https://www.cpsc.gov/Recalls";
const CASE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ------------------------------------------------- independent reference matcher
// Written from spec/docs/recall-matching.md. The TypeScript matcher (plan 06-05) and
// the shipped clients must reproduce every expectation in match-cases.json.

function norm(s) {
  return String(s ?? "")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

function compact(s) {
  return norm(s).replace(/ /g, "");
}

function cutCompany(name) {
  const i = name.indexOf(", of ");
  return i >= 0 ? name.slice(0, i) : name;
}

function companyNames(recall) {
  const out = [];
  for (const key of ["Manufacturers", "Importers", "Distributors"]) {
    for (const c of recall[key] ?? []) out.push(cutCompany(c.Name ?? ""));
  }
  return out;
}

function recallText(recall) {
  const parts = [recall.Title, recall.Description];
  for (const p of recall.Products ?? []) parts.push(p.Name, p.Description, p.Model);
  return norm(parts.map((x) => x ?? "").join(" "));
}

function recallModels(text) {
  const tokens = text.split(" ").filter((t) => t !== "");
  const out = new Set();
  for (const t of tokens) if (t.length >= 4 && /\d/.test(t)) out.add(t);
  for (let i = 0; i + 1 < tokens.length; i += 1) {
    const pair = tokens[i] + tokens[i + 1];
    if (pair.length >= 4 && /\d/.test(pair)) out.add(pair);
  }
  return [...out];
}

function validModel(model) {
  const c = compact(model ?? "");
  return c.length >= 5 && /\d/.test(c);
}

function modelHit(model, models) {
  const c = compact(model);
  return models.some(
    (r) => r === c || (c.startsWith(r) && r.length >= 6) || (r.startsWith(c) && c.length >= 6),
  );
}

function brandHit(make, recall) {
  const n = norm(make ?? "");
  if (n === "") return false;
  const aliases = new Set([n]);
  let shortLineOnly = false;
  for (const b of brands) {
    const names = [b.name, ...b.aliases].map(norm);
    if (names.includes(n)) {
      for (const a of b.aliases) aliases.add(norm(a));
      shortLineOnly = b.short_line_only === true;
      break;
    }
  }
  const companies = companyNames(recall).join(" ");
  const text = shortLineOnly ? norm(companies) : norm(`${recall.Title ?? ""} ${companies}`);
  const padded = ` ${text} `;
  return [...aliases].some((a) => a !== "" && padded.includes(` ${a} `));
}

function firstSentence(description) {
  const d = description ?? "";
  const i = d.indexOf(". ");
  return i >= 0 ? d.slice(0, i + 1) : d;
}

function typeHit(keywords, recall) {
  const names = (recall.Products ?? []).map((p) => p.Name ?? "").join(" ");
  const text = ` ${norm(`${recall.Title ?? ""} ${names} ${firstSentence(recall.Description)}`)} `;
  return (keywords ?? []).some((kw) => {
    const k = norm(kw);
    return k !== "" && (text.includes(` ${k} `) || text.includes(` ${k}S `) || text.includes(` ${k}ES `));
  });
}

function decide(recall, component) {
  const none = { confidence: null, matched_on: null };
  const models = recallModels(recallText(recall));
  const brand = brandHit(component.make, recall);
  if (validModel(component.model)) {
    if (modelHit(component.model, models)) {
      const long = compact(component.model).length >= 8;
      return { confidence: brand || long ? "likely" : "possible", matched_on: "model" };
    }
    if (models.length > 0) return none;
  }
  if (brand && typeHit(component.type_keywords, recall)) {
    return { confidence: "possible", matched_on: "manufacturer" };
  }
  return none;
}

function uuidV5(namespace, name) {
  const ns = Buffer.from(namespace.replace(/-/g, ""), "hex");
  const digest = createHash("sha1")
    .update(Buffer.concat([ns, Buffer.from(name, "utf-8")]))
    .digest()
    .subarray(0, 16);
  digest[6] = (digest[6] & 0x0f) | 0x50;
  digest[8] = (digest[8] & 0x3f) | 0x80;
  const h = digest.toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function clean(value, max) {
  if (value === null || value === undefined) return null;
  const s = String(value)
    .replace(/[\u0000-\u0008\u000e-\u001f\u007f]/g, "")
    .replace(/[\t-\r ]+/g, " ")
    .trim();
  const out = Array.from(s).slice(0, max).join("");
  return out === "" ? null : out;
}

function safeUrl(url) {
  if (typeof url !== "string" || url.length > 2048 || !url.startsWith("https://")) return FALLBACK_URL;
  const rest = url.slice("https://".length);
  const authority = rest.split(/[/?#]/)[0].toLowerCase();
  if (authority.includes("@") || authority.includes(":")) return FALLBACK_URL;
  if (authority === "cpsc.gov" || authority.endsWith(".cpsc.gov")) return url;
  return FALLBACK_URL;
}

function buildAlert(recall, input) {
  return {
    id: uuidV5(NAMESPACE, `${input.component_id.toLowerCase()}:${recall.RecallNumber}`),
    home_id: input.home_id,
    component_id: input.component_id,
    recall_number: recall.RecallNumber,
    recall_id: recall.RecallID,
    title: clean(recall.Title, 500),
    hazard: clean((recall.Hazards ?? [])[0]?.Name ?? null, 2000),
    remedy: clean((recall.Remedies ?? [])[0]?.Name ?? null, 2000),
    url: safeUrl(recall.URL),
    recall_date: String(recall.RecallDate).slice(0, 10),
    matched_on: input.match.matched_on,
    confidence: input.match.confidence,
    status: "open",
  };
}

function isErrorRecord(recall) {
  return recall.RecallID === 0 || recall.RecallNumber === null;
}

// ------------------------------------------------------------------------ tests

const PAYLOADS = [
  "allied-armstrong-furnace-23218.json",
  "friedrich-kuhl-ac-26776.json",
  "vst-tankless-26026.json",
  "non-home-laminator-27024.json",
  "null-description.json",
  "no-hazards.json",
  "error-record.json",
];

test("recalls: the directory holds seven payloads and the match corpus", () => {
  const files = readdirSync(recallsDir).sort();
  assert.deepEqual(files, [...PAYLOADS, "match-cases.json"].sort());
});

test("recalls: every payload has the live CPSC record shape", () => {
  for (const file of PAYLOADS) {
    const r = readRecall(file);
    for (const key of ["RecallID", "RecallNumber", "RecallDate", "URL", "Title", "Description", "Products"]) {
      assert.ok(key in r, `${file}: ${key}`);
    }
    for (const key of ["Manufacturers", "Importers", "Distributors", "Retailers", "Hazards", "Remedies"]) {
      assert.ok(Array.isArray(r[key]), `${file}: ${key} is an array`);
      for (const item of r[key]) assert.equal(typeof item.Name, "string", `${file}: ${key}[].Name`);
    }
    for (const p of r.Products) assert.equal(typeof p.Name, "string", `${file}: Products[].Name`);
    if (file === "error-record.json") continue;
    assert.equal(typeof r.RecallNumber, "string", file);
    assert.ok(Number.isInteger(r.RecallID) && r.RecallID > 0, file);
    assert.ok(!Number.isNaN(Date.parse(r.RecallDate)), `${file}: RecallDate parses`);
    assert.match(r.RecallDate, /^\d{4}-\d{2}-\d{2}T/, file);
    assert.ok(r.Title.length > 0, file);
  }
  assert.equal(readRecall("null-description.json").Description, null);
  assert.deepEqual(readRecall("no-hazards.json").Hazards, []);
  assert.deepEqual(readRecall("non-home-laminator-27024.json").Manufacturers, []);
  assert.equal(readRecall("friedrich-kuhl-ac-26776.json").Manufacturers.length, 0);
  assert.ok(readRecall("friedrich-kuhl-ac-26776.json").Importers.length > 0);
});

test("recalls: the error record is detected and no real payload is", () => {
  const fx = readJSON("spec/fixtures/recalls/match-cases.json");
  assert.ok(fx.error_record_cases.some((c) => c.is_error === true));
  for (const c of fx.error_record_cases) {
    assert.equal(isErrorRecord(readRecall(c.payload)), c.is_error, c.payload);
  }
  const covered = new Set(fx.error_record_cases.map((c) => c.payload));
  for (const file of PAYLOADS) assert.ok(covered.has(file), `${file} is listed`);
  const e = readRecall("error-record.json");
  assert.equal(e.RecallID, 0);
  assert.equal(e.RecallNumber, null);
  assert.ok(e.Title.startsWith("Error retrieving Recalls"));
});

test("recalls: match-cases header and structural minimums", () => {
  const fx = readJSON("spec/fixtures/recalls/match-cases.json");
  assert.equal(fx.version, "0.6.0");
  assert.equal(typeof fx.description, "string");
  assert.equal(fx.brands_source, "spec/taxonomy/brands.json");
  assert.ok(fx.cases.length >= 18, "at least 18 match cases");
  assert.ok(fx.alert_cases.length >= 5, "at least 5 alert cases");
  for (const list of [fx.cases, fx.alert_cases]) {
    const names = list.map((c) => c.name);
    assert.equal(new Set(names).size, names.length);
    for (const n of names) assert.match(n, CASE_NAME, n);
  }
  const confs = new Set(fx.cases.map((c) => c.expected.confidence));
  for (const v of ["likely", "possible", null]) assert.ok(confs.has(v), `confidence ${v}`);
  for (const c of fx.cases) {
    assert.ok(PAYLOADS.includes(c.recall), `${c.name}: recall file`);
    assert.deepEqual(Object.keys(c.component).sort(), ["component_type", "id", "make", "model", "type_keywords"], c.name);
    assert.ok(["model", "manufacturer", null].includes(c.expected.matched_on), c.name);
    assert.equal(c.expected.confidence === null, c.expected.matched_on === null, `${c.name}: null pairs`);
  }
  for (const word of ["family-prefix", "whole-word", "location", "description", "plural", "null-description", "space"]) {
    assert.ok(fx.cases.some((c) => c.name.includes(word)), `a match case about ${word}`);
  }
});

test("recalls: every match case agrees with the independent reference matcher", () => {
  const fx = readJSON("spec/fixtures/recalls/match-cases.json");
  for (const c of fx.cases) {
    const got = decide(readRecall(c.recall), c.component);
    assert.deepEqual(got, c.expected, c.name);
  }
});

test("recalls: the location case would match if the city and state were not cut", () => {
  const r = readRecall("friedrich-kuhl-ac-26776.json");
  const importer = r.Importers[0].Name;
  assert.ok(` ${norm(importer)} `.includes(" TEXAS "), "the raw importer name carries the state");
  assert.ok(!companyNames(r).some((n) => norm(n).split(" ").includes("TEXAS")), "the cut name does not");
});

test("recalls: every alert case builds the expected alert", () => {
  const fx = readJSON("spec/fixtures/recalls/match-cases.json");
  for (const c of fx.alert_cases) {
    const base = readRecall(c.recall);
    const recall = c.recall_override ? { ...base, ...c.recall_override } : base;
    const got = buildAlert(recall, c);
    assert.deepEqual(got, c.expected, c.name);
    assert.equal(c.expected.status, "open");
    assert.match(c.expected.id, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    assert.ok(c.expected.title.length <= 500, `${c.name}: title length`);
    if (c.expected.hazard !== null) assert.ok(Array.from(c.expected.hazard).length <= 2000);
    if (c.expected.remedy !== null) assert.ok(Array.from(c.expected.remedy).length <= 2000);
    assert.match(c.expected.url, /^https:\/\//);
    // eslint-disable-next-line no-control-regex
    assert.doesNotMatch(c.expected.title, /[\u0000-\u001f\u007f]|\s{2}/);
  }
  const lower = fx.alert_cases.filter((c) => c.component_id === c.component_id.toLowerCase());
  const upper = fx.alert_cases.filter((c) => c.component_id !== c.component_id.toLowerCase());
  assert.ok(upper.length >= 1, "an uppercase component id case");
  for (const u of upper) {
    const twin = lower.find((l) => l.component_id === u.component_id.toLowerCase() && l.recall === u.recall);
    assert.ok(twin && twin.expected.id === u.expected.id, `${u.name}: same alert id as the lowercase form`);
  }
  const urls = fx.alert_cases.map((c) => c.expected.url);
  assert.ok(urls.filter((u) => u === FALLBACK_URL).length >= 3, "url fallback cases");
  assert.ok(fx.alert_cases.some((c) => c.expected.hazard === null), "a null hazard case");
  assert.ok(fx.alert_cases.some((c) => c.recall_override && Array.from(c.recall_override.Title ?? "").length > 500), "a clipping case");
});
