"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Wordmark({ size = "md" }: { size?: "md" | "sm" }) {
  return (
    <span className={`font-display ${size === "md" ? "text-[26px] leading-8" : "text-[22px] leading-7"}`}>
      Glow <span className="text-muted">Clinics</span>
    </span>
  );
}

export function Header({ action }: { action?: ReactNode }) {
  return (
    <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 pt-6 pb-4 sm:px-8">
      <Wordmark />
      {action}
    </header>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary"; full?: boolean };

export function Button({ variant = "primary", full, className = "", ...rest }: BtnProps) {
  const base =
    "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition-colors duration-200 disabled:cursor-not-allowed";
  const look =
    variant === "primary"
      ? "bg-berry text-on-berry hover:bg-ink disabled:bg-line disabled:text-muted"
      : "border border-berry bg-raised text-berry hover:bg-berry-soft";
  return <button className={`${base} ${look} ${full ? "w-full" : ""} ${className}`} {...rest} />;
}

export function TextButton({ className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1 text-sm font-semibold text-berry underline underline-offset-[3px] hover:text-ink ${className}`}
      {...rest}
    />
  );
}

export function ProgressSteps({ step, total }: { step: number; total: number }) {
  const left = total - step;
  return (
    <div
      className="flex flex-col gap-2"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-label="Quiz progress"
    >
      <div className="flex justify-between text-xs font-semibold tracking-[0.08em] text-muted uppercase">
        <span>
          Step {step} of {total}
        </span>
        <span>{left === 0 ? "Last one" : `About ${Math.max(10, left * 12)} sec left`}</span>
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-colors duration-300 ${i < step ? "bg-berry" : "bg-line"}`} />
        ))}
      </div>
    </div>
  );
}

export function OptionTile({
  label,
  hint,
  selected,
  multi,
  onClick,
  disabled,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  multi?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-start gap-3 rounded-[16px] bg-raised text-left transition-colors duration-200 ${
        selected
          ? "border-2 border-berry bg-berry-soft p-[15px]"
          : "border border-line-strong p-4 hover:border-berry disabled:opacity-50 disabled:hover:border-line-strong"
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-[3px] grid size-5 flex-none place-items-center ${multi ? "rounded-md" : "rounded-full"} ${
          selected ? "bg-berry" : "border-[1.5px] border-line-strong"
        }`}
      >
        {selected &&
          (multi ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <span className="size-2 rounded-full bg-on-berry" />
          ))}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-lg leading-[26px] font-semibold">{label}</span>
        {hint && <span className="text-sm leading-5 text-muted">{hint}</span>}
      </span>
    </button>
  );
}

export function Pill({ tone, children }: { tone: "match" | "good" | "neutral"; children: ReactNode }) {
  const look = {
    match: "bg-glow text-ink",
    good: "bg-sage-soft text-sage",
    neutral: "border border-line bg-raised text-muted",
  }[tone];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs leading-4 font-semibold tracking-[0.04em] ${look}`}>{children}</span>;
}

export function Check({ color = "#2e6b63" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 flex-none">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
