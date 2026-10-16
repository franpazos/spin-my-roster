// Transform ESPN's team depth chart into a lookup of offensive depth per athlete.
//
// ESPN returns several formations (offense, defense, special teams). The
// offensive one has one column per spot, e.g. qb, rb, te, wr1, wr2, wr3, and
// each column lists athletes from starter to deepest backup.
//
// ESPN demotes injured players (IR, Out…). In this game injuries should not
// matter, so injured players can be put back by their fantasy draft position (ADP).

// Parse the offensive formation. Returns null when there is none.
// { season, positions: Map<position, { starters, order: [{ id, injured }] }> }
export function parseOffenseDepth(espnResponse) {
  const formations = espnResponse?.depthchart || []
  const offense = formations.find((formation) => formation?.positions?.qb)
  if (!offense) return null

  // Group columns by position abbreviation, keeping ESPN's column order.
  const columnsByPosition = new Map()
  for (const [key, column] of Object.entries(offense.positions)) {
    const position = (column?.position?.abbreviation || key.replace(/\d+$/, "")).toUpperCase()
    if (!columnsByPosition.has(position)) columnsByPosition.set(position, [])
    columnsByPosition.get(position).push(column?.athletes || [])
  }

  const positions = new Map()
  for (const [position, columns] of columnsByPosition) {
    const maxDepth = Math.max(...columns.map((athletes) => athletes.length))
    const seen = new Set()
    const order = []

    // Walk row by row: all starters first (WR1, WR2, WR3), then the backups.
    for (let row = 0; row < maxDepth; row++) {
      for (const athletes of columns) {
        const athlete = athletes[row]
        if (!athlete?.id || seen.has(athlete.id)) continue
        seen.add(athlete.id)
        order.push({ id: athlete.id, injured: (athlete.injuries || []).length > 0 })
      }
    }

    positions.set(position, { starters: columns.length, order })
  }

  return { season: espnResponse?.season?.year ?? null, positions }
}

// Every athlete id on the offensive chart (to look up fantasy ranks).
export function getDepthAthleteIds(parsed) {
  if (!parsed) return []
  return [...parsed.positions.values()].flatMap(({ order }) => order.map(({ id }) => id))
}

// Healthy players keep ESPN's order. Each injured player with a fantasy rank (ADP)
// goes in front of the first healthy player ranked worse (or unranked), best
// rank first. Injured players without a rank stay where ESPN put them, so with
// no ranks at all this returns ESPN's order unchanged.
export function reorderInjured(order, ranks = {}) {
  const rankOf = (id) => ranks[id] ?? Infinity
  const result = order.filter((athlete) => !athlete.injured || !Number.isFinite(rankOf(athlete.id)))
  const ranked = order
    .filter((athlete) => athlete.injured && Number.isFinite(rankOf(athlete.id)))
    .sort((a, b) => rankOf(a.id) - rankOf(b.id))

  for (const athlete of ranked) {
    const index = result.findIndex((other) => !other.injured && rankOf(other.id) > rankOf(athlete.id))
    result.splice(index === -1 ? result.length : index, 0, athlete)
  }

  return result
}

// Output: { [athleteId]: { position, rank, label, starter } }
//   rank    1-based order within the position (WR: top three are starters)
//   label   "QB1", "WR3", "RB2"…
//   starter true for the top spots, one per column of the formation
export function normalizeDepthChart(espnResponse, ranks = {}) {
  const parsed = espnResponse?.positions instanceof Map ? espnResponse : parseOffenseDepth(espnResponse)
  if (!parsed) return {}

  const depth = {}
  for (const [position, { starters, order }] of parsed.positions) {
    reorderInjured(order, ranks).forEach(({ id }, index) => {
      depth[id] = {
        position,
        rank: index + 1,
        label: `${position}${index + 1}`,
        starter: index < starters,
      }
    })
  }

  return depth
}
