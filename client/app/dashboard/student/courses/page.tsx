import { BookOpenIcon } from 'lucide-react'
import React from 'react'

export default function page() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((_, i) => <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpenIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Course {i + 1}</h3>
                  <p className="text-sm text-gray-600">
                    12 lectures • 4 quizzes
                  </p>
                </div>
              </div>
              <div className="text-sm text-blue-600">In Progress</div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-100 h-2 rounded-full">
                <div className="bg-blue-600 h-2 rounded-full" style={{
              width: '60%'
            }}></div>
              </div>
              <div className="text-sm text-gray-600">60% completed</div>
            </div>
          </div>)}
      </div>
    </div>
  )
}
