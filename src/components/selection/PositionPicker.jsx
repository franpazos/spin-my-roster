"use client"

import { ChevronRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROSTER_FORMAT } from "@/src/game/rosterFormat"
import { getAvailableSlots } from "@/src/game/selectors"
import { PositionBadge } from "@/src/components/roster/RosterSlotRow"

export function PositionPicker({ state, onSelect }) {
  const availableSlots = getAvailableSlots(state)

  return (
    <div className="p-3 sm:p-4">
      <p className="eyebrow mb-3">Choose an open slot</p>
      <ul className="grid grid-cols-2 gap-2">
        {availableSlots.map((slotKey) => {
          const config = ROSTER_FORMAT[slotKey]
          return (
            <li key={slotKey}>
              <button
                type="button"
                onClick={() => onSelect(slotKey)}
                className={cn(
                  "group flex min-h-16 w-full items-center gap-2.5 rounded-lg border border-line-strong bg-surface-3/60 p-2 text-left",
                  "transition-[background-color,border-color,transform] duration-150",
                  "hover:border-lime/60 hover:bg-surface-3 active:scale-[0.98]",
                )}
              >
                <PositionBadge slotKey={slotKey} filled />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-tight text-ink">{config.fullLabel}</span>
                  {config.autoCommit ? (
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-warning">
                      <Zap className="h-3 w-3" aria-hidden="true" />
                      Auto-fill
                    </span>
                  ) : (
                    <span className="mt-0.5 block text-xs text-ink-muted">Pick a player</span>
                  )}
                </span>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-ink-dim transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-lime"
                  aria-hidden="true"
                />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
