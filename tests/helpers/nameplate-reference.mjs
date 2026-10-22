// Reference nameplate parser used only to verify the shared fixtures. The three
// native ports (Swift, Kotlin, TypeScript) must produce the same output for every
// case under spec/fixtures/nameplate/. Algorithm: spec/docs/nameplate-parsing.md.

export const MODEL_RE =
  /\b(?:MODEL(?:E)?(?:\s*(?:NO\.?|NUMBER|NUM\.?|#|CODE))?(?:\s*\/\s*MODELE)?|MOD\.?(?:\s*NO\.?)?|M\/N|MDL\.?|CAT(?:ALOG)?\.?\s*(?:NO\.?|#)?)(?![A-Z])/g;
export const SERIAL_RE =
  /\b(?:SERIAL(?:\s*(?:NO\.?|NUMBER|NUM\.?|#))?(?:\s*\/\s*SERIE)?|SER\.?(?:\s*(?:NO\.?|#))?|S\/N|SN)(?![A-Z])/g;

const MINLEN = { model: 3, serial: 4 };
const MAXLEN = 30;
const LEAD = ":#.-";
const TRAIL = ".,;:";

export function normalizeLines(lines) {
  return lines
    .map((line) =>
      line
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/ /g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((line) => line.length > 0);
}

function strip(text, leading, trailing) {
  let start = 0;
  let end = text.length;
  while (start < end && leading.includes(text[start])) start += 1;
  while (end > start && trailing.includes(text[end - 1])) end -= 1;
  return text.slice(start, end);
}

function pickToken(text, field) {
  for (const raw of text.split(/\s+/)) {
    if (raw === "") continue;
    const token = strip(raw, LEAD, TRAIL);
    if (token.length < MINLEN[field] || token.length > MAXLEN) continue;
    if (!/^[A-Z0-9][A-Z0-9\-/.]*$/.test(token)) continue;
    if (!/[0-9]/.test(token)) continue;
    return token;
  }
  return null;
}

function labelHits(upper) {
  const hits = [];
  for (const [field, re] of [
    ["model", MODEL_RE],
    ["serial", SERIAL_RE],
  ]) {
    for (const match of upper.matchAll(new RegExp(re.source, "g"))) {
      hits.push({ field, start: match.index, end: match.index + match[0].length });
    }
  }
  hits.sort((a, b) => a.start - b.start || b.end - a.end);
  const kept = [];
  let lastEnd = -1;
  for (const hit of hits) {
    if (hit.start < lastEnd) continue;
    kept.push(hit);
    lastEnd = hit.end;
  }
  return kept;
}

function alnumTokens(upper) {
  return upper.split(/[^A-Z0-9]+/).filter(Boolean);
}

function detectMake(upperLines, brands) {
  for (const upper of upperLines) {
    const tokens = alnumTokens(upper);
    const padded = ` ${tokens.join(" ")} `;
    let best = null;
    for (const brand of brands) {
      if (brand.short_line_only && tokens.length > 3) continue;
      for (const alias of brand.aliases) {
        if (padded.includes(` ${alias} `)) {
          if (best === null || alias.length > best.aliasLength) {
            best = { name: brand.name, aliasLength: alias.length };
          }
        }
      }
    }
    if (best) return best.name;
  }
  return null;
}

export function parseNameplate(lines, brands) {
  const upperLines = normalizeLines(lines).map((line) => line.toUpperCase());
  const result = { make: null, model: null, serial: null };

  upperLines.forEach((upper, i) => {
    const hits = labelHits(upper);
    hits.forEach((hit, j) => {
      if (result[hit.field] !== null) return;
      const next = hits[j + 1];
      const valueText = upper.slice(hit.end, next ? next.start : upper.length);
      let value = pickToken(valueText, hit.field);
      if (
        value === null &&
        j === hits.length - 1 &&
        strip(valueText, " :#.-", " :#.-") === "" &&
        i + 1 < upperLines.length &&
        labelHits(upperLines[i + 1]).length === 0
      ) {
        value = pickToken(upperLines[i + 1], hit.field);
      }
      if (value !== null) result[hit.field] = value;
    });
  });

  result.make = detectMake(upperLines, brands);
  return result;
}
