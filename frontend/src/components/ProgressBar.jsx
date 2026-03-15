// components/ProgressBar.jsx — Task completion progress
export default function ProgressBar({ total, completed }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="glass-strong rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-bold text-slate-800 dark:text-white text-lg">Progress</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {completed} of {total} tasks completed
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">
            {percent}%
          </span>
        </div>
      </div>

      {/* Track */}
      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Milestone badges */}
      {total > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {percent === 100 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 font-mono font-medium">
              🎉 All done!
            </span>
          )}
          {percent >= 50 && percent < 100 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400 font-mono font-medium">
              🚀 Over halfway!
            </span>
          )}
          {total - completed > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-mono font-medium">
              {total - completed} remaining
            </span>
          )}
        </div>
      )}
    </div>
  )
}
