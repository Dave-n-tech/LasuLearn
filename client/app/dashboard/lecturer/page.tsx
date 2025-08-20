import React from 'react'
import {
  UsersIcon,
  PlayIcon,
  BarChart3Icon,
  ActivityIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
} from 'lucide-react'
import Link from 'next/link'

export default function page() {
  // Mock data
  const stats = {
    totalCourses: 5,
    totalLectures: 24,
    totalStudents: 156,
    avgEngagement: 87,
    quizPerformance: 78,
  }
  const recentActivity = [
    {
      id: 1,
      type: 'lecture',
      title: 'Advanced React Patterns',
      course: 'Advanced Web Development',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'course',
      title: 'Mobile App Development with React Native',
      timestamp: '1 day ago',
    },
    {
      id: 3,
      type: 'lecture',
      title: 'State Management Strategies',
      course: 'Advanced Web Development',
      timestamp: '3 days ago',
    },
  ]
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Lecturer Dashboard</h1>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpenIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalCourses}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <PlayIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Lectures</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalLectures}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <UsersIcon className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalStudents}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <ActivityIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Engagement</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.avgEngagement}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Quiz Performance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.quizPerformance}%
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Performance Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quiz Performance Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Advanced Web Development</span>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 h-2 rounded-full w-32">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: '85%',
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">85%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Data Structures</span>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 h-2 rounded-full w-32">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: '72%',
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">72%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mobile App Development</span>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 h-2 rounded-full w-32">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: '90%',
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">90%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">UI/UX Design</span>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 h-2 rounded-full w-32">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: '65%',
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">65%</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/lecturer/analytics"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View detailed analytics →
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Engagement Overview
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Video Completion Rate</span>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 h-2 rounded-full w-32">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: '78%',
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">78%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quiz Participation</span>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 h-2 rounded-full w-32">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: '92%',
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">92%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Discussion Participation</span>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 h-2 rounded-full w-32">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: '67%',
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">67%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Attendance Rate</span>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 h-2 rounded-full w-32">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{
                      width: '89%',
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">89%</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/lecturer/analytics"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View detailed analytics →
            </Link>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${activity.type === 'lecture' ? 'bg-blue-100' : 'bg-green-100'}`}
                >
                  {activity.type === 'lecture' ? (
                    <PlayIcon
                      className={`w-6 h-6 ${activity.type === 'lecture' ? 'text-blue-600' : 'text-green-600'}`}
                    />
                  ) : (
                    <BookOpenIcon className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {activity.title}
                  </h3>
                  {activity.course && (
                    <p className="text-sm text-gray-600">{activity.course}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
