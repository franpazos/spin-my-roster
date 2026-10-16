"use client"

import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROSTER_FORMAT } from "@/src/game/rosterFormat"
import { getAvailableSlots } from "@/src/game/selectors"
import { PositionBadge } from "@/src/components/roster/RosterSlotRow"

export function PositionPicker({ state, onSelect }) {
  const availableSlots = getAvailableSlots(state)

  return (
    <div className="@container p-3 sm:p-4">
      <p className="eyebrow mb-3">Choose an open slot</p>
      {/* Two columns only when the panel is wide enough for full names */}
      <ul className="grid grid-cols-1 gap-2 @[19rem]:grid-cols-2">
        {availableSlots.map((slotKey) => {
          const config = ROSTER_FORMAT[slotKey]
          return (
            <li key={slotKey}>
              <button
                type="button"
                onClick={() => onSelect(slotKey)}
                className={cn(
                  "group flex min-h-14 w-full items-center gap-2.5 rounded-lg border border-line-strong bg-surface-3/60 p-2 text-left",
                  "transition-[background-color,border-color,transform] duration-150",
                  "hover:border-lime/60 hover:bg-surface-3 active:scale-[0.98]",
                )}
              >
                <PositionBadge slotKey={slotKey} filled className="w-11 text-sm" />
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-sm font-semibold leading-tight text-ink">{config.fullLabel}</span>
                  {config.autoCommit ? (
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-warning">
                      <Zap className="h-3 w-3" aria-hidden="true" />
                      Auto-fill
                    </span>
                  ) : (
                    <span className="mt-0.5 block text-xs text-ink-muted">Pick a player</span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
