import { PageHeader, StatsCard, DataTable } from '../../components'
import { Bar } from '../../components'
import { ServicesTableFieldsConfig } from '../../config'
import { getServices } from '../../api'
import { useEffect, useState, useMemo } from 'react'

export default function Services() {
    const [data, setData] = useState([])
    const [filters, setFilters] = useState([])

    useEffect(() => {
        // Add unique id to each service
        getServices().then(data => {
            setData(data.map((item, index) => ({ ...item, id: index + 1 })))
        })
    }, [])

    const filteredData = useMemo(() => {
        // if filters is empty, return all data
        if (filters.length === 0) return data
        return data.filter(item => filters.some(filter => filter.key === filter.key && filter.value === item[filter.key]))
    }, [data, filters])

    const handleSelectedItem = (item) => {
        console.log(item);
        // if item is already in filters, remove it
        if (filters.some(filter => filter.key === item.key && filter.value === item.value)) {
            setFilters(filters.filter(filter => filter.key !== item.key && filter.value !== item.value))
        } else {
            setFilters([...filters, item])
        }
    }

    const agencyOptions = useMemo(() => Array.from(new Set((data || []).map(r => r['Agency']).filter(Boolean))), [data])

    const setAgencyFilter = (agencyValue) => {
        setFilters(prev => {
            const without = prev.filter(f => f.key !== 'Agency')
            if (!agencyValue) return without
            return [...without, { key: 'Agency', value: agencyValue }]
        })
    }

    const activeAgency = useMemo(() => {
        const found = filters.find(f => f.key === 'Agency')
        return found ? found.value : ''
    }, [filters])

    const clearAllFilters = () => setFilters([])

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <PageHeader title="Business Services" />
                <div className="flex items-center gap-3">
                    <div className="relative inline-block">
                        <select
                            id="agencyFilter"
                            className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none"
                            value={activeAgency}
                            onChange={(e) => setAgencyFilter(e.target.value)}
                        >
                            <option value="">All Agencies</option>
                            {agencyOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            {filters.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {filters.map((f, idx) => (
                        <span key={`${f.key}-${f.value}-${idx}`} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-900 border border-black">
                            <span className="max-w-[16rem] truncate">{`${f.key}: ${f.value}`}</span>
                            <button
                                type="button"
                                className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
                                aria-label={`Remove filter ${f.key}: ${f.value}`}
                                onClick={() => setFilters(filters.filter(x => !(x.key === f.key && x.value === f.value)))}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <button
                        type="button"
                        className="ml-1 inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                        onClick={clearAllFilters}
                    >
                        Clear all
                    </button>
                </div>
            )}
            
            {/* Stats Cards */}
            <section className="mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatsCard title="Total Services" value={data.length} />
                </div>
            </section>

            {/* Chart Section */}
            <section className="mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full">
                    <Bar 
                        title="Services by Agency" 
                        subtitle="# of Services by Agency & Sector" 
                        datakey="Agency" 
                        data={filteredData} 
                        onItemSelected={handleSelectedItem} 
                    />
                </div>
            </section>

            {/* Data Table */}
            <section className="mt-6 flex flex-col gap-6">
                <DataTable 
                    data={filteredData} 
                    fieldsConfig={ServicesTableFieldsConfig} 
                    title="Services List" 
                />
            </section>
        </>
    )
}
