"use client";

export function InquiriesListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-3">
              {/* Badge and product name */}
              <div className="flex items-center gap-2">
                <div className="h-5 bg-gray-200 rounded-full w-12" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>

              {/* Sender name and company */}
              <div className="h-5 bg-gray-200 rounded w-48" />

              {/* Message preview */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>

              {/* Email link and address */}
              <div className="flex items-center gap-4 pt-1">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-40" />
              </div>
            </div>

            {/* Date */}
            <div className="h-4 bg-gray-200 rounded w-24 flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
