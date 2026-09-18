import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateHomeRecord } from "homebody-spec";

const testRoot = fileURLToPath(new URL(".", import.meta.url));
const fixtureRoot = join(testRoot, "..", "spec", "fixtures");

function readFixture(name) {
  return JSON.parse(readFileSync(join(fixtureRoot, name), "utf-8"));
}

function expectValid(record) {
  assert.equal(
    validateHomeRecord(record),
    true,
    JSON.stringify(validateHomeRecord.errors, null, 2),
  );
}

function expectInvalid(record) {
  assert.equal(validateHomeRecord(record), false);
  assert.notEqual(validateHomeRecord.errors, null);
}

test("accepts all committed fixtures", () => {
  expectValid(readFixture("minimal-home.json"));
  expectValid(readFixture("maximal-home.json"));
});

test("rejects an invalid UUID", () => {
  const record = readFixture("minimal-home.json");
  record.home.id = "not-a-uuid";
  expectInvalid(record);
});

test("rejects a decimal where an integer is required", () => {
  const record = readFixture("maximal-home.json");
  record.home.year_built = 1998.5;
  expectInvalid(record);
});

test("rejects an unknown property", () => {
  const record = readFixture("minimal-home.json");
  record.home.unknown_property = true;
  expectInvalid(record);
});

test("rejects a malformed semantic version", () => {
  const record = readFixture("minimal-home.json");
  record.schema_version = "0.1";
  expectInvalid(record);
});

test("rejects an unsupported semantic version", () => {
  const record = readFixture("minimal-home.json");
  record.schema_version = "9.9.9";
  expectInvalid(record);
});

test("rejects an event without a non-null target UUID", () => {
  const record = readFixture("maximal-home.json");
  record.events[0].system_id = null;
  record.events[0].component_id = null;
  expectInvalid(record);
});

test("rejects a non-canonical attachment storage path", () => {
  const record = readFixture("maximal-home.json");
  record.attachments[0].storage_path = "../../other-user/secret.jpg";
  expectInvalid(record);
});

test("enforces coordinate cardinality by geometry type", () => {
  const record = readFixture("maximal-home.json");
  record.components[4].geometry.coordinates.push([7, 1.2]);
  expectInvalid(record);

  const shortPolyline = readFixture("maximal-home.json");
  shortPolyline.plan_elements[0].geometry.coordinates = [[0, 0]];
  expectInvalid(shortPolyline);

  const shortPolygon = readFixture("minimal-home.json");
  shortPolygon.rooms[0].geometry.coordinates = [[0, 0], [1, 1]];
  expectInvalid(shortPolygon);
});
