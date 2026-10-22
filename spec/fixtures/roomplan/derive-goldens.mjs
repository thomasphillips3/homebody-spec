#!/usr/bin/env node
// Independent implementation of spec/docs/roomplan-projection.md. Reads each
// *.structure.json and writes (or, with --check, verifies) *.plan.golden.json.
// Written from the document alone; it shares no code with the generator or
// with any platform port.
//   node derive-goldens.mjs          write the goldens
//   node derive-goldens.mjs --check  fail on any difference beyond 1e-6
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const NAMES = ["box", "rotated30", "lshape", "tworoom", "arcwall"];

const MIN_SEGMENT_M = 0.05;
const HOST_RADIUS_M = 0.35;
const MAX_SURFACES = 5000;
const MAX_COORD_M = 10000;
const ARC_CHORD_DEG = 15;
const ARC_END_TOLERANCE_M = 0.05;

const SECTION_TYPES = {
  livingRoom: "living_room",
  bedroom: "bedroom",
  bathroom: "bathroom",
  kitchen: "kitchen",
  diningRoom: "dining_room",
};

function fail(message) {
  throw new Error(message);
}

function finite(n, what) {
  if (typeof n !== "number" || !Number.isFinite(n)) fail(`non-finite ${what}`);
  if (Math.abs(n) > MAX_COORD_M) fail(`coordinate beyond ${MAX_COORD_M} m in ${what}`);
  return n;
}

function round6(n) {
  const r = Math.round(n * 1e6) / 1e6;
  return r === 0 ? 0 : r;
}

// world = T * (x, y, z, 1), T column-major.
function toWorld(m, x, y, z) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

// Plan-space point before normalization: (world X, world Z).
function planXZ(m, x, y, z) {
  const w = toWorld(m, x, y, z);
  finite(w[0], "projected x");
  finite(w[2], "projected z");
  return [w[0], w[2]];
}

const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);

function baseEdge(s) {
  const [w, h] = s.dimensions;
  return [
    planXZ(s.transform, -w / 2, -h / 2, 0),
    planXZ(s.transform, w / 2, -h / 2, 0),
  ];
}

function validate(structure) {
  const lists = ["walls", "doors", "windows", "openings", "floors"];
  let count = 0;
  for (const key of lists) {
    for (const s of structure[key] ?? []) {
      count += 1;
      for (const v of s.transform) finite(v, `${s.identifier} transform`);
      for (const v of s.dimensions) finite(v, `${s.identifier} dimensions`);
      for (const c of s.polygonCorners ?? []) {
        for (const v of c) finite(v, `${s.identifier} polygon corner`);
      }
      if (s.curve) {
        finite(s.curve.radius, `${s.identifier} curve radius`);
        for (const v of s.curve.center) finite(v, `${s.identifier} curve center`);
        finite(s.curve.startAngle.value, `${s.identifier} curve start`);
        finite(s.curve.endAngle.value, `${s.identifier} curve end`);
      }
    }
  }
  if (count > MAX_SURFACES) fail(`more than ${MAX_SURFACES} surfaces`);
  for (const sec of structure.sections ?? []) {
    for (const v of sec.center) finite(v, "section center");
  }
}

function pointSegmentDistance(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return dist(p, a);
  let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return dist(p, [a[0] + t * dx, a[1] + t * dy]);
}

