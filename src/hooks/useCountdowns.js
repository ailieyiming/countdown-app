import { useState, useCallback, useMemo } from 'react'
import { getCountdowns, saveCountdowns } from '../utils/storage.js'
import { arrayMove } from '@dnd-kit/sortable'

export function useCountdowns() {
  const [countdowns, setCountdowns] = useState(() => getCountdowns())
  const [search, setSearch] = useState('')

  const save = useCallback((updated) => {
    setCountdowns(updated)
    saveCountdowns(updated)
  }, [])

  const addCountdown = useCallback((item) => {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      rank: countdowns.length,
      createdAt: new Date().toISOString()
    }
    save([...countdowns, newItem])
  }, [countdowns, save])

  const updateCountdown = useCallback((id, updates) => {
    save(countdowns.map(c => c.id === id ? { ...c, ...updates } : c))
  }, [countdowns, save])

  const deleteCountdown = useCallback((id) => {
    const updated = countdowns
      .filter(c => c.id !== id)
      .map((c, i) => ({ ...c, rank: i }))
    save(updated)
  }, [countdowns, save])

  const reorderCountdowns = useCallback((oldIndex, newIndex) => {
    const reordered = arrayMove(countdowns, oldIndex, newIndex)
      .map((c, i) => ({ ...c, rank: i }))
    save(reordered)
  }, [countdowns, save])

  const filtered = useMemo(() => {
    const sorted = [...countdowns].sort((a, b) => a.rank - b.rank)
    if (!search.trim()) return sorted
    const q = search.toLowerCase()
    return sorted.filter(c => c.name.toLowerCase().includes(q))
  }, [countdowns, search])

  return {
    countdowns: filtered,
    search,
    setSearch,
    addCountdown,
    updateCountdown,
    deleteCountdown,
    reorderCountdowns
  }
}
