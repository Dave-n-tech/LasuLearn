'use client'
import React, { useState } from 'react'
import { UsersIcon, SearchIcon, FilterIcon, DownloadIcon } from 'lucide-react'
import Link from 'next/link'

export default function page() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState('all')
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
  // Mock students data
  const students = [
    {
      id: 1,
      name: 'Emma Wilson',
      email: 'emma.wilson@university.edu',
      courses: [1, 2, 4],
      lastActive: '2 hours ago',
      progress: 85,
      engagement: 92,
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@university.edu',
      courses: [1, 3],
      lastActive: '1 day ago',
      progress: 78,
      engagement: 85,
    },
    {
      id: 3,
      name: 'Sophia Rodriguez',
      email: 'sophia.rodriguez@university.edu',
      courses: [1, 2, 3, 4],
      lastActive: '3 hours ago',
      progress: 92,
      engagement: 95,
    },
    {
      id: 4,
      name: 'James Johnson',
      email: 'james.johnson@university.edu',
      courses: [2, 4],
      lastActive: '5 days ago',
      progress: 65,
      engagement: 70,
    },
    {
      id: 5,
      name: 'Olivia Brown',
      email: 'olivia.brown@university.edu',
      courses: [1, 3],
      lastActive: '1 hour ago',
      progress: 88,
      engagement: 90,
    },
  ]
  // Filter students based on search term, filter, and selected course
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse =
      selectedCourse === 'all' ||
      student.courses.includes(parseInt(selectedCourse))
    if (filter === 'all') return matchesSearch && matchesCourse
    if (filter === 'high-engagement')
      return matchesSearch && matchesCourse && student.engagement >= 90
    if (filter === 'low-engagement')
      return matchesSearch && matchesCourse && student.engagement < 75
    return matchesSearch && matchesCourse
  })
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <button className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 sm:ml-auto">
          <DownloadIcon className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <UsersIcon className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Enrolled Students
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="search"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative w-full sm:w-auto">
                <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white w-full"
                >
                  <option value="all">All Students</option>
                  <option value="high-engagement">High Engagement</option>
                  <option value="low-engagement">Low Engagement</option>
                </select>
              </div>
              <div className="relative w-full sm:w-auto">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white w-full"
                >
                  <option value="all">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
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
                  Student
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Courses
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Progress
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
                  Last Active
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
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <UsersIcon className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {student.courses.length} courses
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${student.progress >= 90 ? 'bg-green-500' : student.progress >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                          style={{
                            width: `${student.progress}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {student.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${student.engagement >= 90 ? 'bg-green-500' : student.engagement >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                          style={{
                            width: `${student.engagement}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {student.engagement}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {student.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/lecturer/students/${student.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Profile
                    </Link>
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

