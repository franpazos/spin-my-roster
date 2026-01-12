"use client";

import { forwardRef } from "react";
import { ROSTER_SLOT_ORDER, ROSTER_FORMAT } from "@/src/game/rosterFormat";

export const RosterExportCard = forwardRef(function RosterExportCard(
  { roster, shareUrl, title = "Spin My Roster" },
  ref
) {
  return (
    <div
      ref={ref}
      className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 w-full max-w-sm"
    >
      {/* Title */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-extrabold tracking-tight text-white">
          {title}
        </h3>
      </div>

      {/* Slots */}
      <div className="space-y-2">
        {ROSTER_SLOT_ORDER.map((slotKey) => {
          const config = ROSTER_FORMAT[slotKey];
          const player = roster?.[slotKey];

          return (
            <div
              key={slotKey}
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {config.label}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {player?.name || config.fullLabel}
                </div>
                <div className="text-xs text-zinc-400 truncate">
                  {player?.team?.abbr ? `${player.team.abbr} • ` : ""}
                  {player?.position || config.label}
                </div>
              </div>

              {player?.team?.logoUrl && (
                <img
                  src={player.team.logoUrl}
                  alt={player.team.abbr}
                  className="w-8 h-8 object-contain opacity-80"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer URL */}
      <div className="mt-4 pt-3 border-t border-zinc-800 text-center">
        <p className="text-[11px] text-zinc-500">{shareUrl}</p>
      </div>
    </div>
  );
});
