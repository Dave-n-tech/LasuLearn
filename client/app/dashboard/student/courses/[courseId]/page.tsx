"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  BookOpenIcon,
  ClockIcon,
  FileTextIcon,
  MoveLeft,
  PlayIcon,
} from "lucide-react";
import { useStudentDashboard } from "../../context/studentContext";
import Link from "next/link";
import { calculateCourseProgress } from "@/app/helpers";
import { EnrolledCourse } from "@/app/types";

export default function page() {
  const { courseId } = useParams<{ courseId: string }>();
  const { enrolledCourses } = useStudentDashboard();
  const [course, setCourse] = useState<EnrolledCourse | undefined>();

  useEffect(() => {
    const course = enrolledCourses.find((enrolled) => {
      return String(enrolled.course.id) === courseId;
    });

    console.log("Course details for", `course ${courseId}`, course);
    setCourse(course);
  }, [courseId]);

  if (!course) return <p>Course not found.</p>;

  const { title, description, lectures } = course.course;

  const totalLectures = lectures.length;
  const totalQuizzes = lectures.reduce(
    (sum, l) => sum + (l.quizzes?.length || 0),
    0
  );

  const progress = calculateCourseProgress(course);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link href={"/dashboard/student/courses"}>
        <span className="mb-4 text-blue-500 hover:text-blue-700 font-semibold">
          <MoveLeft size={18} className="inline" />
          back to courses
        </span>
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-700 mt-1">{description}</p>
      </div>

      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <BookOpenIcon className="w-5 h-5 text-blue-600" />
          <span>{totalLectures} Lectures</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <FileTextIcon className="w-5 h-5 text-green-600" />
          <span>{totalQuizzes} Quizzes</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <ClockIcon className="w-5 h-5 text-purple-600" />
          <span>Progress: {progress || 0}%</span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Lectures</h2>
        {lectures.length !== 0 ? (
          lectures.map((lecture, index) => (
            <div
              key={lecture.id}
              className="bg-gray-50 border rounded-lg px-4 py-3 flex justify-between items-center hover:shadow-sm"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {index + 1}. {lecture.title}
                </p>
                <p className="text-sm text-gray-600">
                  {lecture.quizzes?.length || 0} Quiz
                  {lecture.quizzes?.length === 1 ? "" : "zes"}
                </p>
              </div>
              <Link
                href={`/dashboard/student/lectures/${lecture.id}`}
                className="text-sm flex items-center gap-2 text-blue-600 hover:underline"
              >
                <PlayIcon className="w-4 h-4" />
                Watch
              </Link>
            </div>
          ))
        ) : (
          <p> No lectures for this course yet.</p>
        )}
      </div>
    </div>
  );
}
