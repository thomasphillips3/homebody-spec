#!/usr/bin/env node
// Emits the RoomPlan CapturedStructure fixtures (*.structure.json) in the JSON
// shape produced by Apple's Codable types (see spec/docs/roomplan-projection.md).
// No dependencies. Usage:
//   node generate-structures.mjs          write the files
//   node generate-structures.mjs --check  fail if any file differs by a byte
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const PI = Math.PI;

function clean(n) {
  const r = Math.round(n * 1e9) / 1e9;
  return r === 0 ? 0 : r;
}

// Column-major simd_float4x4 for a yaw about Y: x=(c,0,-s) y=(0,1,0) z=(s,0,c).
function yawT(tx, ty, tz, yaw = 0) {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, tx, ty, tz, 1].map(clean);
}

// Floor frame: local x -> world X, local y -> world Z, local z -> world -Y.
function floorT(tx, tz) {
  return [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, tx, 0, tz, 1];
}

// Column-major 4x4 product a * b.
function mul(a, b) {
  const out = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + r] * b[c * 4 + k];
      out[c * 4 + r] = sum;
    }
  }
  return out.map(clean);
}

function uuid(n) {
  return `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
}

const RAD = {
  converter: { coefficient: 57.29577951308232, constant: 0 },
  symbol: "rad",
};
const angle = (v) => ({ value: v, unit: RAD });

function surface(id, category, dims, transform, opts = {}) {
  return {
    category,
    confidence: { high: {} },
    completedEdges: [],
    dimensions: dims,
    transform,
    identifier: uuid(id),
    parentIdentifier: opts.parent === undefined ? null : uuid(opts.parent),
    polygonCorners: opts.corners ?? [],
    story: opts.story ?? 0,
    curve: opts.curve ?? null,
  };
}

const wall = (id, w, h, T, o) => surface(id, { wall: {} }, [w, h, 0], T, o);
const door = (id, w, h, T, o) =>
  surface(id, { door: { isOpen: false } }, [w, h, 0], T, o);
const windowS = (id, w, h, T, o) => surface(id, { window: {} }, [w, h, 0], T, o);
const opening = (id, w, h, T, o) =>
  surface(id, { opening: {} }, [w, h, 0], T, o);
const floor = (id, w, h, T, corners) =>
  surface(id, { floor: {} }, [w, h, 0], T, { corners });

const IDENTITY = yawT(0, 0, 0, 0);

function room(parts) {
  return {
    version: 2,
    story: 0,
    walls: parts.walls ?? [],
    doors: parts.doors ?? [],
    windows: parts.windows ?? [],
    openings: parts.openings ?? [],
    floors: parts.floors ?? [],
    objects: [],
    sections: parts.sections ?? [],
    referenceOriginTransform: IDENTITY,
  };
}

function structure(parts, rooms) {
  return { ...room(parts), rooms };
}

function section(label, x, z) {
  return { label, center: [x, 0, z], story: 0 };
}

// ---- box: 4 m (X) by 3 m (Z), height 2.5 ----
function boxParts() {
  return {
    walls: [
      wall(1, 4, 2.5, yawT(2, 1.25, 0, 0)),
      wall(2, 3, 2.5, yawT(4, 1.25, 1.5, -PI / 2)),
      wall(3, 4, 2.5, yawT(2, 1.25, 3, PI)),
      wall(4, 3, 2.5, yawT(0, 1.25, 1.5, PI / 2)),
    ],
    doors: [door(5, 0.9, 2, yawT(1, 1, 0, 0), { parent: 1 })],
    windows: [windowS(6, 1.2, 1, yawT(4, 1.5, 1.5, -PI / 2), { parent: 2 })],
    floors: [
      floor(7, 4, 3, floorT(2, 1.5), [
        [-2, -1.5, 0],
        [2, -1.5, 0],
        [2, 1.5, 0],
        [-2, 1.5, 0],
      ]),
    ],
    sections: [section("kitchen", 2, 1.5)],
  };
}

function box() {
  const p = boxParts();
  return structure(p, [room(p)]);
}

// ---- rotated30: box yawed 30 degrees about world Y, then moved by (10,0,-5) ----
function rotated30() {
  const world = mul(yawT(10, 0, -5, 0), yawT(0, 0, 0, PI / 6));
  const p = boxParts();
  const moveSurface = (s) => ({ ...s, transform: mul(world, s.transform) });
  const moved = {
    walls: p.walls.map(moveSurface),
    doors: p.doors.map(moveSurface),
    windows: p.windows.map(moveSurface),
    floors: p.floors.map(moveSurface),
    sections: p.sections.map((sec) => {
      // Section centers are world points, so apply the same rigid motion.
      const [x, y, z] = sec.center;
      const c = Math.cos(PI / 6);
      const s = Math.sin(PI / 6);
      return {
        ...sec,
        center: [clean(c * x + s * z + 10), y, clean(-s * x + c * z - 5)],
      };
    }),
  };
  return structure(moved, [room(moved)]);
}

// ---- lshape: (0,0),(6,0),(6,3),(3,3),(3,5),(0,5) ----
function lshape() {
  const p = {
    walls: [
      wall(1, 6, 2.5, yawT(3, 1.25, 0, 0)),
      wall(2, 3, 2.5, yawT(6, 1.25, 1.5, -PI / 2)),
      wall(3, 3, 2.5, yawT(4.5, 1.25, 3, PI)),
      wall(4, 2, 2.5, yawT(3, 1.25, 4, -PI / 2)),
      wall(5, 3, 2.5, yawT(1.5, 1.25, 5, PI)),
      wall(6, 5, 2.5, yawT(0, 1.25, 2.5, PI / 2)),
    ],
    doors: [door(7, 0.9, 2, yawT(0, 1, 1.0, PI / 2), { parent: 6 })],
    windows: [windowS(8, 1.2, 1, yawT(2.0, 1.5, 5, PI), { parent: 5 })],
    // No parentIdentifier: exercises the 0.35 m nearest-wall fallback.
    openings: [opening(9, 1.0, 2, yawT(3, 1, 4.0, -PI / 2))],
    floors: [
      floor(10, 6, 5, floorT(3, 2.5), [
        [-3, -2.5, 0],
        [3, -2.5, 0],
        [3, 0.5, 0],
        [0, 0.5, 0],
        [0, 2.5, 0],
        [-3, 2.5, 0],
      ]),
    ],
    sections: [section("livingRoom", 1.5, 1.5)],
  };
  return structure(p, [room(p)]);
}

// ---- tworoom: A (0..4 x 0..3 kitchen) and B (4..8 x 0..3 bedroom) ----
function tworoom() {
  const wN_A = wall(1, 4, 2.5, yawT(2, 1.25, 0, 0));
  const wShared = wall(2, 3, 2.5, yawT(4, 1.25, 1.5, -PI / 2));
  const wS_A = wall(3, 4, 2.5, yawT(2, 1.25, 3, PI));
  const wW_A = wall(4, 3, 2.5, yawT(0, 1.25, 1.5, PI / 2));
  const wN_B = wall(5, 4, 2.5, yawT(6, 1.25, 0, 0));
  const wE_B = wall(6, 3, 2.5, yawT(8, 1.25, 1.5, -PI / 2));
  const wS_B = wall(7, 4, 2.5, yawT(6, 1.25, 3, PI));
  const dShared = door(8, 0.9, 2, yawT(4, 1, 1.5, -PI / 2), { parent: 2 });
  const winB = windowS(9, 1.2, 1, yawT(8, 1.5, 1.5, -PI / 2), { parent: 6 });
  const floorA = floor(10, 4, 3, floorT(2, 1.5), [
    [-2, -1.5, 0],
    [2, -1.5, 0],
    [2, 1.5, 0],
    [-2, 1.5, 0],
  ]);
  const floorB = floor(11, 4, 3, floorT(6, 1.5), [
    [-2, -1.5, 0],
    [2, -1.5, 0],
    [2, 1.5, 0],
    [-2, 1.5, 0],
  ]);
  const secA = section("kitchen", 2, 1.5);
  const secB = section("bedroom", 6, 1.5);
  const roomA = room({
    walls: [wN_A, wShared, wS_A, wW_A],
    doors: [dShared],
    floors: [floorA],
    sections: [secA],
  });
  const roomB = room({
    walls: [wShared, wN_B, wE_B, wS_B],
    doors: [dShared],
    windows: [winB],
    floors: [floorB],
    sections: [secB],
  });
  // Flattened arrays hold the union with the shared wall and door once.
  const flat = {
    walls: [wN_A, wShared, wS_A, wW_A, wN_B, wE_B, wS_B],
    doors: [dShared],
    windows: [winB],
    floors: [floorA, floorB],
    sections: [secA, secB],
  };
  return structure(flat, [roomA, roomB]);
}

// ---- arcwall: quarter-circle wall (radius 2) plus a straight wall ----
function arcwall() {
  const p = {
    walls: [
      wall(1, 2.82842712, 2.5, yawT(2, 1.25, 0, 0), {
        curve: {
          center: [0, -1.41421356],
          radius: 2,
          startAngle: angle(PI / 4),
          endAngle: angle(3 * PI / 4),
        },
      }),
      wall(2, 3, 2.5, yawT(3.41421356, 1.25, 1.5, -PI / 2)),
    ],
  };
  return structure(p, [room(p)]);
}

// Pretty printer: 2-space indent, arrays of primitives stay on one line.
function fmt(value, indent = "") {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  const next = indent + "  ";
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    if (value.every((v) => v === null || typeof v !== "object")) {
      return `[${value.map((v) => JSON.stringify(v)).join(", ")}]`;
    }
    return `[\n${value.map((v) => next + fmt(v, next)).join(",\n")}\n${indent}]`;
  }
  const keys = Object.keys(value);
  if (keys.length === 0) return "{}";
  return `{\n${keys
    .map((k) => `${next}${JSON.stringify(k)}: ${fmt(value[k], next)}`)
    .join(",\n")}\n${indent}}`;
}

const FIXTURES = { box, rotated30, lshape, tworoom, arcwall };
const check = process.argv.includes("--check");
let failed = false;
for (const [name, build] of Object.entries(FIXTURES)) {
  const path = join(here, `${name}.structure.json`);
  const text = `${fmt(build())}\n`;
  if (check) {
    let current = "";
    try {
      current = readFileSync(path, "utf-8");
    } catch {
      // missing file counts as a difference
    }
    if (current !== text) {
      console.error(`DIFF ${name}.structure.json`);
      failed = true;
    }
  } else {
    writeFileSync(path, text);
    console.log(`wrote ${name}.structure.json`);
  }
}
if (failed) process.exit(1);
