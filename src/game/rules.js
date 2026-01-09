import { ROSTER_FORMAT, ROSTER_SLOT_ORDER } from "./rosterFormat"

// Check if a player can be added to a slot
export function canAddPlayer(state, slotKey, player) {
  // Check if slot is already filled
  if (state.roster[slotKey] !== null) {
    return { allowed: false, reason: "Slot is already filled" }
  }

  // Check if player is already in roster (no duplicates)
  if (state.usedPlayerIds.has(player.id)) {
    return { allowed: false, reason: "Player is already on your roster" }
  }

  // Check if player position matches slot
  const slotConfig = ROSTER_FORMAT[slotKey]
  if (!slotConfig) {
    return { allowed: false, reason: "Invalid slot" }
  }

  // For HC slot, we use a special check
  if (slotKey === "HC") {
    return { allowed: true }
  }

  // Check position compatibility
  if (!slotConfig.positions.includes(player.position)) {
    return { allowed: false, reason: `Player position (${player.position}) doesn't match slot` }
  }

  return { allowed: true }
}

// Get available slots that are not yet filled
export function getAvailableSlots(roster) {
  return ROSTER_SLOT_ORDER.filter((key) => roster[key] === null)
}

// Check if roster is complete
export function isRosterComplete(roster) {
  return ROSTER_SLOT_ORDER.every((key) => roster[key] !== null)
}

// Get slots that can accept a specific position
export function getSlotsForPosition(roster, position) {
  return ROSTER_SLOT_ORDER.filter((key) => {
    if (roster[key] !== null) return false

    const slotConfig = ROSTER_FORMAT[key]
    return slotConfig.positions.includes(position)
  })
}
