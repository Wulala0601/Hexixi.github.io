import test from 'node:test'
import assert from 'node:assert/strict'
import { doorIds, doorGameReducer, initialDoorGame } from '../src/door-game.ts'

test('a door cannot open without a key', () => {
  for (const id of doorIds) {
    const next = doorGameReducer(initialDoorGame, { type: 'unlock', id })
    assert.deepEqual(next.opened, [])
    assert.equal(next.feedback, 'need-key')
  }
})

test('each key opens only its matching door', () => {
  for (const key of doorIds) for (const door of doorIds) {
    const chosen = doorGameReducer(initialDoorGame, { type: 'select', id: key })
    const next = doorGameReducer(chosen, { type: 'unlock', id: door })
    assert.deepEqual(next.opened, key === door ? [door] : [])
    assert.equal(next.feedback, key === door ? 'opened' : 'wrong')
    assert.equal(next.selected, key)
  }
})

test('all worlds can stay open, close independently and reset', () => {
  let state = initialDoorGame
  for (const id of doorIds) {
    state = doorGameReducer(state, { type: 'select', id })
    state = doorGameReducer(state, { type: 'unlock', id })
    state = doorGameReducer(state, { type: 'unlock', id })
  }
  assert.deepEqual(state.opened, doorIds)
  state = doorGameReducer(state, { type: 'close', id: 'iron' })
  assert.deepEqual(state.opened, doorIds.filter((id) => id !== 'iron'))
  state = doorGameReducer(state, { type: 'reset' })
  assert.deepEqual(state.opened, [])
  assert.equal(state.selected, null)
})
