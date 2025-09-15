import { PageHeader, StatsCard, DataTable } from '../../components'
import { Bar } from '../../components'
import { ProjectsTableFieldsConfig } from '../../config'
import { getProjects, getStrategies } from '../../api'
import { useEffect, useState, useMemo } from 'react'
import { Pie } from '../../components'
import dayjs from 'dayjs'

export default function ProjectsPortfolio() {
    const [data, setData] = useState([])
    const [strategies, setStrategies] = useState([])
    const [projectData, setProjectData] = useState([])
    const [filters, setFilters] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [chartView, setChartView] = useState('years') // 'years' or 'stages'
    const [selectedYear, setSelectedYear] = useState(null)
    const [showCharts, setShowCharts] = useState(false)

    
    useEffect(() => {
        getProjects().then(data => {
            // add id to each project
            setProjectData(data.map((project, index) => ({ ...project, id: index + 1 })))
        })
    }, [])

    const formatDate = (value) => {
        if (!value && value !== 0) return '—'
        const str = String(value).trim()
        if (/^\d+$/.test(str)) {
            const serial = parseInt(str, 10)
            const d = dayjs('1899-12-30').add(serial, 'day')
            return d.isValid() ? d.format('DD MMM YYYY') : str
        }
        const d = dayjs(value)
        return d.isValid() ? d.format('DD MMM YYYY') : str
    }


    const filteredData = useMemo(() => {
        console.log("filters", filters);
        if (filters.length === 0) return projectData
        return projectData.filter(item => {
            return filters.every(filter => {
                const key = filter.key
                const value = filter.value
                if (key === 'status' && value === 'Stage1-9') {
                    return /stage\s*[1-9]\b/i.test(String(item['status'] || ''))
                }
                if (key === 'strategy') {
                    const raw = item.strategies
                    const items = Array.isArray(raw)
                        ? raw
                        : String(raw || '')
                            .split(',')
                            .map(s => s.trim().toLowerCase())
                            .filter(Boolean)
                    return items.includes(String(value).toLowerCase())
                }
                return String(item[key] || '') === String(value)
            })
        })
    }, [projectData, filters])

    console.log("filteredData", filteredData);



    const handleSelectedItem = (item) => {
        if (!item) return
        
        // Handle year chart selection - switch to stages view and set year filter
        if (item.key === 'displayedStartYear') {
            setSelectedYear(item.value)
            setChartView('stages')
            
            // Convert displayedStartYear to actual startYear filter
            let yearValue = item.value
            if (item.value === 'Running') {
                yearValue = 2025 // Convert "Running" to actual year
            }
            
            // Set the year filter which will update the dropdown
            setYearFilter(yearValue.toString())
            return
        }
        
        // Handle stage chart selection - set stage filter
        if (item.key === 'stageName') {
            // Find the full stage name for this short stage name
            const project = filteredData.find(p => p.stageName === item.value)
            const fullStageName = project ? project.fullStageName : item.value
            
            // Toggle stage filter using fullStageName
            const isActive = filters.some(f => f.key === 'fullStageName' && f.value === fullStageName)
            if (isActive) {
                // Remove stage filter
                setFilters(filters.filter(f => !(f.key === 'fullStageName' && f.value === fullStageName)))
            } else {
                // Add stage filter
                setFilters([...filters, { key: 'fullStageName', value: fullStageName }])
            }
            return
        }
        
        // Handle strategies chart selection - set strategy filter
        if (item.key === 'strategies') {
            // Toggle strategy filter
            const isActive = filters.some(f => f.key === 'strategy' && f.value === item.value)
            if (isActive) {
                // Remove strategy filter
                setFilters(filters.filter(f => !(f.key === 'strategy' && f.value === item.value)))
            } else {
                // Add strategy filter
                setFilters([...filters, { key: 'strategy', value: item.value }])
            }
            return
        }
        
        // Handle other filters (original logic)
        if (filters.some(filter => filter.key === item.key && filter.value === item.value)) {
            setFilters(filters.filter(filter => !(filter.key === item.key && filter.value === item.value)))
        } else {
            setFilters([...filters, item])
        }
    }

    const handleViewDetails = (id) => {
        const project = filteredData.find(r => r.id === id)
        setSelectedProject(project)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedProject(null)
    }

    const agencyOptions = useMemo(() => Array.from(new Set((projectData || []).map(r => r['agencySector']).filter(Boolean))), [projectData])

    // Build specialized strategies options from comma-separated lists
    const strategyOptions = useMemo(() => {
        const set = new Set()
        ;(projectData || []).forEach(r => {
            const raw = r.strategies
            const items = Array.isArray(raw)
                ? raw
                : String(raw || '')
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean)
            items.forEach(s => set.add(s))
        })
        return Array.from(set)
    }, [projectData])

    // Build year options from startYear
    const yearOptions = useMemo(() => {
        const years = Array.from(new Set((projectData || [])
            .map(r => r.startYear)
            .filter(year => year && !isNaN(year))
            .map(year => parseInt(year, 10))))
        return years.sort((a, b) => a - b)
    }, [projectData])

    // Build stage options from stageName
    const stageOptions = useMemo(() => {
        return Array.from(new Set((projectData || [])
            .map(r => r.fullStageName)
            .filter(Boolean)))
    }, [projectData])

    const setAgencyFilter = (agencyValue) => {
        setFilters(prev => {
            const without = prev.filter(f => f.key !== 'agencySector')
            if (!agencyValue) return without
            return [...without, { key: 'agencySector', value: agencyValue }]
        })
    }

    const setStrategyFilter = (strategyValue) => {
        setFilters(prev => {
            const without = prev.filter(f => f.key !== 'strategy')
            if (!strategyValue) return without
            return [...without, { key: 'strategy', value: strategyValue }]
        })
    }

    const setYearFilter = (yearValue) => {
        setFilters(prev => {
            const without = prev.filter(f => f.key !== 'startYear')
            if (!yearValue) return without
            return [...without, { key: 'startYear', value: parseInt(yearValue) }]
        })
    }

    const setStageFilter = (stageValue) => {
        setFilters(prev => {
            const without = prev.filter(f => f.key !== 'fullStageName')
            if (!stageValue) return without
            return [...without, { key: 'fullStageName', value: stageValue }]
        })
    }

    const activeAgency = useMemo(() => {
        const found = filters.find(f => f.key === 'agencySector')
        return found ? found.value : ''
    }, [filters])

    const activeStrategy = useMemo(() => {
        const found = filters.find(f => f.key === 'strategy')
        return found ? found.value : ''
    }, [filters])

    const activeYear = useMemo(() => {
        const found = filters.find(f => f.key === 'startYear')
        return found ? found.value : ''
    }, [filters])

    const activeStage = useMemo(() => {
        const found = filters.find(f => f.key === 'fullStageName')
        return found ? found.value : ''
    }, [filters])

    const clearAllFilters = () => {
        setFilters([])
        setChartView('years')
        setSelectedYear(null)
    }

    // Stats cards helpers
    const isFilterActive = (key, value) => filters.some(f => f.key === key && f.value === value)
    const setExclusiveCardFilter = (key, value, keysToClear = []) => {
        setFilters(prev => {
            const isActive = prev.some(f => f.key === key && f.value === value)
            const next = prev.filter(f => f.key !== key && !keysToClear.includes(f.key))
            if (isActive) return next
            return [...next, { key, value }]
        })
    }

    // Calculate year range from project start years
    const yearRange = useMemo(() => {
        if (projectData.length === 0) return ''
        const years = projectData
            .map(p => p.startYear)
            .filter(year => typeof year === 'number' && !isNaN(year))
        
        if (years.length === 0) return ''
        
        const minYear = Math.min(...years)
        const maxYear = Math.max(...years)
        
        return minYear === maxYear ? `${minYear}` : `${minYear} - ${maxYear}`
    }, [projectData])

    // Calculate total budget
    const totalBudget = useMemo(() => {
        return filteredData
            .map(p => parseFloat(p.budget) || 0)
            .reduce((sum, budget) => sum + budget, 0)
    }, [filteredData])

    // Handle return to years view when year filter is removed
    const handleFilterRemove = (filterToRemove) => {
        const newFilters = filters.filter(f => !(f.key === filterToRemove.key && f.value === filterToRemove.value))
        setFilters(newFilters)
        
        // If removing year filter, return to years view
        if (filterToRemove.key === 'startYear') {
            setChartView('years')
            setSelectedYear(null)
        }
    }

    // Get chart data based on current view
    const getChartData = () => {
        if (chartView === 'stages' && selectedYear) {
            // For stages view, use the already filtered data (which includes year filter)
            return filteredData
        }
        
        // Return data with displayedStartYear for years view
        return filteredData.map(project => ({
            ...project,
            displayedStartYear: project.displayedStartYear
        }))
    }

    // Get chart configuration based on current view
    const getChartConfig = () => {
        if (chartView === 'stages' && selectedYear) {
            return {
                title: `Projects by Stages for ${selectedYear})`,
                subtitle: `Number of Projects by Stage for ${selectedYear}`,
                datakey: 'stageName',
                tooltipKey: 'fullStageName'
            }
        }
        
        return {
            title: 'Projects Portfolio Over Years',
            subtitle: 'Number of Projects by Start Year',
            datakey: 'displayedStartYear',
            tooltipKey: null
        }
    }

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <PageHeader title="Technology Projects Portfolio" />
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative inline-block">
                        <select
                            id="strategyFilter"
                            className="appearance-none max-w-[260px] truncate rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none"
                            value={activeStrategy}
                            onChange={(e) => setStrategyFilter(e.target.value)}
                        >
                            <option value="">All Specialized Strategies</option>
                            {strategyOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="relative inline-block">
                        <select
                            id="agencyFilter"
                            className="appearance-none max-w-[200px] truncate rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none"
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
                    <div className="relative inline-block">
                        <select
                            id="yearFilter"
                            className="appearance-none max-w-[150px] truncate rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none"
                            value={activeYear}
                            onChange={(e) => setYearFilter(e.target.value)}
                        >
                            <option value="">All Years</option>
                            {yearOptions.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="relative inline-block">
                        <select
                            id="stageFilter"
                            className="appearance-none max-w-[180px] truncate rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none"
                            value={activeStage}
                            onChange={(e) => setStageFilter(e.target.value)}
                        >
                            <option value="">All Stages</option>
                            {stageOptions.map(stage => (
                                <option key={stage} value={stage}>{stage}</option>
                            ))}
                        </select>
                        <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <button
                        onClick={() => setShowCharts(!showCharts)}
                        className="inline-flex items-center gap-2 rounded-md brand-button px-4 py-2 text-sm font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {showCharts ? 'Hide Analytics' : 'Show Analytics'}
                        <svg 
                            className={`h-4 w-4 transition-transform duration-200 ${showCharts ? 'rotate-180' : 'rotate-0'}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {filters.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {filters.map((f, idx) => {
                        // Map filter keys to user-friendly names
                        const getFilterDisplayName = (key) => {
                            switch(key) {
                                case 'agencySector': return 'Agency/Sector'
                                case 'fullStageName': return 'Stage'
                                case 'startYear': return 'Start Year'
                                case 'strategy': return 'Specialized Strategy'
                                default: return key
                            }
                        }
                        
                        return (
                            <span key={`${f.key}-${f.value}-${idx}`} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-900 border border-black">
                                <span className="max-w-[16rem] truncate">{`${getFilterDisplayName(f.key)}: ${f.value}`}</span>
                                <button
                                    type="button"
                                    className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
                                    aria-label={`Remove filter ${getFilterDisplayName(f.key)}: ${f.value}`}
                                    onClick={() => handleFilterRemove(f)}
                                >
                                    ×
                                </button>
                            </span>
                        )
                    })}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <StatsCard 
                        title="Total Projects" 
                        value={filteredData.length}
                        // subtitle={`All projects in portfolio${yearRange ? ` (${yearRange})` : ''}`}
                    />
                    <StatsCard
                        title="Total Budget"
                        value={
                            <div className="flex items-center">
                                <img src="/images/dirham.svg" alt="AED" className="w-7 h-7 mr-1" />
                                {totalBudget.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </div>
                        }
                        // subtitle="Combined budget of all projects"
                    />
                </div>
            </section>

            <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    showCharts 
                        ? 'max-h-[1000px] opacity-100 mt-6' 
                        : 'max-h-0 opacity-0 mt-0'
                }`}
            >
                <section className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
                        {(() => {
                            const chartConfig = getChartConfig()
                            const chartData = getChartData()
                            
                            return (
                                <div className="relative md:col-span-5">
                                    <Bar 
                                        title={chartConfig.title} 
                                        subtitle={chartConfig.subtitle} 
                                        datakey={chartConfig.datakey} 
                                        data={chartData} 
                                        onItemSelected={handleSelectedItem} 
                                        needToSort={false} 
                                        tooltipKey={chartConfig.tooltipKey}
                                    />
                                    {chartView === 'stages' && (
                                        <button
                                            onClick={() => {
                                                setChartView('years')
                                                setSelectedYear(null)
                                                // Remove year filter by calling setYearFilter with empty value
                                                setYearFilter('')
                                            }}
                                            className="absolute top-4 right-4 bg-white border border-gray-300 rounded-md px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            ← Back
                                        </button>
                                    )}
                                </div>
                            )
                        })()}
                        <div className="md:col-span-7">
                            <Bar 
                                title="Projects by Specialized Strategies" 
                                subtitle="Number of Projects by Specialized Strategy" 
                                datakey="strategies" 
                                data={filteredData} 
                                onItemSelected={handleSelectedItem} 
                                needToSort={true} 
                                activeFilters={filters}
                            />
                        </div>

                    </div>
                </section>
            </div>
          
            {/* Projects Table */}
            <section className="mt-6 flex flex-col gap-6">
                <DataTable 
                    data={filteredData} 
                    fieldsConfig={ProjectsTableFieldsConfig} 
                    title="Projects List"
                    actionTitle="View Details" 
                    onAction={handleViewDetails} 
                />
            </section>

            {/* Project Details Modal */}
            {isModalOpen && selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop that closes on outside click */}
                    <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
                    <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Project Details</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] text-sm">
                            {/* Summary */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                <div>
                                    <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Project Name</div>
                                    <div className="mt-1 text-base font-medium text-gray-900">{selectedProject.projectName || '—'}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Agency/Sector</div>
                                    <div className="mt-1 font-medium text-gray-900">{selectedProject.agencySector || '—'}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Department</div>
                                    <div className="mt-1 font-medium text-gray-900">{selectedProject.department || '—'}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Start Date</div>
                                    <div className="mt-1 font-medium text-gray-900">{formatDate(selectedProject.startDate)}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">End Date</div>
                                    <div className="mt-1 font-medium text-gray-900">{formatDate(selectedProject.endDate)}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Stage</div>
                                    <div className="mt-1 font-medium text-gray-900">{selectedProject.fullStageName || selectedProject.fullStageName || '—'}</div>
                                </div>
                                <div className="sm:col-span-2 md:col-span-3">
                                    <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Strategies</div>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {(() => {
                                            const raw = selectedProject.strategies
                                            const items = Array.isArray(raw)
                                                ? raw
                                                : String(raw || '')
                                                    .split(',')
                                                    .map(s => s.trim())
                                                    .filter(Boolean)
                                            return (items.length > 0 ? items : ['—']).map((s, idx) => (
                                                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{s}</span>
                                            ))
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedProject.projectDescription && (
                                <div className="mt-6">
                                    <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Project Description</div>
                                    <p className="mt-1 leading-6 text-gray-800">{selectedProject.projectDescription}</p>
                                </div>
                            )}
                        </div>
                        {/* Modal Footer with close button (like CART) */}
                        <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
                            <button onClick={closeModal} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Close</button>
                        </div>
                    </div>
                    
                </div>
            )}
        </>
    )
}
