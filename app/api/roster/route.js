import { fetchESPN } from "@/src/data/espn/espnClient"
import { ENDPOINTS } from "@/src/data/espn/endpoints"
import { normalizeRoster } from "@/src/data/espn/normalizeRoster"
import { getFromCache, setInCache, CACHE_TTL } from "@/src/data/espn/cache"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get("teamId")
  const position = searchParams.get("position")

  if (!teamId) {
    return Response.json({ error: "teamId is required" }, { status: 400 })
  }

  const cacheKey = `roster-${teamId}`

  // Check cache for full roster
  let roster = getFromCache(cacheKey)

  if (!roster) {
    try {
      const url = ENDPOINTS.teamRoster(teamId)
      const data = await fetchESPN(url)
      roster = normalizeRoster(data)

      // Cache for 7 days
      setInCache(cacheKey, roster, CACHE_TTL.ROSTER)
    } catch (error) {
      console.error(`[v0] Failed to fetch roster for team ${teamId}:`, error)
      return Response.json({ error: "Failed to fetch roster" }, { status: 500 })
    }
  }

  // Filter by position if provided
  let filteredRoster = roster
  if (position) {
    filteredRoster = roster.filter((player) => player.position === position)
  }

  return Response.json({
    players: filteredRoster,
    teamId,
    position: position || "all",
    fromCache: !!getFromCache(cacheKey),
  })
}
