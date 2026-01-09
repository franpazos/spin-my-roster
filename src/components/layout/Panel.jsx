import { cn } from "@/lib/utils"

export function Panel({ children, className, title, ...props }) {
  return (
    <div
      className={cn("bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden flex flex-col", className)}
      {...props}
    >
      {title && (
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">{title}</h2>
        </div>
      )}
      {children}
    </div>
  )
}
