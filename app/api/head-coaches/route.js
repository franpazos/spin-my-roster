// import { fetchESPN } from "@/src/data/espn/espnClient"
// import { ENDPOINTS } from "@/src/data/espn/endpoints"
// import { getFromCache, setInCache, CACHE_TTL } from "@/src/data/espn/cache"

// export async function GET(request) {
//   const { searchParams } = new URL(request.url)
//   const teamId = searchParams.get("teamId")

//   if (!teamId) {
//     return Response.json({ error: "teamId is required" }, { status: 400 })
//   }

//   const cacheKey = `coach-${teamId}`

//   // Check cache first
//   let coach = getFromCache(cacheKey)

//   if (!coach) {
//     try {
//       const teamData = await fetchESPN(ENDPOINTS.teamInfo(teamId))
//       console.log("[v0] Team data for coach:", JSON.stringify(teamData).slice(0, 500))

//       // Extract coach from team response
//       const team = teamData?.team
//       const coaches = team?.coaches || []
//       const headCoach = coaches.find((c) => c.type === "Head Coach" || c.title === "Head Coach")

//       if (headCoach) {
//         coach = {
//           id: headCoach.id,
//           name: headCoach.name || `${headCoach.firstName} ${headCoach.lastName}`,
//           title: "Head Coach",
//         }
//       } else {
//         // Fallback: use team name + "Head Coach"
//         coach = {
//           id: `hc-${teamId}`,
//           name: `${team?.displayName || team?.name || "Team"} Head Coach`,
//           title: "Head Coach",
//         }
//       }

//       // Cache for 24 hours
//       setInCache(cacheKey, coach, CACHE_TTL.COACHES)
//     } catch (error) {
//       console.error("[v0] Failed to fetch coach for team:", teamId, error)
//       return Response.json({ error: "Failed to fetch coach" }, { status: 500 })
//     }
//   }

//   return Response.json({ coach, teamId })
// }


import { fetchESPN } from "@/src/data/espn/espnClient"
import { ENDPOINTS } from "@/src/data/espn/endpoints"
import { getFromCache, setInCache, CACHE_TTL } from "@/src/data/espn/cache"

function parseTeamIdFromRef(teamRef) {
  const match = String(teamRef || "").match(/\/teams\/(\d+)\b/)
  return match ? match[1] : null
}

async function buildCoachesMap(season = "2025") {
  const index = await fetchESPN(ENDPOINTS.coachesIndex(season))
  const items = index?.items || []
  const refs = items.map((it) => it?.$ref).filter(Boolean)

  const coaches = await Promise.all(
    refs.map(async (ref) => {
      try {
        return await fetchESPN(ref)
      } catch (e) {
        console.error("[v0] Failed to fetch coach ref:", ref, e)
        return null
      }
    }),
  )

  const map = {}
  for (const coach of coaches) {
    if (!coach) continue
    const teamId = parseTeamIdFromRef(coach?.team?.$ref)
    if (!teamId) continue

    map[teamId] = {
      id: coach.id,
      name: `${coach.firstName || ""} ${coach.lastName || ""}`.trim(),
      title: "Head Coach",
      experience: coach.experience ?? null,
      headshotUrl: coach?.headshot?.href || null,
    }
  }

  return map
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get("teamId")
  const season = searchParams.get("season") || "2025"

  if (!teamId) {
    return Response.json({ error: "teamId is required" }, { status: 400 })
  }

  const cacheKey = `coaches-map-${season}`

  let coachesMap = getFromCache(cacheKey)

  if (!coachesMap) {
    try {
      coachesMap = await buildCoachesMap(season)
      // cache full map (24h)
      setInCache(cacheKey, coachesMap, CACHE_TTL.COACHES)
    } catch (error) {
      console.error("[v0] Failed to build coaches map:", error)
      return Response.json({ error: "Failed to fetch coaches map" }, { status: 500 })
    }
  }

  const coach = coachesMap[String(teamId)] || null

  return Response.json({ coach, teamId, season })
}
