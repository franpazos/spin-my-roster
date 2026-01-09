// Simple in-memory cache with TTL
const cache = new Map()

// TTL constants in milliseconds
export const CACHE_TTL = {
  TEAMS: 24 * 60 * 60 * 1000, // 24 hours
  ROSTER: 7 * 24 * 60 * 60 * 1000, // 7 days
  COACHES: 24 * 60 * 60 * 1000, // 24 hours
}

export function getFromCache(key) {
  const item = cache.get(key)
  if (!item) return null

  if (Date.now() > item.expiry) {
    cache.delete(key)
    return null
  }

  return item.data
}

export function setInCache(key, data, ttl) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl,
  })
}

export function clearCache() {
  cache.clear()
}
