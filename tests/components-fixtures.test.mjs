import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { parseNameplate } from "./helpers/nameplate-reference.mjs";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const fixtures = join(repoRoot, "spec", "fixtures");
const readJSON = (rel) => JSON.parse(readFileSync(join(repoRoot, rel), "utf-8"));

const taxonomy = readJSON("spec/taxonomy/components.json");
const brands = readJSON("spec/taxonomy/brands.json").brands;
const CATEGORIES = taxonomy.categories;

// ---------------------------------------------------------------- bootstrap

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

test("bootstrap-systems ids equal an independent SHA-1 UUIDv5 recomputation", () => {
  const fx = readJSON("spec/fixtures/bootstrap-systems.json");
  assert.equal(fx.systems.length, 7);
  assert.deepEqual(fx.systems.map((s) => s.category), CATEGORIES);
  for (const system of fx.systems) {
    const expected = uuidV5(fx.namespace, `${fx.home_id.toLowerCase()}:${system.category}`);
    assert.equal(system.id, expected, system.category);
    assert.match(system.id, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  }
  assert.deepEqual(
    fx.systems.map((s) => s.name),
    [
      "Plumbing",
      "Electrical",
      "HVAC",
      "Roof and structure",
      "Appliances and water heater",
      "Exterior and site",
      "Low-voltage and smart home",
    ],
  );
});

test("bootstrap ids are case-insensitive on the home id", () => {
  const fx = readJSON("spec/fixtures/bootstrap-systems.json");
  const upper = fx.home_id.toUpperCase();
  const recomputed = uuidV5(fx.namespace, `${upper.toLowerCase()}:plumbing`);
  assert.equal(recomputed, fx.systems[0].id);
});

// ------------------------------------------------------------------ roll-up

const SEVERITY = { good: 0, fair: 1, needs_attention: 2, needs_replacement: 3 };
const BY_SEVERITY = ["good", "fair", "needs_attention", "needs_replacement"];

function rollup(components) {
  const layers = {};
  let worstHouse = -1;
  for (const category of CATEGORIES) {
    const rows = components.filter((c) => c.category === category && !c.deleted);
    const counts = { good: 0, fair: 0, needs_attention: 0, needs_replacement: 0 };
    let worst = -1;
    for (const row of rows) {
      if (row.condition in SEVERITY) {
        counts[row.condition] += 1;
        worst = Math.max(worst, SEVERITY[row.condition]);
      }
    }
    layers[category] = {
      condition: worst < 0 ? null : BY_SEVERITY[worst],
      counts,
      total: rows.length,
    };
    worstHouse = Math.max(worstHouse, worst);
  }
  return { layers, house: worstHouse < 0 ? null : BY_SEVERITY[worstHouse] };
}

test("condition-rollup cases match an independent roll-up", () => {
  const fx = readJSON("spec/fixtures/condition-rollup.json");
  assert.ok(fx.cases.length >= 7);
  for (const c of fx.cases) {
    assert.deepEqual(rollup(c.components), c.expected, c.name);
    assert.deepEqual(Object.keys(c.expected.layers), CATEGORIES, c.name);
  }
});

// ---------------------------------------------------------------- nameplate

test("the nameplate corpus has 17 cases and the reference parser passes all of them", () => {
  const dir = join(fixtures, "nameplate");
  const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  assert.equal(files.length, 17);
  for (const file of files) {
    const fx = JSON.parse(readFileSync(join(dir, file), "utf-8"));
    assert.equal(`${fx.name}.json`, file);
    assert.deepEqual(parseNameplate(fx.lines, brands), fx.expected, fx.name);
  }
});

test("the whirlpool case keeps the accented characters in its input", () => {
  const fx = JSON.parse(readFileSync(join(fixtures, "nameplate", "whirlpool-bilingual.json"), "utf-8"));
  assert.ok(fx.lines.some((l) => l.includes("È") || l.includes("É")));
});

// ---------------------------------------------------------------- placement

const EPS = 1e-9;

function dropClosing(ring) {
  const last = ring[ring.length - 1];
  const first = ring[0];
  return ring.length > 1 && last[0] === first[0] && last[1] === first[1] ? ring.slice(0, -1) : ring;
}

function distPointSegment(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

function pointInRing(p, ringIn) {
  const ring = dropClosing(ringIn);
  for (let i = 0; i < ring.length; i += 1) {
    if (distPointSegment(p, ring[i], ring[(i + 1) % ring.length]) <= EPS) return true;
  }
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function cross(o, a, b) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

function onSegment(a, b, p) {
  return distPointSegment(p, a, b) <= EPS;
}

function segmentsIntersect(a, b, c, d) {
  const d1 = cross(a, b, c);
  const d2 = cross(a, b, d);
  const d3 = cross(c, d, a);
  const d4 = cross(c, d, b);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }
  return onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b);
}

function roomIds(rooms, geometry) {
  const out = new Set();
  for (const room of rooms) {
    const ring = dropClosing(room.ring);
    const coords = geometry.coordinates;
    let hit = coords.some((p) => pointInRing(p, ring));
    if (!hit && geometry.type === "polyline") {
      for (let i = 0; i + 1 < coords.length && !hit; i += 1) {
        for (let e = 0; e < ring.length && !hit; e += 1) {
          hit = segmentsIntersect(coords[i], coords[i + 1], ring[e], ring[(e + 1) % ring.length]);
        }
      }
    }
    if (hit) out.add(room.id.toLowerCase());
  }
  return [...out].sort();
}

test("placement room_ids cases match an independent implementation", () => {
  const fx = readJSON("spec/fixtures/components/placement.json");
  assert.ok(fx.room_ids_cases.length >= 9);
  for (const c of fx.room_ids_cases) {
    assert.deepEqual(roomIds(fx.rooms, c.geometry), c.expected_room_ids, c.name);
    const sorted = [...c.expected_room_ids].sort();
    assert.deepEqual(c.expected_room_ids, sorted, `${c.name} expected ids must be sorted`);
  }
});

function markerPoint(geometry) {
  if (geometry.type === "point") return geometry.coordinates[0];
  let best = null;
  let bestLen = -1;
  for (let i = 0; i + 1 < geometry.coordinates.length; i += 1) {
    const a = geometry.coordinates[i];
    const b = geometry.coordinates[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len > bestLen) {
      bestLen = len;
      best = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    }
  }
  return best;
}

function hitTest(c) {
  const markerR = 22 * c.meters_per_pixel;
  const bandR = 12 * c.meters_per_pixel;
  const markers = [];
  const lines = [];
  for (const comp of c.components) {
    if (!c.visible_categories.includes(comp.category) || comp.geometry === null) continue;
    const g = comp.geometry;
    if (g.type === "point" && g.coordinates.length !== 1) continue;
    if (g.type === "polyline" && g.coordinates.length < 2) continue;
    const m = markerPoint(g);
    const md = Math.hypot(c.tap[0] - m[0], c.tap[1] - m[1]);
    if (md <= markerR) markers.push({ id: comp.id, d: md });
    if (g.type === "polyline") {
      let best = Infinity;
      for (let i = 0; i + 1 < g.coordinates.length; i += 1) {
        best = Math.min(best, distPointSegment(c.tap, g.coordinates[i], g.coordinates[i + 1]));
      }
      if (best <= bandR) lines.push({ id: comp.id, d: best });
    }
  }
  const pool = markers.length > 0 ? markers : lines;
  pool.sort((a, b) => a.d - b.d || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return pool.length === 0 ? null : pool[0].id;
}

test("placement hit_test cases match an independent implementation", () => {
  const fx = readJSON("spec/fixtures/components/placement.json");
  assert.ok(fx.hit_test_cases.length >= 9);
  for (const c of fx.hit_test_cases) {
    assert.equal(hitTest(c), c.expected_id, c.name);
  }
});

// ---------------------------------------------------------------- reminders

function daysFromCivil(y0, m, d) {
  const y = m <= 2 ? y0 - 1 : y0;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

function civilFromDays(z0) {
  const z = z0 + 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp < 10 ? mp + 3 : mp - 9;
  return [m <= 2 ? y + 1 : y, m, d];
}

const pad = (n, w) => String(n).padStart(w, "0");
const fmt = ([y, m, d]) => `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}`;
const parse = (s) => s.split("-").map(Number);
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const monthLen = (y, m) => [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

function warrantyEnd(start, months) {
  if (start === null || months === null) return null;
  const [y, m, d] = parse(start);
  const total = y * 12 + (m - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return fmt([ny, nm, Math.min(d, monthLen(ny, nm))]);
}

function nextServiceDue(install, last, interval) {
  if (!Number.isInteger(interval) || interval <= 0) return null;
  const base = last ?? install;
  if (base === null) return null;
  const [y, m, d] = parse(base);
  return fmt(civilFromDays(daysFromCivil(y, m, d) + interval));
}

test("reminder date math matches an independent civil-date implementation", () => {
  const fx = readJSON("spec/fixtures/components/reminders.json");
  for (const c of fx.warranty_end_cases) {
    assert.equal(warrantyEnd(c.warranty_start, c.warranty_length_months), c.expected, c.name);
  }
  for (const c of fx.next_service_due_cases) {
    assert.equal(nextServiceDue(c.install_date, c.last_serviced_at, c.service_interval_days), c.expected, c.name);
  }
  assert.equal(daysFromCivil(1970, 1, 1), 0);
  assert.deepEqual(civilFromDays(0), [1970, 1, 1]);
});

// ------------------------------------------------------------------- search

function words(text) {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function searchTypes(query, category) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const pool = taxonomy.types.filter((t) => t.category === "any" || category === null || t.category === category);
  const ranked = [];
  pool.forEach((type, order) => {
    if (tokens.length === 0) {
      ranked.push({ type, rank: 0, order });
      return;
    }
    const labelWords = words(type.label);
    const allWords = [...labelWords, ...type.aliases.flatMap(words)];
    if (!tokens.every((tok) => allWords.some((w) => w.startsWith(tok)))) return;
    const rank = tokens.every((tok) => labelWords.some((w) => w.startsWith(tok))) ? 0 : 1;
    ranked.push({ type, rank, order });
  });
  ranked.sort((a, b) => {
    const aOther = a.type.id === "other" ? 1 : 0;
    const bOther = b.type.id === "other" ? 1 : 0;
    return aOther - bOther || a.rank - b.rank || a.order - b.order;
  });
  return ranked.map((r) => r.type.id);
}

test("type search cases match an independent implementation", () => {
  const fx = readJSON("spec/fixtures/components/search.json");
  assert.ok(fx.cases.length >= 7);
  for (const c of fx.cases) {
    assert.deepEqual(searchTypes(c.query, c.category), c.expected_ids, c.name);
  }
});

// -------------------------------------------------------------------- links

function effectivePointer(comp, byId) {
  if (comp.deleted || comp.linked_component_id === null) return null;
  const target = byId.get(comp.linked_component_id);
  return target && !target.deleted ? target.id : null;
}

function group(components, id) {
  const byId = new Map(components.map((c) => [c.id, c]));
  const adj = new Map(components.filter((c) => !c.deleted).map((c) => [c.id, new Set()]));
  for (const c of components) {
    const to = effectivePointer(c, byId);
    if (to !== null) {
      adj.get(c.id).add(to);
      adj.get(to).add(c.id);
    }
  }
  const seen = new Set([id]);
  const queue = [id];
  while (queue.length > 0) {
    const cur = queue.pop();
    for (const next of adj.get(cur) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return [...seen].sort();
}

function candidates(components, levelIds, sourceId) {
  const source = components.find((c) => c.id === sourceId);
  const own = new Set(group(components, sourceId));
  const list = components
    .filter((c) => !c.deleted && c.id !== sourceId && c.category === source.category && c.level_id !== source.level_id)
    .map((c) => ({ id: c.id, in_other_group: !own.has(c.id) }))
    .sort((a, b) => (a.id < b.id ? -1 : 1));
  let reason = null;
  if (levelIds.length <= 1) reason = "single_level";
  else if (list.length === 0) reason = "no_candidates";
  return { disabled_reason: reason, candidates: reason === "single_level" ? [] : list };
}

function planLink(components, sourceId, targetId) {
  const own = group(components, sourceId);
  if (own.includes(targetId)) return null;
  const byId = new Map(components.map((c) => [c.id, c]));
  const root = own.find((id) => effectivePointer(byId.get(id), byId) === null);
  return { set_pointer_on: root, to: targetId };
}

function planUnlink(components, a, b) {
  const byId = new Map(components.map((c) => [c.id, c]));
  if (effectivePointer(byId.get(a), byId) === b) return { clear_pointer_on: a };
  if (effectivePointer(byId.get(b), byId) === a) return { clear_pointer_on: b };
  return null;
}

test("link group, candidate, link and unlink cases match an independent implementation", () => {
  const fx = readJSON("spec/fixtures/components/links.json");
  for (const c of fx.group_cases) {
    assert.deepEqual(group(fx.components, c.component_id), c.expected_ids, c.component_id);
  }
  for (const c of fx.candidate_cases) {
    const components = c.components ?? fx.components;
    const levelIds = c.level_ids ?? fx.level_ids;
    assert.deepEqual(candidates(components, levelIds, c.source_id), c.expected, c.name);
  }
  for (const c of fx.link_cases) {
    assert.deepEqual(planLink(fx.components, c.source_id, c.target_id), c.expected, c.name);
  }
  for (const c of fx.unlink_cases) {
    assert.deepEqual(planUnlink(fx.components, c.a_id, c.b_id), c.expected, c.name);
  }
});
