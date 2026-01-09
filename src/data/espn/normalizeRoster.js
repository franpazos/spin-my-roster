// Transform ESPN roster response to simplified format
// NOTE: No filtering by injury/status - show ALL players for position
export function normalizeRoster(espnResponse, positionFilter = null) {
  if (!espnResponse?.athletes) {
    return []
  }

  const players = []

  // ESPN groups athletes by position category
  for (const group of espnResponse.athletes) {
    for (const athlete of group.items || []) {
      const position = athlete.position?.abbreviation || ""

      // If position filter provided, check if player matches
      if (positionFilter && positionFilter.length > 0) {
        if (!positionFilter.includes(position)) continue
      }

      players.push({
        id: athlete.id,
        name: athlete.displayName,
        firstName: athlete.firstName,
        lastName: athlete.lastName,
        position: position,
        jersey: athlete.jersey || null,
        headshotUrl: athlete.headshot?.href || null,
      })
    }
  }

  // Sort by jersey number, then by name
  return players.sort((a, b) => {
    const jerseyA = Number.parseInt(a.jersey) || 999
    const jerseyB = Number.parseInt(b.jersey) || 999
    if (jerseyA !== jerseyB) return jerseyA - jerseyB
    return a.name.localeCompare(b.name)
  })
}
