export function EmptyState({ hasSearch, onAdd }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <span className="text-4xl mb-3">🔍</span>
        <p className="text-slate-400 text-sm">No countdowns match your search.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <span className="text-5xl mb-4">🗓️</span>
      <h2 className="text-white font-semibold text-lg mb-2">Nothing to count down to yet.</h2>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        Add your first milestone — a trip, a birthday, a deadline.
      </p>
      <button
        onClick={onAdd}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors"
      >
        + Add Countdown
      </button>
    </div>
  )
}
