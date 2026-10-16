import { cn } from "@/lib/utils"

/**
 * Spin My Roster isotype: a spin arrow wrapped around a football.
 * Keep in sync with public/icon.svg and the generated PWA icons.
 */
export function BrandMark({ className, title = "Spin My Roster" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-10 w-10", className)}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="12" fill="#0f1c26" />
      <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" fill="none" stroke="rgb(156 196 220 / 0.22)" />
      {/* Spin arrow */}
      <path
        d="M37.86 16 A16 16 0 1 0 39.04 29.47"
        fill="none"
        stroke="#c8f135"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M40.75 23.8 L43.1 32.2 L34.4 29.1 Z" fill="#c8f135" />
      {/* Football */}
      <g transform="rotate(-35 24 24)">
        <ellipse cx="24" cy="24" rx="10.5" ry="6.4" fill="#f5f1e8" />
        <path d="M18.5 24 H29.5" stroke="#0f1c26" strokeWidth="1.4" strokeLinecap="round" />
        <path
          d="M21 22.4 V25.6 M24 22.4 V25.6 M27 22.4 V25.6"
          stroke="#0f1c26"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export function BrandWordmark({ className }) {
  return (
    <span className={cn("font-display font-extrabold uppercase leading-none tracking-wide text-ink", className)}>
      Spin My <span className="text-lime">Roster</span>
    </span>
  )
}
