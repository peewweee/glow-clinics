"use client";

import { useEffect, useRef, useState } from "react";
import { BUDGET, CONCERNS, DETAIL_CHIPS, DOWNTIME, SAFETY } from "@/lib/questions";
import type { Answers, BudgetId, ConcernId, DowntimeId, Recommendation, SafetyId } from "@/lib/types";
import Landing from "./Landing";
import Result from "./Result";
import { ArrowLeft, Button, Header, OptionTile, ProgressSteps, TextButton } from "./ui";

type Stage = "landing" | 0 | 1 | 2 | 3 | 4 | "loading" | "result" | "error";

const TOTAL = 5;
const MAX_DETAILS = 300;
const EMPTY: Answers = { concerns: [], details: "", downtime: "none", budget: "unsure", safety: [] };

export default function TreatmentFinder() {
  const [stage, setStage] = useState<Stage>("landing");
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [picked, setPicked] = useState<{ downtime: boolean; budget: boolean }>({ downtime: false, budget: false });
  const [result, setResult] = useState<Recommendation | null>(null);
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Move focus to the new question so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (typeof stage === "number") headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [stage]);

  useEffect(() => () => { if (advanceTimer.current) clearTimeout(advanceTimer.current); }, []);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setAnswers((a) => ({ ...a, [k]: v }));

  const restart = () => {
    setAnswers(EMPTY);
    setPicked({ downtime: false, budget: false });
    setResult(null);
    setStage(0);
  };

  const submit = async (final: Answers) => {
    setStage("loading");
    const started = Date.now();
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(final),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      // A short pause so the result doesn't flash in; it reads as considered rather than instant.
      await new Promise((r) => setTimeout(r, Math.max(0, 900 - (Date.now() - started))));
      setResult(data as Recommendation);
      setStage("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStage("error");
    }
  };

  const next = () => {
    if (stage === 4) return submit(answers);
    if (typeof stage === "number") setStage((stage + 1) as Stage);
  };
  const back = () => {
    if (stage === 0) setStage("landing");
    else if (typeof stage === "number") setStage((stage - 1) as Stage);
  };

  // Single-choice questions advance on their own after a short pause.
  const pickAndAdvance = (fn: () => void) => {
    fn();
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => setStage((s) => (typeof s === "number" && s < 4 ? ((s + 1) as Stage) : s)), 280);
  };

  if (stage === "landing") return <Landing onStart={() => setStage(0)} />;

  if (stage === "result" && result) return <Result result={result} answers={answers} onRestart={restart} />;

  if (stage === "loading" || stage === "error") {
    return (
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex flex-grow items-center justify-center px-4 pb-24">
          {stage === "loading" ? (
            <div className="flex flex-col items-center gap-6 text-center" role="status" aria-live="polite">
              <span className="glow-pulse block size-24 rounded-full bg-glow" aria-hidden="true" />
              <div>
                <p className="font-display text-[28px] leading-[34px]">Finding your match</p>
                <p className="text-sm text-muted">Reading your answers against our treatment menu</p>
              </div>
            </div>
          ) : (
            <div className="flex max-w-md flex-col items-center gap-4 text-center" role="alert">
              <p className="font-display text-[28px] leading-[34px]">We couldn&apos;t load your match</p>
              <p className="text-muted">{error} Check your connection and try again. Your answers are saved.</p>
              <Button onClick={() => submit(answers)}>Try again</Button>
            </div>
          )}
        </main>
      </div>
    );
  }

  const step = stage as number;
  const canContinue = [
    answers.concerns.length > 0,
    true,
    picked.downtime,
    picked.budget,
    answers.safety.length > 0,
  ][step];

  const toggleConcern = (id: ConcernId) => {
    const has = answers.concerns.includes(id);
    if (has) set("concerns", answers.concerns.filter((c) => c !== id));
    else if (answers.concerns.length < 2) set("concerns", [...answers.concerns, id]);
  };

  const toggleSafety = (id: SafetyId) => {
    if (id === "none") return set("safety", answers.safety.includes("none") ? [] : ["none"]);
    const rest = answers.safety.filter((s) => s !== "none");
    set("safety", rest.includes(id) ? rest.filter((s) => s !== id) : [...rest, id]);
  };

  const addChip = (chip: string) => {
    const sep = answers.details.trim() ? ". " : "";
    set("details", (answers.details.trim().replace(/\.$/, "") + sep + chip).slice(0, MAX_DETAILS));
  };

  const questions = [
    {
      title: "What would you most like to improve?",
      help: "Pick up to two. You can add details in your own words on the next step.",
      body: (
        <div role="group" aria-label="Concerns" className="grid gap-3 sm:grid-cols-2">
          {CONCERNS.map((o) => (
            <OptionTile
              key={o.id}
              multi
              label={o.label}
              hint={o.hint}
              selected={answers.concerns.includes(o.id)}
              disabled={!answers.concerns.includes(o.id) && answers.concerns.length >= 2}
              onClick={() => toggleConcern(o.id)}
            />
          ))}
        </div>
      ),
      footer: `${answers.concerns.length} of 2 selected`,
    },
    {
      title: "Tell us a bit more, in your own words",
      help: "What bothers you, and is there a date you're working towards? This helps us tailor your match.",
      body: (
        <div className="flex flex-col gap-3">
          <label htmlFor="details" className="text-sm font-semibold">
            Your details <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="details"
            rows={5}
            maxLength={MAX_DETAILS}
            value={answers.details}
            onChange={(e) => set("details", e.target.value)}
            placeholder="e.g. I have dark spots from old acne on my cheeks and my wedding is in 3 weeks."
            className="w-full resize-none rounded-[16px] border border-line-strong bg-raised px-4 py-3.5 text-base leading-6 placeholder:text-muted/70 focus:border-2 focus:border-berry focus:px-[15px] focus:py-[13px] focus:outline-none"
          />
          <div className="flex justify-between gap-4 text-xs text-muted">
            <span>Please don&apos;t include medical history here.</span>
            <span className="tabular-nums">
              {answers.details.length} / {MAX_DETAILS}
            </span>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Quick add">
            {DETAIL_CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => addChip(c)}
                className="min-h-9 rounded-full border border-line-strong bg-raised px-3.5 text-sm hover:border-berry hover:bg-berry-soft"
              >
                + {c}
              </button>
            ))}
          </div>
        </div>
      ),
      footer: answers.details.trim() ? "" : "You can skip this one",
    },
    {
      title: "How much downtime can you take?",
      help: "Downtime is how long your skin might look red, swollen or flaky afterwards.",
      body: (
        <div role="radiogroup" aria-label="Downtime" className="grid gap-3">
          {DOWNTIME.map((o) => (
            <OptionTile
              key={o.id}
              label={o.label}
              hint={o.hint}
              selected={picked.downtime && answers.downtime === o.id}
              onClick={() =>
                pickAndAdvance(() => {
                  set("downtime", o.id as DowntimeId);
                  setPicked((p) => ({ ...p, downtime: true }));
                })
              }
            />
          ))}
        </div>
      ),
      footer: "",
    },
    {
      title: "What budget feels comfortable per session?",
      help: "Prices are a guide. Your consultant will confirm the exact cost.",
      body: (
        <div role="radiogroup" aria-label="Budget" className="grid gap-3 sm:grid-cols-2">
          {BUDGET.map((o) => (
            <OptionTile
              key={o.id}
              label={o.label}
              hint={o.hint}
              selected={picked.budget && answers.budget === o.id}
              onClick={() =>
                pickAndAdvance(() => {
                  set("budget", o.id as BudgetId);
                  setPicked((p) => ({ ...p, budget: true }));
                })
              }
            />
          ))}
        </div>
      ),
      footer: "",
    },
    {
      title: "Do any of these apply to you right now?",
      help: "This keeps you safe. If any apply, we'll have a clinician guide your options instead.",
      body: (
        <div role="group" aria-label="Safety check" className="grid gap-3">
          {SAFETY.map((o) => (
            <OptionTile key={o.id} multi label={o.label} selected={answers.safety.includes(o.id)} onClick={() => toggleSafety(o.id)} />
          ))}
        </div>
      ),
      footer: "",
    },
  ];

  const q = questions[step];

  return (
    <div className="flex min-h-dvh flex-col">
      <Header action={<TextButton onClick={restart}>Start over</TextButton>} />
      <main className="w-full flex-grow px-4 pt-2 pb-12 sm:px-8">
        <div className="mx-auto flex max-w-[680px] flex-col gap-6 rounded-[28px] bg-raised p-5 shadow-[var(--shadow-card)] sm:p-10">
          <ProgressSteps step={step + 1} total={TOTAL} />
          <TextButton onClick={back} className="self-start no-underline hover:underline">
            <ArrowLeft />
            Back
          </TextButton>
          <div key={step} className="step-in flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 ref={headingRef} tabIndex={-1} className="font-display text-[28px] leading-[34px] outline-none sm:text-[36px] sm:leading-[42px]">
                {q.title}
              </h1>
              <p className="text-sm leading-5 text-muted">{q.help}</p>
            </div>
            {q.body}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <span className="text-sm text-muted">{q.footer}</span>
            <Button onClick={next} disabled={!canContinue}>
              {step === 4 ? "See my match" : step === 1 && !answers.details.trim() ? "Skip" : "Continue"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
