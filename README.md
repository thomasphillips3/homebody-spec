# homebody-spec

The Home Record spec: an open, versioned JSON Schema for describing a house's
systems, components, and maintenance history, plus the generated Swift,
Kotlin, and TypeScript models derived from it, and golden fixtures used to
validate every generator and every platform's implementation.

This repo is the single source of truth for the Home Record format used by
[Homebody](https://github.com/thomasphillips3/homebody). Any app can
implement the spec to read or write a Home Record - that's the point: your
home's maintenance history should be able to move with the house, or into a
different app, without lock-in.

## Layout

- `spec/` - the JSON Schema itself, documentation, and golden fixtures
- `codegen/` - scripts that generate Swift/Kotlin/TypeScript models and
  validators from the schema
- `generated/` - the generated output, committed so changes are diffable in
  PRs (not gitignored - see `.gitignore`)

## License

Code in this repository (`codegen/`, root manifests) is MIT-licensed. The
schema, documentation, and fixtures under `spec/` are CC-BY 4.0-licensed -
see `spec/LICENSE`.

## Consuming this repo

Homebody's private app repo consumes this spec via SPM (iOS), JitPack
(Android), and npm (web), all pinned to git tags in this repo. This repo is
not published to a private package registry - it's public, and tags are the
versioning mechanism.

### JavaScript and TypeScript

Install a tagged release directly from GitHub:

```sh
npm install github:thomasphillips3/homebody-spec#v0.1.1
```

The package exports TypeScript declarations and a schema-faithful standalone
runtime validator as compiled JavaScript:

```ts
import {
  type HomeRecord,
  validateHomeRecord,
} from "homebody-spec";

const candidate: unknown = JSON.parse(input);
if (!validateHomeRecord(candidate)) {
  console.error(validateHomeRecord.errors);
  throw new Error("Invalid Home Record");
}

const record: HomeRecord = candidate;
```

The authoritative root schema is also exported as `homebody-spec/schema`.

### Swift

Add this repository as a Swift package dependency pinned to `v0.1.1`, then:

```swift
import HomebodySpec

let record: HomeRecord = try HomeRecord(data: data)
```

All generated model types and their Codable members are public. External
Release consumers do not need `@testable`.
