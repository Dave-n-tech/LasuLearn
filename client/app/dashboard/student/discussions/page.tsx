import { MessageSquareIcon } from 'lucide-react'
import React from 'react'

export default function page() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Discussions</h1>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareIcon className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Course Discussions
              </h2>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Start New Discussion
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => <div key={i} className="p-4 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    Discussion Topic {i + 1}
                  </h3>
                  <span className="text-sm text-gray-600">2 hours ago</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Latest reply: This was very helpful, thank you for the
                  explanation.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{5 + i} replies</span>
                  <span>{10 + i} participants</span>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>
  )
}
