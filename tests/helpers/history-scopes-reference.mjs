// Reference implementation of spec/docs/history-scopes.md, written from the doc.
// It exists only to verify spec/fixtures/history-scopes.json.

function order(a, b) {
  const ta = Date.parse(a.occurred_at);
  const tb = Date.parse(b.occurred_at);
  if (ta !== tb) return tb - ta; // newest first
  const ia = a.id.toLowerCase();
  const ib = b.id.toLowerCase();
  if (ia === ib) return 0;
  return ia < ib ? -1 : 1; // lowercase id ascending
}

/** Events visible in a scope, ordered. dataset: { home_id, components, events }. */
export function historyFor(scope, dataset) {
  const live = dataset.events.filter((e) => e.deleted !== true);
  const liveComponents = dataset.components.filter((c) => c.deleted !== true);
  let picked;
  switch (scope.kind) {
    case "component":
      picked = live.filter((e) => e.component_id === scope.id);
      break;
    case "layer": {
      const ids = new Set(liveComponents.filter((c) => c.system_id === scope.id).map((c) => c.id));
      picked = live.filter(
        (e) => e.system_id === scope.id || (e.component_id !== null && ids.has(e.component_id)),
      );
      break;
    }
    case "room": {
      const ids = new Set(liveComponents.filter((c) => c.room_ids.includes(scope.id)).map((c) => c.id));
      picked = live.filter((e) => e.component_id !== null && ids.has(e.component_id));
      break;
    }
    case "house":
      picked = live.filter((e) => e.home_id === scope.id);
      break;
    default:
      throw new Error(`unknown scope ${scope.kind}`);
  }
  return [...picked].sort(order);
}

/** Group an ordered list by the first 7 characters of occurred_at, newest month first. */
export function monthGroups(events) {
  const groups = [];
  for (const e of events) {
    const month = e.occurred_at.slice(0, 7);
    const last = groups[groups.length - 1];
    if (last !== undefined && last.month === month) last.event_ids.push(e.id);
    else groups.push({ month, event_ids: [e.id] });
  }
  return groups;
}

/** Live events that a cascade delete of the target would tombstone. */
export function cascadeCount(target, dataset) {
  const live = dataset.events.filter((e) => e.deleted !== true);
  if (target.kind === "component") return live.filter((e) => e.component_id === target.id).length;
  if (target.kind === "home") return live.filter((e) => e.home_id === target.id).length;
  throw new Error(`unknown target ${target.kind}`);
}
