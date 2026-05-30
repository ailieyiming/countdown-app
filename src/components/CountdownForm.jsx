import { useState, useEffect } from 'react'

const PRESET_COLORS = [
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Sky', value: '#0ea5e9' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Teal', value: '#14b8a6' }
]

export function CountdownForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [icon, setIcon] = useState(initial?.icon ?? '⭐')
  const [color, setColor] = useState(initial?.color ?? PRESET_COLORS[0].value)
  const [date, setDate] = useState(initial?.targetDate?.slice(0, 10) ?? '')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (name.length > 60) e.name = 'Name must be 60 characters or fewer'
    if (!date) e.date = 'Date is required'
    return e
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    onSave({
      name: name.trim(),
      icon: icon.trim().slice(0, 10) || '⭐',
      color,
      targetDate: `${date}T00:00:00`
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-40 bg-black/70 flex items-end sm:items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={initial ? 'Edit countdown' : 'New countdown'}
    >
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-base">
            {initial ? 'Edit Countdown' : 'New Countdown'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-white text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Emoji */}
          <div className="mb-4">
            <label className="text-slate-400 text-xs font-medium block mb-1.5">Emoji</label>
            <input
              type="text"
              value={icon}
              onChange={e => setIcon(e.target.value)}
              maxLength={10}
              placeholder="✈️"
              className="w-20 bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-center text-2xl focus:outline-none focus:border-indigo-500/70"
            />
            <p className="text-slate-600 text-xs mt-1">Type or paste any emoji</p>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="countdown-name" className="text-slate-400 text-xs font-medium block mb-1.5">Name</label>
            <input
              id="countdown-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={60}
              placeholder="Trip to Japan"
              className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/70
                ${errors.name ? 'border-rose-500/70' : 'border-slate-700/50'}
              `}
            />
            {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Date */}
          <div className="mb-4">
            <label htmlFor="countdown-date" className="text-slate-400 text-xs font-medium block mb-1.5">Date</label>
            <input
              id="countdown-date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/70
                ${errors.date ? 'border-rose-500/70' : 'border-slate-700/50'}
              `}
            />
            {errors.date && <p className="text-rose-400 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Color */}
          <div className="mb-6">
            <label className="text-slate-400 text-xs font-medium block mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  aria-label={c.label}
                  className={`w-8 h-8 rounded-full transition-transform
                    ${color === c.value ? 'scale-125 ring-2 ring-white/60 ring-offset-1 ring-offset-slate-900' : 'hover:scale-110'}
                  `}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-3 rounded-xl transition-colors"
          >
            {initial ? 'Save Changes' : 'Add Countdown'}
          </button>
        </form>
      </div>
    </div>
  )
}
