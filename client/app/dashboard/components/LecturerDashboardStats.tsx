import {
  ActivityIcon,
  BookOpenIcon,
  CheckCircleIcon,
  PlayIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";

interface DashboardStatsProps {
  stats: {
    totalCourses: number,
    totalLectures: number,
    totalStudents: number,
    avgEngagement: number,
    quizPerformance: number,
  }
}

export default function LecturerDashboardStats({ stats }: DashboardStatsProps) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2">
      <div className="bg-white rounded-xl py-6 px-4 shadow-sm">
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
      <div className="bg-white rounded-xl py-6 px-4 shadow-sm">
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
      <div className="bg-white rounded-xl py-6 px-4 shadow-sm">
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
      <div className="bg-white rounded-xl py-6 px-4 shadow-sm">
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
      <div className="bg-white rounded-xl py-6 px-4 shadow-sm">
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
  );
}
