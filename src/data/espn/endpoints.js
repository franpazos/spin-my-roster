const BASE_URL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl"
const CORE_BASE_URL = "https://sports.core.api.espn.com/v2"
// Unofficial ESPN Fantasy API. Optional: callers must survive it failing.
const FANTASY_BASE_URL = "https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl"

export const ENDPOINTS = {
  // Get all teams
  teams: () => `${BASE_URL}/teams`,

  // Get single team with roster
  teamRoster: (teamId) => `${BASE_URL}/teams/${teamId}/roster`,

  // Get team depth chart (offense, defense and special teams formations)
  teamDepthChart: (teamId) => `${BASE_URL}/teams/${teamId}/depthcharts`,

  // Fantasy player info (draft ranks). Filter players with the X-Fantasy-Filter header.
  fantasyPlayers: (season) =>
    `${FANTASY_BASE_URL}/seasons/${season}/segments/0/leaguedefaults/3?view=kona_player_info`,

  // Get team info (includes coach refs)
  teamInfo: (teamId) => `${BASE_URL}/teams/${teamId}`,

  // Get the head coach assigned to a team for a season
  teamCoaches: (teamId, season) =>
    `${CORE_BASE_URL}/sports/football/leagues/nfl/seasons/${season}/teams/${teamId}/coaches`,
}
