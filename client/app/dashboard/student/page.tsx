import { BookOpenIcon, CheckCircleIcon, ClockIcon, PlayIcon } from 'lucide-react'
import React from 'react'

export default function page() {
  return (
    <div className="space-y-6 lg:space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpenIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Courses</p>
              <p className="text-2xl font-semibold text-gray-900">4</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <ClockIcon className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hours Watched</p>
              <p className="text-2xl font-semibold text-gray-900">26.5</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Quizzes</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Lectures */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Lectures
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <PlayIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    Introduction to React Hooks
                  </h3>
                  <p className="text-sm text-gray-600">
                    Advanced Web Development • 1h 15m
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600 sm:ml-auto">
                75% completed
              </div>
            </div>)}
        </div>
      </div>
    </div>
  )
}
