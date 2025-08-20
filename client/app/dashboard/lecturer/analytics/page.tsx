'use client'
import React, { useState } from 'react'
import {
  BarChart3Icon,
  TrendingUpIcon,
  ClockIcon,
  DownloadIcon,
  FilterIcon,
} from 'lucide-react'

export default function page() {
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('all')
  
  // Mock courses data
  const courses = [
    {
      id: 1,
      title: 'Advanced Web Development',
    },
    {
      id: 2,
      title: 'Data Structures and Algorithms',
    },
    {
      id: 3,
      title: 'Mobile App Development',
    },
    {
      id: 4,
      title: 'UI/UX Design Principles',
    },
  ]
  // Mock analytics data
  const analyticsData = {
    averageEngagement: 85,
    watchTime: 256,
    quizCompletion: 92,
    attendanceRate: 94,
    studentParticipation: 88,
    courseCompletionRate: 78,
  }
  // Mock course statistics
  const courseStatistics = [
    {
      id: 1,
      title: 'Advanced Web Development',
      students: 45,
      lectures: 12,
      quizzes: 6,
      engagement: 92,
      completion: 85,
      attendance: 96,
    },
    {
      id: 2,
      title: 'Data Structures and Algorithms',
      students: 38,
      lectures: 16,
      quizzes: 4,
      engagement: 85,
      completion: 78,
      attendance: 92,
    },
    {
      id: 3,
      title: 'Mobile App Development',
      students: 32,
      lectures: 10,
      quizzes: 5,
      engagement: 78,
      completion: 70,
      attendance: 88,
    },
    {
      id: 4,
      title: 'UI/UX Design Principles',
      students: 27,
      lectures: 8,
      quizzes: 3,
      engagement: 90,
      completion: 82,
      attendance: 95,
    },
  ]
  // Filter course statistics based on selected course
  const filteredCourseStats =
    selectedCourse === 'all'
      ? courseStatistics
      : courseStatistics.filter(
          (course) => course.id.toString() === selectedCourse,
        )
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white"
            >
              <option value="all">All Time</option>
              <option value="month">Past Month</option>
              <option value="week">Past Week</option>
            </select>
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUpIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Engagement</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.averageEngagement}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <ClockIcon className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Watch Time</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.watchTime}h
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3Icon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Quiz Completion</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.quizCompletion}%
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Engagement Over Time
          </h2>
          <button className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <DownloadIcon className="w-4 h-4" />
            <span>Export Chart</span>
          </button>
        </div>
        <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg">
          <p className="text-gray-600">
            Engagement chart will be implemented here
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Course Analytics
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white"
                >
                  <option value="all">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <button className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <DownloadIcon className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Students
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lectures
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quizzes
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Engagement
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Completion
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Attendance
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourseStats.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {course.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {course.students}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {course.lectures}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {course.quizzes}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${course.engagement}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.engagement}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${course.completion}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.completion}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${course.attendance}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.attendance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      Export
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
