"use client"

import { useState, useEffect } from "react"
import { PlayerRow } from "./PlayerRow"
import { AlertTriangle, RefreshCw, UserX } from "lucide-react"
import { ROSTER_FORMAT } from "@/src/game/rosterFormat"

export function PlayerList({ teamId, teamName, teamColor, slotKey, usedPlayerIds, onSelect }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchPlayers() {
      setLoading(true)
      setError(null)

      try {
        // For HC slot, fetch coach instead
        if (slotKey === "HC") {
          const res = await fetch(`/api/head-coaches?teamId=${teamId}`)
          if (!res.ok) throw new Error(`Failed to fetch coach: ${res.status}`)
          const data = await res.json()
          if (cancelled) return
          setPlayers(data.coach ? [{ ...data.coach, position: "HC" }] : [])
        } else {
          const slotConfig = ROSTER_FORMAT[slotKey]
          const positionCodes = slotConfig?.positions || []

          const position = positionCodes[0] || slotKey
          const res = await fetch(`/api/roster?teamId=${teamId}&position=${position}`)
          if (!res.ok) throw new Error(`Failed to fetch roster: ${res.status}`)
          const data = await res.json()
          if (cancelled) return
          setPlayers(data.players || [])
        }
      } catch (e) {
        if (cancelled) return
        console.error("Failed to fetch players:", e)
        setError("We couldn't load this roster.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (teamId && slotKey) {
      fetchPlayers()
    }

    return () => {
      cancelled = true
    }
  }, [teamId, slotKey, attempt])

  if (loading) {
    return (
      <ul className="space-y-1 p-2" aria-busy="true" aria-label="Loading players">
        {Array.from({ length: 5 }, (_, i) => (
          <li key={i} className="flex min-h-16 items-center gap-3 px-2.5 py-2">
            <span className="skeleton h-12 w-12 shrink-0 rounded-full" />
            <span className="flex-1 space-y-2">
              <span className="skeleton block h-3.5 w-2/3 rounded" />
              <span className="skeleton block h-3 w-1/3 rounded" />
            </span>
            <span className="skeleton h-7 w-16 rounded-md" />
          </li>
        ))}
      </ul>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center px-6 py-10 text-center" role="alert">
        <AlertTriangle className="h-8 w-8 text-warning" aria-hidden="true" />
        <p className="mt-3 font-semibold text-ink">{error}</p>
        <p className="mt-1 text-sm text-ink-muted">Check your connection and try again.</p>
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-line-strong bg-surface-3 px-4 text-sm font-semibold text-ink transition-colors hover:bg-surface-4"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      </div>
    )
  }

  if (players.length === 0) {
    const label = ROSTER_FORMAT[slotKey]?.fullLabel ?? slotKey
    return (
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <UserX className="h-8 w-8 text-ink-dim" aria-hidden="true" />
        <p className="mt-3 font-semibold text-ink">No {label.toLowerCase()} listed</p>
        <p className="mt-1 max-w-xs text-sm text-ink-muted">
          {teamName ?? "This team"} has no active player for this slot right now. Go back and choose another position.
        </p>
      </div>
    )
  }

  // The API already sorts by depth chart; here we only split it into sections.
  const groups = [
    { title: "Starters", players: players.filter((p) => p.depth?.starter) },
    { title: "Backups", players: players.filter((p) => p.depth && !p.depth.starter) },
    { title: "Rest of roster", players: players.filter((p) => !p.depth) },
  ].filter((group) => group.players.length > 0)
  const showHeadings = groups.length > 1

  return (
    <div className="p-2">
      {groups.map((group) => (
        <section key={group.title} aria-label={showHeadings ? group.title : undefined}>
          {showHeadings && <h3 className="eyebrow px-2.5 pb-1 pt-2 text-[0.6875rem]">{group.title}</h3>}
          <ul className="space-y-0.5">
            {group.players.map((player) => {
              const isUsed = usedPlayerIds.has(player.id)
              return (
                <li key={player.id}>
                  <PlayerRow
                    player={player}
                    teamColor={teamColor}
                    isDisabled={isUsed}
                    onClick={() => !isUsed && onSelect(player)}
                  />
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
