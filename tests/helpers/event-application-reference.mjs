// Reference implementation of spec/docs/event-application.md, written from the doc.
// It exists only to verify spec/fixtures/event-application.json. The three native
// ports (Swift, Kotlin, TypeScript) must produce the same output for every case.

const QUALIFYING = new Set(["service", "repair", "replacement"]);

/** Civil date of an event: the first 10 characters of occurred_at (its UTC date part). */
export function civilOf(occurredAt) {
  return occurredAt.slice(0, 10);
}

/** A user-picked civil date D is stored as D + "T12:00:00Z". */
export function occurredAtForCivil(date) {
  return `${date}T12:00:00Z`;
}

/** The device wall-clock date: the first 10 characters of the local wall time string. */
export function civilFromLocalNow(isoWithOffset) {
  return isoWithOffset.slice(0, 10);
}

export function qualifies(eventType) {
  return QUALIFYING.has(eventType);
}

/** Order key: the instant first, then the lowercased id. Negative when a < b. */
export function compareKey(a, b) {
  const ta = Date.parse(a.occurred_at);
  const tb = Date.parse(b.occurred_at);
  if (ta !== tb) return ta < tb ? -1 : 1;
  const ia = a.id.toLowerCase();
  const ib = b.id.toLowerCase();
  if (ia === ib) return 0;
  return ia < ib ? -1 : 1;
}

function maxQualifyingDate(events) {
  let best = null;
  for (const e of events) {
    if (!qualifies(e.event_type)) continue;
    const d = civilOf(e.occurred_at);
    if (best === null || d > best) best = d;
  }
  return best;
}

function latestConditioned(events) {
  let best = null;
  for (const e of events) {
    if (e.condition_after === null || e.condition_after === undefined) continue;
    if (best === null || compareKey(e, best) > 0) best = e;
  }
  return best;
}

/**
 * Apply one event change to its component.
 * component: { id, last_serviced_at, condition } or null for a layer event.
 * before: the event before the change (null on create). after: the event after (null on delete).
 * eventsAfter: every live event on the component after the change (includes after).
 */
export function applyEventChange(component, before, after, eventsAfter) {
  if (component === null) {
    return { last_serviced_at: null, condition: null, patch: {} };
  }
  let lsa = component.last_serviced_at;
  let condition = component.condition;

  // last_serviced_at
  if (after !== null && qualifies(after.event_type)) {
    const d = civilOf(after.occurred_at);
    if (lsa === null || d > lsa) lsa = d;
  }
  if (before !== null && qualifies(before.event_type) && civilOf(before.occurred_at) === lsa) {
    const afterEarlier =
      after !== null && qualifies(after.event_type) && civilOf(after.occurred_at) < civilOf(before.occurred_at);
    if (after === null || !qualifies(after.event_type) || afterEarlier) {
      lsa = maxQualifyingDate(eventsAfter);
    }
  }

  // condition
  const latest = latestConditioned(eventsAfter);
  const afterConditioned = after !== null && after.condition_after !== null && after.condition_after !== undefined;
  if (before === null) {
    if (afterConditioned && latest !== null && latest.id === after.id) {
      condition = after.condition_after;
    }
  } else if (afterConditioned && latest !== null && latest.id === after.id) {
    condition = after.condition_after;
  } else if (before.condition_after !== null && before.condition_after !== undefined) {
    if (before.condition_after === component.condition) {
      const others = eventsAfter.filter((e) => after === null || e.id !== after.id);
      const beforeIsGreatest = others.every(
        (e) => e.condition_after === null || e.condition_after === undefined || compareKey(before, e) > 0,
      );
      if (beforeIsGreatest && latest !== null) condition = latest.condition_after;
    }
  }

  const patch = {};
  if (lsa !== component.last_serviced_at) patch.last_serviced_at = lsa;
  if (condition !== component.condition) patch.condition = condition;
  return { last_serviced_at: lsa, condition, patch };
}
