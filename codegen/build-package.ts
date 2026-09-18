import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generatedRoot = join(repoRoot, "generated", "typescript");
const distRoot = join(repoRoot, "dist");
const tscBin = join(repoRoot, "node_modules", ".bin", "tsc");

rmSync(distRoot, { force: true, recursive: true });
mkdirSync(distRoot, { recursive: true });

execFileSync(
  tscBin,
  [
    join(generatedRoot, "homeRecord.ts"),
    "--declaration",
    "--emitDeclarationOnly",
    "--outDir",
    distRoot,
    "--skipLibCheck",
  ],
  { stdio: "inherit" },
);

for (const fileName of [
  "index.js",
  "index.d.ts",
  "validateHomeRecord.js",
  "validateHomeRecord.d.ts",
]) {
  copyFileSync(join(generatedRoot, fileName), join(distRoot, fileName));
}

const renderSourceRoot = join(repoRoot, "spec", "render");
const renderDistRoot = join(distRoot, "render");
mkdirSync(renderDistRoot, { recursive: true });

execFileSync(
  tscBin,
  [
    join(renderSourceRoot, "index.ts"),
    "--outDir",
    renderDistRoot,
    "--declaration",
    "--module",
    "Node16",
    "--moduleResolution",
    "Node16",
    "--target",
    "ES2022",
    "--skipLibCheck",
  ],
  { stdio: "inherit" },
);

copyFileSync(
  join(renderSourceRoot, "style-tokens.json"),
  join(renderDistRoot, "style-tokens.json"),
);

console.log(`Distributable npm package written to ${distRoot}`);
