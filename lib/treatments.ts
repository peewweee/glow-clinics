import type { ConcernId } from "./types";

// A fictional treatment menu. Glow Clinics' real menu, prices and clinical rules were not provided,
// so every value here is a placeholder to be replaced with the clinic's own data.
export type Treatment = {
  id: string;
  name: string;
  pitch: string; // what it does, as a lower-case noun phrase that completes "we'd start with X: ..."
  concerns: Partial<Record<ConcernId, 1 | 2 | 3>>; // how well it addresses each concern (3 = best)
  downtimeDays: number; // worst-case days of visible recovery
  downtimeLabel: string;
  session: string;
  priceFrom: number; // PHP
  priceUnit: string;
};

export const TREATMENTS: Treatment[] = [
  {
    id: "glow-facial",
    name: "Signature Glow Facial",
    pitch: "a deep-cleansing, exfoliating and hydrating facial with results you can see the same day",
    concerns: { tone: 2, acne: 1 },
    downtimeDays: 0,
    downtimeLabel: "None",
    session: "45 min",
    priceFrom: 6500,
    priceUnit: "per session",
  },
  {
    id: "led",
    name: "LED Light Therapy",
    pitch: "a gentle light treatment that calms breakouts and redness, with no needles or peeling",
    concerns: { acne: 2, tone: 1 },
    downtimeDays: 0,
    downtimeLabel: "None",
    session: "20 min",
    priceFrom: 2500,
    priceUnit: "per session",
  },
  {
    id: "chemical-peel",
    name: "Light Chemical Peel",
    pitch: "a mild acid peel that fades dark spots and acne marks and smooths texture",
    concerns: { tone: 2, acne: 2 },
    downtimeDays: 3,
    downtimeLabel: "2–3 days of light flaking",
    session: "30 min",
    priceFrom: 4800,
    priceUnit: "per session",
  },
  {
    id: "ipl",
    name: "IPL Photofacial",
    pitch: "a light treatment that targets sun spots, redness and broken capillaries",
    concerns: { tone: 3 },
    downtimeDays: 2,
    downtimeLabel: "1–2 days of redness",
    session: "30 min",
    priceFrom: 8500,
    priceUnit: "per session",
  },
  {
    id: "microneedling",
    name: "Microneedling",
    pitch: "a collagen-boosting treatment that softens acne scars and fine lines over a few sessions",
    concerns: { acne: 3, lines: 1 },
    downtimeDays: 4,
    downtimeLabel: "3–4 days of redness",
    session: "60 min",
    priceFrom: 12000,
    priceUnit: "per session",
  },
  {
    id: "anti-wrinkle",
    name: "Anti-wrinkle Injections",
    pitch: "a quick injection that relaxes the muscles behind forehead lines, frown lines and crow's feet",
    concerns: { lines: 3 },
    downtimeDays: 0,
    downtimeLabel: "Little to none",
    session: "20 min",
    priceFrom: 9000,
    priceUnit: "per area",
  },
  {
    id: "fillers",
    name: "Dermal Fillers",
    pitch: "an injectable gel that restores lost volume in the cheeks, lips or jawline",
    concerns: { volume: 3, lines: 1 },
    downtimeDays: 2,
    downtimeLabel: "1–2 days of swelling",
    session: "45 min",
    priceFrom: 18000,
    priceUnit: "per syringe",
  },
  {
    id: "skin-booster",
    name: "Skin Booster Injections",
    pitch: "a course of hyaluronic acid micro-injections that hydrate skin from within for a dewy look",
    concerns: { lines: 1, tone: 1, volume: 1 },
    downtimeDays: 1,
    downtimeLabel: "A day of small bumps",
    session: "30 min",
    priceFrom: 14000,
    priceUnit: "per session",
  },
  {
    id: "laser-hair",
    name: "Laser Hair Removal",
    pitch: "a course of laser sessions for long-term hair reduction on the face or body",
    concerns: { hair: 3 },
    downtimeDays: 0,
    downtimeLabel: "None",
    session: "15–60 min",
    priceFrom: 3500,
    priceUnit: "per area",
  },
];

export const getTreatment = (id: string) => TREATMENTS.find((t) => t.id === id);

export const formatPrice = (n: number) => "₱" + n.toLocaleString("en-PH");
