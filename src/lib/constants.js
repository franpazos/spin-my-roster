// NFL Team IDs for ESPN API
export const NFL_TEAM_IDS = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  33,
  34, // Note: 31, 32 are skipped in ESPN's system
]

// Position codes for roster slots
export const POSITION_CODES = {
  QB: "QB",
  RB: "RB",
  WR: "WR",
  TE: "TE",
  OL: ["C", "OG", "OT", "G", "T", "OL"], // Offensive line positions
  DEF: ["DT", "DE", "LB", "CB", "S", "DB", "NT", "ILB", "OLB", "MLB", "FS", "SS"], // Defensive positions
}

// Roster slot definitions
export const ROSTER_SLOTS = [
  { key: "QB", label: "Quarterback", positions: ["QB"] },
  { key: "RB", label: "Running Back", positions: ["RB"] },
  { key: "WR1", label: "Wide Receiver 1", positions: ["WR"] },
  { key: "WR2", label: "Wide Receiver 2", positions: ["WR"] },
  { key: "TE", label: "Tight End", positions: ["TE"] },
  { key: "OL", label: "Offensive Line", positions: ["C", "OG", "OT", "G", "T", "OL"] },
  {
    key: "DEF",
    label: "Defense",
    positions: ["DT", "DE", "LB", "CB", "S", "DB", "NT", "ILB", "OLB", "MLB", "FS", "SS"],
  },
  { key: "HC", label: "Head Coach", positions: ["HC"] },
]

// Cache TTL values in milliseconds
export const CACHE_TTL = {
  TEAMS: 24 * 60 * 60 * 1000, // 24 hours
  ROSTER: 7 * 24 * 60 * 60 * 1000, // 7 days
  COACHES: 24 * 60 * 60 * 1000, // 24 hours
}
