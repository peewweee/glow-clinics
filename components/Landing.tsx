"use client";

import { ArrowRight, Button, Header } from "./ui";

const STEPS = [
  { title: "Answer 5 questions", body: "Your goals, downtime, budget and a quick safety check." },
  { title: "See your match", body: "One or two treatments, with why they fit what you told us." },
  { title: "Book a free consult", body: "A Glow clinician confirms what's right for you." },
];

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-hidden">
      <Header />
      <main className="mx-auto flex w-full max-w-[1200px] flex-grow flex-wrap items-center gap-12 px-4 pt-6 pb-12 sm:px-8">
        <section className="step-in flex min-w-0 flex-[1_1_440px] flex-col gap-6">
          <p className="text-xs font-semibold tracking-[0.08em] text-berry uppercase">Treatment finder</p>
          <h1 className="font-display text-[40px] leading-[44px] tracking-[-0.01em] sm:text-[56px] sm:leading-[60px]">
            Not sure which treatment is right for you?
          </h1>
          <p className="max-w-[34em] text-lg leading-7 text-muted">
            Answer five quick questions and we&apos;ll suggest one or two treatments to talk through at your free consult. Your answers go
            straight to your consultant, so you can skip the basics.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button onClick={onStart}>
              Find my treatment <ArrowRight />
            </Button>
            <span className="text-sm text-muted">5 questions · about 1 minute · no sign-up</span>
          </div>
        </section>

        <div aria-hidden="true" className="flex min-w-0 flex-[1_1_380px] justify-center">
          <svg viewBox="0 0 480 400" className="block h-auto w-full max-w-[520px]">
            <defs>
              <clipPath id="lp-slab">
                <rect x="24" y="0" width="200" height="380" rx="28" />
              </clipPath>
              <clipPath id="lp-soft">
                <rect x="240" y="140" width="216" height="240" rx="28" />
              </clipPath>
            </defs>
            <rect x="24" y="0" width="200" height="380" rx="28" fill="#6e2a5e" />
            <g clipPath="url(#lp-slab)" fill="none" stroke="#ffc9a3" strokeWidth="8">
              <circle cx="224" cy="380" r="56" />
              <circle cx="224" cy="380" r="96" />
              <circle cx="224" cy="380" r="136" />
              <circle cx="224" cy="380" r="176" />
            </g>
            <rect x="240" y="140" width="216" height="240" rx="28" fill="#fff0e4" />
            <g clipPath="url(#lp-soft)">
              <circle cx="348" cy="380" r="84" fill="#ffc9a3" />
            </g>
            <rect x="240" y="40" width="216" height="84" rx="16" fill="#1e1922" />
          </svg>
        </div>
      </main>

      <section aria-label="How it works" className="border-t border-line bg-raised">
        <ol className="mx-auto grid max-w-[1200px] gap-6 px-4 py-8 sm:grid-cols-3 sm:gap-8 sm:px-8">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex items-start gap-4">
              <span className="grid size-9 flex-none place-items-center rounded-full bg-berry-soft font-bold text-berry">{i + 1}</span>
              <div>
                <div className="text-lg leading-[26px] font-semibold">{s.title}</div>
                <div className="text-sm leading-5 text-muted">{s.body}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
