import { fetchESPN } from "@/src/data/espn/espnClient"
import { ENDPOINTS } from "@/src/data/espn/endpoints"
import { normalizeTeams } from "@/src/data/espn/normalizeTeams"
import { getFromCache, setInCache, CACHE_TTL } from "@/src/data/espn/cache"

export async function GET() {
  const cacheKey = "teams"

  // Check cache
  const cached = getFromCache(cacheKey)
  if (cached) {
    return Response.json({ teams: cached, fromCache: true })
  }

  try {
    const data = await fetchESPN(ENDPOINTS.teams())
    const teams = normalizeTeams(data)

    // Cache for 24 hours
    setInCache(cacheKey, teams, CACHE_TTL.TEAMS)

    return Response.json({ teams, fromCache: false })
  } catch (error) {
    console.error("[v0] Failed to fetch teams:", error)
    return Response.json({ error: "Failed to fetch teams" }, { status: 500 })
  }
}
