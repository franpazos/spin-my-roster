import { fetchESPN } from "./espnClient"
import { ENDPOINTS } from "./endpoints"

// Extract head coach from team response
export function normalizeCoach(espnTeamResponse) {
  // Coach data is nested in the team response
  const team = espnTeamResponse?.team
  if (!team) return null

  // Try to find coach in franchise info or coaches array
  const coaches = team.coaches || []
  const headCoach = coaches.find((c) => c.type === "Head Coach" || c.title === "Head Coach")

  if (headCoach) {
    return {
      id: headCoach.id,
      name: headCoach.name || `${headCoach.firstName} ${headCoach.lastName}`,
      title: "Head Coach",
      experience: headCoach.experience || null,
    }
  }

  return null
}

export async function normalizeCoaches(teamsResponse) {
  const coachesMap = {}

  // Get team IDs from the teams response
  const teams = teamsResponse?.sports?.[0]?.leagues?.[0]?.teams || []

  // Fetch coach data for each team
  for (const { team } of teams) {
    try {
      const teamData = await fetchESPN(ENDPOINTS.teamInfo(team.id))
      const coach = normalizeCoach(teamData)
      if (coach) {
        coachesMap[team.id] = coach
      }
    } catch (error) {
      console.error(`[v0] Failed to fetch coach for team ${team.id}:`, error)
    }
  }

  return coachesMap
}

// Build coaches map from multiple team responses
export function buildCoachesMap(teamResponses) {
  const coachesMap = {}

  for (const [teamId, response] of Object.entries(teamResponses)) {
    const coach = normalizeCoach(response)
    if (coach) {
      coachesMap[teamId] = coach
    }
  }

  return coachesMap
}
