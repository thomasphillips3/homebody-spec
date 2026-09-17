/**
 * Generates Swift, Kotlin, and TypeScript+Zod models from the bundled,
 * fully-dereferenced Home Record schema (build/home-record.bundled.json,
 * produced by `npm run bundle-schema`).
 *
 * Output directory defaults to generated/ (the committed source of truth)
 * but can be overridden via --out-dir, so CI's drift-check can regenerate
 * into a temp directory and diff it against the committed output without
 * duplicating this script.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const bundledSchema = join(repoRoot, "build", "home-record.bundled.json");
const quicktypeBin = join(repoRoot, "node_modules", ".bin", "quicktype");

function parseOutDir(): string {
  const flagIndex = process.argv.indexOf("--out-dir");
  if (flagIndex !== -1 && process.argv[flagIndex + 1]) {
    return resolve(process.argv[flagIndex + 1]);
  }
  if (process.env.CODEGEN_OUT_DIR) {
    return resolve(process.env.CODEGEN_OUT_DIR);
  }
  return join(repoRoot, "generated");
}

function runQuicktype(args: string[]) {
  execFileSync(quicktypeBin, args, { stdio: "inherit" });
}

function main() {
  if (!existsSync(bundledSchema)) {
    console.error(
      `Bundled schema not found at ${bundledSchema}. Run 'npm run bundle-schema' first.`,
    );
    process.exit(1);
  }

  const outDir = parseOutDir();
  const swiftDir = join(outDir, "swift");
  const kotlinDir = join(outDir, "kotlin");
  const typescriptDir = join(outDir, "typescript");

  for (const dir of [swiftDir, kotlinDir, typescriptDir]) {
    mkdirSync(dir, { recursive: true });
  }

  runQuicktype([
    "-s",
    "schema",
    bundledSchema,
    "--lang",
    "swift",
    "--top-level",
    "HomeRecord",
    "-o",
    join(swiftDir, "HomeRecord.swift"),
  ]);

  runQuicktype([
    "-s",
    "schema",
    bundledSchema,
    "--lang",
    "kotlin",
    "--framework",
    "kotlinx",
    "--top-level",
    "HomeRecord",
    "-o",
    join(kotlinDir, "HomeRecord.kt"),
  ]);

  runQuicktype([
    "-s",
    "schema",
    bundledSchema,
    "--lang",
    "typescript-zod",
    "--top-level",
    "HomeRecord",
    "-o",
    join(typescriptDir, "homeRecord.ts"),
  ]);

  console.log(`Generated Swift, Kotlin, and TypeScript models into ${outDir}`);
}

main();
