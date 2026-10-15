import { fetchESPN } from "@/src/data/espn/espnClient"
import { ENDPOINTS } from "@/src/data/espn/endpoints"
import { getFromCache, setInCache, CACHE_TTL } from "@/src/data/espn/cache"

async function fetchHeadCoach(teamId, season) {
  const teamCoaches = await fetchESPN(ENDPOINTS.teamCoaches(teamId, season))
  const coachRef = teamCoaches?.items?.[0]?.$ref

  if (!coachRef) return null

  const coach = await fetchESPN(coachRef)

  return {
    id: coach.id,
    name: `${coach.firstName || ""} ${coach.lastName || ""}`.trim(),
    title: "Head Coach",
    experience: coach.experience ?? null,
    headshotUrl: coach?.headshot?.href || null,
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get("teamId")
  const season = searchParams.get("season") || String(new Date().getFullYear())

  if (!teamId) {
    return Response.json({ error: "teamId is required" }, { status: 400 })
  }

  const cacheKey = `coach-${season}-${teamId}`

  let coach = getFromCache(cacheKey)

  if (!coach) {
    try {
      coach = await fetchHeadCoach(teamId, season)

      if (coach) {
        setInCache(cacheKey, coach, CACHE_TTL.COACHES)
      }
    } catch (error) {
      console.error(`[v0] Failed to fetch coach for team ${teamId}:`, error)
      return Response.json({ error: "Failed to fetch coach" }, { status: 500 })
    }
  }

  return Response.json({ coach, teamId, season })
}
