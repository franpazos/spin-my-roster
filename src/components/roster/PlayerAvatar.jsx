"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Round player photo with a team-colour ring. Falls back to the team logo
 * (OL, DEF, missing or broken headshots) and then to the jersey number.
 * Pass `exportSafe` inside the share card so images are fetched with CORS.
 */
export function PlayerAvatar({ player, team = player?.team, className, showTeamBadge = false, exportSafe = false }) {
  const [failed, setFailed] = useState(false)
  const headshot = !failed ? player?.headshotUrl : null
  const crossOrigin = exportSafe ? "anonymous" : undefined

  return (
    <span
      className={cn(
        "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-surface-3",
        className,
      )}
      style={{ borderColor: team?.color || "var(--line-strong)" }}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        {headshot ? (
          <img
            src={headshot}
            alt=""
            decoding="async"
            crossOrigin={crossOrigin}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover object-top"
          />
        ) : team?.logoUrl ? (
          <img src={team.logoUrl} alt="" crossOrigin={crossOrigin} className="h-full w-full object-contain p-1" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-sm font-bold text-ink-muted">
            {player?.jersey || "?"}
          </span>
        )}
      </span>

      {showTeamBadge && headshot && team?.logoUrl && (
        <img
          src={team.logoUrl}
          alt=""
          crossOrigin={crossOrigin}
          className="absolute -bottom-1 -right-1.5 h-[45%] w-[45%] rounded-full bg-surface-1 object-contain p-px ring-1 ring-line-strong"
        />
      )}
    </span>
  )
}
