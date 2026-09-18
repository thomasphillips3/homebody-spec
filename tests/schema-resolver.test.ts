import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  confinedResolverOptions,
  createConfinedSchemaResolver,
  dereferenceWithConfinedResolver,
} from "../codegen/schema-resolver.js";

const schemaRoot = join(import.meta.dirname, "..", "spec", "schema");

test("disables built-in file and HTTP resolvers", () => {
  const options = confinedResolverOptions(schemaRoot);
  assert.equal(options.resolve.file, false);
  assert.equal(options.resolve.http, false);
});

test("rejects file references outside the schema root", async () => {
  await assert.rejects(
    dereferenceWithConfinedResolver(
      {
        $id: "https://homebody.app/schema/security-test.schema.json",
        $ref: "file:///etc/passwd",
      },
      schemaRoot,
    ),
  );
});

test("rejects network references", async () => {
  await assert.rejects(
    dereferenceWithConfinedResolver(
      {
        $id: "https://homebody.app/schema/security-test.schema.json",
        $ref: "https://example.com/schema.json",
      },
      schemaRoot,
    ),
  );
});

test("rejects encoded path traversal", () => {
  const resolver = createConfinedSchemaResolver(schemaRoot);

  for (const url of [
    "https://homebody.app/schema/%2e%2e/package.json",
    "https://homebody.app/schema/%2e%2e%2fpackage.json",
    "https://homebody.app/schema/%2e%2e%5cpackage.json",
  ]) {
    assert.throws(() => resolver.read({ url }));
  }
});

test("rejects symlinks that escape the schema root", () => {
  const temporaryRoot = mkdtempSync(join(tmpdir(), "homebody-spec-resolver-"));
  const temporarySchemaRoot = join(temporaryRoot, "schema");
  const outsideFile = join(temporaryRoot, "outside.json");

  try {
    mkdirSync(temporarySchemaRoot);
    writeFileSync(outsideFile, "{}\n", "utf-8");
    symlinkSync(outsideFile, join(temporarySchemaRoot, "escape.json"));

    const resolver = createConfinedSchemaResolver(temporarySchemaRoot);
    assert.throws(() =>
      resolver.read({
        url: "https://homebody.app/schema/escape.json",
      }),
    );
  } finally {
    rmSync(temporaryRoot, { force: true, recursive: true });
  }
});
