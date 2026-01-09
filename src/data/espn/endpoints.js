const BASE_URL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl"
const CORE_BASE_URL = "https://sports.core.api.espn.com/v2"

export const ENDPOINTS = {
  // Get all teams
  teams: () => `${BASE_URL}/teams`,

  // Get single team with roster
  teamRoster: (teamId) => `${BASE_URL}/teams/${teamId}/roster`,

  // Get team info (includes coach refs)
  teamInfo: (teamId) => `${BASE_URL}/teams/${teamId}`,

  // Get team head coach

  coachesIndex: (season = "2025" ) =>
    `${CORE_BASE_URL}/sports/football/leagues/nfl/seasons/${season}/coaches?limit=100`,
}
