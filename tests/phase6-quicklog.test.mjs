import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { addDays, civilFromDays, daysFromCivil } from "./helpers/schedule-reference.mjs";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const dir = join(repoRoot, "spec", "fixtures", "quick-log");
const readText = (p) => readFileSync(p, "utf-8");
const readFix = (f) => JSON.parse(readText(join(dir, f)));

// ------------------------------------------------- independent reference
// Written from spec/docs/quick-log.md. The three platform ports (plans 06-12, 06-15,
// 06-34) must reproduce every expectation in the quick-log fixtures.

const LEXICON = [
  ["inspection", ["inspected", "inspect", "checked", "tested", "examined", "looked at"]],
  ["reading", ["read", "measured", "recorded"]],
  ["repair", ["repaired", "fixed", "patched", "rewired", "resealed", "sealed", "tightened", "unclogged"]],
  ["replacement", ["replaced", "swapped", "installed", "changed"]],
  ["service", ["serviced", "cleaned", "flushed", "tuned", "lubricated", "greased", "drained", "descaled", "winterized", "vacuumed", "refilled"]],
];
const VERB_TYPE = new Map(LEXICON.flatMap(([type, verbs]) => verbs.map((v) => [v, type])));
const VERB_RE = new RegExp(
  `\\b(${[...VERB_TYPE.keys()].sort((a, b) => b.length - a.length).map((v) => v.replace(" ", "\\s+")).join("|")})\\b`,
  "i",
);
const SWAP_VERBS = new Set(["replaced", "swapped", "installed", "changed"]);
const CONSUMABLES = new Set(["filter", "filters", "battery", "batteries", "bulb", "bulbs", "cartridge", "cartridges", "pad", "pads"]);
const FILLER_RE = /\b(?:um|uh|like|so|okay|ok|just|basically)\b,?/gi;
const LEAD_DROP = new Set(["the", "a", "an", "my", "our", "new", "old", "some"]);
const TRAIL_DROP = new Set(["for", "at", "on", "and", "it"]);
const CUT_WORDS = new Set(["for", "at", "because", "and"]);
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTHS = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5,
  jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9,
  oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

const pad = (n, w) => String(n).padStart(w, "0");
const civil = (y, m, d) => `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}`;
const isRealDate = (y, m, d) => {
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const s = civil(y, m, d);
  return civilFromDays(daysFromCivil(s)) === s;
};
const weekdayOf = (s) => (((daysFromCivil(s) + 4) % 7) + 7) % 7;
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const ON = "(?:\\b(?:on|from)\\s+)?";

/** Month/day relative to the year of today, rolled back one year when later than today. */
function yearlessDate(today, m, d) {
  const y = Number(today.slice(0, 4));
  if (!isRealDate(y, m, d)) return null;
  const s = civil(y, m, d);
  if (daysFromCivil(s) <= daysFromCivil(today)) return s;
  return isRealDate(y - 1, m, d) ? civil(y - 1, m, d) : null;
}

/** First matching date pattern wins. Returns { date, text } with the matched span removed, or null. */
function findDate(text, today) {
  const attempts = [
    // 1 ISO
    [new RegExp(`${ON}\\b(\\d{4})-(\\d{2})-(\\d{2})\\b`, "i"), (m) => (isRealDate(+m[1], +m[2], +m[3]) ? civil(+m[1], +m[2], +m[3]) : null)],
    // 2 yesterday
    [new RegExp(`${ON}\\byesterday\\b`, "i"), () => addDays(today, -1)],
    // 3 today
    [new RegExp(`${ON}\\btoday\\b`, "i"), () => today],
    // 4 N days / weeks ago
    [new RegExp(`${ON}\\b(\\d+|an|a)\\s+(days?|weeks?)\\s+ago\\b`, "i"), (m) => {
      const n = /^\d+$/.test(m[1]) ? Number(m[1]) : 1;
      return addDays(today, -(m[2].toLowerCase().startsWith("week") ? 7 * n : n));
    }],
    // 5 last week
    [new RegExp(`${ON}\\blast\\s+week\\b`, "i"), () => addDays(today, -7)],
    // 6 last <weekday> or bare weekday
    [new RegExp(`${ON}\\b(?:last\\s+)?(${WEEKDAYS.join("|")})\\b`, "i"), (m) => {
      const back = ((weekdayOf(today) - WEEKDAYS.indexOf(m[1].toLowerCase()) + 6) % 7) + 1;
      return addDays(today, -back);
    }],
    // 7 month name
    [new RegExp(`${ON}\\b(${Object.keys(MONTHS).join("|")})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b`, "i"), (m) => yearlessDate(today, MONTHS[m[1].toLowerCase()], Number(m[2]))],
    // 8 numeric M/D
    [new RegExp(`${ON}\\b(\\d{1,2})/(\\d{1,2})\\b`, "i"), (m) => yearlessDate(today, Number(m[1]), Number(m[2]))],
  ];
  for (const [re, toDate] of attempts) {
    const m = re.exec(text);
    if (!m) continue;
    const date = toDate(m);
    if (date === null) continue; // not a real calendar date: pattern does not match
    return { date, text: text.slice(0, m.index) + " " + text.slice(m.index + m[0].length) };
  }
  return null;
}

