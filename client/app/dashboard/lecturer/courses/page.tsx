"use client";
import React, { useState } from "react";
import {
  BookOpenIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
  ClockIcon,
  CalendarIcon,
  MoreVerticalIcon,
  PlayIcon,
} from "lucide-react";
import Link from "next/link";
import { useLecturerDashboard } from "../context/lecturerContext";
import { formatDistanceToNow } from "date-fns";

export default function page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const { lecturerCourses } = useLecturerDashboard();

  // Filter courses based on search term
  const filteredCourses = lecturerCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const toggleDropdown = (courseId: number) => {
    if (showDropdown === courseId) {
      setShowDropdown(null);
    } else {
      setShowDropdown(courseId);
    }
  };
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
                    <span>{course.lectures.length} lectures</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span>{course.enrollments.length} students</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span>
                      Created {" "}
                      {formatDistanceToNow(new Date(course.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
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
  );
}
