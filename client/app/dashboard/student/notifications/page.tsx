import { AlertCircleIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';
import React from 'react'

export default function page() {
  const notifications = [{
    id: 1,
    type: 'success',
    title: 'Quiz Completed',
    message: 'You scored 92% on Advanced React Concepts quiz',
    time: '2 hours ago',
    icon: CheckCircleIcon,
    color: 'text-green-600',
    bg: 'bg-green-100'
  }, {
    id: 2,
    type: 'reminder',
    title: 'Upcoming Lecture',
    message: 'Web Development lecture starts in 30 minutes',
    time: '25 minutes ago',
    icon: ClockIcon,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  }, {
    id: 3,
    type: 'alert',
    title: 'Assignment Due Soon',
    message: 'Database Design assignment due in 24 hours',
    time: '1 hour ago',
    icon: AlertCircleIcon,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100'
  }];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          Mark all as read
        </button>
      </div>
      <div className="space-y-4">
        {notifications.map(notification => <div key={notification.id} className="bg-white rounded-xl shadow-sm p-6 hover:bg-gray-50 transition-colors">
            <div className="flex gap-4">
              <div className={`${notification.bg} p-3 rounded-lg`}>
                <notification.icon className={`w-6 h-6 ${notification.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {notification.time}
                  </span>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </div>
  )
}
