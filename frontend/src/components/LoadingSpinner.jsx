// components/LoadingSpinner.jsx
export default function LoadingSpinner({ fullscreen = false, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  const spinner = (
    <div className={`${sizes[size]} rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-sky-500 animate-spin`} />
  )
  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-950 z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-sm text-slate-500">Loading TaskFlow…</p>
        </div>
      </div>
    )
  }
  return spinner
}
