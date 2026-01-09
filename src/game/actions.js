// Action types
export const ACTIONS = {
  SPIN: "SPIN",
  SET_CURRENT_TEAM: "SET_CURRENT_TEAM",
  SELECT_POSITION: "SELECT_POSITION",
  COMMIT_SELECTION: "COMMIT_SELECTION",
  GO_BACK: "GO_BACK",
  UNDO: "UNDO",
  RESET: "RESET",
  LOAD_STATE: "LOAD_STATE",
}

// Action creators
export function spin() {
  return { type: ACTIONS.SPIN }
}

export function setCurrentTeam(team) {
  return { type: ACTIONS.SET_CURRENT_TEAM, payload: { team } }
}

export function selectPosition(slotKey) {
  return { type: ACTIONS.SELECT_POSITION, payload: { slotKey } }
}

export function commitSelection(player) {
  return { type: ACTIONS.COMMIT_SELECTION, payload: { player } }
}

export function goBack() {
  return { type: ACTIONS.GO_BACK }
}

export function undo() {
  return { type: ACTIONS.UNDO }
}

export function reset() {
  return { type: ACTIONS.RESET }
}

export function loadState(savedState) {
  return { type: ACTIONS.LOAD_STATE, payload: savedState }
}
