"use client"

import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROSTER_FORMAT } from "@/src/game/rosterFormat"

// Position groups give each badge its own colour; text labels carry the state.
const GROUP_STYLES = {
  qb: { solid: "bg-ice text-surface-0", soft: "text-ice border-ice/40" },
  skill: { solid: "bg-lime text-lime-ink", soft: "text-lime border-lime/40" },
  unit: { solid: "bg-warning text-surface-0", soft: "text-warning border-warning/40" },
  coach: { solid: "bg-ink text-surface-0", soft: "text-ink border-ink/40" },
}

const SLOT_GROUP = {
  QB: "qb",
  RB: "skill",
  WR1: "skill",
  WR2: "skill",
  TE: "skill",
  OL: "unit",
  DEF: "unit",
  HC: "coach",
}

export function PositionBadge({ slotKey, filled, className }) {
  const config = ROSTER_FORMAT[slotKey]
  const group = GROUP_STYLES[SLOT_GROUP[slotKey]] ?? GROUP_STYLES.skill

  return (
    <span
      className={cn(
        "flex h-10 w-12 shrink-0 items-center justify-center font-display text-base font-extrabold uppercase leading-none tracking-wide",
        "[clip-path:polygon(14%_0,100%_0,86%_100%,0_100%)]",
        filled ? group.solid : cn("bg-surface-3", group.soft),
        className,
      )}
      aria-hidden="true"
    >
      {config.label}
    </span>
  )
}

/**
 * One lineup slot. States: open, available (tap to fill), active (picking
 * now), staged (next pick, not locked yet) and confirmed.
 */
export function RosterSlotRow({ slotKey, player, isActive, isAvailable, onClick, isStaged }) {
  const config = ROSTER_FORMAT[slotKey]
  const isEmpty = !player
  const isConfirmed = !isEmpty && !isStaged

  const status = isActive
    ? "Picking"
    : isStaged
      ? "Next pick"
      : isConfirmed
        ? "Locked"
        : isAvailable
          ? "Open"
          : "Empty"

  const body = (
    <>
      <PositionBadge slotKey={slotKey} filled={isConfirmed || isStaged} className={cn(isStaged && "opacity-80")} />

      <div className="min-w-0 flex-1">
        {isEmpty ? (
          <>
            <span className={cn("block truncate text-sm font-medium", isAvailable || isActive ? "text-ink" : "text-ink-muted")}>
              {config.fullLabel}
            </span>
            <span className="block text-xs text-ink-dim">
              {isActive ? "Choosing a player…" : isAvailable ? "Tap to fill this slot" : "Waiting for a spin"}
            </span>
          </>
        ) : (
          <>
            <span className="block truncate text-[0.9375rem] font-semibold leading-tight text-ink">{player.name}</span>
            <span className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
              <span className="font-display text-sm font-bold uppercase tracking-wide text-ink">
                {player.team?.abbr}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{player.team?.name ?? config.fullLabel}</span>
            </span>
          </>
        )}
      </div>

      {/* Right rail: logo, state tag and affordance */}
      <div className="flex shrink-0 items-center gap-2">
        {isStaged && (
          <span aria-hidden="true" className="rounded border border-dashed border-lime/60 px-1.5 py-0.5 font-display text-[0.6875rem] font-extrabold uppercase leading-none tracking-[0.12em] text-lime">
            Next pick
          </span>
        )}
        {isActive && (
          <span aria-hidden="true" className="rounded bg-lime px-1.5 py-0.5 font-display text-[0.6875rem] font-extrabold uppercase leading-none tracking-[0.12em] text-lime-ink">
            Picking
          </span>
        )}
        {!isEmpty && player.team?.logoUrl && (
          <img src={player.team.logoUrl} alt="" className="h-8 w-8 object-contain" />
        )}
        {isConfirmed && <Check className="h-4 w-4 text-success" strokeWidth={3} aria-hidden="true" />}
        {isEmpty && isAvailable && (
          <ChevronRight className="h-5 w-5 text-ice transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        )}
      </div>
      <span className="sr-only">, {status}</span>
    </>
  )

  const base =
    "group flex min-h-14 w-full items-center gap-3 rounded-lg border px-2.5 py-2 text-left transition-[background-color,border-color,transform] duration-150"

  if (isAvailable && isEmpty) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          base,
          "border-dashed border-ice/35 bg-ice/[0.04] hover:border-ice/70 hover:bg-ice/[0.08] active:scale-[0.99]",
        )}
      >
        {body}
      </button>
    )
  }

  return (
    <div
      className={cn(
        base,
        isConfirmed && "border-line bg-surface-3/70",
        isStaged && "border-dashed border-lime/50 bg-lime/[0.06]",
        isActive && "border-lime bg-lime/[0.08]",
        isEmpty && !isActive && "border-transparent bg-surface-1/50",
      )}
    >
      {body}
    </div>
  )
}