const centsOf = (whole, frac) => Number(whole.replace(/,/g, "")) * 100 + (frac === undefined ? 0 : Number(frac.length === 1 ? `${frac}0` : frac));

/** Cost patterns in order; the first pattern that matches wins. */
function findCost(text) {
  const NUM = "(\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.(\\d{1,2}))?";
  const a = new RegExp(`\\$\\s*${NUM}`).exec(text);
  const b = a ? null : new RegExp(`\\b${NUM}\\s*(?:dollars|bucks|usd)\\b`, "i").exec(text);
  const m = a ?? b;
  if (!m) return null;
  return { cents: centsOf(m[1], m[2]), text: text.slice(0, m.index) + " " + text.slice(m.index + m[0].length) };
}

function cleanWs(s) {
  return s.replace(/\s+/g, " ").trim();
}

/** Step 5 and 6: subject cleaning and the consumable rule. verb is the lowercased lexicon verb. */
function subjectAndHint(raw, verb) {
  let t = raw;
  const comma = t.indexOf(",");
  if (comma >= 0) t = t.slice(0, comma);
  const stop = /\.(?:\s|$)/.exec(t);
  if (stop) t = t.slice(0, stop.index);
  let words = t.split(/\s+/).filter(Boolean);
  const cut = words.findIndex((w) => CUT_WORDS.has(w.toLowerCase()));
  if (cut >= 0) words = words.slice(0, cut);
  while (words.length && LEAD_DROP.has(words[0].toLowerCase())) words.shift();
  while (words.length && TRAIL_DROP.has(words[words.length - 1].toLowerCase())) words.pop();
  words = words.map((w) => w.toLowerCase());
  const subject = words.join(" ");
  let type = VERB_TYPE.get(verb);
  let hint = subject === "" ? null : subject;
  if (SWAP_VERBS.has(verb) && words.length && CONSUMABLES.has(words[words.length - 1])) {
    type = "service";
    hint = words.length > 1 ? words.slice(0, -1).join(" ") : subject;
  }
  return { type, hint, subject };
}

const matchVerb = (text) => {
  const m = VERB_RE.exec(text);
  return m ? { verb: m[1].toLowerCase().replace(/\s+/g, " "), end: m.index + m[0].length } : null;
};

function parseSentence(input, today) {
  const original = cleanWs(input);
  let text = cleanWs(original.replace(FILLER_RE, " "));
  let cost_cents = null;
  const cost = findCost(text);
  if (cost) {
    cost_cents = cost.cents;
    text = cleanWs(cost.text);
  }
  let occurred_on = today;
  const date = findDate(text, today);
  if (date) {
    occurred_on = date.date;
    text = cleanWs(date.text);
  }
  const v = matchVerb(text);
  if (!v) {
    return {
      event_type: "note",
      component_hint: null,
      occurred_on,
      cost_cents,
      title: cap(original).slice(0, 60).trimEnd(),
    };
  }
  const { type, hint, subject } = subjectAndHint(text.slice(v.end), v.verb);
  return {
    event_type: type,
    component_hint: hint,
    occurred_on,
    cost_cents,
    title: cap(v.verb) + (subject ? ` ${subject}` : ""),
  };
}

function fromExtraction(x, today) {
  const action = x.action == null ? "" : cleanWs(x.action).toLowerCase();
  const v = action ? matchVerb(action) : null;
  let occurred_on = today;
  if (x.datePhrase != null) {
    const d = findDate(x.datePhrase, today);
    if (d) occurred_on = d.date;
  }
  let cost_cents = null;
  if (x.amountPhrase != null) {
    const c = findCost(x.amountPhrase);
    if (c) cost_cents = c.cents;
    else {
      const bare = /^\s*(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d{1,2}))?\s*$/.exec(x.amountPhrase);
      if (bare) cost_cents = centsOf(bare[1], bare[2]);
    }
  }
  if (!v) {
    const joined = cleanWs([x.action ?? "", x.subject ?? ""].join(" "));
    return {
      event_type: "note",
      component_hint: null,
      occurred_on,
      cost_cents,
      title: joined ? cap(joined).slice(0, 60).trimEnd() : "Note",
    };
  }
  const { type, hint, subject } = subjectAndHint(x.subject ?? "", v.verb);
  return {
    event_type: type,
    component_hint: hint,
    occurred_on,
    cost_cents,
    title: cap(v.verb) + (subject ? ` ${subject}` : ""),
  };
}

