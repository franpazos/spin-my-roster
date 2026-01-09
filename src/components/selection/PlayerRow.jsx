"use client"

import { cn } from "@/lib/utils"

export function PlayerRow({ player, isDisabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
        "hover:bg-zinc-800/70",
        isDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent",
      )}
    >
      {/* Player headshot or placeholder */}
      <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shrink-0">
        {player.headshotUrl ? (
          <img
            src={player.headshotUrl || "/placeholder.svg"}
            alt={player.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-bold">
            {player.jersey || "?"}
          </div>
        )}
      </div>

      {/* Player info */}
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium truncate">{player.name}</div>
        <div className="text-zinc-500 text-xs">
          #{player.jersey || "-"} • {player.position}
        </div>
      </div>

      {/* Select indicator */}
      {!isDisabled && <div className="text-emerald-500 text-xs font-medium">Select</div>}
    </button>
  )
}
