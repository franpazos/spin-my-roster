import { Fragment } from "react"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PHASES } from "@/src/game/gameReducer"

export const PHASE_STEPS = ["Spin", "Team", "Position", "Player", "Confirm"]

/**
 * Maps the reducer state onto the five scoreboard steps.
 * Returns PHASE_STEPS.length when the roster is complete.
 */
export function getPhaseStep(state) {
  switch (state.phase) {
    case PHASES.SPINNING:
      return 1
    case PHASES.CHOOSE_POSITION:
      return 2
    case PHASES.CHOOSE_PLAYER:
      return 3
    case PHASES.COMPLETE:
      return PHASE_STEPS.length
    default:
      return state.stagedPick ? 4 : 0
  }
}

export function PhaseTracker({ state, className, compact = false }) {
  const current = getPhaseStep(state)

  return (
    <ol
      className={cn("flex items-center", compact ? "w-full justify-between" : "gap-1", className)}
      aria-label="Turn progress"
    >
      {PHASE_STEPS.map((label, index) => {
        const done = index < current
        const active = index === current

        return (
          <Fragment key={label}>
            {index > 0 && !compact && (
              <li aria-hidden="true" className={cn("text-ink-dim", done || active ? "text-lime/70" : "opacity-50")}>
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
            )}
            <li
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex items-center gap-1 rounded-md py-1 font-display font-bold uppercase leading-none transition-colors",
                compact ? "px-1.5 text-xs tracking-[0.06em]" : "px-2 text-[0.8125rem] tracking-[0.08em]",
                active && "bg-lime text-lime-ink",
                done && "text-lime",
                !active && !done && "text-ink-dim",
              )}
            >
              {done && <Check className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} strokeWidth={3} aria-hidden="true" />}
              {label}
              {done && <span className="sr-only"> (done)</span>}
            </li>
          </Fragment>
        )
      })}
    </ol>
  )
}
