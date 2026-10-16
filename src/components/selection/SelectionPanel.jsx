"use client";

import { useRef } from "react";
import { Panel } from "@/src/components/layout/Panel";
import { PositionPicker } from "./PositionPicker";
import { PlayerList } from "./PlayerList";
import { RosterExportCard } from "../share/RosterExportCard";
import { RosterShareBar } from "../share/RosterShareBar";
import { PositionBadge } from "@/src/components/roster/RosterSlotRow";
import { PHASES } from "@/src/game/gameReducer";
import { ROSTER_FORMAT, ROSTER_SLOT_ORDER } from "@/src/game/rosterFormat";
import { getAvailableSlots, getFilledSlotsCount } from "@/src/game/selectors";
import {
  ChevronLeft,
  LayoutGrid,
  Lock,
  RotateCcw,
  RotateCw,
  Trophy,
  Undo2,
  UserRoundCheck,
} from "lucide-react";

const HOW_TO_PLAY = [
  { icon: RotateCw, title: "Spin", text: "Draw a random team from the league." },
  { icon: LayoutGrid, title: "Pick a slot", text: "Choose one open position to fill." },
  { icon: UserRoundCheck, title: "Draft & lock", text: "Pick a player, then spin again to lock it in." },
];

export function SelectionPanel({
  state,
  onSelectPosition,
  onSelectPlayer,
  onBack,
  onUndo,
  onReset,
}) {
  // Hooks stay above every conditional return.
  const exportRef = useRef(null);

  const { phase, currentTeam, selectedSlot, usedPlayerIds, roster, stagedPick } = state;

  if (phase === PHASES.IDLE) {
    if (stagedPick) {
      return <StagedPickView stagedPick={stagedPick} state={state} onUndo={onUndo} />;
    }
    return getFilledSlotsCount(state) === 0 ? <HowToPlayView /> : <NextSpinView state={state} />;
  }

  if (phase === PHASES.SPINNING) {
    return <SpinningView state={state} />;
  }

  if (phase === PHASES.CHOOSE_POSITION) {
    return (
      <Panel className="h-full" aria-label="Choose a position">
        <TeamHeader team={currentTeam} kicker="You drew" />
        <div className="scroll-slim flex-1 md:overflow-y-auto">
          <PositionPicker state={state} onSelect={onSelectPosition} />
        </div>
      </Panel>
    );
  }

  if (phase === PHASES.CHOOSE_PLAYER) {
    const slotConfig = ROSTER_FORMAT[selectedSlot];

    return (
      <Panel className="h-full" aria-label={`Choose a ${slotConfig?.fullLabel ?? "player"}`}>
        {/* Sticks to the top of the screen on phones while the list scrolls */}
        <div className="sticky top-0 z-10 rounded-t-xl border-b border-line bg-surface-2">
          <div className="flex items-center gap-2 px-2 py-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-11 min-w-11 items-center gap-1 rounded-lg pl-1.5 pr-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              Positions
            </button>
            <div className="ml-auto flex min-w-0 items-center gap-2 pr-2">
              {currentTeam?.logoUrl && (
                <img src={currentTeam.logoUrl} alt="" className="h-7 w-7 shrink-0 object-contain" />
              )}
              <span className="truncate font-display text-lg font-bold uppercase tracking-wide text-ink">
                {currentTeam?.abbr}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 pb-3">
            <PositionBadge slotKey={selectedSlot} filled />
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl font-extrabold uppercase leading-tight tracking-wide text-ink">
                Draft your {slotConfig?.fullLabel}
              </h2>
              <p className="truncate text-sm text-ink-muted">from the {currentTeam?.name}</p>
            </div>
          </div>
        </div>

        <div className="scroll-slim flex-1 md:overflow-y-auto">
          <PlayerList
            teamId={currentTeam?.id}
            teamName={currentTeam?.name}
            teamColor={currentTeam?.color}
            slotKey={selectedSlot}
            usedPlayerIds={usedPlayerIds}
            onSelect={onSelectPlayer}
          />
        </div>
      </Panel>
    );
  }

  if (phase === PHASES.COMPLETE) {
    const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

    return (
      <Panel className="h-full" aria-label="Roster complete">
        <div className="scroll-slim flex flex-1 flex-col md:overflow-y-auto">
          <div className="relative overflow-hidden px-5 pb-4 pt-6 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(200_241_53_/_0.18),transparent)]"
            />
            <div className="relative mx-auto flex h-16 w-16 animate-pop-in items-center justify-center rounded-2xl bg-lime text-lime-ink shadow-accent">
              <Trophy className="h-8 w-8" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <p className="eyebrow relative mt-4 text-lime">8/8 · Roster complete</p>
            <h2 className="relative mt-1 font-display text-3xl font-extrabold uppercase leading-none tracking-wide text-ink">
              Your squad is locked
            </h2>
            <p className="relative mx-auto mt-2 max-w-xs text-sm text-ink-muted">
              Share your lineup and see who can spin a better one.
            </p>
          </div>

          <div className="px-4">
            <RosterShareBar exportRef={exportRef} shareUrl={shareUrl} />
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-1 px-3 sm:grid-cols-2 md:grid-cols-1">
            {ROSTER_SLOT_ORDER.map((slotKey) => {
              const player = roster[slotKey];
              return (
                <li key={slotKey} className="flex items-center gap-2.5 rounded-lg bg-surface-3/50 p-1.5">
                  <PositionBadge slotKey={slotKey} filled className="h-8 w-10 text-sm" />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{player?.name}</span>
                  <span className="pr-1.5 font-display text-sm font-bold text-ink-muted">{player?.team?.abbr}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto p-4">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-line-strong font-display text-lg font-bold uppercase tracking-wider text-ink transition-colors hover:border-lime/60 hover:bg-surface-3"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              New game
            </button>
          </div>
        </div>

        {/* Off-screen card used to render the shareable PNG */}
        <div className="pointer-events-none fixed left-[-9999px] top-0" aria-hidden="true">
          <RosterExportCard ref={exportRef} roster={roster} shareUrl={shareUrl} />
        </div>
      </Panel>
    );
  }

  return null;
}

function TeamHeader({ team, kicker }) {
  return (
    <div
      className="flex items-center gap-3 border-b border-line px-4 py-3"
      style={{ boxShadow: team?.color ? `inset 4px 0 0 ${team.color}` : undefined }}
    >
      {team?.logoUrl && <img src={team.logoUrl} alt="" className="h-11 w-11 shrink-0 object-contain" />}
      <div className="min-w-0">
        <p className="eyebrow">{kicker}</p>
        <h2 className="truncate font-display text-2xl font-extrabold uppercase leading-none tracking-wide text-ink">
          {team?.name}
        </h2>
      </div>
    </div>
  );
}

function HowToPlayView() {
  return (
    <Panel className="h-full" title="How to play">
      <div className="flex flex-1 flex-col justify-center p-4 sm:p-5">
        <ol className="space-y-3">
          {HOW_TO_PLAY.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="flex items-start gap-3">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-surface-3 text-lime">
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-lime font-display text-xs font-extrabold text-lime-ink">
                  {index + 1}
                </span>
              </span>
              <span className="pt-0.5">
                <span className="block font-display text-lg font-bold uppercase leading-tight tracking-wide text-ink">
                  {title}
                </span>
                <span className="block text-sm text-ink-muted">{text}</span>
              </span>
            </li>
          ))}
        </ol>
        <ul className="mt-5 flex flex-wrap gap-1.5 text-xs text-ink-muted">
          {["8 slots", "No repeat teams", "No repeat players", "OL · DEF · HC auto-fill"].map((rule) => (
            <li key={rule} className="rounded-md border border-line px-2 py-1">
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

function NextSpinView({ state }) {
  const open = getAvailableSlots(state);
  return (
    <Panel className="h-full" title="Next up">
      <div className="flex flex-1 flex-col justify-center p-4 sm:p-5">
        <h3 className="font-display text-2xl font-extrabold uppercase leading-none tracking-wide text-ink">
          Spin for your next team
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          {open.length} open {open.length === 1 ? "slot" : "slots"} left to fill.
        </p>
        <OpenSlots slots={open} />
      </div>
    </Panel>
  );
}

function SpinningView({ state }) {
  const open = getAvailableSlots(state);
  return (
    <Panel className="h-full" title="Drawing a team">
      <div className="flex flex-1 flex-col justify-center p-4 sm:p-5" aria-hidden="true">
        <div className="flex items-center gap-3">
          <span className="skeleton h-12 w-12 rounded-full" />
          <span className="flex-1 space-y-2">
            <span className="skeleton block h-5 w-2/3 rounded" />
            <span className="skeleton block h-3 w-1/3 rounded" />
          </span>
        </div>
        <p className="mt-5 text-sm text-ink-muted">The reel decides. Your open slots:</p>
        <OpenSlots slots={open} />
      </div>
    </Panel>
  );
}

function OpenSlots({ slots }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {slots.map((slotKey) => (
        <li key={slotKey}>
          <PositionBadge slotKey={slotKey} filled={false} className="h-8 w-11 text-sm" />
          <span className="sr-only">{ROSTER_FORMAT[slotKey].fullLabel}</span>
        </li>
      ))}
    </ul>
  );
}

function StagedPickView({ stagedPick, state, onUndo }) {
  const { slotKey, player } = stagedPick;
  const config = ROSTER_FORMAT[slotKey];
  const isLast = getAvailableSlots(state).length === 1;

  return (
    <Panel className="h-full" title="Next pick" aria-live="polite">
      <div className="flex flex-1 flex-col justify-center p-4 sm:p-5">
        <div className="animate-rise-in rounded-xl border border-dashed border-lime/50 bg-lime/[0.06] p-4">
          <div className="flex items-center gap-3">
            <PositionBadge slotKey={slotKey} filled />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold leading-tight text-ink">{player?.name}</p>
              <p className="truncate text-sm text-ink-muted">
                {config.fullLabel} · {player?.team?.name}
              </p>
            </div>
            {player?.team?.logoUrl && (
              <img src={player.team.logoUrl} alt="" className="h-10 w-10 shrink-0 object-contain" />
            )}
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 text-sm text-ink">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
          {isLast
            ? "Last slot. Confirm to lock your full roster."
            : "Not locked yet. Spin again to lock this pick and draw your next team."}
        </p>

        {onUndo && (
          <button
            type="button"
            onClick={onUndo}
            className="mt-3 inline-flex min-h-11 items-center gap-2 self-start rounded-lg px-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink"
          >
            <Undo2 className="h-4 w-4" aria-hidden="true" />
            Change pick
          </button>
        )}
      </div>
    </Panel>
  );
}
