const STORAGE_KEY = "spin_my_roster_game"
const STORAGE_VERSION = 2

// Save game state to localStorage
export function saveGame(state) {
  try {
    const serialized = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      roster: state.roster,
      usedPlayerIds: Array.from(state.usedPlayerIds),
      usedTeamIds: Array.from(state.usedTeamIds),
      phase: state.phase,
      currentTeam: state.currentTeam,
      selectedSlot: state.selectedSlot,
      stagedPick: state.stagedPick,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
  } catch (e) {
    console.error("Failed to save game:", e)
  }
}

// Load game state from localStorage
export function loadGame() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null

    const parsed = JSON.parse(saved)

    // Version check
    if (parsed.version !== STORAGE_VERSION) {
      clearGame()
      return null
    }

    const rosterTeamIds = Object.values(parsed.roster || {})
      .map((player) => player?.team?.id)
      .filter(Boolean)

    return {
      roster: parsed.roster,
      usedPlayerIds: parsed.usedPlayerIds,
      usedTeamIds: parsed.usedTeamIds || rosterTeamIds,
      phase: parsed.phase,
      currentTeam: parsed.currentTeam,
      selectedSlot: parsed.selectedSlot,
      stagedPick: parsed.stagedPick,
    }
  } catch (e) {
    console.error("Failed to load game:", e)
    return null
  }
}

// Clear saved game
export function clearGame() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error("Failed to clear game:", e)
  }
}

// Check if there's a saved game
export function hasSavedGame() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch (e) {
    return false
  }
}
