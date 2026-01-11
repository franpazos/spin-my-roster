"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SpinButton({ onClick, disabled, isSpinning, isComplete, isFinalPick }) {
  const buttonText = getSpinButtonLabel({ isSpinning, isComplete, isFinalPick })

  function getSpinButtonLabel(state) {
    switch (true) {
      case state.isSpinning:
        return "SPINNING..."
      case state.isComplete:
        return "ROSTER COMPLETE!"
      case state.isFinalPick:
        return "CONFIRM ROSTER"
      default:
        return "SPIN"
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isSpinning}
      size="lg"
      className={cn(
        "w-full h-14 text-lg font-bold transition-all",
        "bg-emerald-600 hover:bg-emerald-500 text-white",
        "disabled:bg-zinc-800 disabled:text-zinc-500",
        isSpinning && "animate-pulse",
      )}
    >
      {buttonText}
    </Button>
  )
}
