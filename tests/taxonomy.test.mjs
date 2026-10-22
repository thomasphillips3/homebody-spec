import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const readJSON = (rel) => JSON.parse(readFileSync(join(repoRoot, rel), "utf-8"));

const taxonomy = readJSON("spec/taxonomy/components.json");
const brands = readJSON("spec/taxonomy/brands.json");
const schema = readJSON("spec/schema/entities/component.schema.json");
const enumIds = schema.properties.component_type.enum;

const LEGACY = [
  "water_heater",
  "hvac_furnace",
  "hvac_ac_unit",
  "electrical_panel",
  "outlet",
  "light_fixture",
  "plumbing_fixture",
  "gutter",
  "downspout",
  "smoke_detector",
  "thermostat",
  "camera",
  "network_router",
  "appliance_generic",
  "other",
];
const CATEGORIES = [
  "plumbing",
  "electrical",
  "hvac",
  "roof_structure",
  "appliances_and_water_heater",
  "exterior_and_site",
  "low_voltage_and_smart_home",
];

test("taxonomy has 78 unique types and the category list is fixed", () => {
  assert.equal(taxonomy.types.length, 78);
  assert.deepEqual(taxonomy.categories, CATEGORIES);
  const ids = taxonomy.types.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("taxonomy ids equal the component_type enum", () => {
  const ids = taxonomy.types.map((t) => t.id);
  assert.deepEqual([...ids].sort(), [...enumIds].sort());
  assert.equal(enumIds.length, 78);
});

test("all 15 legacy ids are present", () => {
  const ids = new Set(taxonomy.types.map((t) => t.id));
  for (const legacy of LEGACY) assert.ok(ids.has(legacy), `missing ${legacy}`);
});

test("each layer has at least 8 types and other is the only any type", () => {
  for (const category of CATEGORIES) {
    const count = taxonomy.types.filter((t) => t.category === category).length;
    assert.ok(count >= 8, `${category} has ${count} types`);
  }
  const anyTypes = taxonomy.types.filter((t) => t.category === "any");
  assert.deepEqual(anyTypes.map((t) => t.id), ["other"]);
  assert.equal(taxonomy.types.at(-1).id, "other");
});

test("type shape: placement, interval, aliases, fields", () => {
  for (const type of taxonomy.types) {
    assert.ok(["point", "run", "either"].includes(type.placement), type.id);
    assert.ok(typeof type.label === "string" && type.label.length > 0, type.id);
    const interval = type.default_service_interval_days;
    assert.ok(
      interval === null || (Number.isInteger(interval) && interval > 0),
      `${type.id} interval`,
    );
    for (const alias of type.aliases) {
      assert.equal(alias, alias.toLowerCase(), `${type.id} alias ${alias}`);
    }
    const keys = new Set();
    for (const field of type.fields) {
      assert.ok(field.key && field.label && field.kind, `${type.id} field`);
      assert.ok(
        ["text", "number", "enum", "date", "bool"].includes(field.kind),
        `${type.id}.${field.key} kind`,
      );
      if (field.kind === "enum") {
        assert.ok(
          Array.isArray(field.options) && field.options.length > 0,
          `${type.id}.${field.key} options`,
        );
      }
      assert.ok(!keys.has(field.key), `${type.id} duplicate key ${field.key}`);
      keys.add(field.key);
    }
  }
});

test("brands dictionary rules", () => {
  assert.ok(brands.brands.length >= 60);
  const names = brands.brands.map((b) => b.name);
  assert.equal(new Set(names).size, names.length);
  for (const brand of brands.brands) {
    assert.equal(typeof brand.short_line_only, "boolean", brand.name);
    assert.ok(brand.aliases.length > 0, brand.name);
    for (const alias of brand.aliases) {
      assert.match(alias, /^[A-Z0-9]+(?: [A-Z0-9]+)*$/, `${brand.name} alias ${alias}`);
    }
  }
});
