"use client";
import { Disc, MessageSquareIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useStudentDashboard } from "../student/context/studentContext";
import DiscussionCard from "./DiscussionCard";
import axios from "@/app/api/axios";
import { useLecturerDashboard } from "../lecturer/context/lecturerContext";
import { EnrolledCourse, LecturerCourse, Role } from "@/app/types";

export default function CourseDiscussions() {
  const { enrolledCourses } = useStudentDashboard();
  const { lecturerCourses } = useLecturerDashboard();
  const [courses, setCourses] = useState<(EnrolledCourse | LecturerCourse)[]>(
    []
  );
  const [authData, setAuthData] = useState<any>(null);

  useEffect(() => {
    const storedAuthData = localStorage.getItem("authData");
    const authData = storedAuthData ? JSON.parse(storedAuthData) : null;
    setAuthData(authData);
  }, []);

  // get number of replies for each discussion post
  const discusionReplies =
    authData?.role === Role.STUDENT
      ? enrolledCourses.map((enrolled) => {
          return enrolled.course.discussionPosts.reduce((acc, post) => {
            return acc + (post.replies ?? []).length;
          }, 0);
        })
      : lecturerCourses.map((course) => {
          return course.discussionPosts.reduce((acc, post) => {
            return acc + (post.replies ?? []).length;
          }, 0);
        });

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareIcon className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Course Discussions
            </h2>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {enrolledCourses.length !== 0 ? (
            enrolledCourses.map((enrolled, i) => (
              <DiscussionCard
                key={enrolled.id}
                enrolled={enrolled}
                index={i}
                replies={discusionReplies}
              />
            ))
          ) : lecturerCourses.length !== 0 ? (
            lecturerCourses.map((course, i) => (
              <DiscussionCard
                key={course.id}
                course={course}
                index={i}
                replies={discusionReplies}
              />
            ))
          ) : (
            <p>No dicussions available</p>
          )}
        </div>
      </div>
    </div>
  );
}
