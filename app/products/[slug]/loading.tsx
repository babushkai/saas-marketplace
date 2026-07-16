export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-12 bg-gray-100 skeleton rounded" />
        <div className="h-4 w-4 bg-gray-100 skeleton rounded" />
        <div className="h-4 w-20 bg-gray-100 skeleton rounded" />
        <div className="h-4 w-4 bg-gray-100 skeleton rounded" />
        <div className="h-4 w-32 bg-gray-100 skeleton rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero skeleton */}
          <div className="card-elevated overflow-hidden">
            <div className="h-56 bg-gray-100 skeleton" />
            <div className="px-6 py-5 space-y-3">
              <div className="h-7 bg-gray-200 skeleton rounded w-2/3" />
              <div className="h-5 bg-gray-100 skeleton rounded w-full" />
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <div className="h-6 w-16 bg-gray-100 skeleton rounded-full" />
                <div className="h-6 w-24 bg-gray-100 skeleton rounded-full" />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="h-10 bg-gray-200 skeleton rounded-lg w-40" />
            </div>
          </div>

          {/* Quick info skeleton */}
          <div className="card p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 bg-gray-100 skeleton rounded" />
                  <div className="h-5 w-24 bg-gray-200 skeleton rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Description skeleton */}
          <div className="card p-6 sm:p-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 skeleton rounded w-1/3" />
              <div className="h-4 bg-gray-100 skeleton rounded w-full" />
              <div className="h-4 bg-gray-100 skeleton rounded w-5/6" />
              <div className="h-4 bg-gray-100 skeleton rounded w-4/6" />
              <div className="h-4 bg-gray-100 skeleton rounded w-full" />
              <div className="h-4 bg-gray-100 skeleton rounded w-3/4" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Seller skeleton */}
          <div className="card overflow-hidden">
            <div className="h-16 bg-gray-100 skeleton" />
            <div className="px-6 pb-6 pt-10 space-y-3">
              <div className="h-5 bg-gray-200 skeleton rounded w-2/3" />
              <div className="h-4 bg-gray-100 skeleton rounded w-1/2" />
              <div className="h-9 bg-gray-100 skeleton rounded-lg w-full mt-4" />
            </div>
          </div>

          {/* Inquiry form skeleton */}
          <div className="card overflow-hidden">
            <div className="h-16 bg-primary-50 skeleton" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-100 skeleton rounded w-full" />
              <div className="h-10 bg-gray-100 skeleton rounded-lg" />
              <div className="h-10 bg-gray-100 skeleton rounded-lg" />
              <div className="h-24 bg-gray-100 skeleton rounded-lg" />
              <div className="h-10 bg-gray-200 skeleton rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
