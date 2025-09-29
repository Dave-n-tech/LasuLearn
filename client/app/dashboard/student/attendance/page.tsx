"use client";
import React from "react";
import { useStudentDashboard } from "../context/studentContext";
import { formatDistanceToNow } from "date-fns";

export default function page() {
  const { enrolledCourses } = useStudentDashboard();

  const courses = enrolledCourses.map((enrolled) => enrolled.course);
  const lectures = courses.flatMap((course) => course.lectures);
  const totalLectures = lectures.length;

  const attendedLectures = lectures.filter(
    (lecture) => lecture.attendanceLogs[0]?.wasPresent
  ).length;

  const attendancePercent =
    totalLectures > 0
      ? ((attendedLectures / totalLectures) * 100).toFixed(1)
      : 0;

  const lecturesWithLogs = lectures.filter((l) => l.attendanceLogs.length > 0);

  const avgEngagement =
    lecturesWithLogs.length > 0
      ? (
          lecturesWithLogs.reduce(
            (sum, r) => sum + r.attendanceLogs[0].engagementScore,
            0
          ) / lecturesWithLogs.length
        ).toFixed(1)
      : 0;

  // const quizzes = lectures.flatMap((lecture) => lecture.quizzes);
  // const passedQuizzes = lectures.flatMap((lecture) => {
  //   lecture.quizSubmissions.filter((sub) => sub.isCorrect);
  // });

  return (
    <div className="p-4 sm:p-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Lectures</p>
          <h2 className="text-lg sm:text-xl font-bold">{totalLectures}</h2>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Attended</p>
          <h2 className="text-lg sm:text-xl font-bold">{attendedLectures}</h2>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Attendance %</p>
          <h2 className="text-lg sm:text-xl font-bold">{attendancePercent}%</h2>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Avg. Engagement</p>
          <h2 className="text-lg sm:text-xl font-bold">{avgEngagement}%</h2>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left min-w-[600px]">
          <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] sm:text-xs">
            <tr>
              <th className="px-2 sm:px-4 py-2">Lecture</th>
              <th className="px-2 sm:px-4 py-2">Date</th>
              <th className="px-2 sm:px-4 py-2">Attendance</th>
              <th className="px-2 sm:px-4 py-2">Engagement</th>
              <th className="px-2 sm:px-4 py-2">Quiz</th>
            </tr>
          </thead>
          <tbody>
            {lectures.map((lecture) => {
              const totalQuizzes = lecture.quizzes.length;
              const passedSubmissions = lecture.quizSubmissions.filter(
                (sub) => sub.isCorrect
              );

              console.log(passedSubmissions)

              return (
                <tr key={lecture.id} className="border-b">
                  <td className="px-2 sm:px-4 py-2">{lecture.title}</td>
                  <td className="px-2 sm:px-4 py-2">
                    {lecture.attendanceLogs[0]?.markedAt
                      ? formatDistanceToNow(
                          new Date(lecture.attendanceLogs[0]?.markedAt),
                          {
                            addSuffix: true,
                          }
                        )
                      : "Not marked"}
                  </td>
                  <td className="px-2 sm:px-4 py-2">
                    {lecture.attendanceLogs[0]?.wasPresent ? (
                      <span className="text-green-600 font-medium">
                        Present
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">Absent</span>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2">
                    {lecture.attendanceLogs[0]?.engagementScore || 0}%
                  </td>
                  <td className="px-2 sm:px-4 py-2">{`${passedSubmissions?.length}/${totalQuizzes}`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
