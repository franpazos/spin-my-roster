"use client"

import { Check, Lock, RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Primary game control. Visual modes:
 * spin (default) · confirm (a pick is staged) · final (last pick) ·
 * spinning · complete · waiting (disabled until the player picks).
 */
export function SpinButton({
  onClick,
  disabled,
  isSpinning,
  isComplete,
  isFinalPick,
  hasStagedPick,
  waitingLabel = "Spin",
  stagedLabel,
}) {
  const mode = isSpinning
    ? "spinning"
    : isComplete
      ? "complete"
      : disabled
        ? "waiting"
        : isFinalPick
          ? "final"
          : hasStagedPick
            ? "confirm"
            : "spin"

  const content = {
    spin: { icon: RotateCw, label: "Spin" },
    confirm: { icon: RotateCw, label: "Spin to lock pick" },
    final: { icon: Lock, label: "Confirm roster" },
    spinning: { icon: RotateCw, label: "Spinning…" },
    complete: { icon: Check, label: "Roster complete" },
    waiting: { icon: null, label: waitingLabel },
  }[mode]

  const Icon = content.icon
  const interactive = mode === "spin" || mode === "confirm" || mode === "final"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      aria-busy={isSpinning || undefined}
      data-mode={mode}
      className={cn(
        "group relative flex min-h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-xl px-5 py-3",
        "font-display text-2xl font-extrabold uppercase leading-none tracking-[0.08em]",
        "transition-[transform,background-color,box-shadow,color] duration-150 ease-out-brand",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ice",
        interactive && [
          "bg-lime text-lime-ink shadow-accent",
          "hover:-translate-y-0.5 hover:bg-lime-strong hover:shadow-[0_14px_34px_-10px_rgb(200_241_53_/_0.6)]",
          "active:translate-y-px active:scale-[0.985] active:shadow-none",
        ],
        mode === "spinning" &&
          "cursor-progress bg-surface-4 text-lime bg-[repeating-linear-gradient(-45deg,transparent_0_10px,rgb(200_241_53_/_0.08)_10px_20px)] bg-size-[28px_28px] animate-stripes",
        mode === "complete" && "cursor-default border border-success/40 bg-success/15 text-success",
        mode === "waiting" && "cursor-not-allowed border border-dashed border-line-strong bg-surface-2 text-ink-muted text-xl",
      )}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          strokeWidth={2.75}
          className={cn(
            "h-6 w-6 shrink-0",
            mode === "spinning" && "animate-spin",
            (mode === "spin" || mode === "confirm") &&
              "transition-transform duration-300 group-hover:rotate-90",
          )}
        />
      )}
      <span className="flex flex-col items-start">
        <span>{content.label}</span>
        {(mode === "confirm" || mode === "final") && stagedLabel && (
          <span className="mt-1 font-sans text-xs font-semibold normal-case tracking-normal opacity-75">
            {stagedLabel}
          </span>
        )}
      </span>
    </button>
  )
}
