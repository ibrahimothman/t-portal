import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search, MapPin, Sparkles } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-200 select-none">404</h1>
            <div className="relative -mt-16">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Page Not Found
            </h2>
          </div>

          {/* Action Buttons */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:via-violet-700 hover:to-fuchsia-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 px-5"
          >
            <Home className="h-4 w-4" />
            <span>Go to Home</span>
          </Link>
          
         


         
        </div>
      </div>
    </div>
  )
}

export default NotFound
