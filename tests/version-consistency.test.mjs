import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

function readJSON(relativePath) {
  return JSON.parse(readFileSync(join(repoRoot, relativePath), "utf-8"));
}

test("all release metadata and fixtures use spec/VERSION", () => {
  const version = readFileSync(join(repoRoot, "spec", "VERSION"), "utf-8").trim();
  const packageManifest = readJSON("package.json");
  const packageLock = readJSON("package-lock.json");
  const gradleManifest = readFileSync(
    join(repoRoot, "build.gradle.kts"),
    "utf-8",
  );
  const changelog = readFileSync(
    join(repoRoot, "spec", "CHANGELOG.md"),
    "utf-8",
  );

  assert.match(version, /^\d+\.\d+\.\d+$/);
  assert.equal(packageManifest.version, version);
  assert.equal(packageLock.version, version);
  assert.equal(packageLock.packages[""].version, version);
  assert.match(gradleManifest, new RegExp(`version = "${version}"`));
  assert.match(changelog, new RegExp(`^## ${version} - `, "m"));

  for (const fixtureName of ["minimal-home.json", "maximal-home.json"]) {
    assert.equal(
      readJSON(join("spec", "fixtures", fixtureName)).schema_version,
      version,
    );
  }
});
