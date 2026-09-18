/**
 * Bundles the multi-file, $ref-composed Home Record JSON Schema into a single,
 * fully-dereferenced document that quicktype can consume directly.
 *
 * All reference loading uses a realpath-confined resolver. The parser's
 * built-in file and HTTP resolvers are disabled, so schema changes cannot
 * read outside spec/schema or access the network in local builds or CI.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { dereferenceWithConfinedResolver } from "./schema-resolver.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const schemaRoot = join(repoRoot, "spec", "schema");
const entryPoint = join(schemaRoot, "home-record.schema.json");
const outDir = join(repoRoot, "build");
const outFile = join(outDir, "home-record.bundled.json");

async function main() {
  const rootSchema = JSON.parse(readFileSync(entryPoint, "utf-8")) as object;
  const bundled = await dereferenceWithConfinedResolver(rootSchema, schemaRoot);

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(bundled, null, 2) + "\n", "utf-8");
  console.log(`Bundled schema written to ${outFile}`);
}

main().catch((err) => {
  console.error("Failed to bundle schema:", err);
  process.exit(1);
});
