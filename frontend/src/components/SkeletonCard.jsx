/**
 * Reusable skeleton shimmer primitives for loading states.
 */

function Shimmer({ className = "" }) {
  return (
    <div
      className={`rounded-lg bg-(--chip-bg) animate-pulse ${className}`}
    />
  );
}

/** Full-page skeleton that mirrors the Dashboard layout */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Shimmer className="h-8 w-48" />
          <Shimmer className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Shimmer className="h-10 w-32 rounded-xl" />
          <Shimmer className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-4 flex items-center gap-3">
            <Shimmer className="w-10 h-10 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Shimmer className="h-3 w-20" />
              <Shimmer className="h-6 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Habit list card */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Shimmer className="h-4 w-28" />
            <Shimmer className="h-3 w-20" />
          </div>
          <Shimmer className="w-12 h-12 rounded-full" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-4 flex items-center gap-4">
            <Shimmer className="w-11 h-11 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-4 w-40" />
              <Shimmer className="h-3 w-24" />
            </div>
            <Shimmer className="w-11 h-11 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Generic list skeleton */
export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2 animate-fade-in">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card p-4 flex items-center gap-4">
          <Shimmer className="w-11 h-11 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-4 w-48" />
            <Shimmer className="h-3 w-32" />
          </div>
          <Shimmer className="h-4 w-16 hidden sm:block" />
          <div className="flex gap-1">
            <Shimmer className="w-8 h-8 rounded-xl" />
            <Shimmer className="w-8 h-8 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Stats page skeleton */
export function StatsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Shimmer className="h-8 w-36" />
        <Shimmer className="h-4 w-52" />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <Shimmer className="h-3 w-24" />
            <div className="flex items-center gap-3">
              <Shimmer className="w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <Shimmer className="h-4 w-28" />
                <Shimmer className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <Shimmer className="h-4 w-40 mb-4" />
          <Shimmer className="h-48 w-full rounded-xl" />
        </div>
        <div className="card p-5">
          <Shimmer className="h-4 w-40 mb-4" />
          <Shimmer className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
