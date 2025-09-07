'use client'
import React, { useState } from 'react'
import {
  VideoIcon,
  SearchIcon,
  FilterIcon,
  HelpCircleIcon,
} from 'lucide-react'
import Link from 'next/link'

export default function page() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  // Mock lecture data
  const lectures = [
    {
      id: 1,
      title: 'Introduction to Modern Web Development',
      course: 'Advanced Web Development',
      duration: '1h 15m',
      created: 'Jan 15, 2024',
      engagement: 92,
      quizzes: 2,
      submissions: 43,
    },
    {
      id: 2,
      title: 'React Fundamentals',
      course: 'Advanced Web Development',
      duration: '1h 45m',
      created: 'Jan 18, 2024',
      engagement: 88,
      quizzes: 1,
      submissions: 40,
    },
    {
      id: 3,
      title: 'State Management with React Hooks',
      course: 'Advanced Web Development',
      duration: '1h 30m',
      created: 'Jan 22, 2024',
      engagement: 85,
      quizzes: 1,
      submissions: 38,
    },
    {
      id: 4,
      title: 'Intro to Algorithms',
      course: 'Data Structures and Algorithms',
      duration: '1h 30m',
      created: 'Feb 5, 2024',
      engagement: 90,
      quizzes: 2,
      submissions: 36,
    },
    {
      id: 5,
      title: 'Sorting Algorithms',
      course: 'Data Structures and Algorithms',
      duration: '1h 20m',
      created: 'Feb 8, 2024',
      engagement: 82,
      quizzes: 1,
      submissions: 35,
    },
    {
      id: 6,
      title: 'React Native Basics',
      course: 'Mobile App Development',
      duration: '1h 20m',
      created: 'Dec 12, 2023',
      engagement: 78,
      quizzes: 1,
      submissions: 30,
    },
  ]
  // Filter lectures based on search term and filter
  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.course.toLowerCase().includes(searchTerm.toLowerCase())
    if (filter === 'all') return matchesSearch
    if (filter === 'high-engagement')
      return matchesSearch && lecture.engagement >= 85
    if (filter === 'low-engagement')
      return matchesSearch && lecture.engagement < 70
    return matchesSearch
  })
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Lecture Content</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search lectures..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white"
            >
              <option value="all">All Lectures</option>
              <option value="high-engagement">High Engagement</option>
              <option value="low-engagement">Low Engagement</option>
            </select>
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>
      {filteredLectures.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <p className="text-gray-600">
            No lectures found matching your search.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Lecture
                  </th>
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
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created
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
                    Quizzes
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
                {filteredLectures.map((lecture) => (
                  <tr key={lecture.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <VideoIcon className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lecture.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {lecture.course}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {lecture.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {lecture.created}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${lecture.engagement >= 90 ? 'bg-green-500' : lecture.engagement >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                            style={{
                              width: `${lecture.engagement}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {lecture.engagement}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <HelpCircleIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {lecture.quizzes} ({lecture.submissions} submissions)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/lecturer/content/${lecture.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/lecturer/content/${lecture.id}/edit`}
                        className="text-gray-600 hover:text-gray-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button className='text-red-600 hover:text-red-900 mr-4"'>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
