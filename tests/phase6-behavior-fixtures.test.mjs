import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
import { planNotifications } from "./helpers/notification-plan-reference.mjs";
import {
  buildSections,
  effectiveInterval,
  scheduleFor,
  warrantyEnd,
  warrantyFor,
} from "./helpers/schedule-reference.mjs";

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

// ----------------------------------------------------------- maintenance-schedule

const SERVICE_STATUSES = ["overdue", "due_today", "due_soon", "scheduled", "needs_baseline"];
const WARRANTY_STATUSES = ["expired", "ending_soon", "active", "none"];

function hasName(cases, ...words) {
  return cases.some((c) => words.every((w) => c.name.includes(w)));
}

test("maintenance-schedule: header and structural minimums", () => {
  const fx = readJSON("spec/fixtures/maintenance-schedule.json");
  assertHeader(fx, "maintenance-schedule");
  assert.ok(fx.interval_cases.length >= 8, "at least 8 interval cases");
  assert.ok(fx.schedule_cases.length >= 22, "at least 22 schedule cases");
  assert.ok(fx.section_cases.length >= 3, "at least 3 section cases");
  assert.ok(Array.isArray(fx.warranty_cases) && fx.warranty_cases.length >= 8, "warranty cases");
  assertUniqueNames(fx.interval_cases, "interval_cases");
  assertUniqueNames(fx.schedule_cases, "schedule_cases");
  assertUniqueNames(fx.section_cases, "section_cases");
  assertUniqueNames(fx.warranty_cases, "warranty_cases");
  const sources = new Set(fx.interval_cases.map((c) => c.expected_source));
  for (const s of ["component", "home", "taxonomy", "none"]) assert.ok(sources.has(s), `interval source ${s}`);
  const statuses = new Set(fx.schedule_cases.filter((c) => c.expected).map((c) => c.expected.service_status));
  for (const s of SERVICE_STATUSES) assert.ok(statuses.has(s), `service status ${s}`);
  const wstatuses = new Set(
    [...fx.schedule_cases.filter((c) => c.expected).map((c) => c.expected.warranty_status), ...fx.warranty_cases.map((c) => c.expected_status)],
  );
  for (const s of WARRANTY_STATUSES) assert.ok(wstatuses.has(s), `warranty status ${s}`);
  assert.ok(fx.schedule_cases.some((c) => c.expected === null), "a deleted component yields no row");
  for (const word of ["leap", "dst", "year"]) {
    assert.ok(fx.schedule_cases.some((c) => c.name.includes(word)), `a schedule case about ${word}`);
  }
  assert.ok(hasName(fx.warranty_cases, "month-end"), "a month-end warranty clamp case");
  assert.ok(fx.section_cases.some((c) => Object.values(c.expected_sections).every((ids) => ids.length > 0)), "a case with every section non-empty");
  const twoSections = fx.section_cases.some((c) => {
    const seen = new Set();
    for (const ids of Object.values(c.expected_sections)) for (const id of ids) {
      if (seen.has(id)) return true;
      seen.add(id);
    }
    return false;
  });
  assert.ok(twoSections, "a component in two sections");
});

test("maintenance-schedule: interval resolution matches the independent reference", () => {
  const fx = readJSON("spec/fixtures/maintenance-schedule.json");
  for (const c of fx.interval_cases) {
    const got = effectiveInterval(
      { component_type: c.component_type, service_interval_days: c.component_interval },
      c.home_defaults,
      c.taxonomy_defaults,
    );
    assert.deepEqual(got, { days: c.expected_days, source: c.expected_source }, c.name);
  }
});

test("maintenance-schedule: every schedule case matches the independent reference", () => {
  const fx = readJSON("spec/fixtures/maintenance-schedule.json");
  for (const c of fx.schedule_cases) {
    const got = scheduleFor(c.component, {
      today: c.today,
      home_defaults: c.home_defaults,
      taxonomy_defaults: c.taxonomy_defaults,
    });
    assert.deepEqual(got, c.expected, c.name);
  }
});

test("maintenance-schedule: warranty end, clamp and status match the independent reference", () => {
  const fx = readJSON("spec/fixtures/maintenance-schedule.json");
  for (const c of fx.warranty_cases) {
    assert.equal(warrantyEnd(c.warranty_start, c.warranty_length_months), c.expected_end, c.name);
    assert.deepEqual(
      warrantyFor(c.warranty_start, c.warranty_length_months, c.today),
      {
        warranty_end: c.expected_end,
        warranty_days_until: c.expected_days_until,
        warranty_status: c.expected_status,
      },
      c.name,
    );
  }
});

test("maintenance-schedule: Due tab sections and their total sort order match the reference", () => {
  const fx = readJSON("spec/fixtures/maintenance-schedule.json");
  for (const c of fx.section_cases) {
    const got = buildSections(c.components, {
      today: c.today,
      home_defaults: c.home_defaults,
      taxonomy_defaults: c.taxonomy_defaults,
    });
    assert.deepEqual(Object.keys(c.expected_sections), ["overdue", "due_today", "coming_up", "warranty_ending", "needs_baseline"], c.name);
    assert.deepEqual(got, c.expected_sections, c.name);
    for (const ids of Object.values(c.expected_sections)) {
      for (const id of ids) assert.ok(c.components.some((x) => x.id === id), `${c.name}: ${id} is an input component`);
    }
    const deleted = new Set(c.components.filter((x) => x.deleted).map((x) => x.id));
    for (const ids of Object.values(c.expected_sections)) {
      for (const id of ids) assert.equal(deleted.has(id), false, `${c.name}: deleted components are excluded`);
    }
  }
});

