import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

// This component is for testing the Error Boundary in development
// It intentionally throws an error when the button is clicked
const ErrorTester = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false)

  if (shouldThrowError) {
    // This will trigger the Error Boundary
    throw new Error('This is a test error to demonstrate the Error Boundary functionality!')
  }

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShouldThrowError(true)}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors text-sm font-medium"
        title="Test Error Boundary (Development Only)"
      >
        <AlertTriangle className="w-4 h-4" />
        Test Error
      </button>
    </div>
  )
}

export default ErrorTester
