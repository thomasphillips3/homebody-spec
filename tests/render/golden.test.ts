import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { generateRenderModel } from "../../spec/render/draw-commands.js";
import { LAYER_BY_STYLE } from "../../spec/render/style-layers.js";
import type { LevelRenderInput, StyleToken } from "../../spec/render/types.js";

const testRoot = fileURLToPath(new URL(".", import.meta.url));
const fixtureRoot = join(testRoot, "..", "..", "spec", "fixtures", "render");

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtureRoot, name), "utf-8")) as T;
}

describe("style token layers", () => {
  it("matches style-tokens.json layer map", () => {
    const tokens = JSON.parse(
      readFileSync(
        join(fixtureRoot, "..", "..", "render", "style-tokens.json"),
        "utf-8",
      ),
    ) as { layers: Record<StyleToken, number> };
    expect(LAYER_BY_STYLE).toEqual(tokens.layers);
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
  ];

  for (const { name, input, golden } of cases) {
    it(`matches committed golden for ${name}`, () => {
      const levelInput = readJson<LevelRenderInput>(input);
      const expected = readJson(golden);
      const actual = generateRenderModel(levelInput);
      expect(actual).toEqual(expected);
    });
  }
});
