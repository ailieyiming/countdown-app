export function SearchBar({ value, onChange }) {
  return (
    <div className="mx-4 my-3 relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search countdowns..."
        className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm"
        >
          ×
        </button>
      )}
    </div>
  )
}
