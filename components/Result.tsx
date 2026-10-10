"use client";

import { useState } from "react";
import { BUDGET, CONCERNS, DOWNTIME, SAFETY, labelOf } from "@/lib/questions";
import { formatPrice, getTreatment } from "@/lib/treatments";
import type { Answers, Recommendation } from "@/lib/types";
import { Button, Check, Header, Pill, TextButton } from "./ui";

export default function Result({ result, answers, onRestart }: { result: Recommendation; answers: Answers; onRestart: () => void }) {
  const [booked, setBooked] = useState(false);
  const [showBrief, setShowBrief] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header action={<TextButton onClick={onRestart}>Retake quiz</TextButton>} />
      <main className="step-in mx-auto flex w-full max-w-[1200px] flex-grow flex-col gap-8 px-4 pt-2 pb-28 sm:px-8 sm:pb-12">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-[0.08em] text-berry uppercase">Your results</p>
          <h1 className="font-display text-[32px] leading-[38px] sm:text-[44px] sm:leading-[50px]">
            {result.kind === "match" ? "Here's where we'd start" : "We'd like a clinician to guide this one"}
          </h1>
          {result.contextChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm text-muted">Based on:</span>
              {result.contextChips.map((c) => (
                <span key={c} className="rounded-full border border-line bg-raised px-3 py-1.5 text-sm">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-start gap-8">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
            {result.kind === "match" ? <Match result={result} /> : <Consult reasons={result.reasons} />}
          </div>

          <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-4 rounded-[28px] bg-raised p-6 shadow-[var(--shadow-card)] sm:p-7">
            {booked ? (
              <div className="flex flex-col gap-3" role="status">
                <h2 className="text-xl leading-7 font-semibold">This is where booking would open</h2>
                <p className="text-[15px] leading-[22px] text-muted">
                  In the real flow, the clinic&apos;s booking calendar opens here with your quiz answers attached. This prototype stops here.
                </p>
                <TextButton onClick={() => setBooked(false)} className="self-start">
                  Back to my results
                </TextButton>
              </div>
            ) : (
              <>
                <h2 className="text-xl leading-7 font-semibold">Talk it through with a clinician</h2>
                <p className="text-[15px] leading-[22px] text-muted">
                  Book a free 15-minute consult. We&apos;ll send your answers ahead, so your consultant can skip the basics and focus on you.
                </p>
                <Button onClick={() => setBooked(true)} full>
                  Book a free consult
                </Button>
                <Button variant="secondary" onClick={onRestart} full className="min-h-12">
                  Retake quiz
                </Button>
                <ul className="flex flex-col gap-2.5 border-t border-line pt-4 text-sm">
                  <li className="flex gap-2">
                    <Check />
                    Free, no obligation
                  </li>
                  <li className="flex gap-2">
                    <Check />
                    Phone or in clinic
                  </li>
                  <li className="flex gap-2">
                    <Check />
                    Your quiz answers come with you
                  </li>
                </ul>
              </>
            )}
            <TextButton onClick={() => setShowBrief((s) => !s)} className="self-start" aria-expanded={showBrief}>
              {showBrief ? "Hide" : "Preview"} what your consultant sees
            </TextButton>
            {showBrief && <ConsultantBrief result={result} answers={answers} />}
          </aside>
        </div>

        <div className="flex flex-col gap-1">
          <p className="max-w-[70ch] text-[13px] leading-5 text-muted">
            These suggestions are a starting point, not medical advice. A Glow clinician will confirm what&apos;s right for your skin before any
            treatment.
          </p>
          <p className="text-xs text-muted">
            Prototype · matched by {result.engine === "ai" ? "Gemini AI" : "built-in rules"} · treatments and prices are placeholders
          </p>
        </div>
      </main>

      {!booked && (
        <div className="fixed inset-x-0 bottom-0 border-t border-line bg-raised/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
          <Button onClick={() => { setBooked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} full>
            Book a free consult
          </Button>
        </div>
      )}
    </div>
  );
}

function Match({ result }: { result: Extract<Recommendation, { kind: "match" }> }) {
  const p = getTreatment(result.primary.id);
  const s = result.secondary ? getTreatment(result.secondary.id) : undefined;
  if (!p) return null;

  return (
    <>
      <article className="flex flex-col gap-4 rounded-[28px] bg-glow-soft p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex flex-wrap gap-2">
          <Pill tone="match">Your top match</Pill>
          {p.downtimeDays === 0 && <Pill tone="good">No downtime</Pill>}
        </div>
        <h2 className="font-display text-[28px] leading-[34px] sm:text-[34px] sm:leading-10">{p.name}</h2>
        <p className="max-w-[60ch] text-[17px] leading-[26px]">{result.primary.reason}</p>
        <dl className="grid grid-cols-3 gap-3 border-t border-line pt-4">
          <Fact label="Session" value={p.session} />
          <Fact label="Downtime" value={p.downtimeLabel} />
          <Fact label="From" value={`${formatPrice(p.priceFrom)}`} sub={p.priceUnit} />
        </dl>
      </article>

      {s && result.secondary && (
        <article className="flex flex-col gap-3 rounded-[16px] border border-line bg-raised p-6">
          <div>
            <Pill tone="neutral">Also worth asking about</Pill>
          </div>
          <h3 className="font-display text-[24px] leading-[30px] sm:text-[26px] sm:leading-8">{s.name}</h3>
          <p className="max-w-[60ch] leading-6">{result.secondary.reason}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
            <span>{s.session}</span>
            <span>{s.downtimeLabel === "None" ? "No downtime" : s.downtimeLabel}</span>
            <span>
              From {formatPrice(s.priceFrom)} {s.priceUnit}
            </span>
          </div>
        </article>
      )}

      <details className="rounded-[16px] border border-line bg-raised px-6 py-4" open>
        <summary className="cursor-pointer font-semibold">How we picked this</summary>
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-5 text-muted">
          {result.howWePicked.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </details>
    </>
  );
}

function Fact({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] leading-4 font-semibold tracking-[0.08em] text-muted uppercase sm:text-xs">{label}</dt>
      <dd className="mt-0.5 text-base leading-6 font-semibold tabular-nums sm:text-lg sm:leading-[26px]">{value}</dd>
      {sub && <dd className="text-xs text-muted">{sub}</dd>}
    </div>
  );
}

function Consult({ reasons }: { reasons: string[] }) {
  return (
    <>
      <div role="note" className="flex gap-3 rounded-[16px] bg-amber-soft p-5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a5300" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 flex-none">
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        </svg>
        <div className="flex flex-col gap-1.5">
          <p className="font-semibold text-amber">Let&apos;s talk first</p>
          {reasons.map((r) => (
            <p key={r} className="text-[15px] leading-[22px]">
              {r}
            </p>
          ))}
          <p className="text-[15px] leading-[22px]">So we won&apos;t suggest a treatment here. A clinician will walk you through safe options.</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-[16px] border border-line bg-raised p-6">
        <h2 className="text-[17px] leading-6 font-semibold">What usually happens next</h2>
        <ul className="flex flex-col gap-2.5 text-[15px] leading-[22px]">
          <li className="flex gap-2.5">
            <Check />A free 15-minute call with a clinician
          </li>
          <li className="flex gap-2.5">
            <Check />
            Gentle options for now, like a skincare plan
          </li>
          <li className="flex gap-2.5">
            <Check />A plan for treatments you can start later
          </li>
        </ul>
      </div>
    </>
  );
}

function ConsultantBrief({ result, answers }: { result: Recommendation; answers: Answers }) {
  const rows: [string, string][] = [
    ["Concerns", answers.concerns.map((c) => labelOf(CONCERNS, c)).join(", ")],
    ["In their words", answers.details.trim() || "Skipped"],
    ["Downtime", labelOf(DOWNTIME, answers.downtime)],
    ["Budget", labelOf(BUDGET, answers.budget)],
    ["Safety", answers.safety.map((s) => labelOf(SAFETY, s)).join(", ")],
    [
      "Suggested",
      result.kind === "match"
        ? [getTreatment(result.primary.id)?.name, result.secondary && getTreatment(result.secondary.id)?.name].filter(Boolean).join(", then ")
        : "Clinician review first",
    ],
  ];
  return (
    <div className="rounded-[16px] bg-pearl p-4">
      <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-muted uppercase">Consult brief</p>
      <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="break-words">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
