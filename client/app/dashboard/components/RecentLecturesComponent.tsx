"use client";
import React from "react";
import { useStudentDashboard } from "../student/context/studentContext";
import RecentLectureCard from "./RecentLectureCard";

export default function RecentLecturesComponent() {
  const { enrolledCourses } = useStudentDashboard();

  const lecturesWithWatchInfo = enrolledCourses.flatMap((enrolled) =>
    enrolled.course.lectures.map((lecture) => {
      const userProgress = lecture.progresses.find(
        (p) => p.watched && p.completedAt
      );

      // percentage completed
      const percentageCompleted = userProgress
        ? Math.round((userProgress.watchTime / lecture.duration) * 100)
        : 0;

      return {
        ...lecture,
        courseTitle: enrolled.course.title,
        courseCode: enrolled.course.code,
        completedAt: userProgress?.completedAt || null,
        percentageCompleted: percentageCompleted,
      };
    })
  );

  // Filter only watched lectures
  const watchedLectures = lecturesWithWatchInfo.filter((l) => l.completedAt);

  // Sort by most recently watched
  watchedLectures.sort(
    (a, b) =>
      new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
  );

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Lectures
      </h2>

      {enrolledCourses.length === 0 && (
        <p className="text-gray-500">No lectures found.</p>
      )}

      <div className="space-y-4">
        {watchedLectures.map((lecture) => (
          <RecentLectureCard
            key={lecture.id}
            lectureId={lecture.id}
            title={lecture.title}
            courseTitle={lecture.courseTitle}
            courseCode={lecture.courseCode}
            duration={lecture.duration}
            percentageCompleted={lecture.percentageCompleted}
          />
        ))}
      </div>
    </div>
  );
}
