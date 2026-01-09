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
      dispatch(loadState({ ...saved, phase: PHASES.IDLE, currentTeam: null, selectedSlot: null }))
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
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-lg">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Spin My Roster</h1>
              <p className="text-xs text-zinc-500">Build your dream team</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4">
        {teamsLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-120px)]">
            <div className="text-zinc-500">Loading teams...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
            {/* Left: Roster Panel */}
            <div className="lg:col-span-1 min-h-[400px] lg:min-h-0">
              <RosterPanel
                state={state}
                onSelectPosition={handleSelectPosition}
                onUndo={handleUndo}
                onReset={handleReset}
              />
            </div>

            {/* Center: Reel Panel */}
            <div className="lg:col-span-1 min-h-[400px] lg:min-h-0">
              <ReelPanel state={state} teams={teams} onSpin={handleSpin} onSpinComplete={handleSpinComplete} />
            </div>

            {/* Right: Selection Panel */}
            <div className="lg:col-span-1 min-h-[400px] lg:min-h-0">
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
