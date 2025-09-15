import { useMemo } from 'react'

export default function PageFilters({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle,
  config 
}) {
  const {
    uniqueAgencies = [],
    uniqueDocTypes = [],
    periodSegments = [],
    statusSegments = [],
    requestsByType = []
  } = config

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.selectedAgency) count += 1
    if (filters.selectedStatus) count += 1
    if (filters.selectedPeriod) count += 1
    if (filters.selectedDocTypes && filters.selectedDocTypes.length > 0) count += 1
    if (
      filters.selectedPeriod === 'custom' &&
      (filters.selectedStartDate || filters.selectedEndDate)
    ) {
      count += 1
    }
    return count
  }, [filters])

  function updateFilter(key, value) {
    onFiltersChange({ ...filters, [key]: value })
  }

  function clearAllFilters() {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = Array.isArray(filters[key]) ? [] : ''
      return acc
    }, {})
    onFiltersChange(clearedFilters)
  }

  function toggleType(type) {
    const next = [...filters.selectedDocTypes]
    if (next.includes(type)) {
      next.splice(next.indexOf(type), 1)
    } else {
      next.push(type)
    }
    updateFilter('selectedDocTypes', next)
  }

  function removeFilter(key) {
    updateFilter(key, Array.isArray(filters[key]) ? [] : '')
  }

  return (
    <>
      {/* Filter Toggle Button */}
      <button 
        onClick={onToggle} 
        className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <svg className="h-4 w-4 text-violet-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 6h18v2H3V6zm0 5h12v2H3v-2zm0 5h6v2H3v-2z"/>
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-semibold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="text-sm font-medium text-gray-900">Filters</div>
            <button 
              onClick={clearAllFilters} 
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Reset
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-12">
            {/* Agency/Sector */}
            {uniqueAgencies.length > 0 && (
              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-gray-600">Agency/Sector</label>
                <div className="relative mt-1">
                  <select 
                    value={filters.selectedAgency} 
                    onChange={(e) => updateFilter('selectedAgency', e.target.value)} 
                    className="h-9 w-full rounded-lg border border-gray-200 bg-white/70 pl-2 pr-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All</option>
                    {uniqueAgencies.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Period */}
            {periodSegments.length > 0 && (
              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-gray-600">Period</label>
                <div className="relative mt-1">
                  <select 
                    value={filters.selectedPeriod} 
                    onChange={(e) => updateFilter('selectedPeriod', e.target.value)} 
                    className="h-9 w-full rounded-lg border border-gray-200 bg-white/70 pl-2 pr-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All</option>
                    {periodSegments.map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Status */}
            {statusSegments.length > 0 && (
              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-gray-600">Status</label>
                <div className="relative mt-1">
                  <select 
                    value={filters.selectedStatus} 
                    onChange={(e) => updateFilter('selectedStatus', e.target.value)} 
                    className="h-9 w-full rounded-lg border border-gray-200 bg-white/70 pl-2 pr-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All</option>
                    {statusSegments.map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Custom Date Range */}
            {filters.selectedPeriod === 'custom' && (
              <div className="sm:col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Start date</label>
                  <input 
                    type="date" 
                    value={filters.selectedStartDate} 
                    onChange={(e) => updateFilter('selectedStartDate', e.target.value)} 
                    className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-white/70 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-2 pl-2" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">End date</label>
                  <input 
                    type="date" 
                    value={filters.selectedEndDate} 
                    onChange={(e) => updateFilter('selectedEndDate', e.target.value)} 
                    className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-white/70 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-2 pl-2" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Document Types Section */}
          {requestsByType.length > 0 && (
            <div className="border-t border-gray-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">Document Types</div>
                {filters.selectedDocTypes.length > 0 && (
                  <button 
                    onClick={() => updateFilter('selectedDocTypes', [])} 
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {requestsByType.map((type) => {
                  const active = filters.selectedDocTypes.includes(type.label)
                  return (
                    <button 
                      key={type.label} 
                      onClick={() => toggleType(type.label)} 
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                        active 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{type.label}</span>
                      <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">
                        {type.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Active Filters & Footer */}
          <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {filters.selectedAgency && (
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                  Agency: {filters.selectedAgency}
                  <button 
                    onClick={() => removeFilter('selectedAgency')} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.selectedPeriod && (
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                  Period: {periodSegments.find(p => p[0] === filters.selectedPeriod)?.[1]}
                  <button 
                    onClick={() => removeFilter('selectedPeriod')} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.selectedStatus && (
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                  Status: {statusSegments.find(s => s[0] === filters.selectedStatus)?.[1]}
                  <button 
                    onClick={() => removeFilter('selectedStatus')} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearAllFilters} 
                className="rounded-md px-3 py-2 text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                Clear
              </button>
              <button 
                onClick={onToggle} 
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}