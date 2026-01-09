// Roster format configuration
export const ROSTER_FORMAT = {
  QB: { label: "QB", fullLabel: "Quarterback", positions: ["QB"], max: 1 },
  RB: { label: "RB", fullLabel: "Running Back", positions: ["RB"], max: 1 },
  WR1: { label: "WR1", fullLabel: "Wide Receiver 1", positions: ["WR"], max: 1 },
  WR2: { label: "WR2", fullLabel: "Wide Receiver 2", positions: ["WR"], max: 1 },
  TE: { label: "TE", fullLabel: "Tight End", positions: ["TE"], max: 1 },
  OL: { 
    label: "OL", 
    fullLabel: "Offensive Line", 
    positions: ["OL"], 
    max: 1,
    autoCommit: true,
  },
  DEF: {
    label: "DEF",
    fullLabel: "Team Defense",
    positions: [],
    max: 1,
    autoCommit: true,
  },
  HC: {
    label: "HC",
    fullLabel: "Head Coach",
    positions: ["HC"],
    max: 1,
    autoCommit: true,
  },
}

// Ordered list of slot keys for display
export const ROSTER_SLOT_ORDER = ["QB", "RB", "WR1", "WR2", "TE", "OL", "DEF", "HC"]

// Get empty roster object
export function createEmptyRoster() {
  const roster = {}
  for (const key of ROSTER_SLOT_ORDER) {
    roster[key] = null
  }
  return roster
}
