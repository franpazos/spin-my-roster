import { ACTIONS } from "./actions"
import { createEmptyRoster } from "./rosterFormat"

// Game phases
export const PHASES = {
  IDLE: "IDLE", // Initial state, waiting to spin
  SPINNING: "SPINNING", // Reel is spinning
  CHOOSE_POSITION: "CHOOSE_POSITION", // Choose which position to fill
  CHOOSE_PLAYER: "CHOOSE_PLAYER", // Choose player for selected position
  COMPLETE: "COMPLETE", // Roster is full
}

// Initial state
export function createInitialState() {
  return {
    roster: createEmptyRoster(),
    currentTeam: null,
    phase: PHASES.IDLE,
    selectedSlot: null,
    // history: [], // history might not be needed if using stagedPick
    usedPlayerIds: new Set(),
    stagedPick: null, // Added stagedPick to track the currently selected player before committing
  }
}

// Reducer
export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SPIN: {
      // If there is a staged pick, use it to fill the current slot
      let roster = state.roster
      let usedPlayerIds = state.usedPlayerIds
      let stagedPick = state.stagedPick

      if (stagedPick) {
        // If there is a staged pick, use it to fill the current slot
        const { slotKey, player } = stagedPick

        // Commit into roster
        roster = {
          ...roster,
          [slotKey]: player,
        }

        // Update used players
        const newUsed = new Set(usedPlayerIds)
        if (player?.id) {
          newUsed.add(player.id)
        }
        usedPlayerIds = newUsed

        // Clear staged pick
        stagedPick = null
      }

      // If roster is complete, set phase to COMPLETE
      const isComplete = Object.values(roster).every((slot) => slot !== null)
      if (isComplete) {
        return {
          ...state,
          roster,
          usedPlayerIds,
          stagedPick,
          currentTeam: null,
          selectedSlot: null,
          phase: PHASES.COMPLETE,
        }
      }

      return {
        ...state,
        roster,
        usedPlayerIds,
        stagedPick,
        phase: PHASES.SPINNING,
        currentTeam: null,
        selectedSlot: null,
      }
   }

    case ACTIONS.SET_CURRENT_TEAM: {
      return {
        ...state,
        currentTeam: action.payload.team,
        phase: PHASES.CHOOSE_POSITION,
      }
    }

    case ACTIONS.SELECT_POSITION: {
      return {
        ...state,
        selectedSlot: action.payload.slotKey,
        phase: PHASES.CHOOSE_PLAYER,
      }
    }

    case ACTIONS.COMMIT_SELECTION: {
      const { player } = action.payload
      const slotKey = state.selectedSlot // slotKey is the key of the slot that was selected

      return {
        ...state,
        stagedPick: {
          slotKey,
          player: {
            ...player,
            team: state.currentTeam,
          },
        },

        // keep currentTeam so user cannot skip it unless they stage something 
        currentTeam: state.currentTeam,
        selectedSlot: null,
        phase: PHASES.IDLE,
      }
    }

    case ACTIONS.GO_BACK: {
      if (state.phase === PHASES.CHOOSE_PLAYER) {
        return {
          ...state,
          selectedSlot: null,
          phase: PHASES.CHOOSE_POSITION,
        }
      }
      return state
    }

    case ACTIONS.UNDO: {
      if (!state.stagedPick) return state
      return {
        ...state,
        stagedPick: null,
        selectedSlot: null,
        phase: PHASES.CHOOSE_POSITION,
        // keep currentTeam as-is
      }
    }


    case ACTIONS.RESET: {
      return createInitialState()
    }

    case ACTIONS.LOAD_STATE: {
      return {
        ...action.payload,
        usedPlayerIds: new Set(action.payload.usedPlayerIds || []),
      }
    }

    default:
      return state
  }
}
