import {
  readFileSync,
  realpathSync,
} from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";

import $RefParser from "@apidevtools/json-schema-ref-parser";

export const SCHEMA_ID_PREFIX = "https://homebody.app/schema/";

type ResolverFile = {
  url: string;
};

function isConfined(root: string, candidate: string): boolean {
  const relativePath = relative(root, candidate);
  return (
    relativePath === "" ||
    (!relativePath.startsWith(`..${sep}`) &&
      relativePath !== ".." &&
      !isAbsolute(relativePath))
  );
}

function parseSchemaURL(fileURL: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(fileURL);
  } catch {
    throw new Error(`Invalid schema reference URL: ${fileURL}`);
  }

  if (
    parsed.protocol !== "https:" ||
    parsed.origin !== "https://homebody.app" ||
    !parsed.pathname.startsWith("/schema/") ||
    parsed.username !== "" ||
    parsed.password !== "" ||
    parsed.search !== ""
  ) {
    throw new Error(`Refusing non-Homebody schema reference: ${fileURL}`);
  }

  return parsed;
}

export function createConfinedSchemaResolver(schemaRoot: string) {
  const confinedRoot = realpathSync(schemaRoot);

  return {
    order: 1,
    canRead(file: ResolverFile): boolean {
      try {
        parseSchemaURL(file.url);
        return true;
      } catch {
        return false;
      }
    },
    read(file: ResolverFile): Buffer {
      const parsed = parseSchemaURL(file.url);
      const encodedRelativePath = parsed.pathname.slice("/schema/".length);

      let relativePath: string;
      try {
        relativePath = decodeURIComponent(encodedRelativePath);
      } catch {
        throw new Error(`Invalid encoded schema reference: ${file.url}`);
      }

      const pathSegments = relativePath.split(/[\\/]/);
      if (
        relativePath.includes("\0") ||
        isAbsolute(relativePath) ||
        pathSegments.some((segment) => segment === "..")
      ) {
        throw new Error(`Refusing schema path traversal: ${file.url}`);
      }

      const candidate = resolve(confinedRoot, relativePath);
      if (!isConfined(confinedRoot, candidate)) {
        throw new Error(`Refusing schema path outside root: ${file.url}`);
      }

      let realCandidate: string;
      try {
        realCandidate = realpathSync(candidate);
      } catch {
        throw new Error(`Schema reference does not exist: ${file.url}`);
      }

      if (!isConfined(confinedRoot, realCandidate)) {
        throw new Error(`Refusing schema symlink escape: ${file.url}`);
      }

      return readFileSync(realCandidate);
    },
  };
}

export function confinedResolverOptions(schemaRoot: string) {
  return {
    resolve: {
      file: false,
      http: false,
      homebodySchemaId: createConfinedSchemaResolver(schemaRoot),
    },
  };
}

export async function dereferenceWithConfinedResolver(
  schema: object,
  schemaRoot: string,
): Promise<object> {
  return $RefParser.dereference(
    schema,
    confinedResolverOptions(schemaRoot) as Parameters<
      typeof $RefParser.dereference
    >[1],
  );
}
