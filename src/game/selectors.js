import { ROSTER_FORMAT, ROSTER_SLOT_ORDER } from "./rosterFormat"
import { PHASES } from "./gameReducer"

// Get available slots for current selection
export function getAvailableSlots(state) {
  return ROSTER_SLOT_ORDER.filter((key) => state.roster[key] === null)
}

// Check if roster is complete
export function isRosterComplete(state) {
  return state.phase === PHASES.COMPLETE
}

// Get filled slots count
export function getFilledSlotsCount(state) {
  return ROSTER_SLOT_ORDER.filter((key) => state.roster[key] !== null).length
}

// Get progress percentage
export function getProgress(state) {
  return (getFilledSlotsCount(state) / ROSTER_SLOT_ORDER.length) * 100
}

// Get current slot config
export function getCurrentSlotConfig(state) {
  if (!state.selectedSlot) return null
  return ROSTER_FORMAT[state.selectedSlot]
}

// Filter out used players
export function filterAvailablePlayers(players, usedPlayerIds) {
  return players.filter((p) => !usedPlayerIds.has(p.id))
}

// Can spin (not during spinning or player selection)

// export function canSpin(state) {
//   return state.phase === PHASES.IDLE && !isRosterComplete(state)
// }

// Using `stagedPick` instead of `selectedPlayer`

// export function canSpin(state) {
//   if (isRosterComplete(state)) return false
//   const hasTeam = Boolean(state.currentTeam)
//   const hasStaged = Boolean(state.stagedPick)

//   // Can spin if no team yet (first spin), or if there is a staged pick for current team
//   return !hasTeam || hasStaged
// }

// Alternative version if using `selectedPlayer` instead of `stagedPick`

export function canSpin(state) {
  if (isRosterComplete(state)) return false
  const hasTeam = Boolean(state.currentTeam)

  // replace `state.selectedPlayer` with whatever field you use now for staged
  const hasStaged = Boolean(state.stagedPick)

  return !hasTeam || hasStaged
}


// Can undo

export function canUndo(state) {
  return Boolean(state.stagedPick) // o el campo staged actual
}

// Is it final pick

export function isFinalPick(state) {
  if (!state.stagedPick) return false
  const remaining = getAvailableSlots(state).length
  return remaining === 1
}

