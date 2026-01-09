"use client"

import { Panel } from "@/src/components/layout/Panel"
import { RosterSlotRow } from "./RosterSlotRow"
import { ROSTER_SLOT_ORDER } from "@/src/game/rosterFormat"
import { getAvailableSlots, getFilledSlotsCount } from "@/src/game/selectors"
import { PHASES } from "@/src/game/gameReducer"
import { Button } from "@/components/ui/button"
import { RotateCcw, Undo2 } from "lucide-react"

export function RosterPanel({ state, onSelectPosition, onUndo, onReset }) {
  const availableSlots = getAvailableSlots(state)
  const filledCount = getFilledSlotsCount(state)
  const canSelectPosition = state.phase === PHASES.CHOOSE_POSITION

  return (
    <Panel title="Your Roster" className="h-full">
      {/* Progress bar */}
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
          <span>Progress</span>
          <span>
            {filledCount} / {ROSTER_SLOT_ORDER.length}
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(filledCount / ROSTER_SLOT_ORDER.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Roster slots */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {ROSTER_SLOT_ORDER.map((slotKey) => {
          const comitted = state.roster[slotKey]
          const stagedForThisSlot = state.stagedPick?.slotKey === slotKey ? state.stagedPick.player : null

          const playerToShow = comitted ?? stagedForThisSlot
          const isStaged = !comitted && Boolean(stagedForThisSlot)
          
          const isAvailable = availableSlots.includes(slotKey)
          const isActive = state.selectedSlot === slotKey

          return (
            <RosterSlotRow
              key={slotKey}
              slotKey={slotKey}
              player={playerToShow}
              isStaged={isStaged}
              isActive={isActive}
              isAvailable={isAvailable && canSelectPosition}
              onClick={() => canSelectPosition && isAvailable && onSelectPosition(slotKey)}
            />
          )
        })}
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-zinc-800 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          // disabled={state.history.length === 0 || state.phase !== PHASES.IDLE}
          disabled={!state.stagedPick || state.phase !== PHASES.IDLE}
          className="flex-1 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300"
        >
          <Undo2 className="w-4 h-4 mr-1.5" />
          Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={filledCount === 0}
          className="flex-1 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300"
        >
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Reset
        </Button>
      </div>
    </Panel>
  )
}
