// pages/DashboardPage.jsx — Main todo management interface
import { useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import ProgressBar from '../components/ProgressBar'
import FilterBar from '../components/FilterBar'
import TodoCard from '../components/TodoCard'
import TodoModal from '../components/TodoModal'
import SkeletonLoader from '../components/SkeletonLoader'
import { useTodos } from '../hooks/useTodos'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState({ search: '', status: '', priority: '' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)

  const { todos, stats, loading, error, createTodo, updateTodo, toggleTodo, deleteTodo } = useTodos(filters)

  // Open modal for creating a new todo
  const openCreate = useCallback(() => {
    setEditingTodo(null)
    setModalOpen(true)
  }, [])

  // Open modal pre-filled for editing
  const openEdit = useCallback((todo) => {
    setEditingTodo(todo)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setEditingTodo(null)
  }, [])

  // Called by modal on submit
  const handleSave = useCallback(async (data) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id, data)
    } else {
      await createTodo(data)
    }
  }, [editingTodo, createTodo, updateTodo])

  // Greeting based on time of day
  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {greeting},{' '}
              <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">
                {user?.name?.split(' ')[0]}
              </span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* New task button */}
          <button onClick={openCreate} className="btn-primary flex-shrink-0 shadow-lg shadow-sky-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:block">New task</span>
          </button>
        </div>

        {/* Progress bar */}
        <ProgressBar total={stats.total} completed={stats.completed} />

        {/* Filters */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* Todo list */}
        <section>
          {loading ? (
            <SkeletonLoader count={5} />
          ) : error ? (
            <div className="glass-strong rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Failed to load tasks</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
            </div>
          ) : todos.length === 0 ? (
            <EmptyState
              hasFilters={!!(filters.search || filters.status || filters.priority)}
              onClear={() => setFilters({ search: '', status: '', priority: '' })}
              onCreate={openCreate}
            />
          ) : (
            <div className="space-y-3">
              {/* Section header with count */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {todos.length} task{todos.length !== 1 ? 's' : ''}
                </span>
              </div>

              {todos.map(todo => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onEdit={openEdit}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating action button for mobile */}
      <button
        onClick={openCreate}
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 rounded-full btn-primary shadow-xl shadow-sky-500/30 text-xl"
        aria-label="Add task"
      >
        +
      </button>

      {/* Modal */}
      {modalOpen && (
        <TodoModal
          todo={editingTodo}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

// ─── Empty state sub-component ───────────────────────────────────────────────
function EmptyState({ hasFilters, onClear, onCreate }) {
  if (hasFilters) {
    return (
      <div className="glass-strong rounded-2xl p-10 text-center animate-fade-in">
        <div className="text-4xl mb-3">🔍</div>
        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">No tasks match your filters</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Try adjusting or clearing your search filters</p>
        <button onClick={onClear} className="btn-ghost border border-slate-200 dark:border-slate-700">
          Clear filters
        </button>
      </div>
    )
  }
  return (
    <div className="glass-strong rounded-2xl p-10 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 dark:from-sky-900/30 dark:to-violet-900/30 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p className="font-bold text-slate-800 dark:text-white text-lg mb-1">Your task list is empty</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Create your first task to get started</p>
      <button onClick={onCreate} className="btn-primary">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Create first task
      </button>
    </div>
  )
}
