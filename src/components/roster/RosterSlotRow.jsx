"use client"

import { cn } from "@/lib/utils"
import { ROSTER_FORMAT } from "@/src/game/rosterFormat"

export function RosterSlotRow({ slotKey, player, isActive, isAvailable, onClick, isStaged }) {
  const config = ROSTER_FORMAT[slotKey]
  const isEmpty = !player

  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
        "border border-transparent",
        isEmpty && isAvailable && "hover:bg-zinc-800/50 cursor-pointer",
        isEmpty && !isAvailable && "opacity-50 cursor-not-allowed",
        !isEmpty && "bg-zinc-800/30",
        isStaged && "bg-emerald-500/5 border-emerald-500/30",
        isActive && "border-emerald-500 bg-emerald-500/10",
      )}
    >
      {/* Position badge */}
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
          isEmpty
            ? "bg-zinc-800 text-zinc-500"
            : isStaged
              ? "bg-emerald-500/30 text-emerald-200"
              : "bg-emerald-600 text-white",
        )}
      >
        {config.label}
      </div>

      {/* Player info or empty state */}
      <div className="flex-1 min-w-0">
        {isEmpty ? (
          <span className="text-zinc-500 text-sm">{config.fullLabel}</span>
        ) : (
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium truncate">{player.name}</span>
            <span className="text-zinc-500 text-xs truncate">
              {player.team?.abbr} • {player.position || "HC"}
              {/* {isStaged && (
                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 align-middle">
                  STAGED
                </span>
              )} */}
            </span>
          </div>
        )}
      </div>

      {/* Team logo if filled */}
      {!isEmpty && player.team?.logoUrl && (
        <img
          src={player.team.logoUrl || "/placeholder.svg"}
          alt={player.team.abbr}
          className="w-8 h-8 object-contain opacity-60"
        />
      )}
    </button>
  )
}
