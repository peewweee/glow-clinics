import type { Answers } from "./types";

// Safety screening is deterministic on purpose: an AI model never decides whether
// a flagged client gets a treatment suggestion. Any flag routes to a clinician.
const MESSAGES: Record<string, string> = {
  pregnant: "You mentioned pregnancy or breastfeeding. Some treatments aren't suitable right now.",
  recent: "You've had a procedure in the last two weeks. Your skin may need more time before the next one.",
  infection: "You have an active skin infection or cold sore. That needs to clear before most treatments.",
  isotretinoin: "You're taking acne medication like isotretinoin, which makes skin more sensitive to many treatments.",
};

// Catch the same flags when they're typed into the free-text answer.
const TEXT_PATTERNS: [RegExp, keyof typeof MESSAGES][] = [
  [/\b(pregnan\w*|breast\s?feed\w*|nursing)\b/i, "pregnant"],
  [/\b(accutane|isotretinoin|roaccutane)\b/i, "isotretinoin"],
  [/\b(cold sore|herpes|infection|infected)\b/i, "infection"],
];

export function safetyReasons(a: Answers): string[] {
  const keys = new Set<string>(a.safety.filter((s) => s !== "none"));
  for (const [re, key] of TEXT_PATTERNS) if (re.test(a.details)) keys.add(key);
  return [...keys].map((k) => MESSAGES[k]).filter(Boolean);
}
