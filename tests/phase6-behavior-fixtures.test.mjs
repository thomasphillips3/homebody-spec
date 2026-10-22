import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  applyEventChange,
  civilFromLocalNow,
  civilOf,
  compareKey,
  occurredAtForCivil,
  qualifies,
} from "./helpers/event-application-reference.mjs";
import { cascadeCount, historyFor, monthGroups } from "./helpers/history-scopes-reference.mjs";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const readJSON = (rel) => JSON.parse(readFileSync(join(repoRoot, rel), "utf-8"));

const CASE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertUniqueNames(cases, label) {
  const names = cases.map((c) => c.name);
  assert.equal(new Set(names).size, names.length, `${label} names must be unique`);
  for (const name of names) {
    assert.match(name, CASE_NAME, `${label} name must be lowercase and hyphen separated: ${name}`);
  }
}

function assertHeader(fx, label) {
  assert.equal(fx.version, "0.6.0", `${label} version`);
  assert.equal(typeof fx.description, "string", `${label} description`);
  assert.ok(fx.description.length > 0, `${label} description`);
}

// ----------------------------------------------------------- event-application

const APPLY_TAGS = [
  "create",
  "backfill",
  "edit-date",
  "edit-type",
  "edit-condition",
  "delete-owner",
  "delete-non-owner",
  "delete-only-event",
  "tie",
  "condition-latest-wins",
  "condition-backfill",
  "condition-manual-override",
  "layer-event",
  "manual-date",
  "non-noon",
  "uppercase-id",
];

test("event-application: header, qualifying types and structural minimums", () => {
  const fx = readJSON("spec/fixtures/event-application.json");
  assertHeader(fx, "event-application");
  assert.deepEqual(fx.qualifying_types, ["service", "repair", "replacement"]);
  assert.ok(fx.apply_cases.length >= 26, "at least 26 apply cases");
  assertUniqueNames(fx.apply_cases, "apply_cases");
  const tags = new Set(fx.apply_cases.flatMap((c) => c.tags));
  for (const tag of APPLY_TAGS) assert.ok(tags.has(tag), `tag ${tag} is covered`);
  assert.ok(fx.log_today_cases.length >= 4, "at least 4 log-today cases");
  assertUniqueNames(fx.log_today_cases, "log_today_cases");
  assert.ok(fx.civil_cases.length >= 2);
  for (const t of fx.qualifying_types) assert.equal(qualifies(t), true, t);
  for (const t of ["inspection", "reading", "note"]) assert.equal(qualifies(t), false, t);
});

test("event-application: events_after is consistent with before and after", () => {
  const fx = readJSON("spec/fixtures/event-application.json");
  for (const c of fx.apply_cases) {
    const ids = c.events_after.map((e) => e.id);
    assert.equal(new Set(ids).size, ids.length, `${c.name}: events_after ids are unique`);
    assert.ok(c.before !== null || c.after !== null, `${c.name}: a change needs before or after`);
    if (c.after !== null) {
      const found = c.events_after.find((e) => e.id === c.after.id);
      assert.deepEqual(found, c.after, `${c.name}: events_after holds the after event`);
    }
    if (c.after === null) {
      assert.equal(
        c.events_after.some((e) => e.id === c.before.id),
        false,
        `${c.name}: a deleted event is absent from events_after`,
      );
    }
    for (const e of c.events_after) {
      assert.equal(
        e.component_id,
        c.component === null ? null : c.component.id,
        `${c.name}: every live event targets the component`,
      );
    }
  }
});

test("event-application: every apply case matches the independent Owner rule", () => {
  const fx = readJSON("spec/fixtures/event-application.json");
  for (const c of fx.apply_cases) {
    const got = applyEventChange(c.component, c.before, c.after, c.events_after);
    assert.deepEqual(got, c.expected, c.name);
    const base = c.component ?? { last_serviced_at: null, condition: null };
    const patchKeys = Object.keys(c.expected.patch);
    for (const key of patchKeys) {
      assert.notEqual(c.expected.patch[key], base[key], `${c.name}: patch holds only changed ${key}`);
      assert.equal(c.expected.patch[key], c.expected[key], `${c.name}: patch ${key} equals result`);
    }
    for (const key of ["last_serviced_at", "condition"]) {
      if (!patchKeys.includes(key)) {
        assert.equal(c.expected[key], base[key], `${c.name}: ${key} is unchanged when absent from the patch`);
      }
    }
  }
});

test("event-application: the civil date is the UTC date part and the key is instant then lowercase id", () => {
  const fx = readJSON("spec/fixtures/event-application.json");
  for (const c of fx.civil_cases) {
    assert.equal(civilOf(c.occurred_at), c.expected_civil, c.occurred_at);
  }
  assert.equal(occurredAtForCivil("2026-05-10"), "2026-05-10T12:00:00Z");
  const a = { id: "a5000001-0000-4000-8000-000000000000", occurred_at: "2026-09-01T12:00:00Z" };
  const b = { id: "B2000004-0000-4000-8000-000000000000", occurred_at: "2026-09-01T12:00:00Z" };
  const nine = { id: "9f000003-0000-4000-8000-000000000000", occurred_at: "2026-09-01T12:00:00Z" };
  assert.ok(compareKey(a, b) < 0, "lowercase b sorts after a even though ASCII B sorts before a");
  assert.ok(compareKey(nine, a) < 0, "digit sorts before letter");
  const later = { id: "00000000-0000-4000-8000-000000000000", occurred_at: "2026-09-02T12:00:00Z" };
  assert.ok(compareKey(b, later) < 0, "the instant decides before the id");
});

