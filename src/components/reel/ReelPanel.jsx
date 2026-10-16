"use client";

import { useMemo, useRef } from "react";
import { Panel } from "@/src/components/layout/Panel";
import { SlotMachineReel } from "./SlotMachineReel";
import { SpinButton } from "./SpinButton";
import { PHASES } from "@/src/game/gameReducer";
import { ROSTER_FORMAT, ROSTER_SLOT_ORDER } from "@/src/game/rosterFormat";
import {
  canSpin,
  isRosterComplete,
  isFinalPick,
  getReelHint,
} from "@/src/game/selectors";
import { cn } from "@/lib/utils";

const WAITING_LABELS = {
  [PHASES.CHOOSE_POSITION]: "Pick a position",
  [PHASES.CHOOSE_PLAYER]: "Pick a player",
};

export function ReelPanel({ state, teams, onSpin, onSpinComplete }) {
  const panelRef = useRef(null);
  const isSpinning = state.phase === PHASES.SPINNING;
  const complete = isRosterComplete(state);
  const spinAllowed = canSpin(state);
  const finalPick = isFinalPick(state);
  const hint = getReelHint(state);
  const staged = state.stagedPick;

  // Stable reference so the reel does not restart on unrelated re-renders.
  const availableTeams = useMemo(
    () => teams.filter((team) => !state.usedTeamIds.has(String(team.id))),
    [teams, state.usedTeamIds],
  );

  // On phones the main action docks to the bottom whenever it can be used.
  const docked = spinAllowed || isSpinning;

  const stagedLabel = staged
    ? `Locks ${ROSTER_FORMAT[staged.slotKey]?.label ?? staged.slotKey} · ${staged.player?.name ?? ""}`
    : undefined;

  function handleSpin() {
    onSpin();
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduce ? "auto" : "smooth";

    // The last pick completes the roster: jump to the top, where phones
    // show the celebration and New game first.
    if (finalPick) {
      window.scrollTo({ top: 0, behavior });
      return;
    }

    // Bring the reel into view on small screens so the spin is visible.
    const node = panelRef.current;
    if (node && node.getBoundingClientRect().top < 0) {
      node.scrollIntoView({ behavior, block: "start" });
    }
  }

  const announcement = isSpinning
    ? "Spinning the reel."
    : state.currentTeam
      ? `Landed on the ${state.currentTeam.name}.`
      : complete
        ? "Roster complete."
        : "";

  return (
    <Panel
      ref={panelRef}
      variant="stage"
      className="h-full scroll-mt-3"
      aria-label="Team reel"
      header={
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="eyebrow text-ink">
            {complete ? "Roster complete" : isSpinning ? "Rolling…" : "Spin for a team"}
          </h2>
          <p className="flex items-baseline gap-1.5 text-ink-muted">
            <span className="font-display text-lg font-extrabold leading-none text-ice">
              {availableTeams.length}
            </span>
            <span className="text-xs">teams left</span>
          </p>
        </div>
      }
    >
      {/* Reel housing */}
      <div className="flex flex-1 items-center justify-center px-3 py-4 sm:px-6 lg:py-6">
        <div className="relative w-full max-w-md">
          <ReelRails />
          <div className="rounded-2xl border border-line bg-surface-0/70 p-1.5 shadow-[inset_0_2px_12px_rgb(0_0_0_/_0.6)]">
            {complete ? (
              <DraftedTeams roster={state.roster} />
            ) : (
              <SlotMachineReel
                teams={availableTeams}
                isSpinning={isSpinning}
                onSpinComplete={onSpinComplete}
                lockedTeam={state.currentTeam}
              />
            )}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      {/* Hint + action */}
      <div className="border-t border-line bg-surface-1/60 px-4 pb-4 pt-3">
        <div className="min-h-11 text-center" aria-hidden={isSpinning || undefined}>
          {hint && !isSpinning ? (
            <>
              <p
                className={cn(
                  "text-sm font-semibold leading-snug",
                  hint.tone === "success" ? "text-lime" : "text-ice",
                )}
              >
                {hint.title}
              </p>
              {hint.subtitle && <p className="mt-0.5 text-sm text-ink-muted">{hint.subtitle}</p>}
            </>
          ) : (
            <p className="pt-2 text-sm text-ink-muted">
              {isSpinning
                ? "Rolling through the league…"
                : complete
                  ? "All eight slots are locked."
                  : "Spin to draw your next team."}
            </p>
          )}
        </div>

        <div
          className={cn(
            "mt-3",
            // While the player is choosing, the picker sits right below on phones.
            !docked && !complete && "max-md:hidden",
            docked &&
              "max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-40 max-md:mt-0 max-md:border-t max-md:border-line max-md:bg-surface-0/90 max-md:px-3 max-md:pt-3 max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-md:backdrop-blur-md",
          )}
        >
          <SpinButton
            onClick={handleSpin}
            disabled={!spinAllowed}
            isSpinning={isSpinning}
            isComplete={complete}
            isFinalPick={finalPick}
            hasStagedPick={Boolean(staged)}
            waitingLabel={WAITING_LABELS[state.phase] ?? "Spin"}
            stagedLabel={stagedLabel}
          />
        </div>
      </div>
    </Panel>
  );
}

// Final board: the eight teams drafted, in lineup order.
function DraftedTeams({ roster }) {
  return (
    <ul className="grid grid-cols-4 gap-1.5 p-2" aria-label="Teams drafted">
      {ROSTER_SLOT_ORDER.map((slotKey) => {
        const team = roster[slotKey]?.team;
        return (
          <li
            key={slotKey}
            className="flex animate-pop-in flex-col items-center gap-1 rounded-lg bg-surface-2 px-1 py-2.5"
          >
            {team?.logoUrl && <img src={team.logoUrl} alt="" className="h-10 w-10 object-contain sm:h-12 sm:w-12" />}
            <span className="font-display text-sm font-bold uppercase leading-none text-ink">{team?.abbr}</span>
            <span className="font-display text-xs font-bold uppercase leading-none text-lime">
              {ROSTER_FORMAT[slotKey].label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// Decorative side rails with yard ticks that frame the reel like a machine.
function ReelRails() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -inset-x-2 inset-y-4 hidden sm:block">
      {["left-0", "right-0"].map((side) => (
        <div
          key={side}
          className={cn(
            "absolute inset-y-0 w-1 rounded-full bg-[repeating-linear-gradient(to_bottom,var(--line-strong)_0_2px,transparent_2px_12px)]",
            side,
          )}
        />
      ))}
    </div>
  );
}
