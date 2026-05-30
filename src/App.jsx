import { useState, useCallback } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

import { useCountdowns } from './hooks/useCountdowns.js'
import { useDailyReward } from './hooks/useDailyReward.js'
import { daysUntil } from './utils/dateUtils.js'
import { exportData } from './utils/storage.js'

import { DailyRewardBanner } from './components/DailyRewardBanner.jsx'
import { SearchBar } from './components/SearchBar.jsx'
import { CountdownCard } from './components/CountdownCard.jsx'
import { CountdownForm } from './components/CountdownForm.jsx'
import { EmptyState } from './components/EmptyState.jsx'
import { MilestoneConfetti } from './components/MilestoneConfetti.jsx'

export default function App() {
  const {
    countdowns,
    search,
    setSearch,
    addCountdown,
    updateCountdown,
    deleteCountdown,
    reorderCountdowns
  } = useCountdowns()

  const {
    rewardState,
    showBanner,
    dismissBanner,
    phrase
  } = useDailyReward()

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [milestoneActive, setMilestoneActive] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIndex = countdowns.findIndex(c => c.id === active.id)
    const newIndex = countdowns.findIndex(c => c.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderCountdowns(oldIndex, newIndex)
    }
  }, [countdowns, reorderCountdowns])

  const openAdd = useCallback(() => {
    setEditTarget(null)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((countdown) => {
    setEditTarget(countdown)
    setFormOpen(true)
  }, [])

  const handleSave = useCallback((data) => {
    if (editTarget) {
      updateCountdown(editTarget.id, data)
    } else {
      addCountdown(data)
    }
    // Trigger confetti if today
    if (daysUntil(data.targetDate) === 0) {
      setMilestoneActive(true)
      setTimeout(() => setMilestoneActive(false), 100)
    }
  }, [editTarget, addCountdown, updateCountdown])

  // Split active vs past countdowns
  const active = countdowns.filter(c => (daysUntil(c.targetDate) ?? 1) >= 0)
  const past = countdowns.filter(c => (daysUntil(c.targetDate) ?? 1) < 0)

  const today = new Date()
  const hour = today.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <MilestoneConfetti active={milestoneActive} />

      <div className="mx-auto max-w-[428px] min-h-screen flex flex-col pb-24">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-12 pb-2">
          <div>
            <h1 className="text-white font-semibold text-xl">{greeting} 🐱</h1>
            <p className="text-slate-500 text-xs mt-0.5">
              {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
            className="text-slate-500 hover:text-slate-300 text-xl w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800/50 transition-colors"
          >
            ⚙️
          </button>
        </div>

        {/* Settings dropdown */}
        {showSettings && (
          <div className="mx-4 mb-2 bg-slate-800/80 border border-slate-700/40 rounded-2xl p-4">
            <p className="text-slate-300 text-sm font-medium mb-3">Settings</p>
            <button
              onClick={() => { exportData(); setShowSettings(false) }}
              className="w-full text-left text-slate-300 text-sm py-2 px-3 rounded-xl hover:bg-slate-700/50 flex items-center gap-2"
            >
              <span>💾</span> Export all data (JSON backup)
            </button>
            <div className="mt-2 text-slate-500 text-xs px-3">
              Total earned: <span className="text-indigo-400">${rewardState.totalEarned}</span>
              &nbsp;·&nbsp; Streak: <span className="text-amber-400">🔥 {rewardState.streakCount} days</span>
            </div>
          </div>
        )}

        {/* Daily reward banner */}
        {showBanner && (
          <DailyRewardBanner
            rewardState={rewardState}
            phrase={phrase}
            onDismiss={dismissBanner}
          />
        )}

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Countdown list */}
        {countdowns.length === 0 ? (
          <EmptyState hasSearch={!!search.trim()} onAdd={openAdd} />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={active.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {active.map(countdown => (
                <CountdownCard
                  key={countdown.id}
                  countdown={countdown}
                  onEdit={openEdit}
                  onDelete={deleteCountdown}
                  isPast={false}
                />
              ))}
            </SortableContext>

            {past.length > 0 && (
              <>
                <div className="mx-4 mb-2 mt-2">
                  <div className="text-slate-600 text-xs font-medium uppercase tracking-wider">
                    Past events
                  </div>
                </div>
                <SortableContext
                  items={past.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {past.map(countdown => (
                    <CountdownCard
                      key={countdown.id}
                      countdown={countdown}
                      onEdit={openEdit}
                      onDelete={deleteCountdown}
                      isPast={true}
                    />
                  ))}
                </SortableContext>
              </>
            )}
          </DndContext>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={openAdd}
        aria-label="Add new countdown"
        className="fixed bottom-8 right-1/2 translate-x-1/2 sm:right-8 sm:translate-x-0 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white w-14 h-14 rounded-full text-2xl shadow-lg shadow-indigo-900/50 flex items-center justify-center transition-all"
      >
        +
      </button>

      {/* Form modal */}
      {formOpen && (
        <CountdownForm
          initial={editTarget}
          onSave={handleSave}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  )
}
