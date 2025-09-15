import { PageHeader } from '../../components'
import { StatsCard } from '../../components'
import { DataTable } from '../../components' 
import { ApplicationsTableFieldsConfig } from '../../config'
import { getApplications, getApplicationsTechnologies as getTechnologies, getPojectsByCode } from '../../api'
import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Bar, BubbleChart, Pie } from '../../components'
import StatusBadge from '../../components/StatusBadge'
import dayjs from 'dayjs'

export default function Applications() {
    const [data, setData] = useState([])
    const [filters, setFilters] = useState([])
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const selectedAppName = decodeURIComponent(searchParams.get('application_name') || '')
    const [techData, setTechData] = useState([])
    const [activeSection, setActiveSection] = useState('application')
    const [showEligibilityModal, setShowEligibilityModal] = useState(false)
    const [appProjects, setAppProjects] = useState([])


    useEffect(() => {
        // loop through the data and add a new field id with unique number
        getApplications().then(data => {
            setData(data.map((item, index) => ({ ...item, id: index + 1 })))
        })
    }, [])

    // Load technologies once
    useEffect(() => {
        getTechnologies().then(rows => setTechData(rows || []))
    }, [])

    const filteredData = useMemo(() => {
        // if filters is empty, return all data
        if (filters.length === 0) return data
        // Item must satisfy ANY selected filters for now (OR across chips)
        return data.filter(item => filters.some(filter => filter.value === item[filter.key]))
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

    // Agency/Sector options and helpers
    const agencyOptions = useMemo(() => {
        return Array.from(new Set((data || []).map(r => r['Agency/Sector Business Owner']).filter(Boolean)))
    }, [data])

    const setAgencyFilter = (agencyValue) => {
        setFilters(prev => {
            const withoutAgency = prev.filter(f => f.key !== 'Agency/Sector Business Owner')
            if (!agencyValue) return withoutAgency
            return [...withoutAgency, { key: 'Agency/Sector Business Owner', value: agencyValue }]
        })
    }

    const activeAgency = useMemo(() => {
        const found = filters.find(f => f.key === 'Agency/Sector Business Owner')
        return found ? found.value : ''
    }, [filters])

    const clearAllFilters = () => setFilters([])

    // Status filter helpers (for StatsCards)
    const isFilterActive = (key, value) => filters.some(f => f.key === key && f.value === value)
    const setExclusiveCardFilter = (key, value, keysToClear = []) => {
        setFilters(prev => {
            const isActive = prev.some(f => f.key === key && f.value === value)
            const next = prev.filter(f => f.key !== key && !keysToClear.includes(f.key))
            if (isActive) return next
            return [...next, { key, value }]
        })
    }

    // Date formatter (supports Excel serial dates like 46783)
    const formatDate = (value) => {
        if (!value && value !== 0) return 'N/A'
        const str = String(value).trim()
        if (/^\d+$/.test(str)) {
            const serial = parseInt(str, 10)
            const d = dayjs('1899-12-30').add(serial, 'day')
            return d.isValid() ? d.format('DD MMM YYYY') : str
        }
        const d = dayjs(value)
        return d.isValid() ? d.format('DD MMM YYYY') : str
    }

    // -------- Details helpers when a selection exists --------
    const selectedApp = useMemo(() => {
        if (!selectedAppName) return null
        return data.find(r => (r['Application Name'] || '').toLowerCase() === selectedAppName.toLowerCase()) || null
    }, [data, selectedAppName])

    const techForApp = useMemo(() => {
        if (!selectedAppName) return []
        return (techData || []).filter(t => (t['Application Name'] || '').toLowerCase() === selectedAppName.toLowerCase())
    }, [techData, selectedAppName])

    const eosOrObsoleteTech = useMemo(() => {
        return techForApp.filter(t => {
            const status = (t['Lifecycle Status'] || '').toLowerCase()
            return status.includes('obsolete') || status.includes('reached end of support') || status.includes('end of support')
        })
    }, [techForApp])

    // Load related projects for the selected application
    useEffect(() => {
        const codes = selectedApp ? (selectedApp['Projects'] || selectedApp['projects'] || '') : ''
        if (codes) {
            getPojectsByCode(codes).then(rows => setAppProjects(rows || [])).catch(() => setAppProjects([]))
        } else {
            setAppProjects([])
        }
    }, [selectedAppName, selectedApp])

    const lifecycleBadge = (value) => {
        const v = (value || '').toLowerCase()
        if (v.includes('obsolete')) return 'bg-rose-50 text-rose-700'
        if (v.includes('end of support')) return 'bg-orange-50 text-orange-700'
        if (v.includes('active')) return 'bg-emerald-50 text-emerald-700'
        return 'bg-gray-100 text-gray-800'
    }

    const contractBadge = (value) => {
        const v = (value || '').toLowerCase()
        if (v.includes('expired')) return 'bg-red-50 text-red-700'
        if (v.includes('expiring')) return 'bg-orange-50 text-orange-700'
        if (v.includes('active')) return 'bg-emerald-50 text-emerald-700'
        return 'bg-gray-100 text-gray-800'
    }

    if (selectedAppName) {
        // Guard: handle missing application
        if (!selectedApp) {
            return (
                <>
                    <PageHeader title={`Application: ${selectedAppName}`} />
                    <div className="mt-4 rounded-md border border-gray-200 bg-white p-6 text-sm text-gray-700">
                        No details found for this application. 
                        <button className="ml-2 text-indigo-600 hover:underline" onClick={() => navigate('/technology/business-applications')}>Return to list</button>
                    </div>
                </>
            )
        }

        const isEligible = String(selectedApp?.['isEligable'] || '').toLowerCase() === 'yes'
        const isCloudAdopted = String(selectedApp?.['Cloud-adoption?'] || '').toLowerCase() === 'yes'

        return (
            <>
                <div className="flex items-center justify-between gap-4">
                    <PageHeader title={`Application: ${selectedAppName}`} />
                </div>

                {/* Badges */}
                <section className="mt-4 flex flex-wrap gap-2">
                    {(() => {
                        const contractStatus = selectedApp['Contract Status'] || ''
                        const maximo = selectedApp['MAXIMO Code'] || 'N/A'
                        const expiry = formatDate(selectedApp['Support Expiry Date'])
                        const st = (contractStatus || '').toLowerCase()
                        if (st.includes('expired') || st.includes('expiring')) {
                            const isExpired = st.includes('expired')
                            const badgeClass = isExpired ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'
                            const msg = isExpired
                                ? `Support Contract ${maximo} has expired on ${expiry}`
                                : `Support Contract ${maximo} is expiring soon on ${expiry}`
                            return (
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{msg}</span>
                            )
                        }
                        return null
                    })()}

                    {selectedApp?.['Application Hosting Place'] && (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800">
                            {selectedApp['Application Hosting Place']}
                        </span>
                    )}

                    {isEligible && (
                        <button
                            type="button"
                            onClick={() => setShowEligibilityModal(true)}
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100"
                            title="View cloud eligibility assessment"
                        >
                            Eligible for Cloud, See more
                        </button>
                    )}

                    {isCloudAdopted && (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700">
                            Cloud Adopted
                        </span>
                    )}

                    {String(selectedApp?.['Status'] || '').toLowerCase() === 'under retirement' && (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-700">
                            Under Retirement
                        </span>
                    )}

                    {String(selectedApp?.['Status'] || '').toLowerCase() === 'coming this year' && (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-sky-50 text-sky-700">
                            Coming This Year
                        </span>
                    )}

                    {eosOrObsoleteTech.length > 0 && (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-rose-50 text-rose-700">
                            {eosOrObsoleteTech.length} technologies are obsolete or reached end of support
                        </span>
                    )}
                </section>

                {/* Details layout with left nav groups */}
                <section className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left group list */}
                    <nav className="lg:col-span-1">
                        <ul className="sticky top-24 space-y-2">
                            <li><button onClick={() => setActiveSection('application')} className={`w-full text-left text-sm rounded-md px-3 py-2 border ${activeSection === 'application' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>Application Card</button></li>
                            <li><button onClick={() => setActiveSection('ownership')} className={`w-full text-left text-sm rounded-md px-3 py-2 border ${activeSection === 'ownership' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>Ownership</button></li>
                            <li><button onClick={() => setActiveSection('support')} className={`w-full text-left text-sm rounded-md px-3 py-2 border ${activeSection === 'support' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>Support</button></li>
                            <li><button onClick={() => setActiveSection('cloud')} className={`w-full text-left text-sm rounded-md px-3 py-2 border ${activeSection === 'cloud' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>Cloud Readiness</button></li>
                            <li><button onClick={() => setActiveSection('tech')} className={`w-full text-left text-sm rounded-md px-3 py-2 border ${activeSection === 'tech' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>Technology Stack</button></li>
                            <li><button onClick={() => setActiveSection('projects')} className={`w-full text-left text-sm rounded-md px-3 py-2 border ${activeSection === 'projects' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>Projects</button></li>
                        </ul>
                    </nav>

                    {/* Right content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Application Card */}
                        {activeSection === 'application' && (
                            <div id="group-application" className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900">Application Card</h3>
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-xs text-gray-500">Application Name</div>
                                        <div className="text-sm text-gray-900">{selectedAppName}</div>
                                    </div>
                                    {selectedApp?.['Application Hosting Place'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Application Hosting Place</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Application Hosting Place']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['Criticality'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Criticality</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Criticality']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['principal Vendor'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Principal Vendor</div>
                                        <div className="text-sm text-gray-900">{selectedApp['principal Vendor']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['Original Product Name'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Original Product Name</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Original Product Name']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['DR Setup'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">DR Setup</div>
                                        <div className="text-sm text-gray-900">{selectedApp['DR Setup']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['Cloud Deployment Model'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Cloud Deployment Model</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Cloud Deployment Model']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['Cloud Service Provider'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Cloud Service Provider</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Cloud Service Provider']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['Cloud Service Integrator'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Cloud Service Integrator</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Cloud Service Integrator']}</div>
                                    </div>
                                    )}
                                </div>
                                {selectedApp?.['Description'] && (
                                    <div className="mt-3">
                                        <div className="text-xs text-gray-500">Description</div>
                                        <p className="text-sm text-gray-700 leading-7">{selectedApp['Description']}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Ownership */}
                        {activeSection === 'ownership' && (
                            <div id="group-ownership" className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900">Ownership</h3>
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedApp?.['Agency/Sector'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Agency/Sector</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Agency/Sector']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['Agency/Sector Business Owner'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Business Owner</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Agency/Sector Business Owner']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['Agency/Sector Technical Owner'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Technical Owner</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Agency/Sector Technical Owner']}</div>
                                    </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Support */}
                        {activeSection === 'support' && (
                            <div id="group-support" className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900">Support</h3>
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedApp?.['MAXIMO Code'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">MAXIMO Code</div>
                                        <div className="text-sm text-gray-900">{selectedApp['MAXIMO Code']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['Support Expiry Date'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Support Expiry Date</div>
                                        <div className="text-sm text-gray-900">{formatDate(selectedApp['Support Expiry Date'])}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['Support Vendor'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Support Vendor</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Support Vendor']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['Contract Status'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Contract Status</div>
                                        <div className="text-sm text-gray-900">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${contractBadge(selectedApp['Contract Status'])}`}>
                                                {selectedApp['Contract Status']}
                                            </span>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Cloud Readiness */}
                        {activeSection === 'cloud' && (
                            <div id="group-cloud" className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900">Cloud Readiness</h3>
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedApp?.['Application Hosting Place'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Application Hosting Place</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Application Hosting Place']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['Cloud-adoption?'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Cloud Adoption?</div>
                                        <div className="text-sm text-gray-900">{selectedApp['Cloud-adoption?']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['rationalization'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Rationalization</div>
                                        <div className="text-sm text-gray-900">{selectedApp['rationalization']}</div>
                                    </div>
                                    )}
                                    {selectedApp?.['cloudMigrationStrategy'] && (
                                    <div>
                                        <div className="text-xs text-gray-500">Cloud Migration Strategy</div>
                                        <div className="text-sm text-gray-900">{selectedApp['cloudMigrationStrategy']}</div>
                                    </div>
                                    )}
                                    {isEligible && (
                                        <div>
                                            <div className="text-xs text-gray-500">Cloud Eligibility</div>
                                            <div className="text-sm text-gray-900">
                                                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700">Eligible for Cloud</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Technology Stack */}
                        {activeSection === 'tech' && (
                            <div id="group-tech" className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-gray-900">Technology Stack</h3>
                                    <span className="text-xs text-gray-500">{techForApp.length} items</span>
                                </div>
                                <div className="mt-3 overflow-x-auto">
                                    <table className="min-w-full text-xs text-gray-900">
                                        <thead>
                                            <tr className="text-left uppercase text-[11px] text-gray-500">
                                                <th className="py-2 pr-4">Product</th>
                                                <th className="py-2 pr-4">Version</th>
                                                <th className="py-2 pr-4">Domain</th>
                                                <th className="py-2 pr-4">Vendor</th>
                                                <th className="py-2 pr-4">Release Date</th>
                                                <th className="py-2 pr-4">EOS Date</th>
                                                <th className="py-2 pr-4">EOL Date</th>
                                                <th className="py-2 pr-0">Lifecycle Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {techForApp.map((t, idx) => (
                                                <tr key={idx} className="border-t border-gray-100 odd:bg-gray-50">
                                                    <td className="py-2 pr-4">{t['product']}</td>
                                                    <td className="py-2 pr-4">{t['Version']}</td>
                                                    <td className="py-2 pr-4">{t['Technology Domain'] || t['Domain']}</td>
                                                    <td className="py-2 pr-4">{t['Vendor']}</td>
                                                    <td className="py-2 pr-4">{formatDate(t['Release Date'])}</td>
                                                    <td className="py-2 pr-4">{formatDate(t['EOS Date'])}</td>
                                                    <td className="py-2 pr-4">{formatDate(t['EOL Date'])}</td>
                                                    <td className="py-2 pr-0">
                                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${lifecycleBadge(t['Lifecycle Status'])}`}>
                                                            {t['Lifecycle Status'] || 'No Information Available'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {activeSection === 'projects' && (
                            <div id="group-projects" className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-gray-900">Projects</h3>
                                    <span className="text-xs text-gray-500">{appProjects.length} items</span>
                                </div>
                                <div className="mt-3 overflow-x-auto">
                                    <table className="min-w-full text-xs text-gray-900">
                                        <thead>
                                            <tr className="text-left uppercase text-[11px] text-gray-500">
                                                <th className="py-2 pr-4">Project Name</th>
                                                <th className="py-2 pr-0">Project Code</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appProjects.map((p, idx) => (
                                                <tr key={idx} className="border-t border-gray-100 odd:bg-gray-50">
                                                    <td className="py-2 pr-4">{p.projectName || '—'}</td>
                                                    <td className="py-2 pr-0">{p.projectCode || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Eligibility Assessment Modal */}
                {showEligibilityModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/30" onClick={() => setShowEligibilityModal(false)} />
                        <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
                                <h3 className="text-sm font-semibold text-gray-900">Cloud Eligibility Assessment</h3>
                                <button onClick={() => setShowEligibilityModal(false)} className="rounded-md p-1 text-gray-500 hover:bg-gray-50">✕</button>
                            </div>
                            <div className="max-h-[70vh] overflow-y-auto p-5 text-sm">
                                {/* Summary */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Application Name</div>
                                        <div className="mt-1 text-base font-medium text-gray-900">{selectedApp['Application Name']}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Agency/Sector</div>
                                        <div className="mt-1 font-medium text-gray-900">{selectedApp['Agency/Sector Business Owner'] || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Business Owner</div>
                                        <div className="mt-1 font-medium text-gray-900">{selectedApp['Business Owners (Department)'] || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Technical Owner</div>
                                        <div className="mt-1 font-medium text-gray-900">{selectedApp['Technical Owners (Department)'] || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Assessment Date</div>
                                        <div className="mt-1 font-medium text-gray-900">{'15/7/2025'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Final Score</div>
                                        <div className="mt-1 font-medium text-gray-900">{String(selectedApp['Score'] ?? '—')}</div>
                                    </div>
                                    <div className="sm:col-span-2 md:col-span-3">
                                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Final Decision</div>
                                        <div className="mt-1 inline-flex items-center gap-2 text-gray-900">
                                            {(() => { const fd = selectedApp['Final Descion'] || '—'; const ok = ['Eligible to Cloud','Migrate to Cloud'].includes(fd); return (
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${ok ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'}`}>{fd}</span>
                                            )})()}
                                        </div>
                                    </div>
                                </div>

                                {/* Criteria table */}
                                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50">
                                            <tr className="text-xs text-gray-600">
                                                <th className="px-4 py-3 font-medium">Criteria</th>
                                                <th className="px-4 py-3 font-medium">Weight</th>
                                                <th className="px-4 py-3 font-medium">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {[
                                                { n: 'Business Criticality (BC)', d: 'Is the application mission-critical? (e.g., 5 = Highly critical, 1 = Non-critical).', w: '15%', k: 'Business Criticality (BC)' },
                                                { n: 'Compliance and Data Sensitivity (CDS)', d: 'Does the application handle sensitive or regulated data that may require specific hosting locations? (e.g., 5 = High compliance requirements, 1 = Low compliance requirements).', w: '15%', k: 'Compliance and Data Sensitivity (CDS)' },
                                                { n: 'Application Architecture (AA)', d: 'Is the application cloud-ready or does it require refactoring? (e.g., 5 = Cloud-native or easily adapted, 1 = Legacy, needs heavy modification).', w: '10%', k: 'Application Architecture (AA)' },
                                                { n: 'Performance and Latency (PL)', d: 'Does the application have performance requirements that could be impacted by cloud latency? (e.g., 5 = Low latency sensitivity, 1 = High latency sensitivity).', w: '10%', k: 'Performance and Latency (PL)' },
                                                { n: 'Dependencies and Integrations (DI)', d: 'Does the application have strong dependencies on other systems or apps? (e.g., 5 = Minimal or no dependencies, 1 = Complex dependencies).', w: '10%', k: 'Dependencies and Integrations (DI)' },
                                                { n: 'Security Requirements (SR)', d: 'Are there specific security concerns that cloud providers must meet for this application? (e.g., 5 = Low security concerns, 1 = High security requirements).', w: '10%', k: 'Security Requirements (SR)' },
                                                { n: 'Cost Considerations (C)', d: 'What is the cost impact of migrating this application? Consider operational, licensing, and hardware costs. (e.g., 5 = Low migration cost, 1 = High migration cost).', w: '15%', k: 'Cost Considerations (C)' },
                                                { n: 'Workload and Scalability (WS)', d: 'Can this application benefit from the scalability features of the cloud (e.g., auto-scaling)? (e.g., 5 = High scalability needs, 1 = Low benefit).', w: '10%', k: 'Workload and Scalability (WS)' },
                                                { n: 'Operational Readiness (OR)', d: 'Is your team ready to support and operate this application in the cloud? (e.g., 5 = High readiness, 1 = Low readiness).', w: '5%', k: 'Operational Readiness (OR)' },
                                            ].map((row, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50/60">
                                                    <td className="px-4 py-3 align-top">
                                                        <div className="font-medium text-gray-900">{row.n}</div>
                                                        <div className="mt-0.5 text-xs text-gray-600">{row.d}</div>
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{row.w}</span>
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        {(() => { const s = Number(selectedApp[row.k]); return (
                                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${isNaN(s) ? 'bg-gray-50 text-gray-600' : s >= 4 ? 'bg-emerald-50 text-emerald-700' : s <= 2 ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{isNaN(s) ? '—' : s}</span>
                                                        )})()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
                                <button onClick={() => setShowEligibilityModal(false)} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    
    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <PageHeader title="Business Applications" />
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
                                onClick={() => handleSelectedItem({ key: f.key, value: f.value })}
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
                    <StatsCard title="Total Applications" value={data.length}/>
                    <StatsCard
                        title="Under Retirement"
                        value={data.filter(item => String(item['Status'] || '').toLowerCase() === 'under retirement').length}
                        onClick={() => setExclusiveCardFilter('Status', 'Under Retirement')}
                        selected={isFilterActive('Status', 'Under Retirement')}
                        className={isFilterActive('Status', 'Under Retirement') ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white border-indigo-600' : ''}
                    />
                    <StatsCard
                        title="Coming This Year"
                        value={data.filter(item => String(item['Status'] || '').toLowerCase() === 'coming this year').length}
                        onClick={() => setExclusiveCardFilter('Status', 'Coming This Year')}
                        selected={isFilterActive('Status', 'Coming This Year')}
                        className={isFilterActive('Status', 'Coming This Year') ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white border-indigo-600' : ''}
                    />
                </div>
            </section>

            <section className="mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <Bar title="Applications Ownership" subtitle="# of Applications by Business Agency & Sector" datakey="Agency/Sector Business Owner" data={filteredData} onItemSelected={handleSelectedItem} />
                    <Pie title="Applications Criticality" subtitle="# of Applications by Criticality as per AGF" datakey="Criticality" data={filteredData} onItemSelected={handleSelectedItem} />
                </div>
            </section>

            <section className="mt-6 flex flex-col gap-6">
                <DataTable 
                    data={filteredData} 
                    fieldsConfig={ApplicationsTableFieldsConfig} 
                    title="Applications List"
                    onRowClick={(row) => {
                        const appName = row['Application Name']
                        if (appName) navigate(`/technology/business-applications?application_name=${encodeURIComponent(appName)}`)
                    }}
                />
            </section>
            
        </>
    )
}