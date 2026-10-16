import { cn } from "@/lib/utils"

const VARIANTS = {
  // Standard side panel.
  default: "bg-surface-2/85 border border-line shadow-panel",
  // The reel stage: deeper, framed, slightly brighter rim.
  stage:
    "bg-[linear-gradient(180deg,var(--surface-3)_0%,var(--surface-1)_100%)] border border-line-strong shadow-panel",
  // Quiet container that blends into the page.
  flat: "bg-surface-1/60 border border-line",
}

/**
 * Panel — the base container for each game area.
 *
 * `title` renders a scoreboard-style eyebrow, `description` a short helper
 * line and `actions` sits on the right of the header. Pass `header` to replace
 * the default header entirely.
 */
export function Panel({
  children,
  className,
  title,
  description,
  actions,
  header,
  variant = "default",
  as: Component = "section",
  ...props
}) {
  const hasHeader = header || title || description || actions

  return (
    <Component
      className={cn("relative flex flex-col overflow-hidden rounded-xl backdrop-blur-sm", VARIANTS[variant], className)}
      {...props}
    >
      {hasHeader &&
        (header ?? (
          <PanelHeader title={title} description={description} actions={actions} />
        ))}
      {children}
    </Component>
  )
}

export function PanelHeader({ title, description, actions, className, children }) {
  return (
    <header className={cn("flex items-center gap-3 border-b border-line px-4 py-3", className)}>
      <div className="min-w-0 flex-1">
        {title && <h2 className="eyebrow truncate">{title}</h2>}
        {description && <p className="mt-0.5 truncate text-sm text-ink-muted">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}
