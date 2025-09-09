"use client";
import React, { useState, Component, useEffect } from "react";
import {
  HelpCircleIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  BarChart3Icon,
} from "lucide-react";
import Link from "next/link";
import { useLecturerDashboard } from "../context/lecturerContext";
import { formatDistanceToNow } from "date-fns";
import axios from "@/app/api/axios";
import toast from "react-hot-toast";

interface QuizSubmission {
  id: number;
  userId: number;
  isCorrect: boolean;
  selectedAnswer: string;
  quizId: number;
  lectureId: number;
  submittedAt: Date;
}

export default function page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const { lecturerCourses, setShouldRefresh } = useLecturerDashboard();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const quizzes = lecturerCourses.flatMap((course) =>
    course.lectures.flatMap((lecture) =>
      lecture.quizzes.map((quiz) => ({
        ...quiz,
        lectureTitle: lecture.title,
        courseTitle: course.title,
        averageScore: 0,
      }))
    )
  );

  const quizSubmissions = lecturerCourses.flatMap((course) =>
    course.lectures.map((lecture) => lecture.quizSubmissions)
  );

  function getLectureAverage(submissions: QuizSubmission[], lectureId: number) {
    const lectureSubs = submissions.filter((s) => s.lectureId === lectureId);
    if (lectureSubs.length === 0) return 0;

    const correctCount = lectureSubs.filter((s) => s.isCorrect).length;
    return (correctCount / lectureSubs.length) * 100; // percentage score
  }

  useEffect(() => {
    console.log(quizSubmissions);
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    quiz.averageScore = getLectureAverage(
      quizSubmissions.flat(),
      quiz.id
    );

    const matchesSearch =
      quiz.lectureTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "high-performance")
      return matchesSearch && quiz.averageScore >= 85;
    if (filter === "low-performance")
      return matchesSearch && quiz.averageScore < 80;
    return matchesSearch;
  });

  const handleDelete = async (quizId: number) => {
    try {
      await axios.delete(`/lecturers/lectures/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      toast.success("Quiz successfully deleted");
      setShouldRefresh(true)
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Management</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search quizzes..."
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
              <option value="all">All Quizzes</option>
              <option value="high-performance">High Performance</option>
              <option value="low-performance">Low Performance</option>
            </select>
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <Link
            href="/dashboard/lecturer/quizzes/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5" />
            Create Quiz
          </Link>
        </div>
      </div>
      {filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <p className="text-gray-600">
            No quizzes found matching your search.
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
                    Lecture / Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Questions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Submissions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Performance
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
                {filteredQuizzes.map((quiz, i) => {
                  quiz.averageScore = getLectureAverage(
                    quizSubmissions.flat(),
                    quiz.id
                  );      
                  return (
                    <tr key={quiz.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {quiz.lectureTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          {quiz.courseTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {quiz.question}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {quizSubmissions[i].length}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              quiz.averageScore >= 90
                                ? "bg-green-500"
                                : quiz.averageScore >= 75
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                            style={{
                              width: `${quiz.averageScore}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {quiz.averageScore}%
                        </span>
                      </div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {/* <Link
                        href={`/dashboard/lecturer/quizzes/${quiz.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Details
                      </Link> */}
                        <Link
                          href={`/dashboard/lecturer/quizzes/${quiz.id}/edit`}
                          className="text-gray-600 hover:text-gray-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(quiz.id)}
                          className="text-red-600 hover:text-red-900 mr-4 cursor-pointer"
                        >
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
