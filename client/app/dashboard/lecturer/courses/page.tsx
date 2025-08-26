'use client'
import React, { useState } from 'react'
import {
  BookOpenIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
  ClockIcon,
  CalendarIcon,
  MoreVerticalIcon,
  PlayIcon,
} from 'lucide-react'
import Link from 'next/link'

export default function page() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState<number | null>(null)

  // Mock course data
  const courses = [
    {
      id: 1,
      title: 'Advanced Web Development',
      description:
        'Modern web development techniques focusing on React, Node.js, and cloud deployment.',
      lectures: 12,
      students: 120,
      created: 'Jan 15, 2024',
      lastUpdated: 'Mar 10, 2024',
      thumbnail:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 2,
      title: 'Data Structures and Algorithms',
      description:
        'Fundamental computer science concepts with practical implementations in JavaScript.',
      lectures: 16,
      students: 38,
      created: 'Feb 3, 2024',
      lastUpdated: 'Mar 5, 2024',
      thumbnail:
        'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 3,
      title: 'Mobile App Development',
      description:
        'Cross-platform mobile development with React Native and Expo.',
      lectures: 10,
      students: 32,
      created: 'Dec 10, 2023',
      lastUpdated: 'Feb 28, 2024',
      thumbnail:
        'https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 4,
      title: 'UI/UX Design Principles',
      description:
        'Design thinking and user experience fundamentals for digital products.',
      lectures: 8,
      students: 27,
      created: 'Jan 25, 2024',
      lastUpdated: 'Mar 12, 2024',
      thumbnail:
        'https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 5,
      title: 'Cloud Computing',
      description:
        'AWS, Azure, and Google Cloud fundamentals with practical deployment strategies.',
      lectures: 14,
      students: 22,
      created: 'Mar 1, 2024',
      lastUpdated: 'Mar 15, 2024',
      thumbnail:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
  ]
  // Filter courses based on search term
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const toggleDropdown = (courseId: number) => {
    if (showDropdown === courseId) {
      setShowDropdown(null)
    } else {
      setShowDropdown(courseId)
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            href="/dashboard/lecturer/courses/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5" />
            Create Course
          </Link>
        </div>
      </div>
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <p className="text-gray-600">
            No courses found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(course.id)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MoreVerticalIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    {showDropdown === course.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <Link
                          href={`/dashboard/lecturer/courses/${course.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/dashboard/lecturer/courses/${course.id}/edit`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit Course
                        </Link>
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          Delete Course
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <PlayIcon className="w-4 h-4 text-gray-400" />
                    <span>{course.lectures} lectures</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span>{course.students} students</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span>Created {course.created}</span>
                  </div>
                </div>
                <Link
                  href={`/dashboard/lecturer/courses/${course.id}`}
                  className="block w-full text-center py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
