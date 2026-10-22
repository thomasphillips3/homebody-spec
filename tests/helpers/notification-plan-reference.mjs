// Reference implementation of spec/docs/notification-plan.md, written from the doc.
// It exists only to verify spec/fixtures/notification-plan.json.

import { createHash } from "node:crypto";

import { addDays, scheduleFor } from "./schedule-reference.mjs";

export const NAMESPACE = "5f3c9a2e-7b1d-4e68-9c04-2a8d6e1b7f35";

const KIND_RANK = { service_due: 0, service_overdue: 1, warranty_ending: 2, recall: 3 };
const ALL_KINDS = ["service_due", "service_overdue", "warranty_ending", "recall"];

export function uuidV5(namespace, name) {
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

function notice(component, kind, fireDate, body) {
  return {
    id: uuidV5(NAMESPACE, `${component.id.toLowerCase()}:${kind}:${fireDate}`),
    kind,
    component_id: component.id,
    fire_at: `${fireDate}T09:00`,
    title: component.name,
    body,
  };
}

/** input: { now_local, home_defaults, taxonomy_defaults, components, snoozed_until, enabled_kinds, max_items } */
export function planNotifications(input) {
  const today = input.now_local.slice(0, 10);
  const ctx = { today, home_defaults: input.home_defaults, taxonomy_defaults: input.taxonomy_defaults };
  const snoozed = input.snoozed_until ?? {};
  const enabled = new Set(input.enabled_kinds ?? ALL_KINDS);
  const max = input.max_items ?? 60;
  const out = [];
  for (const c of input.components) {
    const s = scheduleFor(c, ctx);
    if (s === null) continue;
    const found = [];
    if (s.next_due !== null) {
      found.push(notice(c, "service_due", addDays(s.next_due, -7), "Service due in 7 days"));
      found.push(notice(c, "service_due", s.next_due, "Service due today"));
      for (let k = 1; k <= 4; k += 1) {
        found.push(notice(c, "service_overdue", addDays(s.next_due, 7 * k), `Service overdue ${7 * k} days`));
      }
    }
    if (s.warranty_end !== null) {
      found.push(notice(c, "warranty_ending", addDays(s.warranty_end, -30), "Warranty ends in 30 days"));
      found.push(notice(c, "warranty_ending", addDays(s.warranty_end, -7), "Warranty ends in 7 days"));
    }
    const snoozeDate = snoozed[c.id] ?? null;
    for (const n of found) {
      if (!(n.fire_at > input.now_local)) continue;
      const isService = n.kind === "service_due" || n.kind === "service_overdue";
      if (isService && snoozeDate !== null && n.fire_at.slice(0, 10) <= snoozeDate) continue;
      if (!enabled.has(n.kind)) continue;
      out.push(n);
    }
  }
  out.sort((a, b) => {
    if (a.fire_at !== b.fire_at) return a.fire_at < b.fire_at ? -1 : 1;
    if (KIND_RANK[a.kind] !== KIND_RANK[b.kind]) return KIND_RANK[a.kind] - KIND_RANK[b.kind];
    const ia = a.id.toLowerCase();
    const ib = b.id.toLowerCase();
    return ia < ib ? -1 : ia > ib ? 1 : 0;
  });
  return out.slice(0, max);
}