// ------------------------------------------------------------- notification-plan

function uuidV5(namespace, name) {
  const ns = Buffer.from(namespace.replace(/-/g, ""), "hex");
  const digest = createHash("sha1")
    .update(Buffer.concat([ns, Buffer.from(name, "utf-8")]))
    .digest()
    .subarray(0, 16);
  digest[6] = (digest[6] & 0x0f) | 0x50;
  digest[8] = (digest[8] & 0x3f) | 0x80;
  const h = digest.toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

const UUID_V5 = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const KIND_RANK = { service_due: 0, service_overdue: 1, warranty_ending: 2, recall: 3 };
const BODY = /^(Service due in 7 days|Service due today|Service overdue (7|14|21|28) days|Warranty ends in (30|7) days)$/;

test("notification-plan: header, namespace and structural minimums", () => {
  const fx = readJSON("spec/fixtures/notification-plan.json");
  assertHeader(fx, "notification-plan");
  assert.equal(fx.namespace, "5f3c9a2e-7b1d-4e68-9c04-2a8d6e1b7f35");
  assert.ok(fx.cases.length >= 12, "at least 12 cases");
  assert.ok(fx.id_vectors.length >= 3, "at least 3 id vectors");
  assertUniqueNames(fx.cases, "cases");
  assertUniqueNames(fx.id_vectors, "id_vectors");
  const words = [
    "far-future", "three-days", "0800", "0900", "overdue", "long-ago", "warranty", "five-days",
    "snooz", "enabled-kinds", "max-items", "needs-baseline", "deleted", "same-fire-at", "uppercase",
  ];
  for (const w of words) assert.ok(fx.cases.some((c) => c.name.includes(w)), `a case about ${w}`);
});

test("notification-plan: id vectors equal an independent SHA-1 UUIDv5 recomputation", () => {
  const fx = readJSON("spec/fixtures/notification-plan.json");
  for (const v of fx.id_vectors) {
    const expected = uuidV5(fx.namespace, `${v.component_id.toLowerCase()}:${v.kind}:${v.fire_date}`);
    assert.equal(v.expected_id, expected, v.name);
    assert.match(v.expected_id, UUID_V5, v.name);
  }
  const upper = fx.id_vectors.filter((v) => v.component_id !== v.component_id.toLowerCase());
  assert.ok(upper.length >= 1, "an uppercase component id vector");
  for (const v of upper) {
    const lower = fx.id_vectors.find((x) => x.component_id === v.component_id.toLowerCase() && x.kind === v.kind && x.fire_date === v.fire_date);
    assert.ok(lower && lower.expected_id === v.expected_id, `${v.name}: same id as the lowercase form`);
  }
});

test("notification-plan: every case matches the independent planner and its own invariants", () => {
  const fx = readJSON("spec/fixtures/notification-plan.json");
  for (const c of fx.cases) {
    const got = planNotifications(c);
    assert.deepEqual(got, c.expected, c.name);
    const max = c.max_items ?? 60;
    assert.ok(c.expected.length <= max, `${c.name}: within the cap`);
    let prev = null;
    for (const n of c.expected) {
      const comp = c.components.find((x) => x.id === n.component_id);
      assert.ok(comp, `${c.name}: component exists`);
      assert.equal(n.title, comp.name, `${c.name}: title is the component name`);
      assert.match(n.id, UUID_V5, c.name);
      assert.match(n.body, BODY, c.name);
      assert.match(n.fire_at, /^\d{4}-\d{2}-\d{2}T09:00$/, `${c.name}: fires at 09:00`);
      assert.ok(n.fire_at > c.now_local, `${c.name}: strictly in the future`);
      assert.equal(n.id, uuidV5(fx.namespace, `${n.component_id.toLowerCase()}:${n.kind}:${n.fire_at.slice(0, 10)}`), `${c.name}: id`);
      assert.notEqual(n.kind, "recall", `${c.name}: recall is never emitted here`);
      const key = [n.fire_at, KIND_RANK[n.kind], n.id.toLowerCase()];
      if (prev !== null) {
        const cmp = prev[0] < key[0] ? -1 : prev[0] > key[0] ? 1 : prev[1] - key[1] || (prev[2] < key[2] ? -1 : prev[2] > key[2] ? 1 : 0);
        assert.ok(cmp < 0, `${c.name}: sorted by fire_at, kind rank, id`);
      }
      prev = key;
      if (c.enabled_kinds) assert.ok(c.enabled_kinds.includes(n.kind), `${c.name}: kind is enabled`);
    }
    const ids = c.expected.map((n) => n.id);
    assert.equal(new Set(ids).size, ids.length, `${c.name}: ids are unique`);
  }
});
