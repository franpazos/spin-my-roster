// Transform ESPN teams response to simplified format
export function normalizeTeams(espnResponse) {
  if (!espnResponse?.sports?.[0]?.leagues?.[0]?.teams) {
    return []
  }

  return espnResponse.sports[0].leagues[0].teams.map(({ team }) => ({
    id: team.id,
    name: team.displayName,
    abbr: team.abbreviation,
    shortName: team.shortDisplayName,
    logoUrl: team.logos?.[0]?.href || null,
    color: team.color ? `#${team.color}` : null,
    alternateColor: team.alternateColor ? `#${team.alternateColor}` : null,
  }))
}
