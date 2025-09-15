import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCartRequest } from '../../api'
import KPICard from '../../components/KPICard'
import PageHeader from '../../components/PageHeader'
import { StatsCard } from '../../components'
import { DataTable } from '../../components'
import { CartTableFieldsConfig, CartPageFilters } from '../../config'
import { PageFilter } from '../../components'
import isBetween from 'dayjs/plugin/isBetween'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs'
import { Timeline } from '../../components/Timeline'

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export default function CART() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  // const [selectedIds, setSelectedIds] = useState(new Set())
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [details, setDetails] = useState(null)
  const [uniqueAgencies, setUniqueAgencies] = useState([])
  const [uniqueDocTypes, setUniqueDocTypes] = useState([])
  const [page, setPage] = useState(1)
  const pageSize = 10
  

  const periodSegments = [
    ['today','Today'],
    ['yesterday','Yesterday'],
    ['lastWeek','Last Week'],
    ['lastMonth','Last Month'],
    ['custom','Custom'],
  ]
  const statusSegments = [
    ['In Progress','In Progress'],
    ['Delayed','Delayed']
  ]

  const [filters, setFilters] = useState({
    selectedAgency: '',
    selectedPeriod: '',
    selectedStatus: '',
    selectedStartDate: '',
    selectedEndDate: '',
    selectedDocTypes: [],
  })

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
      // Count custom date range as an additional active filter context
      count += 1
    }
    return count
  }, [filters])

  // Derived unique lists will be populated after fetch

  useEffect(() => {
    getCartRequest().then(requests => {
      setRequests(requests);
      // Populate unique agencies
      const agencies = Array.from(new Set(requests.map(r => r.agency).filter(Boolean))).sort()
      setUniqueAgencies(agencies)
      // unique doc types should have the lable and the count
      const types = Array.from(new Set(requests.map(r => r.type).filter(Boolean))).sort().map(type => ({label: type, count: requests.filter(r => r.type === type).length})) 
      setUniqueDocTypes(types);
    })

  }, [])

  function computePeriodRange() {
    let start = dayjs().startOf('day')
    let end = dayjs().startOf('day')
  
    switch (filters.selectedPeriod) {
      case 'today':
        // start & end remain as today
        break
      case 'yesterday':
        start = start.subtract(1, 'day')
        end = end.subtract(1, 'day')
        break
      case 'lastWeek':
        start = start.subtract(7, 'day')
        break
      case 'lastMonth':
        start = start.subtract(1, 'month')
        break
      case 'custom':
        return [
          dayjs(filters.selectedStartDate, 'DD/MM/YYYY', true).format('DD/MM/YYYY'),
          dayjs(filters.selectedEndDate, 'DD/MM/YYYY', true).format('DD/MM/YYYY')
        ]
    }
  
    return [start.format('DD/MM/YYYY'), end.format('DD/MM/YYYY')]
  }

  const filteredRequests = useMemo(() => {
    const [startStr, endStr] = computePeriodRange()
    const start = dayjs(startStr, 'DD/MM/YYYY', true)
    const end = dayjs(endStr, 'DD/MM/YYYY', true)
  
    return requests.filter((r) => {
      if (filters.selectedAgency && r.agency !== filters.selectedAgency) return false
      if (filters.selectedStatus && r.status !== filters.selectedStatus) return false
  
      if (filters.selectedPeriod && start.isValid() && end.isValid()) {
        const sub = dayjs(r.submissionDate, 'DD/MM/YYYY', true)
        if (!sub.isValid()) return false
        if (!sub.isBetween(start, end, 'day', '[]')) return false
      }
  
      if (filters.selectedDocTypes.length > 0 && !filters.selectedDocTypes.includes(r.type)) return false
      return true
    })
  }, [requests, filters])


  // Reset to first page whenever filters change
  useEffect(() => {
    setPage(1)
  }, [filters])

  const pageCount = useMemo(() => Math.max(1, Math.ceil(filteredRequests.length / pageSize)), [filteredRequests])
  const paginatedRequests = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRequests.slice(start, start + pageSize)
  }, [filteredRequests, page])

  const delayedCount = useMemo(() => filteredRequests.filter(r => r.status === 'Delayed').length, [filteredRequests])

  // const totalActive = useMemo(() => filteredRequests.filter((r) => r.status !== 'Closed').length, [filteredRequests])
  // const delayedRequests = useMemo(() => {
  //   const today = new Date()
  //   return filteredRequests.filter((r) => {
  //     const plan = new Date(r.planningClosureDate)
  //     return plan < today && r.status !== 'Closed'
  //   }).length
  // }, [filteredRequests])

  const requestsByType = useMemo(() => {
    // each time we filter, we need to recompute the requestsByType
    const map = new Map()
    for (const r of filteredRequests) map.set(r.type, (map.get(r.type) || 0) + 1)
    const result = Array.from(map.entries()).map(([label, count]) => ({label, count}))  
    return result
  }, [filteredRequests])

  // const allSelectedOnPage = requests.length > 0 && requests.every((r) => selectedIds.has(r.id))
  // const anySelected = selectedIds.size > 0

  function toggleType(type) {
    const next = [...filters.selectedDocTypes]
    if (next.includes(type)) next.splice(next.indexOf(type), 1)
    else next.push(type)
    setFilters({...filters, selectedDocTypes: next})
  }

  function clearAllFilters() {
    setFilters({
      selectedAgency: '',
      selectedPeriod: '',
      selectedStatus: '',
      selectedStartDate: '',
      selectedEndDate: '',
      selectedDocTypes: [],
    })
  }

  // function exportSelected() {
  //   const rows = [['ID', 'Name', 'Department', 'Type', 'Submission Date', 'Status']]
  //   const selectedRows = filteredRequests.filter((r) => selectedIds.has(r.id))
  //   for (const r of selectedRows) rows.push([r.id, r.name, r.department, r.type, r.submissionDate, r.status])
  //   downloadCsv('cart-selected-requests.csv', rows)
  // }

 

  return (
    <>
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <PageHeader title="CART Dashboard" />
        <div className="flex items-center gap-3">
          {/* Inline filters: Agency & Period */}
          <div className="relative inline-block">
            <select
              id="cartAgencyFilter"
              className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none"
              value={filters.selectedAgency}
              onChange={(e) => setFilters({ ...filters, selectedAgency: e.target.value })}
            >
              <option value="">All Agencies</option>
              {uniqueAgencies.map((a) => (<option key={a} value={a}>{a}</option>))}
            </select>
            <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="relative inline-block">
            <select
              id="cartPeriodFilter"
              className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none"
              value={filters.selectedPeriod}
              onChange={(e) => setFilters({ ...filters, selectedPeriod: e.target.value })}
            >
              <option value="">All Periods</option>
              {periodSegments.map(([val,label]) => (<option key={val} value={val}>{label}</option>))}
            </select>
            <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </div>

          
        </div>
      </div>

      {filters.selectedPeriod === 'custom' && (
        <div className="mt-2 flex items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">From</span>
            <input
              type="date"
              className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none"
              value={(filters.selectedStartDate && filters.selectedStartDate.includes('/')) ? filters.selectedStartDate.split('/').reverse().join('-') : (filters.selectedStartDate || '')}
              onChange={(e) => setFilters({ ...filters, selectedStartDate: e.target.value ? e.target.value.split('-').reverse().join('/') : '' })}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">To</span>
            <input
              type="date"
              className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none"
              value={(filters.selectedEndDate && filters.selectedEndDate.includes('/')) ? filters.selectedEndDate.split('/').reverse().join('-') : (filters.selectedEndDate || '')}
              onChange={(e) => setFilters({ ...filters, selectedEndDate: e.target.value ? e.target.value.split('-').reverse().join('/') : '' })}
            />
          </div>
        </div>
      )}

      {/* Active filters summary */}
      {activeFilterCount > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {filters.selectedAgency && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-gray-900 border border-black">
              <span>Agency: {filters.selectedAgency}</span>
              <button onClick={() => setFilters({ ...filters, selectedAgency: '' })} className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">×</button>
            </span>
          )}
          {filters.selectedStatus && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-gray-900 border border-black">
              <span>Status: {statusSegments.find((s) => s[0] === filters.selectedStatus)?.[1]}</span>
              <button onClick={() => setFilters({ ...filters, selectedStatus: '' })} className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">×</button>
            </span>
          )}
          {filters.selectedPeriod && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-gray-900 border border-black">
              <span>Period: {periodSegments.find((p) => p[0] === filters.selectedPeriod)?.[1]}</span>
              <button onClick={() => setFilters({ ...filters, selectedPeriod: '', selectedStartDate: '', selectedEndDate: '' })} className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">×</button>
            </span>
          )}
          {filters.selectedPeriod === 'custom' && (filters.selectedStartDate || filters.selectedEndDate) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-gray-900 border border-black">
              <span>Date: {filters.selectedStartDate || '—'} to {filters.selectedEndDate || '—'}</span>
              <button onClick={() => setFilters({ ...filters, selectedStartDate: '', selectedEndDate: '' })} className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">×</button>
            </span>
          )}
          {filters.selectedDocTypes && filters.selectedDocTypes.length > 0 && filters.selectedDocTypes.map((docType) => (
            <span key={docType} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-gray-900 border border-black">
              <span>Type: {docType}</span>
              <button onClick={() => setFilters({ ...filters, selectedDocTypes: filters.selectedDocTypes.filter((t) => t !== docType) })} className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">×</button>
            </span>
          ))}
          <button onClick={clearAllFilters} className="ml-1 inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 border border-gray-300">Clear all</button>
        </div>
      )}

      {isFilterOpen && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="text-sm font-medium text-gray-900">Filters</div>
            <button onClick={clearAllFilters} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Reset</button>
          </div>
          <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-12">
            {/* Agency/Sector */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-gray-600">Agency/Sector</label>
              <div className="relative mt-1">
                <select value={filters.selectedAgency} onChange={(e) => setFilters({...filters, selectedAgency: e.target.value})} className="h-9 w-full rounded-lg border border-gray-200 bg-white/70 pl-2 pr-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">All</option>
                  {uniqueAgencies.map((a) => (<option key={a} value={a}>{a}</option>))}
                </select>
              </div>
            </div>

            {/* Period segmented */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-gray-600">Period</label>
              <div className="relative mt-1">
                <select value={filters.selectedPeriod} onChange={(e) => setFilters({...filters, selectedPeriod: e.target.value})} className="h-9 w-full rounded-lg border border-gray-200 bg-white/70 pl-2 pr-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">All</option>
                  {periodSegments.map(([val,label]) => (<option key={val} value={val}>{label}</option>))}
                </select>
              </div>
            </div>

            {/* Status segmented */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-gray-600">Status</label>
              <div className="relative mt-1">
                <select value={filters.selectedStatus} onChange={(e) => setFilters({...filters, selectedStatus: e.target.value})} className="h-9 w-full rounded-lg border border-gray-200 bg-white/70 pl-2 pr-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">All</option>
                  {statusSegments.map(([val,label]) => (<option key={val} value={val}>{label}</option>))}
                </select>
              </div>
            </div>

            {/* Custom range */}
            {filters.selectedPeriod === 'custom' && (
              <div className="sm:col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Start date</label>
                  <input type="date" value={filters.selectedStartDate} onChange={(e) => setFilters({...filters, selectedStartDate: e.target.value})} className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-white/70 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-2 pl-2" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">End date</label>
                  <input type="date" value={filters.selectedEndDate} onChange={(e) => setFilters({...filters, selectedEndDate: e.target.value})} className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-white/70 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-2 pl-2" />
                </div>
              </div>
            )}

           
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {filters.selectedAgency && (<span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-700">Agency: {filters.selectedAgency}<button onClick={() => setFilters({...filters, selectedAgency: ''})} className="text-gray-500 hover:text-gray-700">×</button></span>)}
              {filters.selectedPeriod && (<span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-700">Period: {periodSegments.find(p => p[0] === filters.selectedPeriod)?.[1]}<button onClick={() => setFilters({...filters, selectedPeriod: ''})} className="text-gray-500 hover:text-gray-700">×</button></span>)}
              {filters.selectedStatus && (<span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-700">Status: {statusSegments.find(s => s[0] === filters.selectedStatus)?.[1]}<button onClick={() => setFilters({...filters, selectedStatus: ''})} className="text-gray-500 hover:text-gray-700">×</button></span>)}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearAllFilters} className="rounded-md px-3 py-2 text-xs font-medium text-gray-700 hover:text-gray-900">Clear</button>
              <button onClick={() => setIsFilterOpen(false)} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700">Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
      <section className="mt-6 flex flex-col gap-6">
        <div className="grid grid-cols-8  gap-6 w-full">
            <StatsCard title="Total Requests" value={filteredRequests.length}/>
            <StatsCard
              title="Delayed Requests"
              value={delayedCount}
              classNames={
                delayedCount > 0
                  ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
              }
              onClick={() =>
                setFilters({
                  ...filters,
                  selectedStatus:
                    filters.selectedStatus === 'Delayed' ? '' : 'Delayed',
                })
              }
              selected={filters.selectedStatus === 'Delayed'}
            />



            <div className="rounded-xl border border-gray-200 bg-white p-4 col-span-12 md:col-span-6">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-base font-medium text-gray-900">Requests by Type</div>
                {filters.selectedDocTypes && filters.selectedDocTypes.length > 0 && (
                  <button
                    onClick={() => setFilters({ ...filters, selectedDocTypes: [] })}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {requestsByType.map((type) => {
                  const active = filters.selectedDocTypes.includes(type.label)
                  const count = type.count
                  return (
                    <button key={type.label} onClick={() => toggleType(type.label)} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${active ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>
                      <span>{type.label}</span>
                      <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>  
        </div>
      </section>

      {/* Table header with bulk actions */}
      

      {/* Table */}
      {filteredRequests.length > 0 && (
        <section className="mt-6 flex flex-col gap-6">
          <DataTable data={filteredRequests} fieldsConfig={CartTableFieldsConfig} title="CART Requests" actionTitle="View Details" onAction={(id) => setDetails(filteredRequests.find(r => r.id === id))} />
        </section>
      )}

    

      {/* Details modal */}
      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDetails(null)} />
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Request Details</h3>
              <button onClick={() => setDetails(null)} className="rounded-md p-1 text-gray-500 hover:bg-gray-50">✕</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5 text-sm">
              {/* Heading row: ID and Status */}
              <div className="grid grid-cols-2 items-start gap-4">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Request ID</div>
                  <div className="mt-1 font-medium text-gray-900">{details.id}</div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Status</div>
                  
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${details.status === 'Delayed' ? 'bg-red-50 text-red-700 ring-red-600/20': 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'}`}>{details.status}</span>
                </div>
              </div>

              {/* Request name */}
              <div className="mt-5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Request Name</div>
                <div className="mt-1 text-base font-medium text-gray-900">{details.name}</div>
              </div>

              {/* Department and Type */}
              <div className="mt-5 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Department</div>
                  <div className="mt-1 inline-flex items-center gap-2 text-gray-900">
                    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M3 10l9-7 9 7v7a2 2 0 01-2 2h-3v-6H8v6H5a2 2 0 01-2-2v-7z"/></svg>
                    {details.department}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Request Type</div>
                  <div className="mt-1 inline-flex items-center gap-2 text-gray-900">
                    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h9l5 5v15H6V2z"/><path d="M15 2v5h5"/></svg>
                    {details.type}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Summary</div>
                <div className="mt-2 rounded-lg border border-gray-100 bg-gray-50 p-3 text-gray-800">{details.summary}</div>
              </div>

              {/* Dates row */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Submission Date</div>
                  <div className="mt-1 inline-flex items-center gap-2 text-gray-900">
                    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h2v3H7V2zm8 0h2v3h-2V2z"/><path d="M3 7h18v14H3V7zm4 3h5v5H7v-5z"/></svg>
                    { details.submissionDate}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Due Date</div>
                  <div className="mt-1 inline-flex items-center gap-2 text-gray-900">
                    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h2v3H7V2zm8 0h2v3h-2V2z"/><path d="M3 7h18v14H3V7zm9 4h6v2h-6v-2z"/></svg>
                    { details.planningClosureDate}
                  </div>
                </div>
                <div>
                  {details.status === 'Delayed' && (
                    <>
                    
                    <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Delayed Since</div>
                    <div className="mt-1 inline-flex items-center gap-2 text-gray-900">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8v5l3 2"/><path d="M12 2a10 10 0 110 20 10 10 0 010-20z"/></svg>
                      {details.delay}
                    
                    </div>
                  </>
                  )}
                </div>


              </div>


              <div className="mt-5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Current Stage</div>
                <div className="mt-1 inline-flex items-center gap-2 text-gray-900">
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h6v6H3V3zm0 8h6v6H3v-6zm12-8h6v6h-6V3zm0 8h6v6h-6v-6z"/>
                  <path d="M9 6h3l-1.5 1.5L12 9H9V6zm0 8h3l-1.5 1.5L12 17H9v-3z" stroke="currentColor" strokeWidth="1" fill="none"/>
                </svg>
                  {details.stage}
                </div>
              </div>

              {/* Pending with reviewrs */}

              <div className="mt-5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Pending with Reviewers</div>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  {details.pendingReviewers.map((reviewer) => (
                    <div key={reviewer} className="inline-flex items-center gap-2 text-gray-900">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4a4 4 0 110 8 4 4 0 010-8zM6 20a6 6 0 1112 0v2H6v-2z"/>
                      </svg>
                      <span>{reviewer}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="mt-5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Request Lifecycle</div>
                <div className="mt-3 w-full">
                  <Timeline request={details}/>
                </div>
              </div> */}
              

              {/* Workflow timeline */}
              {/* <div className="mt-8">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Review Workflow</div>
                <div className="mt-3 max-h-72 overflow-y-auto pr-2">
                  <ol className="relative">
                    {details.reviewers.map((rv, idx) => {
                      const isApproved = rv.decision === 'approved'
                      const isRejected = rv.decision === 'rejected'
                      const chip = isApproved
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                        : isRejected
                        ? 'bg-rose-50 text-rose-700 ring-rose-600/20'
                        : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                      const dot = isApproved ? 'bg-emerald-500' : isRejected ? 'bg-rose-500' : 'bg-amber-400'
                      return (
                        <li
                          key={idx}
                          className="relative mb-6 pl-10 before:absolute before:left-4 before:top-0 before:h-full before:w-px before:bg-gray-200"
                        >
                          <span className={`absolute left-4 top-1 -translate-x-1/2 h-3 w-3 rounded-full ring-2 ring-white ${dot}`} />
                          <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                              <div className="font-medium text-gray-900">{rv.role}</div>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ring-1 ring-inset ${chip}`}>
                                {rv.decision || 'pending'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">{rv.decidedAt ? formatDate(rv.decidedAt) : ''}</div>
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              </div> */}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
              <button onClick={() => setDetails(null)} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}