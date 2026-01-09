import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Get random item from array
export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

// Get random team ID
export function getRandomTeamId(teamIds) {
  return getRandomItem(teamIds)
}

// Shuffle array (Fisher-Yates)
export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Format player name (first initial + last name)
export function formatPlayerName(fullName) {
  if (!fullName) return ""
  const parts = fullName.trim().split(" ")
  if (parts.length === 1) return parts[0]
  const firstName = parts[0]
  const lastName = parts.slice(1).join(" ")
  return `${firstName.charAt(0)}. ${lastName}`
}
