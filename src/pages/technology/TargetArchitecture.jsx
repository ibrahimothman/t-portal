import TargetArchitectureImage from '../../components/images/TargetArchitectureImage'
import { getTargetPlatforms } from '../../api'
import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'

export default function TargetArchitecture() {
	const [selectedPlatform, setSelectedPlatform] = useState(null)
	const [data, setData] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleItemSelected = (platformCode) => {
		const platform = data.find(platform => platform.code === platformCode)
		if (platform) {
			setSelectedPlatform(platform)
			setIsModalOpen(true)
		}
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedPlatform(null)
	}

	useEffect(() => {
		getTargetPlatforms().then(setData)
	}, [])

	return (
		<div className="min-h-screen bg-white">
			<PageHeader title="Target Architecture" />


			<section>
				<div className="w-full mx-auto text-center mt-10 px-4">
					<div className="max-w-none">
						<TargetArchitectureImage onItemSelected={handleItemSelected} />
					</div>
				</div>
			</section>

			{/* Platform Details Modal */}
			{isModalOpen && selectedPlatform && (
				<div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
						{/* Modal Header */}
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold text-gray-900">
									{selectedPlatform.name || selectedPlatform.platformName || 'Platform Details'}
								</h2>
								<p className="text-sm text-gray-600 mt-1">Platform Information & Related Projects</p>
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
							{/* Platform Description */}
							{selectedPlatform.description && (
								<div className="mb-6">
									<h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
									<p className="text-gray-700">{selectedPlatform.description}</p>
								</div>
							)}

							{/* Related Projects */}
							{selectedPlatform.projects && selectedPlatform.projects.length > 0 && (
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Related Projects ({selectedPlatform.projects.length})</h3>
									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{selectedPlatform.projects.map((project, index) => (
													<tr key={project.code || project.id || index} className="hover:bg-gray-50">
														<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
															{project.code || project.projectCode || '-'}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{project.name || project.projectName || '-'}
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
																project.status === 'Active' || project.status === 'In Progress' 
																	? 'bg-green-100 text-green-800'
																	: project.status === 'Completed'
																	? 'bg-blue-100 text-blue-800'
																	: project.status === 'On Hold' || project.status === 'Delayed'
																	? 'bg-yellow-100 text-yellow-800'
																	: project.status === 'Cancelled'
																	? 'bg-red-100 text-red-800'
																	: 'bg-gray-100 text-gray-800'
															}`}>
																{project.status || 'Unknown'}
															</span>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{project.department || '-'}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{project.startDate || project.start || '-'}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{project.endDate || project.end || '-'}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							)}

							{/* No Projects Message */}
							{(!selectedPlatform.projects || selectedPlatform.projects.length === 0) && (
								<div className="text-center py-8">
									<div className="text-gray-400 mb-2">
										<svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
									</div>
									<p className="text-gray-600">No projects found for this platform.</p>
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
		</div>
	)
}


