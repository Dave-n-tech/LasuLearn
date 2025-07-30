"use client";
import { BookOpenIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import React from "react";
import { useStudentDashboard } from "../student/context/studentContext";
import { EnrolledCourse } from "@/app/types";
import { getLectureCompletionStats } from "@/app/helpers";

export default function DashbboardStatsComponent() {
  const { enrolledCourses } = useStudentDashboard();


  const { total, completed } = getLectureCompletionStats(enrolledCourses);

  const getCompletedQUizzes = (enrolledCourses: EnrolledCourse[]): number => {
    return enrolledCourses.reduce((total, enrolled) => {
        const quizSubmissions = enrolled.course.lectures.flatMap(lecture => lecture.quizSubmissions || []);

        return total + quizSubmissions.length;
    }, 0);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <BookOpenIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Courses</p>
            <p className="text-2xl font-semibold text-gray-900">
              {enrolledCourses.length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-teal-100 p-3 rounded-lg">
            <ClockIcon className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Lectures Completed</p>
            <p className="text-2xl font-semibold text-gray-900">{`${completed} / ${total}`}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <CheckCircleIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed Quizzes</p>
            <p className="text-2xl font-semibold text-gray-900">{getCompletedQUizzes(enrolledCourses)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
