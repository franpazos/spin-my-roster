"use client"

import { useReducer, useEffect, useState, useCallback } from "react"
import { RosterPanel } from "@/src/components/roster/RosterPanel"
import { ReelPanel } from "@/src/components/reel/ReelPanel"
import { SelectionPanel } from "@/src/components/selection/SelectionPanel"
import { gameReducer, createInitialState, PHASES } from "@/src/game/gameReducer"
import {
  spin,
  setCurrentTeam,
  selectPosition,
  commitSelection,
  goBack,
  undo,
  reset,
  loadState,
} from "@/src/game/actions"
import { saveGame, loadGame, clearGame } from "@/src/game/persistence"
import { ROSTER_FORMAT, ROSTER_SLOT_ORDER } from "@/src/game/rosterFormat"
import { getFilledSlotsCount } from "@/src/game/selectors"
import { BrandMark, BrandWordmark } from "@/src/components/brand/BrandMark"
import { PhaseTracker } from "@/src/components/layout/PhaseTracker"

export default function HomePage() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState)
  const [teams, setTeams] = useState([])
  const [teamsLoading, setTeamsLoading] = useState(true)

  // Load teams on mount
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("/api/teams")
        const data = await res.json()
        setTeams(data.teams || [])
      } catch (e) {
        console.error("[v0] Failed to fetch teams:", e)
      } finally {
        setTeamsLoading(false)
      }
    }
    fetchTeams()
  }, [])

  // Load saved game on mount
  useEffect(() => {
    const saved = loadGame()
    if (saved) {
      const sanitized =
        saved?.phase === PHASES.SPINNING
          ? { ...saved, phase: PHASES.IDLE } // If game is in progress, reset to IDLE
          : saved

      dispatch(loadState(sanitized))
    }
  }, [])

  // Save game when roster changes
  useEffect(() => {
    if (state.phase !== PHASES.SPINNING) {
      saveGame(state)
    }
  }, [state])

  // Handlers
  const handleSpin = useCallback(() => {
    dispatch(spin())
  }, [])

  const handleSpinComplete = useCallback((team) => {
    dispatch(setCurrentTeam(team))
  }, [])

  const handleSelectPosition = useCallback(
    async (slotKey) => {
      const slotConfig = ROSTER_FORMAT[slotKey]

      // If this slot auto-commits (DEF or HC), handle it directly
      if (slotConfig?.autoCommit) {
        dispatch(selectPosition(slotKey))

        if (slotKey === "DEF") {
          // Auto-commit team defense
          const defensePlayer = {
            id: `def-${state.currentTeam.id}`,
            name: `${state.currentTeam.name} Defense`,
            position: "DEF",
          }
          dispatch(commitSelection(defensePlayer))
        } else if (slotKey === "OL") {
          const OLUnit = {
            id: `ol-${state.currentTeam.id}`,
            name: `${state.currentTeam.name} Offensive Line`,
            position: "OL",
          }
          dispatch(commitSelection(OLUnit))
        } else if (slotKey === "HC") {
          try {
            const res = await fetch(`/api/head-coaches?teamId=${state.currentTeam.id}`)
            if (!res.ok) throw new Error(`Failed to fetch coach: ${res.status}`)
            const data = await res.json()

            if (data.coach) {
              dispatch(
                commitSelection({
                  id: data.coach.id || `hc-${state.currentTeam.id}`,
                  name: data.coach.name,
                  position: "HC",
                  headshotUrl: data.coach.headshotUrl || null,
                }),
              )
            } else {
              // Fallback if coach not found
              dispatch(
                commitSelection({
                  id: `hc-${state.currentTeam.id}`,
                  name: `${state.currentTeam.abbr} Head Coach`,
                  position: "HC",
                }),
              )
            }
          } catch (e) {
            console.error("[v0] Failed to fetch coach:", e)
            // Fallback on error
            dispatch(
              commitSelection({
                id: `hc-${state.currentTeam.id}`,
                name: `${state.currentTeam.abbr} Head Coach`,
                position: "HC",
              }),
            )
          }
        }
      } else {
        // Normal flow - go to player selection
        dispatch(selectPosition(slotKey))
      }
    },
    [state.currentTeam],
  )

  const handleSelectPlayer = useCallback((player) => {
    dispatch(commitSelection(player))
  }, [])

  const handleBack = useCallback(() => {
    dispatch(goBack())
  }, [])

  const handleUndo = useCallback(() => {
    dispatch(undo())
  }, [])

  const handleReset = useCallback(() => {
    clearGame()
    dispatch(reset())
  }, [])

  const filledCount = getFilledSlotsCount(state)
  const totalSlots = ROSTER_SLOT_ORDER.length

  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh">
      <header className="shrink-0 border-b border-line bg-surface-0/70 backdrop-blur-md">
        <div className="mx-auto flex h-[var(--header-h)] max-w-[1440px] items-center gap-4 px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandMark className="h-9 w-9 shrink-0" title="" />
            <h1 className="truncate">
              <BrandWordmark className="text-xl sm:text-2xl" />
            </h1>
          </div>

          <PhaseTracker state={state} className="mx-auto hidden lg:flex" />

          <div
            className="ml-auto flex items-baseline gap-1.5 rounded-lg border border-line bg-surface-2 px-3 py-1.5 lg:ml-0"
            aria-label={`${filledCount} of ${totalSlots} picks locked`}
          >
            <span className="eyebrow text-[0.6875rem]">Picks</span>
            <span className="font-display text-xl font-extrabold leading-none text-ink">
              {filledCount}
              <span className="text-ink-dim">/{totalSlots}</span>
            </span>
          </div>
        </div>

        {/* Mobile and tablet scoreboard strip */}
        <div className="mx-auto max-w-xl border-t border-line px-2 py-1.5 lg:hidden">
          <PhaseTracker state={state} compact />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col p-3 max-md:pb-28 sm:p-4 sm:max-md:pb-28 lg:min-h-0 lg:px-6">
        {teamsLoading ? (
          <LoadingStage />
        ) : (
          <div className="grid flex-1 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)]">
            {/* Reel: first on mobile, centre stage on desktop */}
            <div className="order-1 lg:order-2 lg:min-h-0">
              <ReelPanel state={state} teams={teams} onSpin={handleSpin} onSpinComplete={handleSpinComplete} />
            </div>

            {/* Contextual selection */}
            <div className="order-2 lg:order-3 lg:min-h-0">
              <SelectionPanel
                state={state}
                onSelectPosition={handleSelectPosition}
                onSelectPlayer={handleSelectPlayer}
                onBack={handleBack}
                onUndo={handleUndo}
                onReset={handleReset}
              />
            </div>

            {/* Lineup and secondary controls */}
            <div className="order-3 md:col-span-2 lg:order-1 lg:col-span-1 lg:min-h-0">
              <RosterPanel
                state={state}
                onSelectPosition={handleSelectPosition}
                onUndo={handleUndo}
                onReset={handleReset}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function LoadingStage() {
  return (
    <div
      className="grid flex-1 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)]"
      role="status"
      aria-label="Loading teams"
    >
      <div className="skeleton order-1 h-80 rounded-xl lg:order-2 lg:h-full" />
      <div className="skeleton order-2 h-56 rounded-xl lg:order-3 lg:h-full" />
      <div className="skeleton order-3 h-96 rounded-xl md:col-span-2 lg:order-1 lg:col-span-1 lg:h-full" />
    </div>
  )
}
