import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { daysUntil, formatDays } from '../utils/dateUtils.js'

const PAST_THRESHOLD = -1

export function CountdownCard({ countdown, onEdit, onDelete, isPast }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: countdown.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const days = daysUntil(countdown.targetDate)
  const label = formatDays(days)
  const isToday = days === 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mx-4 mb-3 rounded-2xl border flex items-center gap-3 px-4 py-3 select-none
        ${isPast
          ? 'bg-slate-800/30 border-slate-700/30'
          : 'bg-slate-800/60 border-slate-700/40'
        }
        ${isToday ? 'ring-1 ring-indigo-500/50 bg-indigo-950/50' : ''}
        ${isDragging ? 'shadow-lg shadow-black/50' : ''}
      `}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing touch-none text-lg leading-none min-w-[28px] min-h-[44px] flex items-center justify-center"
      >
        ⠿
      </button>

      {/* Icon with color dot */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: countdown.color + '33', borderColor: countdown.color + '66', borderWidth: 1 }}
        aria-label={`${countdown.icon} icon`}
      >
        <span aria-hidden="true">{countdown.icon}</span>
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-sm truncate ${isPast ? 'text-slate-400' : 'text-slate-100'}`}>
          {countdown.name}
        </div>
        {countdown.targetDate && (
          <div className="text-slate-500 text-xs mt-0.5">
            {new Date(countdown.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>

      {/* Days */}
      <div className="text-right flex-shrink-0">
        <div className={`font-bold text-lg tabular-nums leading-tight
          ${isToday ? 'text-indigo-300' : isPast ? 'text-slate-500' : 'text-white'}
        `}>
          {isToday ? '🎉' : days !== null ? (isPast ? Math.abs(days) : days) : '?'}
        </div>
        <div className={`text-xs leading-tight ${isPast ? 'text-slate-600' : 'text-slate-400'}`}>
          {isToday ? 'TODAY' : isPast ? 'days ago' : 'days'}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 flex-shrink-0 ml-1">
        <button
          onClick={() => onEdit(countdown)}
          aria-label={`Edit ${countdown.name}`}
          className="text-slate-500 hover:text-slate-300 text-sm min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(countdown.id)}
          aria-label={`Delete ${countdown.name}`}
          className="text-slate-600 hover:text-rose-400 text-sm min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-rose-900/20 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
