"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { ReelItem } from "./ReelItem";
import { shuffleArray, getRandomItem } from "@/src/lib/utils";
import { cn } from "@/lib/utils";

const SPIN_DURATION_MS = 2600;
const REDUCED_SPIN_DURATION_MS = 450;
const FILLER_COUNT = 26;
const CELEBRATE_MS = 1400;
// Slow start, long confident deceleration.
const SPIN_EASING = "cubic-bezier(0.42, 0, 0.12, 1)";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

// Two random neighbours for a team, never the team itself.
function neighboursFor(team, pool) {
  const others = pool.filter((t) => String(t.id) !== String(team?.id));
  const shuffled = shuffleArray(others);
  return [shuffled[0] ?? null, shuffled[1] ?? null];
}

/**
 * The reel strip. The winning team is chosen up front from `teams` (already
 * filtered by the caller to exclude used teams); the animation only reveals it.
 *
 * Strip phases: "idle" (static window) → "armed" (strip built, no transition)
 * → "rolling" (CSS transform transition) → "idle" with the winner centred.
 */
export function SlotMachineReel({
  teams,
  isSpinning,
  onSpinComplete,
  lockedTeam,
}) {
  const [strip, setStrip] = useState([null, null, null]);
  const [center, setCenter] = useState(1);
  const [phase, setPhase] = useState("idle");
  const [celebrate, setCelebrate] = useState(false);
  const [duration, setDuration] = useState(SPIN_DURATION_MS);

  const stripRef = useRef(null);
  const teamsRef = useRef(teams);
  const onCompleteRef = useRef(onSpinComplete);
  const timersRef = useRef([]);

  teamsRef.current = teams;
  onCompleteRef.current = onSpinComplete;

  // Warm the logo cache so the strip never shows half-loaded images.
  useEffect(() => {
    for (const team of teams) {
      if (team.logoUrl) {
        const img = new Image();
        img.src = team.logoUrl;
      }
    }
    // Only needed once per team list size change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams.length]);

  // Idle window: show the locked team (e.g. after a reload) or random teams.
  useEffect(() => {
    if (isSpinning || phase !== "idle") return;
    const pool = teamsRef.current;

    if (lockedTeam) {
      setStrip((current) => {
        if (String(current[1]?.id) === String(lockedTeam.id)) return current;
        const [before, after] = neighboursFor(lockedTeam, pool);
        return [before, lockedTeam, after];
      });
      setCenter(1);
      return;
    }

    setStrip((current) => {
      if (current[1] !== null || pool.length === 0) return current;
      const shuffled = shuffleArray(pool);
      return [shuffled[0], shuffled[1] ?? null, shuffled[2] ?? null];
    });
  }, [lockedTeam, isSpinning, phase, teams.length]);

  // Start a spin on the rising edge of `isSpinning`.
  useEffect(() => {
    if (!isSpinning) return;
    const pool = teamsRef.current;
    if (pool.length === 0) return;

    const finalTeam = getRandomItem(pool);
    const [before, after] = neighboursFor(finalTeam, pool);
    const fillers = Array.from(
      { length: FILLER_COUNT },
      (_, i) => pool[(i + Math.floor(Math.random() * pool.length)) % pool.length],
    );
    const reduced = prefersReducedMotion();
    const spinMs = reduced ? REDUCED_SPIN_DURATION_MS : SPIN_DURATION_MS;

    setStrip((current) => [...current.slice(0, 3), ...fillers, before, finalTeam, after]);
    setCenter(1);
    setCelebrate(false);
    setDuration(spinMs);
    setPhase("armed");

    const timers = timersRef.current;
    timers.push(
      setTimeout(() => {
        // Collapse the long strip back to a three-row window.
        setPhase("idle");
        setStrip([before, finalTeam, after]);
        setCenter(1);
        setCelebrate(true);
        onCompleteRef.current(finalTeam);
      }, spinMs + 60),
    );

    return () => {
      timers.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [isSpinning]);

  useEffect(() => {
    if (!celebrate) return;
    const timer = setTimeout(() => setCelebrate(false), CELEBRATE_MS);
    return () => clearTimeout(timer);
  }, [celebrate]);

  // Once the strip is laid out at the start position, roll to the winner.
  useLayoutEffect(() => {
    if (phase !== "armed") return;
    // Force a style flush so the transition starts from the armed position.
    void stripRef.current?.offsetHeight;
    setCenter(strip.length - 2);
    setPhase("rolling");
  }, [phase, strip.length]);

  const rolling = phase === "rolling";
  const settled = phase === "idle" && !isSpinning;
  const locked = settled && Boolean(lockedTeam);
  const glow = locked ? lockedTeam.color : null;

  return (
    <div
      className={cn(
        "relative [--reel-item:5.25rem] sm:[--reel-item:6rem] [@media(max-height:700px)]:[--reel-item:4.5rem]",
        "h-[calc(var(--reel-item)*3)] overflow-hidden rounded-lg",
      )}
    >
      {/* Team colour wash behind the winner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: glow ? 1 : 0,
          background: glow
            ? `radial-gradient(60% 35% at 50% 50%, ${glow}55, transparent 70%)`
            : undefined,
        }}
      />

      {/* Strip, faded at the top and bottom for depth */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]">
        <div
          ref={stripRef}
          className="will-change-transform"
          style={{
            transform: `translate3d(0, calc(var(--reel-item) * ${-(center - 1)}), 0)`,
            transition: rolling ? `transform ${duration}ms ${SPIN_EASING}` : "none",
          }}
        >
          {strip.map((team, index) => (
            <ReelItem
              key={index}
              team={team}
              focus={settled && index === center}
              dimmed={settled && index !== center}
            />
          ))}
        </div>
      </div>

      {/* Selection frame with side pointers */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-3 top-1/2 h-[var(--reel-item)] -translate-y-1/2 rounded-xl border-2 transition-[border-color,box-shadow] duration-300",
          rolling && "border-lime/40",
          !rolling && !locked && "border-line-strong",
          locked && "border-lime shadow-[0_0_0_4px_rgb(200_241_53_/_0.12)]",
          celebrate && "animate-pop-in shadow-[0_0_0_6px_rgb(200_241_53_/_0.2),0_0_40px_rgb(200_241_53_/_0.25)]",
        )}
      >
        <span className="absolute -left-[3px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[8px] border-l-[9px] border-y-transparent border-l-lime" />
        <span className="absolute -right-[3px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[8px] border-r-[9px] border-y-transparent border-r-lime" />
        {locked && (
          <span className="absolute -top-2.5 right-5 animate-rise-in rounded bg-lime px-1.5 py-0.5 font-display text-[0.6875rem] font-extrabold uppercase leading-none tracking-[0.12em] text-lime-ink">
            Locked
          </span>
        )}
      </div>
    </div>
  );
}
