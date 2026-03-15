// components/TodoCard.jsx — Single todo item card
import { useState } from 'react'
import { format, isPast, isToday, parseISO } from 'date-fns'

const PRIORITY_CONFIG = {
  high: { label: 'High', dot: 'bg-red-500', badge: 'badge-high' },
  medium: { label: 'Med', dot: 'bg-amber-500', badge: 'badge-medium' },
  low: { label: 'Low', dot: 'bg-emerald-500', badge: 'badge-low' },
}

export default function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const cfg = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.medium

  // Due date formatting and overdue detection
  const dueInfo = (() => {
    if (!todo.due_date) return null
    const date = parseISO(todo.due_date)
    const overdue = !todo.completed && isPast(date) && !isToday(date)
    const todayDue = !todo.completed && isToday(date)
    return {
      label: isToday(date) ? 'Today' : format(date, 'MMM d'),
      overdue,
      todayDue,
    }
  })()

  const handleDelete = () => {
    if (!confirming) { setConfirming(true); return }
    onDelete(todo.id)
  }

  return (
    <div className={`group relative glass-strong rounded-2xl p-4 shadow-sm transition-all duration-300
      hover:shadow-md hover:-translate-y-0.5
      ${todo.completed ? 'opacity-60' : ''}
      animate-slide-in`}
    >
      {/* Priority color bar on left edge */}
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${cfg.dot}`} />

      <div className="pl-3 flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id, !todo.completed)}
          className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full border-2 transition-all duration-200 flex items-center justify-center
            ${todo.completed
              ? 'bg-sky-500 border-sky-500 shadow-sm shadow-sky-500/30'
              : 'border-slate-300 dark:border-slate-600 hover:border-sky-400'}`}
          aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold text-sm leading-snug truncate
              ${todo.completed ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-100'}`}>
              {todo.title}
            </h3>

            {/* Actions (visible on hover) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
              <button
                onClick={() => onEdit(todo)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all"
                aria-label="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button
                onClick={handleDelete}
                onBlur={() => setTimeout(() => setConfirming(false), 200)}
                className={`p-1.5 rounded-lg transition-all ${confirming
                  ? 'text-red-600 bg-red-100 dark:bg-red-900/30'
                  : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                aria-label="Delete"
                title={confirming ? 'Click again to confirm' : 'Delete'}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>

          {/* Description */}
          {todo.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{todo.description}</p>
          )}

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Priority badge */}
            <span className={cfg.badge}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>

            {/* Due date */}
            {dueInfo && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium
                ${dueInfo.overdue
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                  : dueInfo.todayDue
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {dueInfo.overdue ? `Overdue · ${dueInfo.label}` : dueInfo.label}
              </span>
            )}

            {/* Category */}
            {todo.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                #{todo.category}
              </span>
            )}

            {/* Tags */}
            {Array.isArray(todo.tags) && todo.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
