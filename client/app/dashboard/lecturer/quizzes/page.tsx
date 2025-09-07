'use client'
import React, { useState, Component } from 'react'
import {
  HelpCircleIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  BarChart3Icon,
} from 'lucide-react'
import Link from 'next/link'

export default function page() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  // Mock quiz data
  const quizzes = [
    {
      id: 1,
      title: 'Web Development Basics Quiz',
      lecture: 'Introduction to Modern Web Development',
      course: 'Advanced Web Development',
      questions: 5,
      submissions: 43,
      averageScore: 85,
      passRate: 92,
      created: 'Jan 16, 2024',
    },
    {
      id: 2,
      title: 'Modern JavaScript Features Quiz',
      lecture: 'Introduction to Modern Web Development',
      course: 'Advanced Web Development',
      questions: 8,
      submissions: 40,
      averageScore: 78,
      passRate: 88,
      created: 'Jan 17, 2024',
    },
    {
      id: 3,
      title: 'React Components Quiz',
      lecture: 'React Fundamentals',
      course: 'Advanced Web Development',
      questions: 6,
      submissions: 38,
      averageScore: 82,
      passRate: 90,
      created: 'Jan 20, 2024',
    },
    {
      id: 4,
      title: 'Sorting Algorithms Quiz',
      lecture: 'Sorting Algorithms',
      course: 'Data Structures and Algorithms',
      questions: 7,
      submissions: 35,
      averageScore: 76,
      passRate: 82,
      created: 'Feb 10, 2024',
    },
    {
      id: 5,
      title: 'React Native Basics Quiz',
      lecture: 'React Native Basics',
      course: 'Mobile App Development',
      questions: 5,
      submissions: 30,
      averageScore: 88,
      passRate: 93,
      created: 'Dec 15, 2023',
    },
  ]
  // Filter quizzes based on search term and filter
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.lecture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchTerm.toLowerCase())
    if (filter === 'all') return matchesSearch
    if (filter === 'high-performance')
      return matchesSearch && quiz.averageScore >= 85
    if (filter === 'low-performance')
      return matchesSearch && quiz.averageScore < 80
    return matchesSearch
  })
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Management</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search quizzes..."
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
              <option value="all">All Quizzes</option>
              <option value="high-performance">High Performance</option>
              <option value="low-performance">Low Performance</option>
            </select>
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <Link
            href="/dashboard/lecturer/quizzes/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5" />
            Create Quiz
          </Link>
        </div>
      </div>
      {filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <p className="text-gray-600">
            No quizzes found matching your search.
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
                    Quiz
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Lecture / Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Questions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Submissions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Performance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created
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
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <HelpCircleIcon className="w-5 h-5 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {quiz.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {quiz.lecture}
                      </div>
                      <div className="text-sm text-gray-500">{quiz.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {quiz.questions}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {quiz.submissions}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${quiz.averageScore >= 90 ? 'bg-green-500' : quiz.averageScore >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                            style={{
                              width: `${quiz.averageScore}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {quiz.averageScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {quiz.created}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {/* <Link
                        href={`/dashboard/lecturer/quizzes/${quiz.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Details
                      </Link> */}
                      <Link
                        href={`/dashboard/lecturer/quizzes/${quiz.id}/edit`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </Link>
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
