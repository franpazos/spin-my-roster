"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SpinButton({ onClick, disabled, isSpinning }) {
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
      {isSpinning ? "Spinning..." : "SPIN"}
    </Button>
  )
}