const STOPWORDS = new Set(["the", "a", "an", "my", "our", "unit", "thing", "one", "main", "old", "new", "uh", "um"]);
const stem = (w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);
const words = (s) => (String(s ?? "").toLowerCase().match(/[a-z0-9]+/g) ?? []).map(stem);

function resolveHint(hint, components) {
  if (hint == null || hint === "") return { status: "none", component_ids: [] };
  const tokens = (String(hint).toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => !STOPWORDS.has(w)).map(stem);
  if (tokens.length === 0) return { status: "none", component_ids: [] };
  const hits = [];
  for (const c of components) {
    const nameWords = words(c.name);
    const otherWords = [c.type_label, ...(c.aliases ?? []), c.make].flatMap(words);
    const pre = (t, set) => set.some((w) => w.startsWith(t));
    if (!tokens.every((t) => pre(t, nameWords) || pre(t, otherWords))) continue;
    hits.push({ c, tier: tokens.every((t) => pre(t, nameWords)) ? 0 : 1 });
  }
  if (hits.length === 0) return { status: "none", component_ids: [] };
  const best = Math.min(...hits.map((h) => h.tier));
  const top = hits
    .filter((h) => h.tier === best)
    .map((h) => h.c)
    .sort((a, b) => {
      const an = a.name.toLowerCase();
      const bn = b.name.toLowerCase();
      if (an !== bn) return an < bn ? -1 : 1;
      const ai = a.id.toLowerCase();
      const bi = b.id.toLowerCase();
      return ai < bi ? -1 : ai > bi ? 1 : 0;
    });
  return { status: top.length === 1 ? "resolved" : "ambiguous", component_ids: top.map((c) => c.id) };
}

// -------------------------------------------------------------------- tests
const sentences = readFix("sentences.json");
const resolver = readFix("resolver.json");
const extractions = readFix("extractions.json");
const TODAY = "2026-10-22";
const CASE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CIVIL = /^\d{4}-\d{2}-\d{2}$/;
const EVENT_TYPES = new Set(["inspection", "reading", "repair", "replacement", "service", "note"]);

test("reference clock is a Thursday", () => {
  assert.equal(sentences.reference.today, TODAY);
  assert.equal(extractions.reference.today, TODAY);
  assert.equal(sentences.reference.now_local, "2026-10-22T10:00");
  assert.equal(WEEKDAYS[weekdayOf(TODAY)], "thursday");
  assert.equal(addDays(TODAY, -2), "2026-10-20");
  assert.equal(WEEKDAYS[weekdayOf("2026-10-20")], "tuesday");
});

test("sentence corpus structure", () => {
  assert.ok(sentences.cases.length >= 22);
  const names = sentences.cases.map((c) => c.name);
  assert.equal(new Set(names).size, names.length, "unique names");
  for (const c of sentences.cases) {
    assert.match(c.name, CASE_NAME);
    assert.equal(typeof c.input, "string");
    assert.deepEqual(Object.keys(c.expected).sort(), ["component_hint", "cost_cents", "event_type", "occurred_on", "title"]);
    assert.ok(EVENT_TYPES.has(c.expected.event_type), c.name);
    assert.match(c.expected.occurred_on, CIVIL);
    assert.equal(civilFromDays(daysFromCivil(c.expected.occurred_on)), c.expected.occurred_on, `${c.name}: real date`);
    assert.ok(c.expected.cost_cents === null || Number.isInteger(c.expected.cost_cents), c.name);
    assert.ok(c.expected.component_hint === null || typeof c.expected.component_hint === "string", c.name);
  }
  const keywords = [
    "inspection", "reading", "repair", "replacement", "service", "note", "consumable",
    "date-today", "date-yesterday", "date-last-weekday", "date-bare-weekday", "date-same-weekday",
    "date-days-ago", "date-week-ago", "date-last-week", "date-iso", "date-month-name",
    "date-rollback", "date-numeric", "cost-dollar-sign", "cost-thousands", "cost-cents-only",
    "cost-bucks", "cost-dollars", "cost-usd", "cost-none", "cost-no-verb", "noisy", "no-verb",
    "two-verbs", "uppercase", "whitespace", "spelled-out",
  ];
  for (const k of keywords) {
    assert.ok(names.some((n) => n.includes(k)), `missing category keyword: ${k}`);
  }
  assert.ok(sentences.cases.some((c) => c.expected.occurred_on === TODAY && !/today|yesterday|ago|week|day|\d/.test(c.input)), "a no-date case");
});

