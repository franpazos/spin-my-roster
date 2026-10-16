import { cn } from "@/lib/utils"

/**
 * One row of the reel strip. Every row shares the same layout so the strip
 * can scroll freely; emphasis comes from `focus` once the reel has stopped.
 */
export function ReelItem({ team, focus = false, dimmed = false }) {
  if (!team) {
    return (
      <div className="flex h-[var(--reel-item)] items-center justify-center gap-4 px-6" aria-hidden="true">
        <div className="skeleton h-14 w-14 rounded-full" />
        <div className="skeleton h-6 w-24 rounded-md" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex h-[var(--reel-item)] items-center justify-center gap-4 px-6 transition-[opacity,transform] duration-300 ease-out-brand",
        dimmed && "scale-[0.92] opacity-45",
      )}
      aria-hidden={!focus}
    >
      <img
        src={team.logoUrl || "/placeholder.svg"}
        alt=""
        draggable="false"
        decoding="async"
        className={cn(
          "h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16",
          focus && "drop-shadow-[0_6px_14px_rgb(0_0_0_/_0.55)]",
        )}
      />
      <div className="min-w-0 text-left">
        <div
          className={cn(
            "font-display text-3xl font-extrabold uppercase leading-none tracking-wide sm:text-4xl",
            focus ? "text-ink" : "text-ink-muted",
          )}
        >
          {team.abbr}
        </div>
        <div className={cn("mt-1 truncate text-sm", focus ? "text-ink-muted" : "text-ink-dim")}>{team.name}</div>
      </div>
    </div>
  )
}
