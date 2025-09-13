"use client";
import React from "react";
import { PlayIcon, BookOpenIcon, ClockIcon } from "lucide-react";
import LecturerDashboardStats from "../components/LecturerDashboardStats";
import { useLecturerDashboard } from "./context/lecturerContext";

export default function page() {
  const { lecturerCourses } = useLecturerDashboard();

  const totalCourses = lecturerCourses.length;
  const totalStudents = lecturerCourses.reduce(
    (acc, course) => acc + course.enrollments.length,
    0
  );
  const totalLectures = lecturerCourses.reduce(
    (acc, course) => acc + course.lectures.length,
    0
  );
  const avgEngagement = lecturerCourses
    .flatMap((c) => c.lectures) // all lectures
    .flatMap((l) => l.attendanceLogs.map((a) => a.engagementScore)) // all scores
    .reduce((sum, score, _, arr) => sum + score / arr.length, 0);

  const quizPerformance = (() => {
    const submissions = lecturerCourses
      .flatMap((c) => c.lectures)
      .flatMap((l) => l.quizSubmissions);

    if (submissions.length === 0) return 0;

    const correct = submissions.filter((s) => s.isCorrect).length;
    return (correct / submissions.length) * 100;
  })();

  // Mock data
  const stats = {
    totalCourses,
    totalLectures,
    totalStudents,
    avgEngagement,
    quizPerformance,
  };

  const recentActivity = [
    {
      id: 1,
      type: "lecture",
      title: "Advanced React Patterns",
      course: "Advanced Web Development",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "course",
      title: "Mobile App Development with React Native",
      timestamp: "1 day ago",
    },
    {
      id: 3,
      type: "lecture",
      title: "State Management Strategies",
      course: "Advanced Web Development",
      timestamp: "3 days ago",
    },
  ];
  
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Lecturer Dashboard</h1>
      </div>

      {/* Stats */}
      <LecturerDashboardStats stats={stats} />

      {/* Recent Activity */}
      {/* <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    activity.type === "lecture" ? "bg-blue-100" : "bg-green-100"
                  }`}
                >
                  {activity.type === "lecture" ? (
                    <PlayIcon
                      className={`w-6 h-6 ${
                        activity.type === "lecture"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    />
                  ) : (
                    <BookOpenIcon className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {activity.title}
                  </h3>
                  {activity.course && (
                    <p className="text-sm text-gray-600">{activity.course}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
