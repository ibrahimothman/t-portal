import { useState, useEffect } from 'react'
import { PageHeader } from '../../../components'

const CRITERIA = [
  {
    id: 'business_criticality',
    title: 'Business Criticality (BC)',
    question: 'Is the application mission-critical? (e.g., 5 = Highly critical, 1 = Non-critical).',
    weight: 15,
    icon: '🏢',
    tooltip: 'Higher criticality requires robust cloud architecture and planning.',
    labels: ['Low Impact', 'Minor', 'Moderate', 'Important', 'Mission Critical']
  },
  {
    id: 'data_sensitivity',
    title: 'Compliance and Data Sensitivity (CDS)',
    question: 'Does the application handle sensitive or regulated data that may require specific hosting locations? (e.g., 5 = High compliance requirements, 1 = Low compliance requirements).',
    weight: 15,
    icon: '🔒',
    tooltip: 'Sensitive/regulated data may require specific residency and controls.',
    labels: ['Public', 'Internal', 'Confidential', 'Restricted', 'Top Secret']
  },
  {
    id: 'architecture',
    title: 'Application Architecture (AA)',
    question: 'Is the application cloud-ready or does it require refactoring? (e.g., 5 = Cloud-native or easily adapted, 1 = Legacy, needs heavy modification).',
    weight: 10,
    icon: '🏗️',
    tooltip: 'Modern, loosely-coupled architectures migrate more easily to cloud.',
    labels: ['Legacy/Monolith', 'Partially Modern', 'Mixed', 'Mostly Modern', 'Cloud-Native']
  },
  {
    id: 'performance_latency',
    title: 'Performance and Latency (PL)',
    question: 'Does the application have performance requirements that could be impacted by cloud latency? (e.g., 5 = Low latency sensitivity, 1 = High latency sensitivity).',
    weight: 10,
    icon: '⚡',
    tooltip: 'Latency-sensitive apps may need edge or private connectivity.',
    labels: ['Not Sensitive', 'Slightly', 'Moderate', 'Sensitive', 'Very Sensitive']
  },
  {
    id: 'dependencies',
    title: 'Dependencies and Integrations (DI)',
    question: 'Does the application have strong dependencies on other systems or apps? (e.g., 5 = Minimal or no dependencies, 1 = Complex dependencies).',
    weight: 10,
    icon: '🔗',
    tooltip: 'Many/complex dependencies increase migration complexity and risk.',
    labels: ['None/Few', 'Some', 'Several', 'Many', 'Highly Complex']
  },
  {
    id: 'security',
    title: 'Security Requirements (SR)',
    question: 'Are there specific security concerns that cloud providers must meet for this application? (e.g., 5 = Low security concerns, 1 = High security requirements).',
    weight: 10,
    icon: '🛡️',
    tooltip: 'Stricter security/compliance may limit cloud options and add overhead.',
    labels: ['Basic', 'Standard', 'Enhanced', 'Strict', 'Ultra-Strict']
  },
  {
    id: 'cost',
    title: 'Cost Considerations (C)',
    question: 'What is the cost impact of migrating this application? Consider operational, licensing, and hardware costs. (e.g., 5 = Low migration cost, 1 = High migration cost).',
    weight: 15,
    icon: '💰',
    tooltip: 'Cloud can reduce costs via elasticity and managed services when applicable.',
    labels: ['High Cost', 'Above Avg', 'Moderate', 'Low', 'Very Low']
  },
  {
    id: 'scalability',
    title: 'Workload and Scalability (WS)',
    question: 'Can this application benefit from the scalability features of the cloud (e.g., auto-scaling)? (e.g., 5 = High scalability needs, 1 = Low benefit).',
    weight: 10,
    icon: '📈',
    tooltip: 'Variable loads and growth benefit from cloud scaling capabilities.',
    labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Constantly']
  },
  {
    id: 'operational_readiness',
    title: 'Operational Readiness (OR)',
    question: 'Is your team ready to support and operate this application in the cloud? (e.g., 5 = High readiness, 1 = Low readiness).',
    weight: 5,
    icon: '👥',
    tooltip: 'Team skills and operating model are critical for success in cloud.',
    labels: ['Not Ready', 'Learning', 'Some Skills', 'Mostly Ready', 'Cloud Expert']
  }
]

