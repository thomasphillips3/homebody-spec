import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const temporaryRoot = mkdtempSync(join(tmpdir(), "homebody-spec-consumer-"));
const consumerRoot = join(temporaryRoot, "consumer");

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf-8",
  });

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed\n${result.stdout}\n${result.stderr}`,
    );
  }

  return result.stdout;
}

try {
  const packOutput = run(
    "npm",
    [
      "pack",
      "--ignore-scripts",
      "--silent",
      "--json",
      "--pack-destination",
      temporaryRoot,
    ],
    repoRoot,
  );
  const [{ filename }] = JSON.parse(packOutput);
  const tarballPath = join(temporaryRoot, filename);

  mkdirSync(consumerRoot);
  writeFileSync(
    join(consumerRoot, "package.json"),
    JSON.stringify(
      {
        name: "homebody-spec-node-consumer",
        private: true,
        type: "module",
      },
      null,
      2,
    ),
    "utf-8",
  );
  copyFileSync(
    join(repoRoot, "spec", "fixtures", "minimal-home.json"),
    join(consumerRoot, "fixture.json"),
  );
  writeFileSync(
    join(consumerRoot, "index.mjs"),
    `import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateHomeRecord } from "homebody-spec";

const fixture = JSON.parse(readFileSync(new URL("./fixture.json", import.meta.url)));
assert.equal(typeof validateHomeRecord, "function");
assert.equal(validateHomeRecord(fixture), true, JSON.stringify(validateHomeRecord.errors));
`,
    "utf-8",
  );

  run(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      tarballPath,
    ],
    consumerRoot,
  );
  run("node", ["index.mjs"], consumerRoot);

  console.log(`Direct Node consumer passed for ${basename(tarballPath)}`);
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
