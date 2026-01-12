"use client"

import { Panel } from "@/src/components/layout/Panel"
import { PositionPicker } from "./PositionPicker"
import { PlayerList } from "./PlayerList"
import { PHASES } from "@/src/game/gameReducer"
import { ROSTER_FORMAT } from "@/src/game/rosterFormat"
import { ChevronLeft, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SelectionPanel({ state, onSelectPosition, onSelectPlayer, onBack }) {
  const { phase, currentTeam, selectedSlot, usedPlayerIds, roster } = state

  // Idle state - show instructions
  if (phase === PHASES.IDLE) {
    return (
      <Panel title="Instructions" className="h-full">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
            <span className="text-2xl">🎰</span>
          </div>
          <h3 className="text-white text-xl font-medium mb-2">
            Ready to Play?
          </h3>
          <p className="text-zinc-500 text-md max-w-xs">
            Spin to get a team.
          </p>
          <p className="text-zinc-500 text-md max-w-xs">
            Pick a position and a player.
          </p>
          <p className="text-zinc-500 text-md max-w-xs">
            Spin again to lock it in.
          </p>
          <p className="text-zinc-500 text-md max-w-xs">
            Fill all slots to complete your roster.
          </p>
          <p className="text-zinc-500 text-md max-w-xs">
            No repeats.
          </p>
        </div>
      </Panel>
    )
  }

  // Spinning state
  if (phase === PHASES.SPINNING) {
    return (
      <Panel title="Spinning..." className="h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-bounce text-4xl">🎰</div>
        </div>
      </Panel>
    )
  }

  // Choose position state
  if (phase === PHASES.CHOOSE_POSITION) {
    return (
      <Panel className="h-full">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-3">
          {currentTeam?.logoUrl && (
            <img src={currentTeam.logoUrl || "/placeholder.svg"} alt={currentTeam.abbr} className="w-8 h-8" />
          )}
          <div>
            <h2 className="text-white font-medium">{currentTeam?.name}</h2>
            <p className="text-zinc-500 text-xs">Select a position</p>
          </div>
        </div>
        <PositionPicker state={state} onSelect={onSelectPosition} />
      </Panel>
    )
  }

  // Choose player state
  if (phase === PHASES.CHOOSE_PLAYER) {
    const slotConfig = ROSTER_FORMAT[selectedSlot]

    return (
      <Panel className="h-full flex flex-col">
        {/* Header with back button */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-400 hover:text-white -ml-2 mb-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to positions
          </Button>
          <div className="flex items-center gap-3">
            {currentTeam?.logoUrl && (
              <img src={currentTeam.logoUrl || "/placeholder.svg"} alt={currentTeam.abbr} className="w-8 h-8" />
            )}
            <div>
              <h2 className="text-white font-medium">Select {slotConfig?.fullLabel}</h2>
              <p className="text-zinc-500 text-xs">from {currentTeam?.name}</p>
            </div>
          </div>
        </div>

        {/* Player list */}
        <div className="flex-1 overflow-y-auto">
          <PlayerList
            teamId={currentTeam?.id}
            slotKey={selectedSlot}
            usedPlayerIds={usedPlayerIds}
            onSelect={onSelectPlayer}
          />
        </div>
      </Panel>
    )
  }

  // Complete state
  if (phase === PHASES.COMPLETE) {
    return (
      <Panel title="Congratulations!" className="h-full">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-600/20 flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Roster Complete!</h3>
          <p className="text-zinc-500 text-sm max-w-xs mb-6">
            You've built your dream team. Share it with friends or reset to try again!
          </p>
        </div>
      </Panel>
    )
  }

  return null
}
