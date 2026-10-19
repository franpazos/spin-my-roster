"use client";

import { forwardRef } from "react";
import { ROSTER_SLOT_ORDER, ROSTER_FORMAT } from "@/src/game/rosterFormat";
import { BrandMark } from "@/src/components/brand/BrandMark";
import { PositionBadge } from "@/src/components/roster/RosterSlotRow";
import { PlayerAvatar } from "@/src/components/roster/PlayerAvatar";
import { DraftOrderStrip, PickTag, getDraftOrder } from "./DraftOrder";

const UNIT_SLOTS = new Set(["OL", "DEF"]);

/**
 * Collectible-style card rendered off-screen and exported as a 1080px-wide
 * PNG (540px × pixelRatio 2). Everything is self-contained so the capture
 * does not depend on page layout.
 */
export const RosterExportCard = forwardRef(function RosterExportCard(
  { roster, shareUrl, title = "Spin My Roster" },
  ref
) {
  const filled = ROSTER_SLOT_ORDER.filter((key) => roster?.[key]).length;
  const displayUrl = (shareUrl || "").replace(/^https?:\/\//, "");
  const draftOrder = getDraftOrder(roster);

  return (
    <div
      ref={ref}
      className="relative w-[540px] overflow-hidden rounded-[28px] p-7 font-sans text-ink"
      style={{
        backgroundColor: "#060a0f",
        backgroundImage: [
          "radial-gradient(90% 45% at 50% 0%, rgba(138,220,255,0.18), transparent 70%)",
          "radial-gradient(70% 35% at 100% 100%, rgba(200,241,53,0.14), transparent 70%)",
          "repeating-linear-gradient(90deg, transparent 0 53px, rgba(156,196,220,0.05) 53px 54px)",
        ].join(","),
        boxShadow: "inset 0 0 0 1px rgba(156,196,220,0.22)",
      }}
    >
      {/* Brand header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BrandMark className="h-10 w-10" title="" />
          <span className="font-display text-2xl font-extrabold uppercase leading-none tracking-wide">
            {title.replace(/Roster$/i, "")}
            <span className="text-lime">Roster</span>
          </span>
        </div>
        <span className="rounded-md bg-lime px-2.5 py-1.5 font-display text-sm font-extrabold uppercase leading-none tracking-[0.1em] text-lime-ink">
          {filled}/{ROSTER_SLOT_ORDER.length} roster complete
        </span>
      </div>

      <h3 className="mt-6 font-display text-[3.25rem] font-extrabold uppercase leading-[0.9] tracking-wide">
        My starting
        <br />
        <span className="text-lime">lineup</span>
      </h3>

      {/* Slots */}
      <div className="@container mt-6 space-y-1.5">
        {ROSTER_SLOT_ORDER.map((slotKey, index) => {
          const config = ROSTER_FORMAT[slotKey];
          const player = roster?.[slotKey];

          return (
            <div
              key={slotKey}
              className="flex items-center gap-3.5 rounded-xl px-3 py-2"
              style={{ backgroundColor: index % 2 === 0 ? "rgba(21,39,51,0.9)" : "rgba(15,28,38,0.9)" }}
            >
              <PositionBadge slotKey={slotKey} filled className="h-10 w-14 text-lg" />
              <PlayerAvatar player={player} exportSafe className="h-11 w-11" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[1.1875rem] font-bold leading-tight text-ink">
                  {/* Units already carry the team name below, so use the slot name */}
                  {UNIT_SLOTS.has(slotKey) ? config.fullLabel : player?.name || config.fullLabel}
                </div>
                <div className="truncate text-[0.8125rem] text-ink-muted">
                  {player?.team?.name || config.fullLabel}
                </div>
              </div>
              {player?.team?.abbr && (
                <span className="font-display text-2xl font-extrabold leading-none tracking-wide text-ink">
                  {player.team.abbr}
                </span>
              )}
              {player?.team?.logoUrl && (
                <img
                  src={player.team.logoUrl}
                  alt=""
                  crossOrigin="anonymous"
                  className="h-10 w-10 object-contain"
                />
              )}
              <PickTag number={player?.pickNumber} className="ml-0.5" />
            </div>
          );
        })}
      </div>

      {/* Draft order: the sequence that explains each choice */}
      {draftOrder.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">
            Draft order
          </div>
          <DraftOrderStrip picks={draftOrder} layout="card" exportSafe />
        </div>
      )}

      {/* Footer */}
      <div
        className="mt-6 flex items-center justify-between border-t pt-4"
        style={{ borderColor: "rgba(156,196,220,0.2)" }}
      >
        <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">
          Spin yours
        </span>
        <span className="font-display text-xl font-extrabold tracking-wide text-ice">{displayUrl}</span>
      </div>
    </div>
  );
});
