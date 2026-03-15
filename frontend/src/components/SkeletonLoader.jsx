// components/SkeletonLoader.jsx — Loading skeleton for todo cards
export default function SkeletonLoader({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-strong rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3 pl-3">
            {/* Checkbox placeholder */}
            <div className="mt-0.5 w-5 h-5 rounded-full skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2">
              {/* Title */}
              <div className={`h-4 skeleton rounded ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`} />
              {/* Description */}
              {i % 3 !== 0 && <div className="h-3 skeleton rounded w-full" />}
              {/* Badges */}
              <div className="flex gap-2 mt-1">
                <div className="h-5 w-12 skeleton rounded-full" />
                <div className="h-5 w-16 skeleton rounded-full" />
                {i % 2 === 0 && <div className="h-5 w-14 skeleton rounded-full" />}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
