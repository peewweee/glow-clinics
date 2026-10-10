import type { BudgetId, ConcernId, DowntimeId, SafetyId } from "./types";

export type Option<T extends string> = { id: T; label: string; hint?: string };

export const CONCERNS: Option<ConcernId>[] = [
  { id: "tone", label: "Dull or uneven skin tone", hint: "Dark spots, redness, lack of radiance" },
  { id: "lines", label: "Fine lines and wrinkles", hint: "Forehead, crow's feet, frown lines" },
  { id: "acne", label: "Acne or acne scars", hint: "Breakouts, marks, uneven texture" },
  { id: "volume", label: "Lost volume or sagging", hint: "Cheeks, lips, jawline" },
  { id: "hair", label: "Unwanted hair", hint: "Face or body" },
  { id: "other", label: "Something else", hint: "Tell us on the next step" },
];

export const DOWNTIME: Option<DowntimeId>[] = [
  { id: "none", label: "None. I need to look normal the next day", hint: "Back to work or plans straight away" },
  { id: "few", label: "A few days is fine", hint: "Some redness or flaking for 1–3 days" },
  { id: "week", label: "Up to a week", hint: "Happy to wait for stronger results" },
];

export const BUDGET: Option<BudgetId>[] = [
  { id: "under5", label: "Under ₱5,000 per session" },
  { id: "5to15", label: "₱5,000 – ₱15,000 per session" },
  { id: "over15", label: "Over ₱15,000 per session" },
  { id: "unsure", label: "Not sure yet", hint: "We'll show a range of options" },
];

export const SAFETY: Option<SafetyId>[] = [
  { id: "pregnant", label: "Pregnant or breastfeeding" },
  { id: "recent", label: "Had a cosmetic procedure in the last 2 weeks" },
  { id: "infection", label: "Active skin infection or cold sore" },
  { id: "isotretinoin", label: "Taking acne medication like isotretinoin" },
  { id: "none", label: "None of these" },
];

export const DETAIL_CHIPS = ["I have an event coming up", "My skin is sensitive", "This is my first treatment"];

export const DOWNTIME_MAX_DAYS: Record<DowntimeId, number> = { none: 0, few: 3, week: 7 };

export const BUDGET_MAX: Record<BudgetId, number> = { under5: 5000, "5to15": 15000, over15: Infinity, unsure: Infinity };

export const DOWNTIME_CHIP: Record<DowntimeId, string> = { none: "No downtime", few: "A few days' downtime", week: "Up to a week's downtime" };

export const BUDGET_CHIP: Record<BudgetId, string> = {
  under5: "Under ₱5k",
  "5to15": "₱5k–15k",
  over15: "₱15k+",
  unsure: "Budget open",
};

export const labelOf = <T extends string>(opts: Option<T>[], id: T) => opts.find((o) => o.id === id)?.label ?? id;
