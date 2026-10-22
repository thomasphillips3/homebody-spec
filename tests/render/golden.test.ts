import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { CATEGORY_GLYPHS, generateRenderModel } from "../../spec/render/draw-commands.js";
import { LAYER_BY_STYLE } from "../../spec/render/style-layers.js";
import type { LevelRenderInput, StyleToken } from "../../spec/render/types.js";

const testRoot = fileURLToPath(new URL(".", import.meta.url));
const fixtureRoot = join(testRoot, "..", "..", "spec", "fixtures", "render");
const tokensPath = join(testRoot, "..", "..", "spec", "render", "style-tokens.json");

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtureRoot, name), "utf-8")) as T;
}

interface Tokens {
  layers: Record<StyleToken, number>;
  markers: Record<string, Record<string, number>>;
  components: {
    category_glyphs: Record<string, string>;
    layer_colors: Record<string, { light: string; dark: string }>;
    condition_colors: Record<string, { light: string; dark: string; shape: string }>;
    halo_colors: { light: string; dark: string };
    glyphs: Record<string, string>;
    badges: Record<string, { outer: string; mark: string }>;
  };
}

const tokens = JSON.parse(readFileSync(tokensPath, "utf-8")) as Tokens;

const CATEGORIES = [
  "plumbing",
  "electrical",
  "hvac",
  "roof_structure",
  "appliances_and_water_heater",
  "exterior_and_site",
  "low_voltage_and_smart_home",
];

describe("style token layers", () => {
  it("matches style-tokens.json layer map", () => {
    expect(LAYER_BY_STYLE).toEqual(tokens.layers);
  });

  it("includes the component tokens at the specified z-order", () => {
    expect(tokens.layers["component.run" as StyleToken]).toBe(40);
    expect(tokens.layers["component.halo" as StyleToken]).toBe(45);
    expect(tokens.layers["component.marker" as StyleToken]).toBe(50);
    expect(tokens.layers["component.badge" as StyleToken]).toBe(51);
  });
});

describe("component tokens", () => {
  it("defines screen-fixed marker and run sizes", () => {
    expect(tokens.markers["component.marker"]).toEqual({
      diameter_px: 28,
      hit_radius_px: 22,
      badge_px: 14,
    });
    expect(tokens.markers["component.run"]).toEqual({
      width_px: 4,
      casing_px: 6,
      hit_band_px: 12,
    });
    expect(tokens.markers["component.halo"]).toEqual({ ring_px: 3, gap_px: 2 });
  });

  it("maps every layer category to a glyph and a color pair", () => {
    expect(Object.keys(tokens.components.category_glyphs)).toEqual(CATEGORIES);
    expect(CATEGORY_GLYPHS).toEqual(tokens.components.category_glyphs);
    for (const category of CATEGORIES) {
      const glyph = tokens.components.category_glyphs[category];
      expect(tokens.components.glyphs[glyph]).toBeTypeOf("string");
      const color = tokens.components.layer_colors[`component.layer.${category}`];
      expect(color.light).toMatch(/^#[0-9a-f]{6}$/);
      expect(color.dark).toMatch(/^#[0-9a-f]{6}$/);
    }
    expect(Object.keys(tokens.components.glyphs).sort()).toEqual(
      [...new Set(Object.values(tokens.components.category_glyphs))].sort(),
    );
  });

  it("defines a badge for each of the four known conditions and a color for all five", () => {
    expect(Object.keys(tokens.components.badges).sort()).toEqual(
      ["fair", "good", "needs_attention", "needs_replacement"],
    );
    expect(Object.keys(tokens.components.condition_colors).sort()).toEqual(
      ["fair", "good", "needs_attention", "needs_replacement", "unknown"],
    );
    expect(tokens.components.halo_colors).toEqual({ light: "#1d2a24", dark: "#ffffff" });
  });

  it("uses only absolute M, L, C and Z commands in glyph and badge paths", () => {
    const paths = [
      ...Object.values(tokens.components.glyphs),
      ...Object.values(tokens.components.badges).flatMap((b) => [b.outer, b.mark]),
    ];
    expect(paths.length).toBe(7 + 8);
    for (const path of paths) {
      expect(path).toMatch(/^[MLCZ0-9. \-]+$/);
      expect(path).not.toMatch(/  /);
      expect(path.startsWith("M ")).toBe(true);
      expect(path.endsWith(" Z")).toBe(true);
    }
  });
});

describe("generateRenderModel golden vectors", () => {
  const cases = [
    {
      name: "rectangular-room",
      input: "rectangular-room.input.json",
      golden: "rectangular-room.golden.json",
    },
    {
      name: "maximal-main-floor",
      input: "maximal-main-floor.input.json",
      golden: "maximal-main-floor.golden.json",
    },
    {
      name: "roomplan-scan",
      input: "roomplan-scan.input.json",
      golden: "roomplan-scan.golden.json",
    },
    {
      name: "components-overlay",
      input: "components-overlay.input.json",
      golden: "components-overlay.golden.json",
    },
  ];

  for (const { name, input, golden } of cases) {
    it(`matches committed golden for ${name}`, () => {
      const levelInput = readJson<LevelRenderInput>(input);
      const expected = readJson(golden);
      const actual = generateRenderModel(levelInput);
      expect(actual).toEqual(expected);
    });
  }

  it("emits no component output when components is absent or empty", () => {
    const input = readJson<LevelRenderInput>("rectangular-room.input.json");
    const without = generateRenderModel(input);
    const empty = generateRenderModel({ ...input, components: [] });
    expect(empty).toEqual(without);
    expect(JSON.stringify(without)).not.toContain("marker");
  });

  it("emits one marker per point and one marker per run, and omits level mismatches and malformed geometry", () => {
    const input = readJson<LevelRenderInput>("components-overlay.input.json");
    const model = generateRenderModel(input);
    const markers = model.commands.filter((c) => c.kind === "marker");
    expect(markers.length).toBe(5);
    expect(JSON.stringify(model)).not.toContain("null");
    const ids = new Set(model.commands.map((c) => c.source_id));
    expect(ids.has("20000000-0000-4000-8000-000000000006")).toBe(false);
    expect(ids.has("20000000-0000-4000-8000-000000000007")).toBe(false);
    expect(ids.has("20000000-0000-4000-8000-000000000008")).toBe(false);
  });
});
