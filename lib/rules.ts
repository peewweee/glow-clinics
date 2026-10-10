import { BUDGET_CHIP, BUDGET_MAX, CONCERNS, DOWNTIME_CHIP, DOWNTIME_MAX_DAYS, labelOf } from "./questions";
import { TREATMENTS, type Treatment } from "./treatments";
import type { Answers, ConcernId, Recommendation } from "./types";

const EVENT_RE = /\b(wedding|event|party|birthday|graduation|photo ?shoot|debut|prom|vacation|trip|holiday)\b/i;

// Words in the free-text answer that hint at a concern the client didn't tick.
const KEYWORDS: [RegExp, ConcernId][] = [
  [/\b(spot|spots|pigment\w*|melasma|dull|redness|uneven|sun ?damage|glow)\b/i, "tone"],
  [/\b(wrinkle\w*|lines?|crow'?s feet|forehead|ageing|aging)\b/i, "lines"],
  [/\b(acne|pimple\w*|breakout\w*|scar\w*|pores?)\b/i, "acne"],
  [/\b(volume|sagging|hollow\w*|lips?|cheeks?|jaw\w*)\b/i, "volume"],
  [/\b(hair|shaving|waxing)\b/i, "hair"],
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const withinDowntime = (t: Treatment, a: Answers) => t.downtimeDays <= DOWNTIME_MAX_DAYS[a.downtime];

export function contextChips(a: Answers): string[] {
  const chips = a.concerns.filter((c) => c !== "other").map((c) => labelOf(CONCERNS, c));
  if (EVENT_RE.test(a.details)) chips.push("Event coming up");
  chips.push(DOWNTIME_CHIP[a.downtime], BUDGET_CHIP[a.budget]);
  return chips;
}

/** Rule-based fallback, used when no AI key is set or the AI call fails. */
export function recommendByRules(a: Answers): Recommendation {
  const hasEvent = EVENT_RE.test(a.details);
  const textConcerns = KEYWORDS.filter(([re]) => re.test(a.details)).map(([, c]) => c);
  const budgetMax = BUDGET_MAX[a.budget];

  const score = (t: Treatment) => {
    let s = 0;
    a.concerns.forEach((c, i) => (s += (t.concerns[c] ?? 0) * (i === 0 ? 10 : 6)));
    textConcerns.forEach((c) => (s += (t.concerns[c] ?? 0) * 3));
    if (s === 0) return 0;
    s += t.priceFrom <= budgetMax ? 4 : -6;
    if (hasEvent && t.downtimeDays === 0) s += 3;
    return Math.max(s, 1);
  };

  const rank = (list: Treatment[]) =>
    list
      .map((t) => ({ t, s: score(t) }))
      .filter((x) => x.s > 0)
      .sort((x, y) => y.s - x.s || x.t.downtimeDays - y.t.downtimeDays);

  // First choice: treatments inside the client's downtime limit.
  let ranked = rank(TREATMENTS.filter((t) => withinDowntime(t, a)));
  // Nothing inside the limit treats their concern (e.g. lost volume with zero downtime):
  // suggest the closest match anyway and say plainly that it needs more downtime.
  let stretched = false;
  if (!ranked.length) {
    ranked = rank(TREATMENTS);
    stretched = ranked.length > 0;
  }
  // Still nothing (only "Something else" with no useful details): offer the gentlest options.
  if (!ranked.length) ranked = TREATMENTS.filter((t) => t.id === "glow-facial" || t.id === "led").map((t) => ({ t, s: 1 }));

  const [first, second] = ranked;
  const mainConcern = a.concerns.find((c) => c !== "other") ?? textConcerns[0];
  const concernText = mainConcern ? labelOf(CONCERNS, mainConcern).toLowerCase() : null;

  const lead = concernText ? `You'd like help with ${concernText}` : "You'd like a general refresh";
  const timing =
    first.t.downtimeDays === 0 && a.downtime === "none" ? " without taking time off" : "";
  const event = hasEvent && first.t.downtimeDays === 0 ? " before your event" : "";
  let primaryReason = `${lead}${timing}${event}, so we'd start with ${first.t.name}: ${first.t.pitch}.`;
  if (stretched) {
    primaryReason += ` It does come with ${first.t.downtimeLabel.toLowerCase()}, a little more than you hoped for, so it's worth talking through timing at your consult.`;
  }

  const secondary = second && second.s >= first.s * 0.5 ? second.t : null;
  const secondaryReason = secondary
    ? `${cap(secondary.pitch)}.${secondary.downtimeDays > 0 ? ` Expect ${secondary.downtimeLabel.toLowerCase()}.` : ""}`
    : "";

  const howWePicked = [
    stretched
      ? `Nothing on our menu treats ${concernText ?? "this"} with ${a.downtime === "none" ? "zero" : "that little"} downtime, so we picked the closest match.`
      : a.downtime === "none"
        ? "You chose no downtime, so we only looked at treatments you can walk out of looking normal."
        : `We only looked at treatments with up to ${DOWNTIME_MAX_DAYS[a.downtime]} days of downtime.`,
    concernText ? `We ranked them by how well they treat ${concernText}.` : "We started with our gentlest options.",
    a.budget === "unsure" ? "You didn't set a budget, so price didn't change the ranking." : "Treatments within your budget ranked higher.",
  ];

  return {
    kind: "match",
    primary: { id: first.t.id, reason: primaryReason },
    secondary: secondary ? { id: secondary.id, reason: secondaryReason } : null,
    howWePicked,
    contextChips: contextChips(a),
    engine: "rules",
  };
}
