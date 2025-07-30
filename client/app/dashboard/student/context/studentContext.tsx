"use client";
import axios from "@/app/api/axios";
import { useAppContext } from "@/app/context/AppContext";
import { EnrolledCourse, Notification, User } from "@/app/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface StudentDashboardContextType {
  loading: boolean;
  user?: User | null;
  notifications: Notification[];
  enrolledCourses: EnrolledCourse[];
  getCourseDetails: (courseId: string) => Promise<any>;
}

// data to return
/**
 * Enrolled courses: /api/students/courses/enrollments
 * total hours watched
 * completed quizzes
 * recent lectures with progress
 * courses with progress on lectures watched
 * Courses available to enroll in
 */

const StudentDashboardContext = createContext<
  StudentDashboardContextType | undefined
>(undefined);

export function StudentDashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAppContext();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    async function fetchStudentCourseData() {
      const res = await axios.get("/students/courses/enrollments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const enrolledCourses = res.data;
      setEnrolledCourses(enrolledCourses);
    }

    async function getAllAvailableCourses() {
      const res = await axios.get("/students/courses/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const courses = res.data;

      console.log("all available courses: ", courses);
    }

    async function getNotifications() {
      const res = await axios.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const notifications = res.data.notifications;
      setNotifications(notifications)

      console.log("Notifications: ", notifications);
    }

    fetchStudentCourseData();
    getAllAvailableCourses();
    getNotifications();
  }, []);

  const getCourseDetails = async (courseId: string) => {
    const token = localStorage.getItem("authToken");
    const res = await axios.get(`/student/courses/${courseId}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const courseDetails = res.data;

    return courseDetails;
  };

  return (
    <StudentDashboardContext.Provider
      value={{ loading, user, notifications, enrolledCourses, getCourseDetails }}
    >
      {children}
    </StudentDashboardContext.Provider>
  );
}

export const useStudentDashboard = () => {
  const context = useContext(StudentDashboardContext);
  if (context === undefined) {
    throw new Error(
      "useStudentDashboard must be used within a StudentDashboardProvider"
    );
  }
  return context;
};
