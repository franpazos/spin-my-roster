"use client"

import { useEffect, useState } from "react"
import { Panel } from "@/src/components/layout/Panel"
import { RosterSlotRow } from "./RosterSlotRow"
import { ROSTER_SLOT_ORDER } from "@/src/game/rosterFormat"
import { getAvailableSlots, getFilledSlotsCount } from "@/src/game/selectors"
import { PHASES } from "@/src/game/gameReducer"
import { cn } from "@/lib/utils"
import { RotateCcw, Undo2 } from "lucide-react"

const RESET_CONFIRM_MS = 3500

export function RosterPanel({ state, onSelectPosition, onUndo, onReset }) {
  const availableSlots = getAvailableSlots(state)
  const filledCount = getFilledSlotsCount(state)
  const canSelectPosition = state.phase === PHASES.CHOOSE_POSITION
  const total = ROSTER_SLOT_ORDER.length
  const canUndo = Boolean(state.stagedPick) && state.phase === PHASES.IDLE
  const canReset = filledCount > 0

  // Reset is destructive: the first click arms it, the second one resets.
  const [confirmReset, setConfirmReset] = useState(false)
  useEffect(() => {
    if (!confirmReset) return
    const timer = setTimeout(() => setConfirmReset(false), RESET_CONFIRM_MS)
    return () => clearTimeout(timer)
  }, [confirmReset])

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    setConfirmReset(false)
    onReset()
  }

  return (
    <Panel
      className="h-full"
      aria-label="Your lineup"
      header={
        <div className="border-b border-line px-4 pb-3 pt-3.5">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-extrabold uppercase leading-none tracking-wide text-ink">
              Your lineup
            </h2>
            <p className="font-display text-2xl font-extrabold leading-none text-ink">
              {filledCount}
              <span className="text-ink-dim">/{total}</span>
              <span className="sr-only"> slots locked</span>
            </p>
          </div>
          {/* Segmented progress: one tick per slot */}
          <div className="mt-3 grid grid-cols-8 gap-1" aria-hidden="true">
            {ROSTER_SLOT_ORDER.map((slotKey) => {
              const locked = state.roster[slotKey] !== null
              const staged = state.stagedPick?.slotKey === slotKey
              return (
                <span
                  key={slotKey}
                  className={cn(
                    "h-1.5 rounded-full transition-colors duration-300",
                    locked ? "bg-lime" : staged ? "bg-lime/40" : "bg-surface-4",
                  )}
                />
              )
            })}
          </div>
        </div>
      }
    >
      <ul className="scroll-slim grid flex-1 grid-cols-1 content-start gap-1.5 p-2.5 md:grid-cols-2 md:overflow-y-auto lg:grid-cols-1">
        {ROSTER_SLOT_ORDER.map((slotKey) => {
          const committed = state.roster[slotKey]
          const stagedForThisSlot = state.stagedPick?.slotKey === slotKey ? state.stagedPick.player : null

          const playerToShow = committed ?? stagedForThisSlot
          const isStaged = !committed && Boolean(stagedForThisSlot)

          const isAvailable = availableSlots.includes(slotKey)
          const isActive = state.selectedSlot === slotKey

          return (
            <li key={slotKey}>
              <RosterSlotRow
                slotKey={slotKey}
                player={playerToShow}
                isStaged={isStaged}
                isActive={isActive}
                isAvailable={isAvailable && canSelectPosition}
                onClick={() => canSelectPosition && isAvailable && onSelectPosition(slotKey)}
              />
            </li>
          )
        })}
      </ul>

      {/* Secondary controls */}
      <div className="flex items-center justify-between gap-2 border-t border-line px-2.5 py-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-3 disabled:cursor-not-allowed disabled:text-ink-dim disabled:hover:bg-transparent"
        >
          <Undo2 className="h-4 w-4" aria-hidden="true" />
          Undo pick
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={!canReset}
          aria-live="polite"
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:text-ink-dim/70",
            confirmReset
              ? "bg-danger/15 text-danger ring-1 ring-danger/50"
              : "text-ink-muted hover:bg-danger/10 hover:text-danger disabled:hover:bg-transparent",
          )}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {confirmReset ? "Tap again to reset" : "Reset"}
        </button>
      </div>
    </Panel>
  )
}
