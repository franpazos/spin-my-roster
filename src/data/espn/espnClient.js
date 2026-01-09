// Fetch wrapper with error handling for ESPN API
export async function fetchESPN(url) {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour at fetch level
    })

    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch from ESPN: ${url}`, error)
    throw error
  }
}
