// components/FilterBar.jsx — Search, status, and priority filters
import { useState } from 'react'

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Done' },
]

const priorityOptions = [
  { value: '', label: 'Any Priority' },
  { value: 'high', label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '🟢 Low' },
]

export default function FilterBar({ filters, onChange }) {
  const [searchInput, setSearchInput] = useState(filters.search || '')

  // Debounce the search field slightly
  const handleSearch = (e) => {
    const val = e.target.value
    setSearchInput(val)
    clearTimeout(window._searchTimer)
    window._searchTimer = setTimeout(() => onChange({ ...filters, search: val }), 400)
  }

  const setFilter = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="glass-strong rounded-2xl p-4 shadow-sm space-y-3">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearch}
          placeholder="Search tasks…"
          className="input-base pl-10"
        />
        {searchInput && (
          <button
            onClick={() => { setSearchInput(''); setFilter('search', '') }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Status + Priority row */}
      <div className="flex gap-2 flex-wrap">
        {/* Status filter */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter('status', opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filters.status === opt.value
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) => setFilter('priority', e.target.value)}
          className="input-base !w-auto !py-2 text-xs cursor-pointer"
        >
          {priorityOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Clear all filters */}
        {(filters.search || filters.status || filters.priority) && (
          <button
            onClick={() => { setSearchInput(''); onChange({ search: '', status: '', priority: '' }) }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
