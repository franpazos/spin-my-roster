"use client"

import { useState, useEffect } from "react"
import { PlayerRow } from "./PlayerRow"
import { filterAvailablePlayers } from "@/src/game/selectors"
import { Loader2 } from "lucide-react"
import { ROSTER_FORMAT } from "@/src/game/rosterFormat"

export function PlayerList({ teamId, slotKey, usedPlayerIds, onSelect }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPlayers() {
      setLoading(true)
      setError(null)

      try {
        // For HC slot, fetch coach instead
        if (slotKey === "HC") {
          const res = await fetch(`/api/head-coaches?teamId=${teamId}`)
          const data = await res.json()
          if (data.coach) {
            setPlayers([{ ...data.coach, position: "HC" }])
          } else {
            setPlayers([])
          }
        } else {
          const slotConfig = ROSTER_FORMAT[slotKey]
          const positionCodes = slotConfig?.positions || []

          const position = positionCodes[0] || slotKey
          const res = await fetch(`/api/roster?teamId=${teamId}&position=${position}`)
          const data = await res.json()
          console.log("[v0] Roster response for", slotKey, "position:", position, "data:", data)
          setPlayers(data.players || [])
        }
      } catch (e) {
        console.error("Failed to fetch players:", e)
        setError("Failed to load players")
      } finally {
        setLoading(false)
      }
    }

    if (teamId && slotKey) {
      fetchPlayers()
    }
  }, [teamId, slotKey])

  // Filter out already used players
  const availablePlayers = filterAvailablePlayers(players, usedPlayerIds)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-12 text-red-400 text-sm">{error}</div>
  }

  if (players.length === 0) {
    return <div className="text-center py-12 text-zinc-500 text-sm">No players found for this position</div>
  }

  return (
    <div className="divide-y divide-zinc-800/50">
      {players.map((player) => {
        const isUsed = usedPlayerIds.has(player.id)
        return (
          <PlayerRow key={player.id} player={player} isDisabled={isUsed} onClick={() => !isUsed && onSelect(player)} />
        )
      })}
    </div>
  )
}
