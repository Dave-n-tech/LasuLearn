'use client'
import React, { useState } from 'react'
import {
  ArrowLeftIcon,
  UserIcon,
  MailIcon,
  ClockIcon,
  BookOpenIcon,
  CheckCircleIcon,
  BarChart3Icon,
  PlayIcon,
  HelpCircleIcon,
  CalendarIcon,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function page() {
  const { studentId } = useParams<{ studentId: string }>()
  const [activeTab, setActiveTab] = useState('engagement')
  // Mock student data
  const student = {
    id: parseInt(studentId || '1'),
    name: 'Emma Wilson',
    email: 'emma.wilson@university.edu',
    enrolledDate: 'Sep 1, 2023',
    program: 'Computer Science',
    year: 3,
    totalCourses: 4,
    completedCourses: 2,
    overallProgress: 85,
    overallEngagement: 92,
  }
  // Mock enrolled courses data
  const enrolledCourses = [
    {
      id: 1,
      title: 'Advanced Web Development',
      progress: 95,
      lecturesWatched: 11,
      totalLectures: 12,
      quizzesTaken: 5,
      totalQuizzes: 6,
      quizAverage: 92,
    },
    {
      id: 2,
      title: 'Data Structures and Algorithms',
      progress: 80,
      lecturesWatched: 12,
      totalLectures: 16,
      quizzesTaken: 3,
      totalQuizzes: 4,
      quizAverage: 85,
    },
    {
      id: 4,
      title: 'UI/UX Design Principles',
      progress: 75,
      lecturesWatched: 6,
      totalLectures: 8,
      quizzesTaken: 2,
      totalQuizzes: 3,
      quizAverage: 90,
    },
  ]
  // Mock engagement data
  const engagementData = [
    {
      week: 'Week 1',
      engagement: 95,
    },
    {
      week: 'Week 2',
      engagement: 90,
    },
    {
      week: 'Week 3',
      engagement: 92,
    },
    {
      week: 'Week 4',
      engagement: 88,
    },
    {
      week: 'Week 5',
      engagement: 94,
    },
    {
      week: 'Week 6',
      engagement: 90,
    },
  ]
  // Mock lecture activity
  const lectureActivity = [
    {
      id: 1,
      title: 'Introduction to React Hooks',
      course: 'Advanced Web Development',
      watchPercentage: 100,
      completedAt: 'Jan 17, 2024',
      duration: '1h 15m',
      timeSpent: '1h 20m',
    },
    {
      id: 2,
      title: 'State Management with Redux',
      course: 'Advanced Web Development',
      watchPercentage: 85,
      completedAt: 'Jan 19, 2024',
      duration: '55m',
      timeSpent: '48m',
    },
    {
      id: 3,
      title: 'Intro to Algorithms',
      course: 'Data Structures and Algorithms',
      watchPercentage: 100,
      completedAt: 'Jan 22, 2024',
      duration: '1h 30m',
      timeSpent: '1h 35m',
    },
    {
      id: 4,
      title: 'Design Thinking',
      course: 'UI/UX Design Principles',
      watchPercentage: 75,
      completedAt: 'In progress',
      duration: '50m',
      timeSpent: '38m',
    },
  ]
  // Mock quiz results
  const quizResults = [
    {
      id: 1,
      title: 'Web Development Basics Quiz',
      course: 'Advanced Web Development',
      score: 92,
      status: 'Passed',
      completedAt: 'Jan 18, 2024',
      timeSpent: '8m 45s',
    },
    {
      id: 2,
      title: 'Modern JavaScript Features Quiz',
      course: 'Advanced Web Development',
      score: 88,
      status: 'Passed',
      completedAt: 'Jan 20, 2024',
      timeSpent: '10m 15s',
    },
    {
      id: 3,
      title: 'Sorting Algorithms Quiz',
      course: 'Data Structures and Algorithms',
      score: 85,
      status: 'Passed',
      completedAt: 'Jan 23, 2024',
      timeSpent: '12m 30s',
    },
    {
      id: 4,
      title: 'Design Principles Quiz',
      course: 'UI/UX Design Principles',
      score: 90,
      status: 'Passed',
      completedAt: 'Jan 25, 2024',
      timeSpent: '9m 20s',
    },
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/lecturer/students"
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {student.name}
              </h2>
              <div className="flex items-center gap-2 text-gray-600">
                <MailIcon className="w-4 h-4" />
                <span>{student.email}</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                {student.program} • Year {student.year}
              </p>
            </div>
            <div className="sm:ml-auto flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Send Message
              </button>
              <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                View Report
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b border-gray-200">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Enrolled Since</span>
            </div>
            <div className="font-semibold text-gray-900">
              {student.enrolledDate}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <BookOpenIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Courses</span>
            </div>
            <div className="font-semibold text-gray-900">
              {student.totalCourses} ({student.completedCourses} completed)
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircleIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Progress</span>
            </div>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${student.overallProgress}%`,
                  }}
                ></div>
              </div>
              <span className="font-semibold text-gray-900">
                {student.overallProgress}%
              </span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3Icon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Engagement</span>
            </div>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${student.overallEngagement}%`,
                  }}
                ></div>
              </div>
              <span className="font-semibold text-gray-900">
                {student.overallEngagement}%
              </span>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('engagement')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'engagement' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Engagement
            </button>
            <button
              onClick={() => setActiveTab('lectures')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'lectures' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Lecture Activity
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'quizzes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Quiz Results
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'courses' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Enrolled Courses
            </button>
          </div>
        </div>
        <div className="p-6">
          {activeTab === 'engagement' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Engagement Overview
              </h3>
              <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg">
                <p className="text-gray-600">
                  Engagement chart will be implemented here
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {engagementData.map((data, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">{data.week}</span>
                      <span className="font-medium text-gray-900">
                        {data.engagement}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${data.engagement >= 90 ? 'bg-green-500' : data.engagement >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                        style={{
                          width: `${data.engagement}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'lectures' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Lecture Activity
              </h3>
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
                        Progress
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
                        Time Spent
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Completed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lectureActivity.map((lecture) => (
                      <tr key={lecture.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <PlayIcon className="w-4 h-4 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-3">
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
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${lecture.watchPercentage === 100 ? 'bg-green-500' : lecture.watchPercentage >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                                style={{
                                  width: `${lecture.watchPercentage}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {lecture.watchPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {lecture.duration}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {lecture.timeSpent}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {lecture.completedAt}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'quizzes' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Quiz Results
              </h3>
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
                        Course
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Score
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Time Spent
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Completed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quizResults.map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <HelpCircleIcon className="w-4 h-4 text-purple-600" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {quiz.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {quiz.course}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${quiz.score >= 90 ? 'bg-green-500' : quiz.score >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                                style={{
                                  width: `${quiz.score}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {quiz.score}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${quiz.status === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {quiz.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {quiz.timeSpent}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {quiz.completedAt}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Enrolled Courses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                  >
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {course.title}
                    </h4>
                    <div className="space-y-4 mt-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            Overall Progress
                          </span>
                          <span className="font-medium text-gray-900">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${course.progress >= 90 ? 'bg-green-500' : course.progress >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                            style={{
                              width: `${course.progress}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 mb-1">Lectures</div>
                          <div className="font-medium text-gray-900">
                            {course.lecturesWatched}/{course.totalLectures}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Quizzes</div>
                          <div className="font-medium text-gray-900">
                            {course.quizzesTaken}/{course.totalQuizzes}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Quiz Average</div>
                          <div className="font-medium text-gray-900">
                            {course.quizAverage}%
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/lecturer/courses/${course.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        View Course Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
