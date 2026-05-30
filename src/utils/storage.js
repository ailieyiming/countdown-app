const COUNTDOWNS_KEY = 'countdowns'
const REWARD_KEY = 'rewardState'

export const DEFAULT_REWARD_STATE = {
  totalEarned: 0,
  streakCount: 0,
  lastOpenDate: null,
  lastStreakDate: null
}

export function getCountdowns() {
  try {
    return JSON.parse(localStorage.getItem(COUNTDOWNS_KEY)) ?? []
  } catch {
    return []
  }
}

export function saveCountdowns(countdowns) {
  try {
    localStorage.setItem(COUNTDOWNS_KEY, JSON.stringify(countdowns))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function getRewardState() {
  try {
    return JSON.parse(localStorage.getItem(REWARD_KEY)) ?? DEFAULT_REWARD_STATE
  } catch {
    return DEFAULT_REWARD_STATE
  }
}

export function saveRewardState(state) {
  try {
    localStorage.setItem(REWARD_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function exportData() {
  const data = {
    countdowns: getCountdowns(),
    rewardState: getRewardState(),
    exportedAt: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `countdown-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
