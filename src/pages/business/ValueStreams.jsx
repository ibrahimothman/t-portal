import { PageHeader, StatsCard } from '../../components'
import { DataTable } from '../../components' 
import { ValueStreamsTableFieldsConfig } from '../../config'
import { getValueStreams } from '../../api'
import { useEffect, useState, useMemo } from 'react'

export default function ValueStreams() {
    const [data, setData] = useState([])
    const [filters, setFilters] = useState([])
    const [selectedValueStream, setSelectedValueStream] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        getValueStreams().then(setData)
    }, [])

    const filteredData = useMemo(() => {
        // if filters is empty, return all data
        if (filters.length === 0) return data
        return data.filter(item => filters.some(filter => filter.key === filter.key && filter.value === item[filter.key]))
    }, [data, filters])

    const handleViewDetails = (id) => {
        const valueStream = filteredData.find(r => r.id === id)
        setSelectedValueStream(valueStream)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedValueStream(null)
    }

    return (
        <>
            <PageHeader title="Value Streams" />

            {/* add stats cards */}
            <section className="mt-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatsCard title="Total Value Streams" value={filteredData.length} />
                </div>
            </section>
            
            <section className="mt-6 flex flex-col gap-6">
                <DataTable 
                    data={filteredData} 
                    fieldsConfig={ValueStreamsTableFieldsConfig} 
                    title="Value Streams" 
                    actionTitle="View Details" 
                    onAction={handleViewDetails} 
                />
            </section>

            {/* Value Stream Details Modal */}
            {isModalOpen && selectedValueStream && (
                <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {selectedValueStream["Value Stream Name"]}
                                    </h2>
                                    {selectedValueStream.Agency && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {selectedValueStream.Agency}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">Value Stream Details</p>
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
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {selectedValueStream["Value Stream Definition/Description"]}
                                </p>
                            </div>

                            {/* Value Stream Flow */}
                            {selectedValueStream.stages && selectedValueStream.stages.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Value Stream Flow</h3>
                                    <div className="relative">
                                        {selectedValueStream.stages.map((stage, index) => (
                                            <div key={stage.Id} className="flex items-start mb-8 last:mb-0">
                                                {/* Stage Number Circle */}
                                                <div className="flex-shrink-0 mr-4">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    {/* Connecting Line */}
                                                    {index < selectedValueStream.stages.length - 1 && (
                                                        <div className="w-px h-16 bg-gray-300 ml-5 mt-2"></div>
                                                    )}
                                                </div>

                                                {/* Stage Content */}
                                                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                                                    <h4 className="font-semibold text-gray-900 mb-2">
                                                        {stage["Value Stream Stage"]}
                                                    </h4>
                                                    <p className="text-gray-700 mb-4">
                                                        {stage.Description}
                                                    </p>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                        <div>
                                                            <span className="font-medium text-gray-600">Entrance Criteria:</span>
                                                            <p className="text-gray-800 mt-1">{stage["Entrance Criteria"]}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Exit Criteria:</span>
                                                            <p className="text-gray-800 mt-1">{stage["Exit Criteria"]}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Value Item:</span>
                                                            <p className="text-gray-800 mt-1">{stage["Value Item"]}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Stakeholder:</span>
                                                            <p className="text-gray-800 mt-1">{stage.Stakeholder}</p>
                                                        </div>
                                                    </div>

                                                    {stage["Value Proposition"] && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                                            <span className="font-medium text-gray-600">Value Proposition:</span>
                                                            <p className="text-gray-800 mt-1">{stage["Value Proposition"]}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Stages Message */}
                            {(!selectedValueStream.stages || selectedValueStream.stages.length === 0) && (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-2">
                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">No detailed stages available for this value stream.</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}