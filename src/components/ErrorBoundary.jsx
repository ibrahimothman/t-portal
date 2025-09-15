import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We encountered an unexpected error while loading this page. 
                Don't worry, our team has been notified and we're working to fix it.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReload}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>

              {/* Error Details (Development Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 mb-3">
                    Show Error Details (Development Mode)
                  </summary>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-red-600 mb-2">Error:</h3>
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono bg-white p-2 rounded border overflow-x-auto">
                        {this.state.error && this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo && this.state.errorInfo.componentStack && (
                      <div>
                        <h3 className="text-sm font-semibold text-red-600 mb-2">Component Stack:</h3>
                        <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono bg-white p-2 rounded border overflow-x-auto max-h-40 overflow-y-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Support Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Need help? Contact{' '}
                  <a 
                    href="mailto:support@tsg.gov" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    TSG Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
