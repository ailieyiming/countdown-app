import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDailyReward } from './useDailyReward.js'
import { saveRewardState, DEFAULT_REWARD_STATE } from '../utils/storage.js'

beforeEach(() => {
  localStorage.clear()
})

describe('useDailyReward', () => {
  it('awards $1 and shows banner on first ever open', () => {
    const { result } = renderHook(() => useDailyReward())
    expect(result.current.earnedToday).toBe(true)
    expect(result.current.showBanner).toBe(true)
    expect(result.current.rewardState.totalEarned).toBe(1)
    expect(result.current.rewardState.streakCount).toBe(1)
  })

  it('does not award again on same-day second open', () => {
    // Simulate first open
    const today = new Date().toDateString()
    saveRewardState({
      ...DEFAULT_REWARD_STATE,
      totalEarned: 1,
      streakCount: 1,
      lastOpenDate: today,
      lastStreakDate: today
    })

    const { result } = renderHook(() => useDailyReward())
    expect(result.current.earnedToday).toBe(false)
    expect(result.current.showBanner).toBe(false)
    expect(result.current.rewardState.totalEarned).toBe(1)
  })

  it('increments streak on consecutive days', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    saveRewardState({
      ...DEFAULT_REWARD_STATE,
      totalEarned: 5,
      streakCount: 5,
      lastOpenDate: yesterday.toDateString(),
      lastStreakDate: yesterday.toDateString()
    })

    const { result } = renderHook(() => useDailyReward())
    expect(result.current.rewardState.streakCount).toBe(6)
    expect(result.current.rewardState.totalEarned).toBe(6)
  })

  it('resets streak after missing a day', () => {
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    saveRewardState({
      ...DEFAULT_REWARD_STATE,
      totalEarned: 10,
      streakCount: 10,
      lastOpenDate: twoDaysAgo.toDateString(),
      lastStreakDate: twoDaysAgo.toDateString()
    })

    const { result } = renderHook(() => useDailyReward())
    expect(result.current.rewardState.streakCount).toBe(1)
    expect(result.current.rewardState.totalEarned).toBe(11)
  })

  it('dismissBanner hides the banner', () => {
    const { result } = renderHook(() => useDailyReward())
    expect(result.current.showBanner).toBe(true)
    act(() => result.current.dismissBanner())
    expect(result.current.showBanner).toBe(false)
  })
})
