export const doorIds = ['witch', 'iron', 'swan', 'garden', 'crate', 'shop'] as const
export type DoorId = typeof doorIds[number]
export type DoorGame = {
  selected: DoorId | null
  opened: DoorId[]
  feedback: 'idle' | 'selected' | 'need-key' | 'wrong' | 'opened' | 'closed' | 'reset'
  target: DoorId | null
}
export type DoorAction = { type: 'select' | 'unlock' | 'close' | 'open'; id: DoorId } | { type: 'reset' }
export const initialDoorGame: DoorGame = { selected: null, opened: [], feedback: 'idle', target: null }

export function doorGameReducer(state: DoorGame, action: DoorAction): DoorGame {
  if (action.type === 'reset') return { ...initialDoorGame, feedback: 'reset' }
  if (action.type === 'select') return { ...state, selected: action.id, feedback: 'selected', target: null }
  if (action.type === 'close') return { ...state, opened: state.opened.filter(id => id !== action.id), feedback: 'closed', target: action.id }
  // 手机端：点门边的小钥匙，一步直接开门
  if (action.type === 'open') {
    if (state.opened.includes(action.id)) return state
    return { ...state, selected: action.id, opened: [...state.opened, action.id], feedback: 'opened', target: action.id }
  }
  if (state.opened.includes(action.id)) return state
  if (!state.selected) return { ...state, feedback: 'need-key', target: action.id }
  if (state.selected !== action.id) return { ...state, feedback: 'wrong', target: action.id }
  return { ...state, opened: [...state.opened, action.id], feedback: 'opened', target: action.id }
}
