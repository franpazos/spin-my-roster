import { cn } from "@/lib/utils";
import { ROSTER_FORMAT, ROSTER_SLOT_ORDER } from "@/src/game/rosterFormat";

/**
 * Picks in the order they were made: [{ slotKey, player, pickNumber }].
 * Returns [] when any pick lacks a number (games saved before draft order
 * was tracked), so callers can simply hide the feature.
 */
export function getDraftOrder(roster) {
  const picks = ROSTER_SLOT_ORDER.map((slotKey) => ({
    slotKey,
    player: roster?.[slotKey],
    pickNumber: roster?.[slotKey]?.pickNumber,
  })).filter(({ player }) => player);

  if (picks.length === 0 || picks.some(({ pickNumber }) => !Number.isFinite(pickNumber))) return [];
  return picks.sort((a, b) => a.pickNumber - b.pickNumber);
}

// Small "PICK 3" tag for a roster row. Inside an @container narrower than
// 22rem the word "Pick" is dropped visually (kept for screen readers).
export function PickTag({ number, className }) {
  if (!Number.isFinite(number)) return null;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-baseline gap-1 rounded-md border border-line-strong px-1.5 py-1 font-display font-bold uppercase leading-none text-ink-muted",
        className,
      )}
    >
      <span className="sr-only @[22rem]:not-sr-only text-[0.625rem] tracking-[0.12em]">Pick</span>
      <span className="text-sm text-ink">{number}</span>
    </span>
  );
}

/**
 * The draft as a numbered sequence: pick number, team logo and slot.
 * `layout="card"` keeps all eight in one row for the share image.
 */
export function DraftOrderStrip({ picks, layout = "screen", exportSafe = false, className }) {
  if (picks.length === 0) return null;

  return (
    <ol
      aria-label="Draft order"
      className={cn(
        "grid gap-1.5",
        layout === "card" ? "grid-cols-8" : "grid-cols-4 @[30rem]:grid-cols-8",
        className,
      )}
    >
      {picks.map(({ slotKey, player, pickNumber }) => (
        <li
          key={slotKey}
          className="relative flex flex-col items-center gap-1 rounded-lg px-1 pb-1.5 pt-2"
          style={{ backgroundColor: "rgba(21,39,51,0.9)" }}
        >
          <span className="absolute left-1.5 top-1 font-display text-xs font-extrabold leading-none text-lime">
            {pickNumber}
          </span>
          {player.team?.logoUrl ? (
            <img
              src={player.team.logoUrl}
              alt=""
              crossOrigin={exportSafe ? "anonymous" : undefined}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <span className="h-8 w-8" />
          )}
          <span className="font-display text-sm font-extrabold uppercase leading-none tracking-wide text-ink">
            {ROSTER_FORMAT[slotKey].label}
          </span>
          <span className="sr-only">
            {`Pick ${pickNumber}: ${ROSTER_FORMAT[slotKey].fullLabel}, ${player.name}`}
          </span>
        </li>
      ))}
    </ol>
  );
}
