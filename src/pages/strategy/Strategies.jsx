import { PageHeader } from '../../components'
import { StatsCard } from '../../components'
import { DataTable } from '../../components' 
import { StrategiesTableFieldsConfig } from '../../config'
import { getStrategiesProjects } from '../../api'
import { useEffect, useState, useMemo } from 'react'
import { Bar, BubbleChart, Pie } from '../../components'

export default function Strategies() {
    const [data, setData] = useState([])
    const [filters, setFilters] = useState([])


    useEffect(() => {
        // loop through the data and add a new field id with unique number
        getStrategiesProjects().then(data => {
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

    
    
    const agencyOptions = useMemo(() => Array.from(new Set((data || []).map(r => r['agency']).filter(Boolean))), [data])

    const setAgencyFilter = (agencyValue) => {
        setFilters(prev => {
            const without = prev.filter(f => f.key !== 'agency')
            if (!agencyValue) return without
            return [...without, { key: 'agency', value: agencyValue }]
        })
    }

    const activeAgency = useMemo(() => {
        const found = filters.find(f => f.key === 'agency')
        return found ? found.value : ''
    }, [filters])

    const clearAllFilters = () => setFilters([])

    const toggleFilter = (key, value) => {
        if (filters.some(f => f.key === key && f.value === value)) {
            setFilters(filters.filter(f => !(f.key === key && f.value === value)))
        } else {
            setFilters([...filters, { key, value }])
        }
    }

    const setCategoryFilter = (categoryValue) => {
        setFilters(prev => {
            const withoutCategory = prev.filter(f => f.key !== 'category')
            const isActive = prev.some(f => f.key === 'category' && f.value === categoryValue)
            // If already active, deselect; else set exclusively
            if (isActive) return withoutCategory
            return [...withoutCategory, { key: 'category', value: categoryValue }]
        })
    }

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <PageHeader title="Specialized Strategies" />
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
                                onClick={() => toggleFilter(f.key, f.value)}
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
            <section className="mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatsCard title="Total Strategies" value={filteredData.length} />
                    <StatsCard 
                      title="Total Core Business Strategies" 
                      value={filteredData.filter(item => item.category === 'Core Business').length} 
                      onClick={() => setCategoryFilter('Core Business')} 
                      selected={filters.some(f => f.key==='category' && f.value==='Core Business')}
                      className={filters.some(f => f.key==='category' && f.value==='Core Business') ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white' : ''}
                    />
                    <StatsCard 
                      title="Total Support Strategies" 
                      value={filteredData.filter(item => item.category === 'Support').length} 
                      onClick={() => setCategoryFilter('Support')} 
                      selected={filters.some(f => f.key==='category' && f.value==='Support')}
                      className={filters.some(f => f.key==='category' && f.value==='Support') ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white' : ''}
                    />
                </div>
            </section>

            <section className="mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full">
                    {/* <Bar 
                        title="Projects Per Strategy" 
                        subtitle="# of Projects by Strategy" 
                        datakey="name" 
                        data={filteredData.map(item => ({
                            category: item["English Name"],
                            count: item.no_projects
                        }))} 
                        onItemSelected={handleSelectedItem}
                    /> */}

                    <Bar 
                        title="Specialized Strategies by Agency/Sector" 
                        subtitle="# of Specialized Strategies by Agency/Sector" 
                        datakey="agency" 
                        data={filteredData} 
                        onItemSelected={handleSelectedItem}
                    />
                </div>
            </section>

            <section className="mt-6 flex flex-col gap-6">
                <DataTable data={filteredData} fieldsConfig={StrategiesTableFieldsConfig} title="Strategies List" />
            </section>
            
        </>
    )
}