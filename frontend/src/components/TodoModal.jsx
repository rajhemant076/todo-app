// components/TodoModal.jsx — Create / Edit todo modal
import { useState, useEffect, useRef } from 'react'

const DEFAULTS = {
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
  category: '',
  tags: '',
}

export default function TodoModal({ todo, onSave, onClose }) {
  const [form, setForm] = useState(DEFAULTS)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const firstInputRef = useRef(null)
  const isEdit = Boolean(todo)

  // Populate form when editing
  useEffect(() => {
    if (todo) {
      setForm({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'medium',
        due_date: todo.due_date || '',
        category: todo.category || '',
        tags: Array.isArray(todo.tags) ? todo.tags.join(', ') : '',
      })
    }
    // Auto-focus first input
    setTimeout(() => firstInputRef.current?.focus(), 50)
  }, [todo])

  // Close on Escape key
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        priority: form.priority,
        due_date: form.due_date || null,
        category: form.category.trim() || null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      }
      await onSave(payload)
      onClose()
    } catch {
      // Error handled by hook
    } finally {
      setLoading(false)
    }
  }

  const handle = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-strong w-full max-w-lg rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <h2 className="font-bold text-lg text-slate-800 dark:text-white">
            {isEdit ? 'Edit task' : 'New task'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={form.title}
              onChange={handle('title')}
              placeholder="What needs to be done?"
              className={`input-base ${errors.title ? 'border-red-400 focus:ring-red-400/40 focus:border-red-400' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={handle('description')}
              placeholder="Optional details…"
              rows={2}
              className="input-base resize-none"
            />
          </div>

          {/* Priority + Due date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
              <select value={form.priority} onChange={handle('priority')} className="input-base cursor-pointer">
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={handle('due_date')}
                min={new Date().toISOString().split('T')[0]}
                className="input-base cursor-pointer"
              />
            </div>
          </div>

          {/* Category + Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={handle('category')}
                placeholder="e.g. work, personal"
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tags <span className="text-slate-400 font-normal">(comma-separated)</span></label>
              <input
                type="text"
                value={form.tags}
                onChange={handle('tags')}
                placeholder="design, urgent"
                className="input-base"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-slate-200 dark:border-slate-700">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Saving…
                </span>
              ) : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