test("event-application: logging 'today' uses the device-local civil date", () => {
  const fx = readJSON("spec/fixtures/event-application.json");
  for (const c of fx.log_today_cases) {
    const civil = civilFromLocalNow(c.device_local_now);
    assert.equal(civil, c.expected_civil_today, c.name);
    assert.equal(occurredAtForCivil(civil), c.expected_occurred_at, c.name);
  }
  const byName = Object.fromEntries(fx.log_today_cases.map((c) => [c.name, c]));
  const utc13 = fx.log_today_cases.find((c) => c.device_local_now === "2026-03-02T01:30:00+13:00");
  const utcm11 = fx.log_today_cases.find((c) => c.device_local_now === "2026-03-01T22:30:00-11:00");
  assert.ok(utc13 && utcm11, "UTC+13 and UTC-11 cases exist");
  assert.equal(utc13.expected_civil_today, "2026-03-02");
  assert.equal(utcm11.expected_civil_today, "2026-03-01");
  assert.ok(fx.log_today_cases.some((c) => c.expected_civil_today === "2028-02-29"), "leap day case");
  assert.ok(
    fx.log_today_cases.some((c) => c.device_local_now === "2026-12-31T23:59:00-11:00"),
    "year boundary case",
  );
  assert.ok(Object.keys(byName).length >= 4);
});

// -------------------------------------------------------------- history-scopes

test("history-scopes: dataset shape and structural minimums", () => {
  const fx = readJSON("spec/fixtures/history-scopes.json");
  assertHeader(fx, "history-scopes");
  assert.ok(fx.systems.length >= 2);
  assert.ok(fx.rooms.length >= 3);
  assert.ok(fx.components.length >= 5);
  assert.ok(fx.components.some((c) => c.deleted === true), "a soft-deleted component");
  assert.ok(fx.events.length >= 14);
  assert.ok(fx.events.some((e) => e.deleted === true), "a soft-deleted event");
  assert.ok(
    fx.events.some((e) => e.component_id === null && e.system_id !== null),
    "a system-level event",
  );
  assert.ok(
    fx.events.some((e) => {
      const comp = fx.components.find((c) => c.id === e.component_id);
      return comp !== undefined && comp.deleted === true && e.deleted !== true;
    }),
    "an orphan live event on a deleted component",
  );
  assert.ok(
    fx.events.some((e) => e.home_id !== fx.home_id),
    "events of another home",
  );
  // ties: three events share one instant with ids 9..., a... and an uppercase B...
  const byInstant = new Map();
  for (const e of fx.events) {
    byInstant.set(e.occurred_at, [...(byInstant.get(e.occurred_at) ?? []), e.id]);
  }
  const tie = [...byInstant.values()].find((ids) => ids.length >= 3);
  assert.ok(tie, "three events share one occurred_at");
  assert.ok(tie.some((id) => /^9/.test(id)) && tie.some((id) => /^a/.test(id)) && tie.some((id) => /^[A-Z]/.test(id)));
  assertUniqueNames(fx.cases, "cases");
  for (const kind of ["component", "layer", "room", "house"]) {
    assert.ok(fx.cases.some((c) => c.scope.kind === kind), `scope ${kind}`);
  }
  assert.ok(fx.cases.some((c) => c.expected_event_ids.length === 0), "an empty scope");
  assert.ok(fx.month_group_cases.length >= 1);
  assert.ok(fx.cascade_count_cases.length >= 2);
  assert.ok(fx.cascade_count_cases.some((c) => c.target.kind === "component"));
  assert.ok(fx.cascade_count_cases.some((c) => c.target.kind === "home"));
});

test("history-scopes: every scope case matches the independent reference", () => {
  const fx = readJSON("spec/fixtures/history-scopes.json");
  for (const c of fx.cases) {
    const got = historyFor(c.scope, fx).map((e) => e.id);
    assert.deepEqual(got, c.expected_event_ids, c.name);
    const keys = got.map((id) => {
      const e = fx.events.find((x) => x.id === id);
      return { occurred_at: e.occurred_at, id: e.id.toLowerCase(), deleted: e.deleted === true };
    });
    for (const k of keys) assert.equal(k.deleted, false, `${c.name}: soft-deleted events never appear`);
    for (let i = 1; i < keys.length; i += 1) {
      const prev = keys[i - 1];
      const cur = keys[i];
      const pt = Date.parse(prev.occurred_at);
      const ct = Date.parse(cur.occurred_at);
      assert.ok(pt > ct || (pt === ct && prev.id < cur.id), `${c.name}: order is occurred_at desc then lowercase id asc`);
    }
  }
});

test("history-scopes: month groups and cascade counts match the reference", () => {
  const fx = readJSON("spec/fixtures/history-scopes.json");
  assertUniqueNames(fx.month_group_cases, "month_group_cases");
  for (const c of fx.month_group_cases) {
    const groups = monthGroups(historyFor(c.scope, fx));
    assert.deepEqual(
      groups,
      c.expected_groups.map((g) => ({ month: g.month, event_ids: g.event_ids })),
      c.name,
    );
    const months = c.expected_groups.map((g) => g.month);
    assert.deepEqual([...months].sort().reverse(), months, `${c.name}: newest month first`);
  }
  for (const c of fx.cascade_count_cases) {
    assert.equal(cascadeCount(c.target, fx), c.expected_event_count, JSON.stringify(c.target));
  }
});
