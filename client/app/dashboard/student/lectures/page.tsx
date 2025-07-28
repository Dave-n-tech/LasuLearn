'use client'
import { BookOpenIcon, ChevronDownIcon, ChevronUpIcon, FilterIcon, PlayIcon } from 'lucide-react'
import React, { useState } from 'react'

export default function page() {
  const [expandedCourses, setExpandedCourses] = useState<
    Record<string, boolean>
  >({
    course1: true,
    course2: false,
    course3: false,
    course4: false,
  })
  const [filter, setFilter] = useState('all')
  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }))
  }
  const courses = [
    {
      id: 'course1',
      name: 'Advanced Web Development',
      instructor: 'Dr. Sarah Johnson',
      progress: 75,
      lectures: [
        {
          id: 1,
          title: 'Introduction to React Hooks',
          duration: '1h 15m',
          progress: 100,
          lastWatched: '1 day ago',
        },
        {
          id: 2,
          title: 'State Management with Redux',
          duration: '55m',
          progress: 65,
          lastWatched: '3 days ago',
        },
        {
          id: 3,
          title: 'Building Custom Hooks',
          duration: '1h 05m',
          progress: 45,
          lastWatched: '1 week ago',
        },
      ],
    },
    {
      id: 'course2',
      name: 'Data Structures & Algorithms',
      instructor: 'Prof. Michael Chen',
      progress: 40,
      lectures: [
        {
          id: 1,
          title: 'Intro to Algorithms',
          duration: '1h 30m',
          progress: 100,
          lastWatched: '2 days ago',
        },
        {
          id: 2,
          title: 'Sorting Algorithms',
          duration: '1h 20m',
          progress: 20,
          lastWatched: '5 days ago',
        },
        {
          id: 3,
          title: 'Trees and Graphs',
          duration: '1h 45m',
          progress: 0,
          lastWatched: 'Not started',
        },
      ],
    },
    {
      id: 'course3',
      name: 'UX/UI Design Principles',
      instructor: 'Prof. Emily Rodriguez',
      progress: 90,
      lectures: [
        {
          id: 1,
          title: 'Design Thinking',
          duration: '50m',
          progress: 100,
          lastWatched: '1 week ago',
        },
        {
          id: 2,
          title: 'User Research Methods',
          duration: '1h 10m',
          progress: 100,
          lastWatched: '5 days ago',
        },
        {
          id: 3,
          title: 'Prototyping Techniques',
          duration: '1h 25m',
          progress: 70,
          lastWatched: 'Yesterday',
        },
      ],
    },
    {
      id: 'course4',
      name: 'Mobile App Development',
      instructor: 'Dr. James Wilson',
      progress: 25,
      lectures: [
        {
          id: 1,
          title: 'React Native Basics',
          duration: '1h 20m',
          progress: 100,
          lastWatched: '1 week ago',
        },
        {
          id: 2,
          title: 'Navigation in Mobile Apps',
          duration: '55m',
          progress: 0,
          lastWatched: 'Not started',
        },
        {
          id: 3,
          title: 'Working with Native Modules',
          duration: '1h 15m',
          progress: 0,
          lastWatched: 'Not started',
        },
      ],
    },
  ]
  const filteredCourses = courses.filter((course) => {
    if (filter === 'all') return true
    if (filter === 'in-progress')
      return course.progress > 0 && course.progress < 100
    if (filter === 'completed') return course.progress === 100
    if (filter === 'not-started') return course.progress === 0
    return true
  })
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Lectures</h1>
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="all">All Courses</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="not-started">Not Started</option>
          </select>
        </div>
      </div>
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-600">
            No courses match your filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div
                className="p-6 border-b border-gray-100 flex items-center justify-between cursor-pointer"
                onClick={() => toggleCourse(course.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookOpenIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600">
                      Instructor: {course.instructor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    <div className="text-sm text-gray-600 mb-1">
                      Course Progress
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 h-2 rounded-full w-32">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${course.progress}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                  {expandedCourses[course.id] ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              {expandedCourses[course.id] && (
                <div className="divide-y divide-gray-100">
                  {course.lectures.map((lecture) => (
                    <div key={lecture.id} className="p-4 hover:bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            <PlayIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {lecture.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Duration: {lecture.duration}
                            </p>
                          </div>
                        </div>
                        <div className="sm:ml-auto">
                          <div className="flex flex-col sm:items-end">
                            <div className="text-sm text-gray-600 mb-1">
                              {lecture.progress === 0
                                ? 'Not started'
                                : lecture.progress === 100
                                  ? 'Completed'
                                  : `${lecture.progress}% completed`}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-100 h-2 rounded-full w-32">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${lecture.progress}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {lecture.lastWatched}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
