import { cn } from "@/lib/utils"

export function ReelItem({ team, isCenter, opacity = 1 }) {
  if (!team) {
    return (
      <div className="h-24 flex items-center justify-center" style={{ opacity }}>
        <div className="w-16 h-16 rounded-full bg-zinc-800 animate-pulse" />
      </div>
    )
  }

  return (
    <div
      className={cn("h-24 flex items-center justify-center gap-3 transition-all duration-200", isCenter && "scale-110")}
      style={{ opacity }}
    >
      {team.logoUrl && (
        <img
          src={team.logoUrl || "/placeholder.svg"}
          alt={team.name}
          className={cn("w-16 h-16 object-contain", isCenter && "drop-shadow-lg")}
        />
      )}
      <div className={cn("text-left", isCenter ? "opacity-100" : "opacity-50")}>
        <div className={cn("font-bold", isCenter ? "text-white text-lg" : "text-zinc-400 text-sm")}>{team.abbr}</div>
        {isCenter && <div className="text-zinc-400 text-xs">{team.name}</div>}
      </div>
    </div>
  )
}
