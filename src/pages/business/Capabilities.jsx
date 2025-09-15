import { PageHeader, StatsCard } from '../../components'
import { getCapabilities } from '../../api'
import { useEffect, useState, useMemo, useRef } from 'react'

export default function Capabilities() {
    const [data, setData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedDomains, setExpandedDomains] = useState({})
    const coreColumnRef = useRef(null)
    const [coreColumnHeight, setCoreColumnHeight] = useState(0)

    useEffect(() => {
        getCapabilities().then(data => {
            setData(data)
            // Set all domains to expanded by default
            const domains = {}
            data.forEach(item => {
                const domain = item.domain || item.Domain || 'Uncategorized'
                domains[domain] = true
            })
            setExpandedDomains(domains)
        })
    }, [])

    // Observe left/core column height and sync to strategic column
    useEffect(() => {
        if (!coreColumnRef.current) return
        const element = coreColumnRef.current
        const update = () => setCoreColumnHeight(element.getBoundingClientRect().height)
        const ro = new ResizeObserver(() => update())
        ro.observe(element)
        update()
        window.addEventListener('resize', update)
        return () => {
            ro.disconnect()
            window.removeEventListener('resize', update)
        }
    }, [])

    // Group capabilities by domain
    const groupedCapabilities = useMemo(() => {
        const grouped = {}
        data.forEach(item => {
            const domain = item.domain || item.Domain || 'Uncategorized'
            const capability = item.capabilities || item.Capabilities || item.capability || item.Capability || 'Unnamed Capability'
            
            if (!grouped[domain]) {
                grouped[domain] = []
            }
            grouped[domain].push({
                ...item,
                capability: capability,
                domain: domain
            })
        })
        return grouped
    }, [data])

    // Filter capabilities based on search term
    const filteredGroupedCapabilities = useMemo(() => {
        if (!searchTerm) return groupedCapabilities
        
        const filtered = {}
        Object.keys(groupedCapabilities).forEach(domain => {
            const filteredCapabilities = groupedCapabilities[domain].filter(cap =>
                cap.capability.toLowerCase().includes(searchTerm.toLowerCase()) ||
                domain.toLowerCase().includes(searchTerm.toLowerCase())
            )
            if (filteredCapabilities.length > 0) {
                filtered[domain] = filteredCapabilities
            }
        })
        return filtered
    }, [groupedCapabilities, searchTerm])

    const domains = Object.keys(filteredGroupedCapabilities)
    const totalCapabilities = Object.values(filteredGroupedCapabilities).flat().length

    // Toggle domain expansion
    const toggleDomain = (domain) => {
        setExpandedDomains(prev => ({
            ...prev,
            [domain]: !prev[domain]
        }))
    }

    // Helper: render a domain card consistently
    const renderDomainCard = (domain) => (
        <div key={domain} className={`bg-white rounded-lg shadow-sm border ${getCategoryStyles(domain).cardBorder} h-full flex flex-col`}>
                                {/* Domain Header - Clickable */}
                                <div 
                className={`rounded-t-lg px-4 py-3 border-b-2 ${getCategoryStyles(domain).headerBg} ${getCategoryStyles(domain).borderColor} cursor-pointer ${getCategoryStyles(domain).headerHover}`}
                                    onClick={() => toggleDomain(domain)}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900 text-lg">{domain}</h3>
                                        <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getCategoryStyles(domain).countBg} ${getCategoryStyles(domain).countText}`}>
                            {filteredGroupedCapabilities[domain]?.length || 0}
                                            </span>
                                            {/* Expand/Collapse Icon */}
                                            <svg 
                                                className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                                                    expandedDomains[domain] ? 'rotate-180' : ''
                                                }`}
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Capabilities Cards - Collapsible */}
                                {expandedDomains[domain] && (
                <div className="bg-gray-50 rounded-b-lg p-4 flex-1 overflow-auto min-h-0">
                    <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] items-stretch">
                                        {filteredGroupedCapabilities[domain].map((capability, index) => (
                                            <div 
                                                key={`${domain}-${index}`}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 h-full"
                                            >
                                <div className="space-y-2 h-full flex flex-col">
                                    <h4 className="font-medium text-gray-900 text-sm">
                                                        {capability.capability}
                                                    </h4>
                                                    {capability.description && (
                                                        <p className="text-xs text-gray-600 line-clamp-2">
                                                            {capability.description}
                                                        </p>
                                                    )}
                                                    {capability.level && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Level: {capability.level}
                                                        </span>
                                                    )}
                                                    {capability.owner && (
                                                        <div className="flex items-center text-xs text-gray-500">
                                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                            </svg>
                                                            {capability.owner}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                    </div>
                                        {filteredGroupedCapabilities[domain].length === 0 && (
                                            <div className="text-center py-4 text-gray-500">
                                                <p className="text-sm">No capabilities found</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
    )

    // Map known domain names to the user's desired layout
    const normalize = (s = '') => s.toLowerCase().trim()
    const findDomainByNeedles = (needles = []) => {
        const map = new Map()
        domains.forEach(d => map.set(normalize(d), d))
        for (const domain of domains) {
            const dn = normalize(domain)
            if (needles.some(n => dn.includes(n))) return domain
        }
        return undefined
    }

    const customerDomain = findDomainByNeedles(['customer management', 'customer mgmt', 'customer'])
    const regulationDomain = findDomainByNeedles(['regulation', 'regulatory'])
    const operationsDomain = findDomainByNeedles(['transportation operation', 'transportation operations', 'transport operations'])
    const infrastructureDomain = findDomainByNeedles(['transportation infrastructure', 'infrastructure'])
    const strategicDomain = findDomainByNeedles(['strategy planning and development', 'strategy planning', 'strategic', 'strategy'])
    const supportDomain = findDomainByNeedles(['support function', 'support functions', 'support'])

    const used = new Set([customerDomain, regulationDomain, operationsDomain, infrastructureDomain, strategicDomain, supportDomain].filter(Boolean))
    const remainingDomains = domains.filter(d => !used.has(d))

    // Category and styles
    const getCategory = (domain) => {
        if (!domain) return 'other'
        if (domain === customerDomain || domain === regulationDomain || domain === operationsDomain || domain === infrastructureDomain) return 'core'
        if (domain === strategicDomain) return 'strategic'
        if (domain === supportDomain) return 'support'
        return 'other'
    }

    const categoryStyles = {
        core: {
            borderColor: 'border-blue-600',
            headerBg: 'bg-blue-50',
            headerHover: 'hover:bg-blue-100',
            cardBorder: 'border-blue-200',
            countBg: 'bg-blue-100',
            countText: 'text-blue-800'
        },
        strategic: {
            borderColor: 'border-purple-600',
            headerBg: 'bg-purple-50',
            headerHover: 'hover:bg-purple-100',
            cardBorder: 'border-purple-200',
            countBg: 'bg-purple-100',
            countText: 'text-purple-800'
        },
        support: {
            borderColor: 'border-amber-600',
            headerBg: 'bg-amber-50',
            headerHover: 'hover:bg-amber-100',
            cardBorder: 'border-amber-200',
            countBg: 'bg-amber-100',
            countText: 'text-amber-800'
        },
        other: {
            borderColor: 'border-gray-200',
            headerBg: 'bg-gray-100',
            headerHover: 'hover:bg-gray-200',
            cardBorder: 'border-gray-200',
            countBg: 'bg-gray-100',
            countText: 'text-gray-800'
        }
    }

    const getCategoryStyles = (domain) => categoryStyles[getCategory(domain)] || categoryStyles.other

    return (
        <>
            <PageHeader title="Business Capabilities" />
            <div className="mt-3">
                <p className="text-sm text-gray-700">
                    RTA's target business capability map is designed across 
                    <span className="mx-1 inline-block rounded px-1.5 py-0.5 bg-gray-100 text-gray-800 font-semibold">6 key domains</span>
                    and further classified into 
                    <span className="mx-1 inline-block rounded px-1.5 py-0.5 bg-gray-100 text-gray-800 font-semibold">22 level 1 capabilities</span>.
                </p>
            </div>
          


            {/* Domain Grid */}
            <section className="mt-6">
                {domains.length === 0 ? (
                    <div className="w-full text-center py-12 text-gray-500">
                        <p className="text-lg">No capabilities found</p>
                        <p className="text-sm">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <>
                        {/* Custom desktop layout - two columns to eliminate spanning gaps */}
                        <div className="hidden lg:flex gap-4 items-stretch">
                            <div className="flex-[3] min-w-0 flex flex-col gap-4" ref={coreColumnRef}>
                                {customerDomain && (
                                    <div>
                                        {renderDomainCard(customerDomain)}
                                    </div>
                                )}
                                <div className="grid grid-cols-3 gap-4 items-stretch min-w-0">
                                    {regulationDomain && (
                                        <div className="min-w-0 h-full">
                                            {renderDomainCard(regulationDomain)}
                                        </div>
                                    )}
                                    {operationsDomain && (
                                        <div className="min-w-0 h-full">
                                            {renderDomainCard(operationsDomain)}
                                        </div>
                                    )}
                                    {infrastructureDomain && (
                                        <div className="min-w-0 h-full">
                                            {renderDomainCard(infrastructureDomain)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {strategicDomain && (
                                <div className="flex-[1] min-w-0 self-stretch" style={{ height: coreColumnHeight || 'auto' }}>
                                    {renderDomainCard(strategicDomain)}
                                </div>
                            )}
                        </div>

                        {/* Mobile/Tablet fallback grid with prioritized order */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
                            {[customerDomain, regulationDomain, operationsDomain, infrastructureDomain, strategicDomain, supportDomain]
                                .filter(Boolean)
                                .map(d => renderDomainCard(d))}
                        </div>

                        {/* Render any remaining domains not covered above */}
                        {remainingDomains.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {remainingDomains.map(d => renderDomainCard(d))}
                            </div>
                        )}

                        {/* Support full-width at bottom on desktop */}
                        {supportDomain && (
                            <div className="hidden lg:block mt-4">
                                {renderDomainCard(supportDomain)}
                    </div>
                        )}
                    </>
                )}
            </section>
        </>
    )
}