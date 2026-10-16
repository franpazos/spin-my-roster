import { fetchESPN } from "./espnClient"
import { ENDPOINTS } from "./endpoints"

// Average draft position (ADP) per athlete id from the ESPN Fantasy API,
// lower is better. ADP reflects what real drafters think of a player and
// barely reacts to in-season injuries, so we use it to put injured stars back
// where they belong on the depth chart. Expert ranks (PPR) were too eager:
// they promoted injured backups over clearly better healthy starters.
// Returns {} on any failure so callers fall back to ESPN's depth order.

// ESPN reports ADP 170 for players nobody drafts: treat those as unranked.
const UNDRAFTED_ADP = 170
export async function fetchFantasyRanks(athleteIds, season) {
  const ids = athleteIds.map(Number).filter(Number.isFinite)
  if (ids.length === 0 || !season) return {}

  try {
    const data = await fetchESPN(ENDPOINTS.fantasyPlayers(season), {
      headers: {
        "X-Fantasy-Filter": JSON.stringify({ players: { filterIds: { value: ids } } }),
      },
    })

    const ranks = {}
    for (const entry of data?.players || []) {
      const player = entry?.player
      const adp = player?.ownership?.averageDraftPosition
      if (player?.id && Number.isFinite(adp) && adp > 0 && adp < UNDRAFTED_ADP) {
        ranks[String(player.id)] = adp
      }
    }
    return ranks
  } catch (error) {
    console.warn("Fantasy ranks unavailable:", error?.message)
    return {}
  }
}
