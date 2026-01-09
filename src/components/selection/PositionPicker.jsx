"use client"

import { cn } from "@/lib/utils"
import { ROSTER_FORMAT } from "@/src/game/rosterFormat"
import { getAvailableSlots } from "@/src/game/selectors"

export function PositionPicker({ state, onSelect }) {
  const availableSlots = getAvailableSlots(state)

  return (
    <div className="p-4">
      <p className="text-zinc-400 text-sm mb-3">Choose a position to fill:</p>
      <div className="flex flex-wrap gap-2">
        {availableSlots.map((slotKey) => {
          const config = ROSTER_FORMAT[slotKey]
          return (
            <button
              key={slotKey}
              onClick={() => onSelect(slotKey)}
              className={cn(
                "px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                "bg-zinc-800 text-zinc-300 hover:bg-emerald-600 hover:text-white",
                "border border-zinc-700 hover:border-emerald-500",
              )}
            >
              {config.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
