"use client";
import React from "react";
import { BookOpenIcon } from "lucide-react";
import { useStudentDashboard } from "../student/context/studentContext";
import { CourseLectureProgress } from "@/app/types";
import { calculateCourseProgress } from "@/app/helpers";
import Link from "next/link";

export default function CourseCard() {
  const { enrolledCourses } = useStudentDashboard();

  const getNumberofQuizzes = (lectures: CourseLectureProgress[]) => {
    if (!lectures) return 0;

    return lectures.reduce((sum, lecture) => {
      if (Array.isArray(lecture.quizzes)) {
        return sum + lecture.quizzes.length;
      }
      return sum;
    }, 0);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {enrolledCourses.map((enrolled) => {
        const progress = calculateCourseProgress(enrolled)

        return (
          <Link href={`/dashboard/student/courses/${enrolled.course.id}`}
            key={enrolled.course.id}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpenIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {`${enrolled.course.code} - ${enrolled.course.title}`}
                  </h3>
                  <p className="text-sm text-gray-600">{`${
                    enrolled.course.lectures.length
                  } lectures • ${getNumberofQuizzes(
                    enrolled.course.lectures
                  )} quizzes`}</p>
                </div>
              </div>
              <div className="text-sm text-blue-600">{progress < 100 ? "In Progress" : "Completed"}</div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-100 h-2 rounded-full">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">{`${progress}% completed`}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
