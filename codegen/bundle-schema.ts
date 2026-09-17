/**
 * Bundles the multi-file, $ref-composed Home Record JSON Schema into a single,
 * fully-dereferenced document that quicktype can consume directly.
 *
 * Every entity schema file declares an absolute $id
 * (https://homebody.app/schema/...), which is not a reachable host. Per JSON
 * Schema resolution rules, that $id becomes the base URI for resolving
 * relative $refs inside the document, so a naive dereference() call tries to
 * fetch https://homebody.app/schema/entities/... over the network instead of
 * reading the local file. To avoid that, this script registers a custom
 * resolver that maps the https://homebody.app/schema/ URL prefix back onto
 * the local spec/schema/ directory on disk, and disables the default http
 * resolver entirely so nothing ever hits the network.
 *
 * This is the permanent version of the one-off resolver scripts 01-03 and
 * 01-04 used in their session scratchpads to work around the same issue.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import $RefParser from "@apidevtools/json-schema-ref-parser";

const SCHEMA_ID_PREFIX = "https://homebody.app/schema/";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const schemaRoot = join(repoRoot, "spec", "schema");
const entryPoint = join(schemaRoot, "home-record.schema.json");
const outDir = join(repoRoot, "build");
const outFile = join(outDir, "home-record.bundled.json");

async function main() {
  const bundled = await $RefParser.dereference(entryPoint, {
    resolve: {
      http: false,
      homebodySchemaId: {
        order: 1,
        canRead: (file: { url: string }) => file.url.startsWith(SCHEMA_ID_PREFIX),
        read: (file: { url: string }) => {
          const relativePath = file.url.slice(SCHEMA_ID_PREFIX.length);
          const localPath = join(schemaRoot, relativePath);
          return readFileSync(localPath);
        },
      },
    },
  } as Parameters<typeof $RefParser.dereference>[1]);

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(bundled, null, 2) + "\n", "utf-8");
  console.log(`Bundled schema written to ${outFile}`);
}

main().catch((err) => {
  console.error("Failed to bundle schema:", err);
  process.exit(1);
});
