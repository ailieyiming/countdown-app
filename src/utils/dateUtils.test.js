import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { daysUntil, formatDays, todayString, yesterdayString } from './dateUtils.js'

describe('daysUntil', () => {
  it('returns null for null input', () => {
    expect(daysUntil(null)).toBe(null)
  })

  it('returns null for invalid date string', () => {
    expect(daysUntil('not-a-date')).toBe(null)
  })

  it('returns null for empty string', () => {
    expect(daysUntil('')).toBe(null)
  })

  it('returns 0 for today', () => {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T00:00:00`
    expect(daysUntil(todayStr)).toBe(0)
  })

  it('returns positive number for future date', () => {
    const future = new Date()
    future.setDate(future.getDate() + 5)
    const str = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}T00:00:00`
    expect(daysUntil(str)).toBe(5)
  })

  it('returns negative number for past date', () => {
    const past = new Date()
    past.setDate(past.getDate() - 3)
    const str = `${past.getFullYear()}-${String(past.getMonth() + 1).padStart(2, '0')}-${String(past.getDate()).padStart(2, '0')}T00:00:00`
    expect(daysUntil(str)).toBe(-3)
  })
})

describe('formatDays', () => {
  it('returns TODAY for 0', () => {
    expect(formatDays(0)).toBe('TODAY')
  })

  it('returns singular for 1 day', () => {
    expect(formatDays(1)).toBe('1 day')
  })

  it('returns plural for multiple days', () => {
    expect(formatDays(5)).toBe('5 days')
  })

  it('returns "X days ago" for negative', () => {
    expect(formatDays(-3)).toBe('3 days ago')
  })

  it('returns "1 day ago" for -1', () => {
    expect(formatDays(-1)).toBe('1 day ago')
  })

  it('returns "Invalid date" for null', () => {
    expect(formatDays(null)).toBe('Invalid date')
  })
})

describe('todayString', () => {
  it('returns a non-empty string', () => {
    expect(todayString()).toBeTruthy()
    expect(typeof todayString()).toBe('string')
  })
})

describe('yesterdayString', () => {
  it('is different from today', () => {
    expect(yesterdayString()).not.toBe(todayString())
  })
})
