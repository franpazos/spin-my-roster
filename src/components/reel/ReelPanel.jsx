"use client"

import { Panel } from "@/src/components/layout/Panel"
import { SlotMachineReel } from "./SlotMachineReel"
import { SpinButton } from "./SpinButton"
import { PHASES } from "@/src/game/gameReducer"
import { canSpin, isRosterComplete, isFinalPick, getReelHint } from "@/src/game/selectors"

export function ReelPanel({ state, teams, onSpin, onSpinComplete }) {
  const isSpinning = state.phase === PHASES.SPINNING
  const complete = isRosterComplete(state)
  const spinAllowed = canSpin(state)
  const finalPick = isFinalPick(state)
  const hint = getReelHint(state)

  return (
    <Panel className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 text-center">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
          {complete ? "Roster Complete!" : "Spin for a Team"}
        </h2>
      </div>

      {/* Reel */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
        <div className="w-full max-w-xs">
          <SlotMachineReel teams={teams} isSpinning={isSpinning} onSpinComplete={onSpinComplete} />
        </div>
      </div>

      {/* Sticky footer: hint + current team indicator */}
      <div className="sticky bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur">
        {hint && !isSpinning && (
          <div className="px-4 pt-3 text-center">
            <p className="text-emerald-400 text-sm font-medium leading-snug">
              {hint.title}
            </p>

            {hint.subtitle && (
              <p className="text-zinc-400 text-md mt-1">
                {hint.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Spin button */}
        <div className="p-4">
          <SpinButton
            onClick={onSpin}
            disabled={!spinAllowed}
            isSpinning={isSpinning}
            isComplete={complete}
            isFinalPick={finalPick}
          />
        </div>
      </div>
    </Panel>
  )
}
