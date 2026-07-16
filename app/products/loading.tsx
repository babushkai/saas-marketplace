export default function ProductsListingLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-12 bg-gray-100 skeleton rounded" />
        <div className="h-4 w-4 bg-gray-100 skeleton rounded" />
        <div className="h-4 w-24 bg-gray-100 skeleton rounded" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 skeleton rounded w-48" />
        <div className="h-4 bg-gray-100 skeleton rounded w-72 mt-2" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0 space-y-4">
          <div className="card p-4">
            <div className="h-5 bg-gray-200 skeleton rounded w-24 mb-4" />
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 skeleton rounded-lg" />
              ))}
            </div>
          </div>
          <div className="card p-4">
            <div className="h-5 bg-gray-200 skeleton rounded w-20 mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-gray-100 skeleton rounded" />
                  <div className="h-4 bg-gray-100 skeleton rounded flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1">
          {/* Search bar skeleton */}
          <div className="h-11 bg-gray-100 skeleton rounded-lg mb-4" />

          {/* Toolbar skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-20 bg-gray-100 skeleton rounded-lg" />
            <div className="flex gap-2">
              <div className="h-8 w-32 bg-gray-100 skeleton rounded-lg" />
              <div className="h-8 w-16 bg-gray-100 skeleton rounded-lg" />
            </div>
          </div>

          {/* Product grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="h-40 bg-gray-100 skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 skeleton rounded w-16" />
                  <div className="h-5 bg-gray-200 skeleton rounded w-3/4" />
                  <div className="h-4 bg-gray-100 skeleton rounded w-full" />
                  <div className="pt-3 border-t border-gray-100 flex justify-between">
                    <div className="h-5 bg-gray-100 skeleton rounded w-16" />
                    <div className="h-5 bg-gray-100 skeleton rounded w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
