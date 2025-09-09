"use client";
import React, { useState } from "react";
import {
  VideoIcon,
  SearchIcon,
  FilterIcon,
  HelpCircleIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useLecturerDashboard } from "../context/lecturerContext";
import { formatDistanceToNow } from "date-fns";
import axios from "@/app/api/axios";
import toast from "react-hot-toast";

export default function page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const { lecturerCourses, setShouldRefresh } = useLecturerDashboard();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const lectures = lecturerCourses.flatMap((course) => course.lectures);

  const filteredLectures = lectures.filter((lecture) => {
    const course = lecturerCourses.find((c) =>
      c.lectures.some((l) => l.id === lecture.id)
    );

    const matchesSearch =
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.title.toLowerCase().includes(searchTerm.toLowerCase());

    // calculate average engagement if logs exist
    const logs = lecture.attendanceLogs || [];
    const avgEngagement =
      logs.length > 0
        ? logs.reduce((acc, log) => acc + log.engagementScore, 0) / logs.length
        : 0;

    if (filter === "all") return matchesSearch;
    if (filter === "high-engagement")
      return matchesSearch && avgEngagement >= 85;
    if (filter === "low-engagement") return matchesSearch && avgEngagement < 70;

    return matchesSearch;
  });

  const handleDelete = async (lectureId: number) => {
    try {
      await axios.delete(`/lecturers/courses/lectures/${lectureId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      toast.success("Lecture successfully deleted");
      setShouldRefresh(true)
    } catch (error) {
      console.error("Error deleting lecture:", error);
      toast.error("Failed to delete lecture. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Lecture Content</h1>
        <div className="flex flex-wrap items-center gap-3">
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
          <Link
            href="/dashboard/lecturer/content/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5" />
            Create Lecture
          </Link>
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
                {filteredLectures.map((lecture) => {
                  const course = lecturerCourses.find((c) =>
                    c.lectures.some((l) => l.id === lecture.id)
                  )?.title;

                  const logs = lecture.attendanceLogs || [];
                  const avgEngagement =
                    logs.length > 0
                      ? logs.reduce(
                          (acc, log) => acc + log.engagementScore,
                          0
                        ) / logs.length
                      : 0;

                  return (
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
                        <div className="text-sm text-gray-600">{course}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {lecture.duration}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(lecture.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                avgEngagement >= 90
                                  ? "bg-green-500"
                                  : avgEngagement >= 75
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                              }`}
                              style={{
                                width: `${avgEngagement}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {avgEngagement}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <HelpCircleIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {lecture.quizzes.length} (
                            {lecture.quizSubmissions.length} submissions)
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
                        <button onClick={() => handleDelete(lecture.id)} className='text-red-600 hover:text-red-900 mr-4 cursor-pointer'>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
