import { fetchESPN } from "@/src/data/espn/espnClient"
import { ENDPOINTS } from "@/src/data/espn/endpoints"
import { normalizeRoster } from "@/src/data/espn/normalizeRoster"
import { normalizeDepthChart } from "@/src/data/espn/normalizeDepthChart"
import { getFromCache, setInCache, CACHE_TTL } from "@/src/data/espn/cache"

// Depth chart lookup for a team. Optional: on failure the roster keeps its
// default order, so a depth chart outage never blocks the game.
async function getDepthChart(teamId) {
  const cacheKey = `depth-${teamId}`
  const cached = getFromCache(cacheKey)
  if (cached) return cached

  try {
    const depth = normalizeDepthChart(await fetchESPN(ENDPOINTS.teamDepthChart(teamId)))
    setInCache(cacheKey, depth, CACHE_TTL.DEPTH_CHART)
    return depth
  } catch (error) {
    console.warn(`Depth chart unavailable for team ${teamId}:`, error?.message)
    return {}
  }
}

// Depth chart players first (QB1, QB2…), then everyone else in roster order.
function sortByDepth(players) {
  return players
    .map((player, index) => ({ player, index }))
    .sort((a, b) => {
      const rankA = a.player.depth?.rank ?? Infinity
      const rankB = b.player.depth?.rank ?? Infinity
      return rankA === rankB ? a.index - b.index : rankA - rankB
    })
    .map(({ player }) => player)
}

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

  // Attach depth chart info for the player's own position and sort by it
  const depthChart = await getDepthChart(teamId)
  filteredRoster = sortByDepth(
    filteredRoster.map((player) => {
      const depth = depthChart[player.id]
      return depth && depth.position === player.position ? { ...player, depth } : player
    }),
  )

  return Response.json({
    players: filteredRoster,
    teamId,
    position: position || "all",
    fromCache: !!getFromCache(cacheKey),
  })
}
