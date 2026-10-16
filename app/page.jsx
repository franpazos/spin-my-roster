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
import { ROSTER_FORMAT } from "@/src/game/rosterFormat"

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
        console.log("[v0] Teams data:", data)
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
            console.log("Head coach response:", data)

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

  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh">
      {/* Header */}
      <header className="h-[var(--header-h)] shrink-0 border-b border-line px-4">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime font-display text-lg font-bold text-lime-ink">
              S
            </div>
            <div>
              <h1 className="font-display text-lg font-bold uppercase text-ink">Spin My Roster</h1>
              <p className="text-xs text-ink-muted">Build your dream team</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col p-4 lg:min-h-0">
        {teamsLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-ink-muted">Loading teams...</div>
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-1 gap-4 lg:min-h-0 lg:grid-cols-3">
            {/* Left: Roster Panel */}
            <div className="lg:min-h-0">
              <RosterPanel
                state={state}
                onSelectPosition={handleSelectPosition}
                onUndo={handleUndo}
                onReset={handleReset}
              />
            </div>

            {/* Center: Reel Panel */}
            <div className="lg:min-h-0">
              <ReelPanel state={state} teams={teams} onSpin={handleSpin} onSpinComplete={handleSpinComplete} />
            </div>

            {/* Right: Selection Panel */}
            <div className="lg:min-h-0">
              <SelectionPanel
                state={state}
                onSelectPosition={handleSelectPosition}
                onSelectPlayer={handleSelectPlayer}
                onBack={handleBack}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
