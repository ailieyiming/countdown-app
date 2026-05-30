import { useState, useEffect } from 'react'
import { getRewardState, saveRewardState, DEFAULT_REWARD_STATE } from '../utils/storage.js'
import { todayString, yesterdayString } from '../utils/dateUtils.js'
import { getDailyPhrase } from '../utils/phrases.js'

export function useDailyReward() {
  const [rewardState, setRewardState] = useState(() => getRewardState())
  const [showBanner, setShowBanner] = useState(false)
  const [earnedToday, setEarnedToday] = useState(false)

  useEffect(() => {
    const today = todayString()
    const yesterday = yesterdayString()
    const state = getRewardState()

    if (state.lastOpenDate !== today) {
      // New day — award $1
      const newStreak = state.lastStreakDate === yesterday
        ? (state.streakCount || 0) + 1
        : 1

      const updated = {
        ...state,
        totalEarned: (state.totalEarned || 0) + 1,
        streakCount: newStreak,
        lastOpenDate: today,
        lastStreakDate: today
      }

      saveRewardState(updated)
      setRewardState(updated)
      setEarnedToday(true)
      setShowBanner(true)
    }
  }, [])

  const dismissBanner = () => setShowBanner(false)

  return {
    rewardState,
    showBanner,
    earnedToday,
    dismissBanner,
    phrase: getDailyPhrase()
  }
}
