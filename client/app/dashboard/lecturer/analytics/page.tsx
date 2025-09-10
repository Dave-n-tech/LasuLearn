"use client";
import React, { useState } from "react";
import {
  BarChart3Icon,
  TrendingUpIcon,
  ClockIcon,
  DownloadIcon,
  FilterIcon,
} from "lucide-react";
import { useLecturerDashboard } from "../context/lecturerContext";
import { LecturerCourse } from "@/app/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export default function Page() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const { lecturerCourses } = useLecturerDashboard();

  // helper to calculate stats per course
  const buildCourseStats = (course: LecturerCourse) => {
    const students = course.enrollments?.length || 0;
    const lectures = course.lectures?.length || 0;

    // count total quizzes
    const quizzes = course.lectures?.reduce(
      (sum, lecture) => sum + (lecture.quizzes?.length || 0),
      0
    );

    // engagement (average engagement score across logs)
    const allEngagements = course.lectures?.flatMap(
      (lecture) =>
        lecture.attendanceLogs?.map((log) => log.engagementScore) || []
    );
    const engagement =
      allEngagements && allEngagements.length > 0
        ? Math.round(
            allEngagements.reduce((a, b) => a + b, 0) / allEngagements.length
          )
        : 0;

    // completion (students who completed at least one lecture / total)
    const completedStudents = course.enrollments?.filter((enroll) =>
      enroll.user?.lectureProgresses?.some((p) => p.watched === true)
    ).length;
    const completion =
      students > 0 ? Math.round((completedStudents / students) * 100) : 0;

    // attendance (present logs / total logs)
    const allAttendance = course.lectures?.flatMap(
      (lecture) => lecture.attendanceLogs || []
    );
    const presentCount = allAttendance.filter((log) => log.wasPresent).length;
    const attendance =
      allAttendance.length > 0
        ? Math.round((presentCount / allAttendance.length) * 100)
        : 0;

    const totalWatchTimeSecs =
      course.lectures
        ?.flatMap(
          (lecture) =>
            lecture.progresses?.map((log) => log.watchTime || 0) || []
        )
        .reduce((a, b) => a + b, 0) || 0;
    const watchTime = Math.round(totalWatchTimeSecs / 3600); // in hours

    const allSubmissions = course.lectures?.flatMap(
      (lecture) => lecture.quizSubmissions || []
    );
    const quizCompletion =
      quizzes > 0
        ? Math.round((allSubmissions.length / (quizzes * students)) * 100)
        : 0;

    return {
      id: course.id,
      title: course.title,
      students,
      lectures,
      quizzes,
      engagement,
      completion,
      attendance,
      watchTime,
      quizCompletion,
    };
  };

  // build stats from real data
  const courseStatistics = lecturerCourses.map(buildCourseStats);

  // Filter course statistics based on selected course
  const filteredCourseStats =
    selectedCourse === "all"
      ? courseStatistics
      : courseStatistics.filter(
          (course) => course.id.toString() === selectedCourse
        );

  // Mock overall analytics (can recalc later)
  const analyticsData = {
    averageEngagement: Math.round(
      courseStatistics.reduce((a, c) => a + c.engagement, 0) /
        (courseStatistics.length || 1)
    ),
    watchTime: Math.round(
      courseStatistics.reduce((acc, c) => acc + c.watchTime, 0)
    ),
    quizCompletion: Math.round(
      courseStatistics.reduce((acc, c) => acc + c.quizCompletion, 0)
    ),
    attendanceRate: Math.round(
      courseStatistics.reduce((a, c) => a + c.attendance, 0) /
        (courseStatistics.length || 1)
    ),
    studentParticipation: 88,
    courseCompletionRate: Math.round(
      courseStatistics.reduce((a, c) => a + c.completion, 0) /
        (courseStatistics.length || 1)
    ),
  };

  const handleExportPDF = () => {
    if (!filteredCourseStats || filteredCourseStats.length === 0) {
      alert("No student data available to export.");
      return;
    }

    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(16);
      const title =
        selectedCourse && selectedCourse !== "all"
          ? `Analytics Report - ${selectedCourse}`
          : "Analytics Report - All Courses";
      doc.text(title, 14, 20);

      // Build table
      const tableColumn = [
        "Course",
        "Students",
        "Lectures",
        "Quizzes",
        "Engagement (%)",
        "Completion (%)",
        "Attendance (%)",
      ];
      const tableRows = filteredCourseStats.map((course) => [
        `${course.title}`,
        course.students,
        course.lectures,
        `${course.engagement}%`,
        `${course.completion}%`,
        `${course.attendance}%`,
      ]);

      // AutoTable
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 123, 255] },
      });

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text("Generated by Lecturer Dashboard", 14, pageHeight - 10);

      // Save
      const fileName =
        selectedCourse && selectedCourse !== "all"
          ? `analytics-report-${selectedCourse}.pdf`
          : "analytics-report-all.pdf";

      doc.save(fileName);
      toast.success("PDF report generated successfully!");
    } catch (error) {
      console.log("Error generating PDF:", error);
      toast.error(
        "An error occurred while generating the PDF. Please try again."
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white"
            >
              <option value="all">All Time</option>
              <option value="month">Past Month</option>
              <option value="week">Past Week</option>
            </select>
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUpIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Engagement</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.averageEngagement}%
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
              <p className="text-sm text-gray-600">Watch Time</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.watchTime}h
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3Icon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Quiz Completion</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.quizCompletion}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Course Analytics
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white"
                >
                  <option value="all">All Courses</option>
                  {lecturerCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleExportPDF}
                className="cursor-pointer flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lectures
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quizzes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourseStats.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {course.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {course.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {course.lectures}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {course.quizzes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${course.engagement}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.engagement}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${course.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.completion}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${course.attendance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.attendance}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
