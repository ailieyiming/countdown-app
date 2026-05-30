export function DailyRewardBanner({ rewardState, phrase, onDismiss }) {
  return (
    <div className="mx-4 mt-4 mb-2 rounded-2xl bg-gradient-to-r from-indigo-900/80 to-violet-900/80 border border-indigo-700/50 p-4 relative">
      <button
        onClick={onDismiss}
        aria-label="Dismiss reward banner"
        className="absolute top-3 right-3 text-slate-400 hover:text-white text-lg leading-none"
      >
        ×
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🎉</span>
        <div>
          <div className="text-white font-semibold text-sm">
            +$1 earned today &nbsp;·&nbsp; <span className="text-indigo-300">${rewardState.totalEarned} total</span>
          </div>
          <div className="text-slate-300 text-xs">
            🔥 {rewardState.streakCount} day streak
          </div>
        </div>
      </div>

      <p className="text-slate-300 text-sm italic leading-snug">&ldquo;{phrase}&rdquo;</p>
    </div>
  )
}
