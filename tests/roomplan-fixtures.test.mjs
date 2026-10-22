import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const dir = join(repoRoot, "spec", "fixtures", "roomplan");
const NAMES = ["box", "rotated30", "lshape", "tworoom", "arcwall"];
const SURFACE_KEYS = [
  "category",
  "confidence",
  "completedEdges",
  "dimensions",
  "transform",
  "identifier",
  "story",
  "curve",
  "parentIdentifier",
  "polygonCorners",
];

const readJSON = (name) => JSON.parse(readFileSync(join(dir, name), "utf-8"));

test("generate-structures --check reproduces every structure fixture byte for byte", () => {
  execFileSync("node", [join(dir, "generate-structures.mjs"), "--check"], {
    stdio: "pipe",
  });
});

test("derive-goldens --check matches every plan golden within 1e-6", () => {
  execFileSync("node", [join(dir, "derive-goldens.mjs"), "--check"], {
    stdio: "pipe",
  });
});

for (const name of NAMES) {
  test(`${name} structure: every surface has the keys the RoomPlan decoder requires`, () => {
    const structure = readJSON(`${name}.structure.json`);
    for (const list of ["walls", "doors", "windows", "openings", "floors"]) {
      for (const surface of structure[list]) {
        for (const key of SURFACE_KEYS) {
          assert.ok(key in surface, `${name} ${list} surface missing ${key}`);
        }
        assert.equal(surface.transform.length, 16);
        assert.equal(surface.dimensions.length, 3);
      }
    }
    assert.ok(Array.isArray(structure.rooms) && structure.rooms.length >= 1);
  });
}

test("box golden equals the hand-worked example", () => {
  const g = readJSON("box.plan.golden.json");
  const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  assert.equal(g.scan_rotation_rad, 0);
  assert.deepEqual(g.scan_origin_m, [0, 0]);
  assert.equal(g.story_count, 1);
  assert.deepEqual(
    g.elements.map((e) => [e.kind, e.host_surface_id, e.coordinates]),
    [
      ["wall", null, [[0, 0], [4, 0]]],
      ["wall", null, [[4, 0], [4, 3]]],
      ["wall", null, [[4, 3], [0, 3]]],
      ["wall", null, [[0, 3], [0, 0]]],
      ["door", id(1), [[0.55, 0], [1.45, 0]]],
      ["window", id(2), [[4, 0.9], [4, 2.1]]],
    ],
  );
  assert.equal(g.rooms.length, 1);
  assert.equal(g.rooms[0].room_type, "kitchen");
  assert.equal(g.rooms[0].area_m2, 12);
  assert.deepEqual(g.rooms[0].ring, [[0, 0], [4, 0], [4, 3], [0, 3], [0, 0]]);
  assert.deepEqual(g.warnings, []);
});

test("rotated30 yields the box elements with a 30 degree rotation and nonzero origin", () => {
  const box = readJSON("box.plan.golden.json");
  const rot = readJSON("rotated30.plan.golden.json");
  assert.ok(Math.abs(rot.scan_rotation_rad - Math.PI / 6) < 1e-5);
  assert.ok(rot.scan_origin_m.some((v) => Math.abs(v) > 1));
  assert.equal(rot.elements.length, box.elements.length);
  rot.elements.forEach((e, i) => {
    e.coordinates.forEach((p, j) => {
      assert.ok(Math.abs(p[0] - box.elements[i].coordinates[j][0]) < 1e-5);
      assert.ok(Math.abs(p[1] - box.elements[i].coordinates[j][1]) < 1e-5);
    });
  });
  assert.equal(rot.rooms[0].area_m2, 12);
});

test("lshape pins hosting, the 0.35 m fallback, and the non-rectangular area", () => {
  const g = readJSON("lshape.plan.golden.json");
  const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const byKind = Object.fromEntries(
    g.elements.filter((e) => e.kind !== "wall").map((e) => [e.kind, e]),
  );
  assert.equal(byKind.door.host_surface_id, id(6));
  assert.equal(byKind.window.host_surface_id, id(5));
  assert.equal(byKind.opening.host_surface_id, id(4));
  assert.equal(g.rooms[0].area_m2, 24);
  assert.equal(g.rooms[0].room_type, "living_room");
});

test("tworoom emits the shared wall once and two rooms", () => {
  const g = readJSON("tworoom.plan.golden.json");
  assert.equal(g.elements.filter((e) => e.kind === "wall").length, 7);
  assert.deepEqual(g.rooms.map((r) => r.room_type), ["kitchen", "bedroom"]);
});

test("arcwall subdivides a 90 degree sweep into six 15 degree chords", () => {
  const g = readJSON("arcwall.plan.golden.json");
  const chords = g.elements.filter((e) => e.surface_id.includes("#"));
  assert.equal(chords.length, 6);
  assert.deepEqual(g.warnings, []);
});