function insideRing(pt, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function shoelace(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    sum += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return Math.abs(sum) / 2;
}

function project(structure) {
  validate(structure);
  const warnings = [];
  const elements = [];
  const wallInfo = new Map();
  const phis = [];

  for (const wall of structure.walls ?? []) {
    const [a, b] = baseEdge(wall);
    phis.push({ phi: Math.atan2(b[1] - a[1], b[0] - a[0]), w: dist(a, b) });
    let chain = [a, b];
    if (wall.curve) {
      const [, h] = wall.dimensions;
      const { center, radius } = wall.curve;
      const t0 = wall.curve.startAngle.value;
      const t1 = wall.curve.endAngle.value;
      const sweepDeg = (Math.abs(t1 - t0) * 180) / Math.PI;
      const n = Math.max(1, Math.ceil(sweepDeg / ARC_CHORD_DEG - 1e-9));
      let pts = [];
      for (let k = 0; k <= n; k++) {
        const t = t0 + ((t1 - t0) * k) / n;
        pts.push(
          planXZ(
            wall.transform,
            center[0] + radius * Math.cos(t),
            -h / 2,
            center[1] + radius * Math.sin(t),
          ),
        );
      }
      const p0 = pts[0];
      const p1 = pts[n];
      if (dist(p0, a) + dist(p1, b) > dist(p0, b) + dist(p1, a)) pts = pts.reverse();
      if (dist(pts[0], a) > ARC_END_TOLERANCE_M || dist(pts[n], b) > ARC_END_TOLERANCE_M) {
        warnings.push({ code: "curve_fallback", surface_id: wall.identifier });
        chain = [a, b];
      } else {
        chain = pts;
      }
    }
    const segments = [];
    for (let k = 0; k + 1 < chain.length; k++) {
      const seg = [chain[k], chain[k + 1]];
      if (dist(seg[0], seg[1]) < MIN_SEGMENT_M) {
        warnings.push({ code: "short_segment_dropped", surface_id: wall.identifier });
        continue;
      }
      const curved = Boolean(wall.curve);
      segments.push({ id: curved ? `${wall.identifier}#${k}` : wall.identifier, seg });
    }
    wallInfo.set(wall.identifier, { a, b, segments });
    for (const s of segments) {
      elements.push({
        surface_id: s.id,
        kind: "wall",
        host_surface_id: null,
        coordinates: s.seg,
      });
    }
  }

  const wallIds = [...wallInfo.keys()];
  function nearestWall(mid) {
    let best = null;
    let bestD = Infinity;
    for (const id of wallIds) {
      const info = wallInfo.get(id);
      const segs = info.segments.length > 0 ? info.segments.map((s) => s.seg) : [[info.a, info.b]];
      const d = Math.min(...segs.map(([p, q]) => pointSegmentDistance(mid, p, q)));
      if (d < bestD) {
        bestD = d;
        best = id;
      }
    }
    return bestD <= HOST_RADIUS_M ? best : null;
  }

  for (const [key, kind] of [
    ["doors", "door"],
    ["windows", "window"],
    ["openings", "opening"],
  ]) {
    for (const s of structure[key] ?? []) {
      const [a, b] = baseEdge(s);
      if (dist(a, b) < MIN_SEGMENT_M) {
        warnings.push({ code: "short_segment_dropped", surface_id: s.identifier });
        continue;
      }
      let host = null;
      if (s.parentIdentifier && wallInfo.has(s.parentIdentifier)) {
        host = s.parentIdentifier;
      } else {
        host = nearestWall([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
      }
      elements.push({ surface_id: s.identifier, kind, host_surface_id: host, coordinates: [a, b] });
    }
  }

  const rooms = [];
  for (const f of structure.floors ?? []) {
    let local = f.polygonCorners ?? [];
    if (local.length === 0) {
      const [w, h] = f.dimensions;
      local = [
        [-w / 2, -h / 2, 0],
        [w / 2, -h / 2, 0],
        [w / 2, h / 2, 0],
        [-w / 2, h / 2, 0],
      ];
    }
    const ring = local.map(([x, y, z]) => planXZ(f.transform, x, y, z));
    const first = ring[0];
    if (dist(first, ring[ring.length - 1]) > 1e-9) ring.push(first);
    const distinct = ring.slice(0, -1).filter(
      (p, i, arr) => arr.findIndex((q) => dist(p, q) < 1e-9) === i,
    );
    if (distinct.length < 3) {
      warnings.push({ code: "degenerate_floor", surface_id: f.identifier });
      continue;
    }
    let roomType = "other";
    for (const sec of structure.sections ?? []) {
      if (insideRing([sec.center[0], sec.center[2]], ring)) {
        roomType = SECTION_TYPES[sec.label] ?? "other";
        break;
      }
    }
    rooms.push({ surface_id: f.identifier, room_type: roomType, ring, area_m2: shoelace(ring) });
  }

  const stories = new Set();
  for (const key of ["walls", "doors", "windows", "openings", "floors"]) {
    for (const s of structure[key] ?? []) stories.add(s.story);
  }
  if (stories.size > 1) warnings.push({ code: "multi_story", surface_id: null });

  // Normalization (section 6).
  let totalW = 0;
  let sumS = 0;
  let sumC = 0;
  for (const { phi, w } of phis) {
    totalW += w;
    sumS += w * Math.sin(4 * phi);
    sumC += w * Math.cos(4 * phi);
  }
  const mean =
    totalW === 0 || Math.hypot(sumS, sumC) < 1e-9 * totalW ? 0 : Math.atan2(sumS, sumC) / 4;
  const rot = -mean;
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const rotate = (p) => [c * p[0] - s * p[1], s * p[0] + c * p[1]];
  for (const e of elements) e.coordinates = e.coordinates.map(rotate);
  for (const r of rooms) r.ring = r.ring.map(rotate);
  const all = [...elements.flatMap((e) => e.coordinates), ...rooms.flatMap((r) => r.ring)];
  const origin = all.length
    ? [-Math.min(...all.map((p) => p[0])), -Math.min(...all.map((p) => p[1]))]
    : [0, 0];
  const place = (p) => {
    const q = [round6(p[0] + origin[0]), round6(p[1] + origin[1])];
    for (const v of q) finite(v, "output coordinate");
    return q;
  };

  return {
    scan_rotation_rad: round6(rot),
    scan_origin_m: origin.map(round6),
    story_count: stories.size,
    elements: elements.map((e) => ({ ...e, coordinates: e.coordinates.map(place) })),
    rooms: rooms.map((r) => ({ ...r, ring: r.ring.map(place), area_m2: round6(r.area_m2) })),
    warnings,
  };
}

// Pretty printer: 2-space indent, arrays of primitives and point lists inline.
function fmt(value, indent = "") {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  const next = indent + "  ";
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const flat = (v) =>
      v === null || typeof v !== "object" || (Array.isArray(v) && v.every((x) => typeof x !== "object"));
    if (value.every(flat)) return `[${value.map((v) => JSON.stringify(v)).join(", ")}]`;
    return `[\n${value.map((v) => next + fmt(v, next)).join(",\n")}\n${indent}]`;
  }
  const keys = Object.keys(value);
  if (keys.length === 0) return "{}";
  return `{\n${keys
    .map((k) => `${next}${JSON.stringify(k)}: ${fmt(value[k], next)}`)
    .join(",\n")}\n${indent}}`;
}

function closeTo(a, b, path, errors) {
  if (typeof a === "number" && typeof b === "number") {
    if (Math.abs(a - b) > 1e-6) errors.push(`${path}: ${a} vs ${b}`);
  } else if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) errors.push(`${path}: length ${a.length} vs ${b.length}`);
    else a.forEach((v, i) => closeTo(v, b[i], `${path}[${i}]`, errors));
  } else if (a && b && typeof a === "object" && typeof b === "object") {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) closeTo(a[k], b[k], `${path}.${k}`, errors);
  } else if (a !== b) {
    errors.push(`${path}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  }
}

const check = process.argv.includes("--check");
let failed = false;
for (const name of NAMES) {
  const structure = JSON.parse(readFileSync(join(here, `${name}.structure.json`), "utf-8"));
  const derived = project(structure);
  const goldenPath = join(here, `${name}.plan.golden.json`);
  if (check) {
    const golden = JSON.parse(readFileSync(goldenPath, "utf-8"));
    const errors = [];
    closeTo(derived, golden, name, errors);
    if (errors.length) {
      console.error(`DIFF ${name}.plan.golden.json\n  ${errors.slice(0, 10).join("\n  ")}`);
      failed = true;
    }
  } else {
    writeFileSync(goldenPath, `${fmt(derived)}\n`);
    console.log(`wrote ${name}.plan.golden.json`);
  }
}
if (failed) process.exit(1);
