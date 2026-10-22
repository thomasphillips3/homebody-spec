// Reference implementation of spec/docs/maintenance-schedule.md, written from the doc.
// It exists only to verify spec/fixtures/maintenance-schedule.json. Civil math is on
// integers (days from civil); the built-in date object is never used.

function isLeap(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function daysInMonth(y, m) {
  if (m === 2) return isLeap(y) ? 29 : 28;
  return m === 4 || m === 6 || m === 9 || m === 11 ? 30 : 31;
}

function parseCivil(s) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

const pad = (n, w) => String(n).padStart(w, "0");

/** Days since 1970-01-01 for a civil date string. */
export function daysFromCivil(s) {
  const c = parseCivil(s);
  const y = c.m <= 2 ? c.y - 1 : c.y;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (c.m + (c.m > 2 ? -3 : 9)) + 2) / 5) + c.d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

export function civilFromDays(z) {
  const zz = z + 719468;
  const era = Math.floor(zz / 146097);
  const doe = zz - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp < 10 ? mp + 3 : mp - 9;
  return `${pad(m <= 2 ? y + 1 : y, 4)}-${pad(m, 2)}-${pad(d, 2)}`;
}

export function addDays(s, n) {
  return civilFromDays(daysFromCivil(s) + n);
}

/** Start plus whole calendar months, the day clamped to the target month end. */
export function warrantyEnd(start, months) {
  if (start === null || start === undefined || months === null || months === undefined) return null;
  if (!Number.isInteger(months)) return null;
  const c = parseCivil(start);
  if (c === null) return null;
  const total = c.y * 12 + (c.m - 1) + months;
  const y = Math.floor(total / 12);
  const m = total - y * 12 + 1;
  const d = Math.min(c.d, daysInMonth(y, m));
  return `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}`;
}

export function warrantyFor(start, months, today) {
  const end = warrantyEnd(start, months);
  if (end === null) return { warranty_end: null, warranty_days_until: null, warranty_status: "none" };
  const days = daysFromCivil(end) - daysFromCivil(today);
  const status = days < 0 ? "expired" : days <= 30 ? "ending_soon" : "active";
  return { warranty_end: end, warranty_days_until: days, warranty_status: status };
}

/** A valid interval is a JSON number that is an integer of at least 1. */
export function validInterval(n) {
  return typeof n === "number" && Number.isInteger(n) && n >= 1;
}

export function effectiveInterval(component, homeDefaults, taxonomyDefaults) {
  if (validInterval(component.service_interval_days)) {
    return { days: component.service_interval_days, source: "component" };
  }
  const home = homeDefaults?.[component.component_type];
  if (validInterval(home)) return { days: home, source: "home" };
  const tax = taxonomyDefaults?.[component.component_type];
  if (validInterval(tax)) return { days: tax, source: "taxonomy" };
  return { days: null, source: "none" };
}

/** Schedule row for one component, or null for a soft-deleted one. ctx: { today, home_defaults, taxonomy_defaults }. */
export function scheduleFor(component, ctx) {
  if (component.deleted === true) return null;
  const interval = effectiveInterval(component, ctx.home_defaults, ctx.taxonomy_defaults);
  let baseline = null;
  let baselineSource = "none";
  if (component.last_serviced_at !== null && component.last_serviced_at !== undefined) {
    baseline = component.last_serviced_at;
    baselineSource = "last_serviced";
  } else if (component.install_date !== null && component.install_date !== undefined) {
    baseline = component.install_date;
    baselineSource = "install";
  }
  let nextDue = null;
  let daysUntil = null;
  let status;
  let reason = null;
  if (interval.days === null || baseline === null) {
    status = "needs_baseline";
    reason = interval.days === null ? "no_interval" : "no_baseline";
  } else {
    nextDue = addDays(baseline, interval.days);
    daysUntil = daysFromCivil(nextDue) - daysFromCivil(ctx.today);
    status = daysUntil < 0 ? "overdue" : daysUntil === 0 ? "due_today" : daysUntil <= 30 ? "due_soon" : "scheduled";
  }
  const warranty = warrantyFor(component.warranty_start ?? null, component.warranty_length_months ?? null, ctx.today);
  return {
    interval_days: interval.days,
    interval_source: interval.source,
    baseline,
    baseline_source: baselineSource,
    next_due: nextDue,
    days_until_due: daysUntil,
    service_status: status,
    needs_baseline_reason: reason,
    ...warranty,
  };
}

function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The five Due tab sections as lists of component ids, each in its documented total order. */
export function buildSections(components, ctx) {
  const rows = [];
  for (const c of components) {
    const s = scheduleFor(c, ctx);
    if (s !== null) rows.push({ c, s, name: c.name.toLowerCase(), id: c.id.toLowerCase() });
  }
  const byDue = (a, b) => cmp(a.s.next_due, b.s.next_due) || cmp(a.name, b.name) || cmp(a.id, b.id);
  const byWarranty = (a, b) => cmp(a.s.warranty_end, b.s.warranty_end) || cmp(a.name, b.name) || cmp(a.id, b.id);
  const byName = (a, b) => cmp(a.name, b.name) || cmp(a.id, b.id);
  const pick = (pred, sorter) => rows.filter(pred).sort(sorter).map((r) => r.c.id);
  return {
    overdue: pick((r) => r.s.service_status === "overdue", byDue),
    due_today: pick((r) => r.s.service_status === "due_today", byDue),
    coming_up: pick((r) => r.s.service_status === "due_soon", byDue),
    warranty_ending: pick((r) => r.s.warranty_status === "ending_soon", byWarranty),
    needs_baseline: pick((r) => r.s.service_status === "needs_baseline", byName),
  };
}
