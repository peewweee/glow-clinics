# Glow Clinics · Treatment Finder

A working prototype of an AI-powered triage quiz for **Glow Clinics**, a fictional med-spa. A prospective client answers five quick questions and gets one or two suggested treatments, with a short explanation, before booking a consultation.

**Live demo:** https://glow-clinics.vercel.app

---

## The problem, in one line

The sales team spends the first five minutes of every consult call on basic triage. This tool does that triage before the call, and hands the answers to the consultant.

## What it does

1. **Landing page** explains the promise: five questions, about a minute, no sign-up.
2. **Five questions, one per screen**
   - What would you most like to improve? (pick up to two)
   - Tell us more in your own words (optional free text, which the AI reads)
   - How much downtime can you take?
   - What budget feels comfortable per session?
   - A safety check (pregnancy, recent procedures, skin infection, acne medication)
3. **Results**: a top match, an optional alternative, plain-language reasons, and a "How we picked this" section.
4. **Booking panel** with a preview of the **consult brief**, which is exactly what the sales team would receive.

## Design choices

- **One question per screen** with a progress bar keeps it calm and fast on a phone, where most med-spa traffic lands.
- **Free text is optional.** Tap-only answers get a good result, and typed details ("wedding in 3 weeks") make it personal. This is where the AI adds value over a plain form.
- **The result explains itself.** "How we picked this" shows the reasoning in plain words, so clients and staff can trust or challenge it.
- **The consult is always the next step.** The tool suggests and never prescribes. Every result ends with "Book a free consult", and the copy never promises results.
- **The consult brief** shows how the tool removes the five minutes of triage: the consultant opens the call already knowing the client's goals, timeline, budget and safety flags.
- **Visual identity:** there were no brand guidelines, so I made a small design system: a calm pearl background, one deep berry colour for actions, and a warm apricot "glow" that only appears on results. All text meets WCAG AA contrast.

## Technical choices

| Part | Choice | Why |
|---|---|---|
| App | Next.js (App Router) + TypeScript | One project for the pages and the API, and it deploys to Vercel with zero setup |
| Styling | Tailwind CSS with the design-system tokens | Fast to build, and consistent with the design system |
| AI | Google Gemini Flash (free tier) through the Vercel AI SDK | Costs nothing for a prototype. Switching to Claude or OpenAI is a one-line change |
| Structured output | Zod schema; the AI must pick IDs from the treatment list | The AI can't invent treatments or prices. Its answer is checked before it's shown |
| Fallback | Rule-based scorer | Works with no API key, and takes over automatically if the AI is slow, fails or hits its free-tier limit |
| Data | Treatment menu in `lib/treatments.ts` | No database needed for a proof of concept |

### How a recommendation is made

1. **Safety gate, with no AI involved.** If any safety box is ticked, or the free text mentions pregnancy, isotretinoin or an infection, the client is routed to a clinician and no treatment is suggested. I didn't want an AI model making that call.
2. **AI match.** Gemini gets the treatment menu (each item marked as inside or outside the client's downtime limit) and the answers. It returns a top pick, an optional alternative, the reasons, and short summary labels. It can also raise a safety flag from the free text, for things the keyword check misses.
3. **Fallback.** With no key, or on any error, the rule-based scorer ranks treatments by concern, downtime and budget, and writes a templated explanation.

The results page footer says which engine produced the match (Gemini or rules), which is useful when staff are testing.

## Assumptions I made

- **Treatment menu, prices and session details are placeholders.** The nine treatments are typical med-spa services. Prices are in Philippine pesos (₱).
- **Safety triggers are my guesses**, not clinical guidance. A real clinic would define these with its medical director.
- **Booking is out of scope.** "Book a free consult" shows where the clinic's booking tool would open, with the answers attached.
- **No client data is stored.** Nothing is saved, and the free-text box asks clients not to share medical history.
- **Free-tier AI.** Google may use free-tier prompts to improve its products. That's fine for fictional test data, but not for real clients (see below).

## What I'd do with more time or information

- **Real data:** plug in Glow's actual menu, prices, contraindications and brand guidelines, and have a clinician review the safety rules and the AI's wording.
- **Booking integration:** send the consult brief into their booking tool or CRM, so the consultant sees it before the call.
- **Measure it:** track drop-off per question, how often staff agree with the suggestion, and whether calls get shorter. Then A/B test the question order.
- **Production AI setup:** move to a paid tier with data-retention controls, add rate limiting, and keep a small test set of sample answers to check the AI's picks whenever the prompt or model changes.
- **Accessibility and language:** a full screen-reader audit, and a Filipino/Taglish version if the clinic's clients would use it.

## Run it locally

```bash
npm install
cp .env.example .env.local   # add your free Gemini key from https://aistudio.google.com (optional)
npm run dev                  # http://localhost:3000
```

Without a key the app runs on the built-in rules.

## Deploy

Import the repo into Vercel and add `GOOGLE_GENERATIVE_AI_API_KEY` under Project → Settings → Environment Variables. Optionally set `GEMINI_MODEL` (default: `gemini-flash-latest`).

## Project map

```
app/page.tsx                 → the quiz
app/api/recommend/route.ts   → safety gate → AI → rules fallback
components/                  → Landing, TreatmentFinder (questions), Result, shared UI
lib/treatments.ts            → the treatment menu (placeholder data)
lib/questions.ts             → question wording and options
lib/safety.ts                → deterministic safety screening
lib/ai.ts                    → Gemini prompt and output schema
lib/rules.ts                 → rule-based fallback
```
