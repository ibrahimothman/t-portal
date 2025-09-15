import { PageHeader } from '../../components'
import { StatsCard } from '../../components'
import { DataTable } from '../../components' 
import { CloudMigrationTableFieldsConfig } from '../../config'
import { getCloudMigrationData } from '../../api'
import { useEffect, useState, useMemo } from 'react'

import { Bar, BubbleChart, Pie } from '../../components'

export default function CloudMigration() {
    const [data, setData] = useState([])
    const [filters, setFilters] = useState([])
    const [details, setDetails] = useState(null)
    
    const [showHeaderInfo, setShowHeaderInfo] = useState(false)
    const agencyOptions = ['CTSS', 'CASS', 'SCG', 'EAS', 'LA', 'TRA', 'Rail', 'PTA']
    const filterLabelMap = {
        'Agency/Sector Business Owner': 'Agency/Sector',
        'Application Hosting Place': 'Hosting',
        'isEligable': 'is Eligible'
    }


    useEffect(() => {
        // add id to each item
        getCloudMigrationData().then(data => {
            setData(data.map((item, index) => ({ ...item, id: index + 1 })))
        })
    }, [])


    const filteredData = useMemo(() => {
        // if filters is empty, return all data
        if (filters.length === 0) return data
        // item must satisfy ALL active filters (AND)
        return data.filter(item => filters.every(filter => item[filter.key] === filter.value))
    }, [data, filters])

    console.log(filteredData)

    const isFilterActive = (key, value) =>
        filters.some(f => f.key === key && f.value === value)

    const toggleFilter = (key, value) => {
        setFilters(prev => {
            const active = prev.some(f => f.key === key && f.value === value)
            if (active) {
                return prev.filter(f => !(f.key === key && f.value === value))
            }
            return [...prev, { key, value }]
        })
    }

    const handleSelectedItem = (item) => {
        console.log(item)
        toggleFilter(item.key, item.value)
    }

    const clearAllFilters = () => setFilters([])

    const setExclusiveCardFilter = (key, value, keysToClear = []) => {
        setFilters(prev => {
            const isActive = prev.some(f => f.key === key && f.value === value)
            // remove self and conflicting keys
            const next = prev.filter(f => f.key !== key && !keysToClear.includes(f.key))
            if (isActive) return next
            return [...next, { key, value }]
        })
    }

    const setAgencyFilter = (agencyValue) => {
        setFilters(prev => {
            const withoutAgency = prev.filter(f => f.key !== 'Agency/Sector Technical Owner')
            if (!agencyValue) return withoutAgency
            return [...withoutAgency, { key: 'Agency/Sector Technical Owner', value: agencyValue }]
        })
    }

    const activeAgency = useMemo(() => {
        const found = filters.find(f => f.key === 'Agency/Sector Business Owner')
        return found ? found.value : ''
    }, [filters])

    
    
    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <PageHeader title="Cloud Migration Dashboard" />
                    <button
                        onClick={() => setShowHeaderInfo(true)}
                        className="p-2  hover:text-black-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        aria-label="What is TIME & 6R?"
                        title="What is TIME & 6R?"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                    </button>
                </div>
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
                            <span className="max-w-[16rem] truncate">{`${filterLabelMap[f.key] || f.key}: ${f.value}`}</span>
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
                    <StatsCard title="Total Applications" value="120"/>
                    <StatsCard
                        title="Applications on Cloud"
                        value={data.filter(item => item['Application Hosting Place'] === 'Public Cloud').length}
                        onClick={() => setExclusiveCardFilter('Application Hosting Place', 'Public Cloud', ['isEligable'])}
                        selected={isFilterActive('Application Hosting Place', 'Public Cloud')}
                        className={isFilterActive('Application Hosting Place', 'Public Cloud') ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white border-indigo-600' : ''}
                    />
                    <StatsCard
                        title="Applications Eligible for Cloud"
                        value={data.filter(item => item.isEligable === 'Yes').length}
                        onClick={() => setExclusiveCardFilter('isEligable', 'Yes', ['Application Hosting Place'])}
                        selected={isFilterActive('isEligable', 'Yes')}
                        className={isFilterActive('isEligable', 'Yes') ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white border-indigo-600' : ''}
                    />
                </div>
            </section>

            {showHeaderInfo && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/30" onClick={() => setShowHeaderInfo(false)} />
                <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
                    <h3 className="text-sm font-semibold text-gray-900">Understanding TIME & 6R Frameworks</h3>
                    <button onClick={() => setShowHeaderInfo(false)} className="rounded-md p-1 text-gray-500 hover:bg-gray-50">✕</button>
                  </div>
                  <div className="max-h-[75vh] overflow-y-auto p-5">
                    <div className="space-y-8 text-sm text-gray-800">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-2">TIME Framework (Rationalization)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"><div className="font-medium">Tolerate</div><div className="text-gray-600">Keep as-is for now; minimize change and cost while monitoring value.</div></div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3"><div className="font-medium">Invest</div><div className="text-gray-600">Modernize/transform to increase business value and technical health.</div></div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3"><div className="font-medium">Migrate</div><div className="text-gray-600">Move to a new platform/cloud to improve scalability and resilience.</div></div>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3"><div className="font-medium">Eliminate</div><div className="text-gray-600">Decommission redundant or low-value applications.</div></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-2">6R Cloud Migration Strategies</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3"><div className="font-medium">Rehost</div><div className="text-gray-600">Lift-and-shift with minimal changes.</div></div>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3"><div className="font-medium">Replatform</div><div className="text-gray-600">Tweak platform to gain quick cloud benefits.</div></div>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3"><div className="font-medium">Repurchase</div><div className="text-gray-600">Replace with SaaS alternative.</div></div>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3"><div className="font-medium">Refactor / Re-architect</div><div className="text-gray-600">Redesign for cloud-native capabilities.</div></div>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3"><div className="font-medium">Retire</div><div className="text-gray-600">Decommission not-needed applications.</div></div>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3"><div className="font-medium">Retain</div><div className="text-gray-600">Keep on-prem for now due to constraints.</div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
                    <button onClick={() => setShowHeaderInfo(false)} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Close</button>
                  </div>
                </div>
              </div>
            )}

            {/* <section className="mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <BubbleChart data={filteredData} onItemSelected={handleSelectedItem} />
                    <Bar title="Cloud Migration Roadmap" subtitle="# of Applications by Migration Year" datakey="migrationYear" data={filteredData} onItemSelected={handleSelectedItem} needToSort={false} />
                </div>
            </section> */}

            <section className="mt-6 flex flex-col gap-6">
                <DataTable
                  data={filteredData}
                  fieldsConfig={CloudMigrationTableFieldsConfig}
                  title="Applications List"
                  onAction={(id) => setDetails(filteredData.find(r => r.id === id))}
                  actionsFilter={(row) => row.isEligable === 'Yes'}
                />
            </section>

            

            {details && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/30" onClick={() => setDetails(null)} />
                <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
                    <h3 className="text-sm font-semibold text-gray-900">Cloud Eligibility Assessment</h3>
                    <button onClick={() => setDetails(null)} className="rounded-md p-1 text-gray-500 hover:bg-gray-50">✕</button>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto p-5 text-sm">
                    {/* Summary */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Application Name</div>
                        <div className="mt-1 text-base font-medium text-gray-900">{details['Application Name']}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Agency/Sector</div>
                        <div className="mt-1 font-medium text-gray-900">{details['Agency/Sector Business Owner'] || '—'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Business Owner</div>
                        <div className="mt-1 font-medium text-gray-900">{details['Business Owners (Department)'] || '—'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Technical Owner</div>
                        <div className="mt-1 font-medium text-gray-900">{details['Technical Owners (Department)'] || details['Technical Owners (Department)'] || '—'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Assessment Date</div>
                        <div className="mt-1 font-medium text-gray-900">{'15/7/2025'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Final Score</div>
                        <div className="mt-1 font-medium text-gray-900">{String(details['Score']) ?? '—'}</div>
                      </div>
                      <div className="sm:col-span-2 md:col-span-3">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Final Decision</div>
                        <div className="mt-1 inline-flex items-center gap-2 text-gray-900">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${['Eligible to Cloud','Migrate to Cloud'].includes(details['Final Descion']) ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'}`}>{details['Final Descion'] || '—'}</span>
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
                                {(() => { const s = Number(details[row.k]); return (
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${s >= 4 ? 'bg-emerald-50 text-emerald-700' : s <= 2 ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{isNaN(s) ? '—' : s}</span>
                                )})()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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