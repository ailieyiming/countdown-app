import { describe, it, expect, beforeEach } from 'vitest'
import { getCountdowns, saveCountdowns, getRewardState, saveRewardState, DEFAULT_REWARD_STATE } from './storage.js'

beforeEach(() => {
  localStorage.clear()
})

describe('getCountdowns', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(getCountdowns()).toEqual([])
  })

  it('returns empty array when localStorage has corrupted JSON', () => {
    localStorage.setItem('countdowns', 'not-valid-json{{{')
    expect(getCountdowns()).toEqual([])
  })

  it('returns empty array when localStorage has null', () => {
    localStorage.setItem('countdowns', 'null')
    expect(getCountdowns()).toEqual([])
  })

  it('returns saved countdowns', () => {
    const items = [{ id: '1', name: 'Test', rank: 0 }]
    localStorage.setItem('countdowns', JSON.stringify(items))
    expect(getCountdowns()).toEqual(items)
  })
})

describe('saveCountdowns', () => {
  it('persists countdowns to localStorage', () => {
    const items = [{ id: '1', name: 'Trip', rank: 0 }]
    saveCountdowns(items)
    expect(JSON.parse(localStorage.getItem('countdowns'))).toEqual(items)
  })
})

describe('getRewardState', () => {
  it('returns default state when localStorage is empty', () => {
    expect(getRewardState()).toEqual(DEFAULT_REWARD_STATE)
  })

  it('returns default state when localStorage has corrupted JSON', () => {
    localStorage.setItem('rewardState', '{{invalid')
    expect(getRewardState()).toEqual(DEFAULT_REWARD_STATE)
  })

  it('returns saved reward state', () => {
    const state = { totalEarned: 10, streakCount: 5, lastOpenDate: 'Mon Jan 01 2024', lastStreakDate: 'Mon Jan 01 2024' }
    localStorage.setItem('rewardState', JSON.stringify(state))
    expect(getRewardState()).toEqual(state)
  })
})

describe('saveRewardState', () => {
  it('persists reward state to localStorage', () => {
    const state = { totalEarned: 3, streakCount: 3, lastOpenDate: 'today', lastStreakDate: 'today' }
    saveRewardState(state)
    expect(JSON.parse(localStorage.getItem('rewardState'))).toEqual(state)
  })
})
