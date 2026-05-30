// Returns days until targetDate from now.
// Positive = future, 0 = today, negative = past.
// Returns null if targetDate is invalid.
export function daysUntil(targetDate) {
  if (!targetDate) return null
  const target = new Date(targetDate)
  if (isNaN(target.getTime())) return null

  const now = new Date()
  // Compare calendar dates in local timezone (not UTC)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate())

  const diffMs = targetStart - todayStart
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export function formatDays(days) {
  if (days === null) return 'Invalid date'
  if (days === 0) return 'TODAY'
  if (days > 0) return `${days} day${days === 1 ? '' : 's'}`
  const abs = Math.abs(days)
  return `${abs} day${abs === 1 ? '' : 's'} ago`
}

export function todayString() {
  return new Date().toDateString()
}

export function yesterdayString() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toDateString()
}
