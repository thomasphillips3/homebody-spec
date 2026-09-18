/**
 * Generates Swift, Kotlin, and TypeScript models plus a standalone AJV
 * validator from the bundled,
 * fully-dereferenced Home Record schema (build/home-record.bundled.json,
 * produced by `npm run bundle-schema`).
 *
 * Output directory defaults to generated/ (the committed source of truth)
 * but can be overridden via --out-dir, so CI's drift-check can regenerate
 * into a temp directory and diff it against the committed output without
 * duplicating this script.
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import standaloneCode from "ajv/dist/standalone/index.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const bundledSchema = join(repoRoot, "build", "home-record.bundled.json");
const modelSchema = join(repoRoot, "build", "home-record.models.json");
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

function removeNestedSchemaIdentifiers(
  value: unknown,
  isRoot = true,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => removeNestedSchemaIdentifiers(item, false));
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, child]) => {
        if (!isRoot && (key === "$id" || key === "$schema")) {
          return [];
        }
        return [[key, removeNestedSchemaIdentifiers(child, false)]];
      }),
    );
  }

  return value;
}

function writeModelSchema(schema: Record<string, unknown>) {
  const modelInput = structuredClone(schema) as {
    properties?: {
      schema_version?: Record<string, unknown>;
    };
  };

  // Runtime validation accepts only known versions. Keep generated model APIs
  // string-based so adding a compatible version does not change public types.
  delete modelInput.properties?.schema_version?.enum;
  writeFileSync(modelSchema, `${JSON.stringify(modelInput, null, 2)}\n`, "utf-8");
}

function postprocessSwiftOutput(filePath: string) {
  const marker = "public class JSONAny: Codable {\n\n    public let value: Any\n";
  const source = readFileSync(filePath, "utf-8");
  if (!source.includes(marker)) {
    throw new Error("Unable to add public JSONAny initializer to Swift output");
  }

  writeFileSync(
    filePath,
    source.replace(
      marker,
      `${marker}
    public init(_ value: Any) {
        self.value = value
    }
`,
    ),
    "utf-8",
  );
}

function postprocessTypeScriptOutput(filePath: string) {
  const source = readFileSync(filePath, "utf-8");
  const eventPattern = /export interface Event \{\n([\s\S]*?)\n\}\n/;
  const eventMatch = source.match(eventPattern);
  if (!eventMatch) {
    throw new Error("Unable to locate Event in TypeScript output");
  }

  const commonFields = eventMatch[1]
    .split("\n")
    .filter(
      (line) =>
        !line.includes("component_id?:") && !line.includes("system_id?:"),
    )
    .join("\n");
  const replacement = `export type Event =
    | (EventFields & { system_id: string; component_id?: string | null })
    | (EventFields & { component_id: string; system_id?: string | null });

export interface EventFields {
${commonFields}
}
`;

  writeFileSync(filePath, source.replace(eventPattern, replacement), "utf-8");
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

  const bundledInput = JSON.parse(
    readFileSync(bundledSchema, "utf-8"),
  ) as Record<string, unknown>;
  writeModelSchema(bundledInput);

  runQuicktype([
    "-s",
    "schema",
    modelSchema,
    "--lang",
    "swift",
    "--top-level",
    "HomeRecord",
    "--access-level",
    "public",
    "--support-linux",
    "-o",
    join(swiftDir, "HomeRecord.swift"),
  ]);
  postprocessSwiftOutput(join(swiftDir, "HomeRecord.swift"));

  runQuicktype([
    "-s",
    "schema",
    modelSchema,
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
    modelSchema,
    "--lang",
    "typescript",
    "--top-level",
    "HomeRecord",
    "--just-types",
    "--no-date-times",
    "-o",
    join(typescriptDir, "homeRecord.ts"),
  ]);
  postprocessTypeScriptOutput(join(typescriptDir, "homeRecord.ts"));

  const schema = removeNestedSchemaIdentifiers(
    bundledInput,
  );
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    validateFormats: true,
    code: {
      lines: true,
      source: true,
    },
  });
  addFormats(ajv, { mode: "full" });
  const validate = ajv.compile(schema);
  const validatorCode = standaloneCode(ajv, validate);

  writeFileSync(
    join(typescriptDir, "validateHomeRecord.js"),
    `// Generated from spec/schema. Do not edit directly.\n${validatorCode}`,
    "utf-8",
  );
  writeFileSync(
    join(typescriptDir, "validateHomeRecord.d.ts"),
    `import type { HomeRecord } from "./homeRecord.js";

export interface HomeRecordValidationError {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: Record<string, unknown>;
  message?: string;
}

export interface HomeRecordValidator {
  (data: unknown): data is HomeRecord;
  errors: HomeRecordValidationError[] | null;
}

declare const validateHomeRecord: HomeRecordValidator;
export default validateHomeRecord;
`,
    "utf-8",
  );
  writeFileSync(
    join(typescriptDir, "index.js"),
    `"use strict";

const validateHomeRecord = require("./validateHomeRecord.js");

exports.validateHomeRecord = validateHomeRecord;
`,
    "utf-8",
  );
  writeFileSync(
    join(typescriptDir, "index.d.ts"),
    `export type * from "./homeRecord.js";
export { default as validateHomeRecord } from "./validateHomeRecord.js";
export type {
  HomeRecordValidationError,
  HomeRecordValidator,
} from "./validateHomeRecord.js";
`,
    "utf-8",
  );

  console.log(
    `Generated Swift, Kotlin, TypeScript, and runtime validator output into ${outDir}`,
  );
}

main();
