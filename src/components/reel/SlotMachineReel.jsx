"use client"

import { useState, useEffect, useRef } from "react"
import { ReelItem } from "./ReelItem"
import { shuffleArray, getRandomItem } from "@/src/lib/utils"
import { cn } from "@/lib/utils"

export function SlotMachineReel({ teams, isSpinning, onSpinComplete }) {
  const [displayTeams, setDisplayTeams] = useState([null, null, null])
  const [isAnimating, setIsAnimating] = useState(false)
  const spinIntervalRef = useRef(null)
  const spinTimeoutRef = useRef(null)

  // Initialize with random teams when available
  useEffect(() => {
    if (teams.length > 0 && displayTeams[1] === null) {
      const shuffled = shuffleArray(teams)
      setDisplayTeams([shuffled[0], shuffled[1], shuffled[2]])
    }
  }, [teams])

  // Handle spinning animation
  useEffect(() => {
    if (!isSpinning || teams.length === 0) return

    setIsAnimating(true)
    let iterations = 0
    const maxIterations = 20 + Math.floor(Math.random() * 10) // 20-30 spins
    const finalTeam = getRandomItem(teams)

    // Start fast spinning
    spinIntervalRef.current = setInterval(
      () => {
        iterations++
        const shuffled = shuffleArray(teams)

        if (iterations >= maxIterations) {
          // Final stop - show the selected team in center
          clearInterval(spinIntervalRef.current)
          const idx = teams.indexOf(finalTeam)
          const prevIdx = idx === 0 ? teams.length - 1 : idx - 1
          const nextIdx = (idx + 1) % teams.length
          setDisplayTeams([teams[prevIdx], finalTeam, teams[nextIdx]])

          spinTimeoutRef.current = setTimeout(() => {
            setIsAnimating(false)
            onSpinComplete(finalTeam)
          }, 300)
        } else {
          // Keep spinning with random teams
          setDisplayTeams([shuffled[0], shuffled[1], shuffled[2]])
        }
      },
      iterations < maxIterations - 5 ? 80 : 150,
    ) // Slow down at the end

    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
    }
  }, [isSpinning, teams, onSpinComplete])

  return (
    <div className="relative h-72 overflow-hidden">
      {/* Gradient overlays for depth effect */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-zinc-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-900 to-transparent z-10 pointer-events-none" />

      {/* Reel items */}
      <div className={cn("flex flex-col justify-center h-full transition-transform", isAnimating && "animate-pulse")}>
        <ReelItem team={displayTeams[0]} isCenter={false} opacity={0.3} />
        <ReelItem team={displayTeams[1]} isCenter={true} opacity={1} />
        <ReelItem team={displayTeams[2]} isCenter={false} opacity={0.3} />
      </div>

      {/* Center highlight */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-24 border-2 border-emerald-500/30 rounded-xl pointer-events-none" />
    </div>
  )
}