export default function CloudReadinessTool() {
  const [language, setLanguage] = useState('EN')
  const [responses, setResponses] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Calculate progress
  const progress = (Object.keys(responses).length / CRITERIA.length) * 100

  // Calculate score and status
  const calculateScore = () => {
    // If no responses yet, return 0
    if (Object.keys(responses).length === 0) {
      return 0
    }

    const totalWeight = CRITERIA.reduce((sum, criterion) => sum + criterion.weight, 0)
    let weightedScore = 0

    CRITERIA.forEach(criterion => {
      const response = responses[criterion.id] || 0
      // Invert scoring for criteria where lower values are better for cloud readiness
      const invertedCriteria = ['data_sensitivity', 'performance_latency', 'dependencies', 'security']
      const score = invertedCriteria.includes(criterion.id) ? (6 - response) : response
      weightedScore += (score * criterion.weight)
    })

    return totalWeight > 0 ? weightedScore / totalWeight : 0
  }

  const score = calculateScore()
  const getStatus = () => {
    if (score >= 3.0) return { status: 'Eligible to Cloud', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' }
    if (score >= 2.0) return { status: 'Needs Improvements', color: 'amber', bgColor: 'bg-amber-100', textColor: 'text-amber-800' }
    return { status: 'Not Ready', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' }
  }

  const statusInfo = getStatus()

  // Get risk factors and recommendations
  const getRiskFactors = () => {
    const risks = []
    const recommendations = []

    CRITERIA.forEach(criterion => {
      const response = responses[criterion.id] || 0
      
      if (criterion.id === 'data_sensitivity' && response >= 4) {
        risks.push('High data sensitivity')
        recommendations.push('Review data residency and compliance requirements')
      }
      if (criterion.id === 'performance_latency' && response >= 4) {
        risks.push('High latency sensitivity')
        recommendations.push('Consider edge computing or private connections')
      }
      if (criterion.id === 'dependencies' && response >= 4) {
        risks.push('Complex dependencies')
        recommendations.push('Map and assess all system dependencies')
      }
      if (criterion.id === 'security' && response >= 4) {
        risks.push('Strict security requirements')
        recommendations.push('Plan for enhanced security controls and compliance')
      }
      if (criterion.id === 'operational_readiness' && response <= 2) {
        risks.push('Limited cloud expertise')
        recommendations.push('Invest in team training and cloud skills development')
      }
    })

    // Add positive drivers
    const drivers = []
    CRITERIA.forEach(criterion => {
      const response = responses[criterion.id] || 0
      
      if (criterion.id === 'scalability' && response >= 4) {
        drivers.push('Strong scalability benefit')
      }
      if (criterion.id === 'cost' && response >= 4) {
        drivers.push('Cost optimization opportunity')
      }
      if (criterion.id === 'architecture' && response >= 4) {
        drivers.push('Modern architecture')
      }
    })

    return { risks: risks.slice(0, 3), recommendations: recommendations.slice(0, 2), drivers: drivers.slice(0, 3) }
  }

  const { risks, recommendations, drivers } = getRiskFactors()

  const handleSliderChange = (criterionId, value) => {
    setResponses(prev => ({
      ...prev,
      [criterionId]: parseInt(value)
    }))
  }

  const exportToPDF = () => {
    // Placeholder for PDF export functionality
    alert('PDF export functionality would be implemented here')
  }

  const emailResults = () => {
    // Placeholder for email functionality
    alert('Email functionality would be implemented here')
  }

  const ResultPanel = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Result</h3>
      
      {/* Score Meter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Cloud Readiness Score</span>
          <span className="text-2xl font-bold text-gray-900">{score.toFixed(1)}/5.0</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              score >= 3.0 ? 'bg-green-500' : score >= 2.0 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.max((score / 5) * 100, 5)}%` }}
          />
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
          {statusInfo.status}
        </div>
      </div>

      {/* Drivers and Risks */}
      {(drivers.length > 0 || risks.length > 0) && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Key Factors</h4>
          <div className="space-y-2">
            {drivers.map((driver, index) => (
              <div key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 mr-2 mb-1">
                ✓ {driver}
              </div>
            ))}
            {risks.map((risk, index) => (
              <div key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 mr-2 mb-1">
                ⚠ {risk}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Next Steps</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Export Buttons */}
      {Object.keys(responses).length === CRITERIA.length && (
        <div className="space-y-2">
          <button
            onClick={exportToPDF}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            📄 Download PDF
          </button>
          <button
            onClick={emailResults}
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            📧 Email Results
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
    <PageHeader title="Cloud Eligibility Tool" />
   
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto  sm:px-6 py-8">
          
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Assessment Progress</span>
              <span className="text-sm text-gray-600">{Object.keys(responses).length}/{CRITERIA.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Assessment Cards */}
          <div className={`space-y-6 ${isMobile ? 'order-1' : 'lg:col-span-2'}`}>
            {CRITERIA.map((criterion, index) => (
              <div key={criterion.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{criterion.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{criterion.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          Weight: {criterion.weight}%
                        </span>
                        <div className="group relative">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <div className="absolute bottom-6 left-0 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            {criterion.tooltip}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{criterion.question}</p>
                
                {/* Slider */}
                <div className="space-y-3">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={responses[criterion.id] || 1}
                    onChange={(e) => handleSliderChange(criterion.id, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: responses[criterion.id] 
                        ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((responses[criterion.id] - 1) / 4) * 100}%, #e5e7eb ${((responses[criterion.id] - 1) / 4) * 100}%, #e5e7eb 100%)`
                        : '#e5e7eb'
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    {criterion.labels.map((label, idx) => (
                      <span key={idx} className={`text-center ${responses[criterion.id] === idx + 1 ? 'text-blue-600 font-medium' : ''}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                  {responses[criterion.id] && (
                    <div className="text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Selected: {criterion.labels[responses[criterion.id] - 1]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Results Panel */}
          <div className={`${isMobile ? 'order-2' : 'lg:col-span-1'}`}>
            {isMobile ? (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
                <button
                  onClick={() => setShowResults(!showResults)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">View Results</span>
                  <span className={`transform transition-transform ${showResults ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </span>
                </button>
                {showResults && (
                  <div className="mt-4 max-h-96 overflow-y-auto">
                    <ResultPanel />
                  </div>
                )}
              </div>
            ) : (
              <ResultPanel />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>How the score is calculated:</strong> Each criterion is weighted based on its importance for cloud migration success. 
              Your responses are combined to provide an overall readiness score from 1-5.
            </p>
            <p>
              <strong>Privacy:</strong> Your responses are not stored or transmitted. This assessment is for guidance only and 
              should be supplemented with detailed technical evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* Add some bottom padding for mobile to account for fixed results panel */}
      {isMobile && <div className="h-24" />}
    </div>
    </>
  )
}