test("anchor cases carry the planned values", () => {
  const by = (input) => sentences.cases.find((c) => c.input === input)?.expected;
  assert.deepEqual(by("replaced the furnace filter today, $28"), {
    event_type: "service", component_hint: "furnace", occurred_on: "2026-10-22", cost_cents: 2800, title: "Replaced furnace filter",
  });
  assert.deepEqual(by("inspected the roof yesterday"), {
    event_type: "inspection", component_hint: "roof", occurred_on: "2026-10-21", cost_cents: null, title: "Inspected roof",
  });
  assert.deepEqual(by("cleaned the gutters last Tuesday for $90"), {
    event_type: "service", component_hint: "gutters", occurred_on: "2026-10-20", cost_cents: 9000, title: "Cleaned gutters",
  });
  assert.deepEqual(by("swapped the water heater anode 3 days ago"), {
    event_type: "replacement", component_hint: "water heater anode", occurred_on: "2026-10-19", cost_cents: null, title: "Swapped water heater anode",
  });
  assert.deepEqual(by("furnace is making a weird noise"), {
    event_type: "note", component_hint: null, occurred_on: "2026-10-22", cost_cents: null, title: "Furnace is making a weird noise",
  });
});

test("weekday arithmetic: last Thursday and last Friday", () => {
  assert.equal(parseSentence("fixed the door thursday", TODAY).occurred_on, "2026-10-15");
  assert.equal(parseSentence("fixed the door last friday", TODAY).occurred_on, "2026-10-16");
});

test("sentence corpus is parsed by the reference", () => {
  for (const c of sentences.cases) {
    assert.deepEqual(parseSentence(c.input, sentences.reference.today), c.expected, c.name);
  }
});

test("extraction corpus structure and normalization", () => {
  assert.ok(extractions.cases.length >= 6);
  const names = extractions.cases.map((c) => c.name);
  assert.equal(new Set(names).size, names.length);
  for (const c of extractions.cases) {
    assert.match(c.name, CASE_NAME);
    assert.deepEqual(Object.keys(c.extracted).sort(), ["action", "amountPhrase", "datePhrase", "notes", "subject"]);
    for (const v of Object.values(c.extracted)) assert.ok(v === null || typeof v === "string");
    assert.deepEqual(fromExtraction(c.extracted, extractions.reference.today), c.expected, c.name);
  }
  const has = (f) => extractions.cases.some(f);
  assert.ok(has((c) => c.extracted.datePhrase === null));
  assert.ok(has((c) => c.extracted.amountPhrase === null));
  assert.ok(has((c) => c.extracted.action === "changed" && /batteries$/.test(c.extracted.subject) && c.expected.event_type === "service"));
  assert.ok(has((c) => c.expected.event_type === "note" && c.extracted.action !== null));
  assert.ok(has((c) => c.extracted.amountPhrase === "$1,250.50" && c.expected.cost_cents === 125050));
});

test("model path and typed path agree on shared phrases", () => {
  const typed = parseSentence("replaced the furnace filter today, $28", TODAY);
  const model = fromExtraction({ action: "replaced", subject: "furnace filter", datePhrase: "today", amountPhrase: "$28", notes: null }, TODAY);
  assert.deepEqual(model, typed);
});

test("resolver corpus structure", () => {
  assert.ok(resolver.cases.length >= 11);
  const statuses = new Set(resolver.cases.map((c) => c.expected.status));
  for (const s of ["resolved", "ambiguous", "none"]) assert.ok(statuses.has(s), s);
  const names = resolver.cases.map((c) => c.name);
  assert.equal(new Set(names).size, names.length);
  const furnaces = resolver.components.filter((c) => c.component_type === "furnace");
  assert.deepEqual(furnaces.map((c) => c.name).sort(), ["Furnace - Basement", "Furnace - Upstairs"]);
  for (const c of resolver.components) {
    assert.deepEqual(Object.keys(c).sort(), ["aliases", "component_type", "id", "make", "model", "name", "type_label"]);
  }
  assert.ok(resolver.cases.some((c) => c.hint === null));
  assert.ok(resolver.cases.some((c) => c.hint === "dishwasher" && c.expected.status === "none"));
  const ids = new Set(resolver.components.map((c) => c.id));
  for (const c of resolver.cases) for (const id of c.expected.component_ids) assert.ok(ids.has(id), c.name);
});

test("resolver corpus is resolved by the reference", () => {
  for (const c of resolver.cases) {
    assert.deepEqual(resolveHint(c.hint, resolver.components), c.expected, c.name);
  }
});

test("no em or en dashes in the quick-log files", () => {
  const files = [
    join(repoRoot, "spec", "docs", "quick-log.md"),
    join(repoRoot, "tests", "phase6-quicklog.test.mjs"),
    ...["sentences.json", "resolver.json", "extractions.json"].map((f) => join(dir, f)),
  ];
  const dashes = new RegExp(`[${String.fromCharCode(0x2013)}${String.fromCharCode(0x2014)}]`);
  for (const f of files) assert.doesNotMatch(readText(f), dashes, f);
});
