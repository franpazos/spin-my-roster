"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PlayerAvatar } from "@/src/components/roster/PlayerAvatar"

export function PlayerRow({ player, isDisabled, onClick, teamColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "group flex min-h-16 w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-[background-color,transform] duration-150",
        "hover:bg-surface-3 active:scale-[0.99]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:active:scale-100",
      )}
    >
      <PlayerAvatar player={player} team={{ color: teamColor }} className="h-12 w-12" />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.9375rem] font-semibold text-ink">{player.name}</span>
        <span className="mt-0.5 flex items-center gap-2 text-xs text-ink-muted">
          <span className="font-display text-sm font-bold text-ink">#{player.jersey || "–"}</span>
          {/* Depth chart spot (WR1, QB2…) when ESPN lists the player, else the plain position */}
          <span
            className={cn(
              "rounded px-1.5 py-0.5 font-display text-[0.6875rem] font-bold uppercase tracking-wider",
              player.depth?.starter ? "bg-lime text-lime-ink" : "bg-surface-4 text-ink",
            )}
          >
            {player.depth?.label ?? player.position}
          </span>
          {player.depth?.starter && (
            <span className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-lime">
              Starter
            </span>
          )}
        </span>
      </span>

      {isDisabled ? (
        <span className="shrink-0 text-xs font-medium text-ink-muted">On roster</span>
      ) : (
        <span className="flex shrink-0 items-center gap-0.5 rounded-md border border-lime/40 px-2 py-1 font-display text-sm font-bold uppercase tracking-wider text-lime transition-colors group-hover:bg-lime group-hover:text-lime-ink">
          Draft
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
    </button>
  )
}
