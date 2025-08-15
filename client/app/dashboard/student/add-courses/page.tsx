"use client";
import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddCoursesCard from "../../components/AddCoursesCard";
import { useStudentDashboard } from "../context/studentContext";
import { Course } from "@/app/types";
import axios from "@/app/api/axios";

export default function page() {
  const {
    enrolledCourses,
    allCourses,
    loading,
    setLoading,
    error,
    setError,
    message,
    setMessage,
    setShouldRefetch,
  } = useStudentDashboard();
  const [notEnrolledCourses, setNotEnrolledCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const enrolledCourseIds = new Set(enrolledCourses.map((c) => c.courseId));
    const notEnrolledCourses = allCourses.filter(
      (course) => !enrolledCourseIds.has(course.id)
    );

    setNotEnrolledCourses(notEnrolledCourses);
  }, [enrolledCourses, allCourses]);

  const handleEnrollCourse = async (courseId: string) => {
    const token = localStorage.getItem("authToken");

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `/students/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShouldRefetch((prev) => !prev);
      setMessage("You have been successfully enrolled in the course!");
      // return res;
    } catch (error: any) {
      console.error("An error occurred while enrolling in the course", error);
      setError(
        "An error occurred while enrolling the course. Please try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = notEnrolledCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Add Courses</h1>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={() => setError(null)}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l3.029-2.651-3.029-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.183l2.651-3.029a1.2 1.2 0 1 1 1.697 1.697L11.819 10l3.029 2.651a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}

        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">{message}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={() => setMessage(null)}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l3.029-2.651-3.029-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.183l2.651-3.029a1.2 1.2 0 1 1 1.697 1.697L11.819 10l3.029 2.651a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}
        {filteredCourses.length === 0 ? (
          <p> No courses available.</p>
        ) : (
          filteredCourses.map((course) => (
            <AddCoursesCard
              key={course.id}
              course={course}
              enroll={handleEnrollCourse}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
}
