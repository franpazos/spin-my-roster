// Transform ESPN's team depth chart into a lookup of offensive depth per athlete.
//
// ESPN returns several formations (offense, defense, special teams). The
// offensive one has one column per spot, e.g. qb, rb, te, wr1, wr2, wr3, and
// each column lists athletes from starter to deepest backup.
//
// Output: { [athleteId]: { position, rank, label, starter } }
//   rank    1-based order within the position (WR: wr1 starter = 1, wr2 = 2…)
//   label   "QB1", "WR3", "RB2"…
//   starter true for the first athlete of each column
export function normalizeDepthChart(espnResponse) {
  const formations = espnResponse?.depthchart || []
  const offense = formations.find((formation) => formation?.positions?.qb)
  if (!offense) return {}

  // Group columns by position abbreviation, keeping ESPN's column order.
  const columnsByPosition = new Map()
  for (const [key, column] of Object.entries(offense.positions)) {
    const position = (column?.position?.abbreviation || key.replace(/\d+$/, "")).toUpperCase()
    if (!columnsByPosition.has(position)) columnsByPosition.set(position, [])
    columnsByPosition.get(position).push(column?.athletes || [])
  }

  const depth = {}

  for (const [position, columns] of columnsByPosition) {
    const maxDepth = Math.max(...columns.map((athletes) => athletes.length))
    let rank = 0

    // Walk row by row: all starters first (WR1, WR2, WR3), then the backups.
    for (let row = 0; row < maxDepth; row++) {
      for (const athletes of columns) {
        const id = athletes[row]?.id
        if (!id || depth[id]) continue
        rank += 1
        depth[id] = {
          position,
          rank,
          label: `${position}${rank}`,
          starter: row === 0,
        }
      }
    }
  }

  return depth
}
