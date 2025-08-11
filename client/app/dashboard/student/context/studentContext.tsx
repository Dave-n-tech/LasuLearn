"use client";
import axios from "@/app/api/axios";
import { useAppContext } from "@/app/context/AppContext";
import { Course, EnrolledCourse, Notification, User } from "@/app/types";
import { get } from "http";
import React, { createContext, useContext, useEffect, useState } from "react";

interface StudentDashboardContextType {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  user?: User | null;
  notifications: Notification[];
  enrolledCourses: EnrolledCourse[];
  allCourses: Course[];
  getCourseDetails: (courseId: string) => Promise<any>;
  setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const StudentDashboardContext = createContext<
  StudentDashboardContextType | undefined
>(undefined);

export function StudentDashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, setLoading } = useAppContext();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const [students, setStudents] = useState<User[]>([]);

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

      setAllCourses(courses);
    }

    async function getNotifications() {
      const res = await axios.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const notifications = res.data.notifications;
      setNotifications(notifications);
    }

    fetchStudentCourseData();
    getAllAvailableCourses();
    getNotifications();
  }, [shouldRefetch]);

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
      value={{
        error,
        setError,
        loading,
        setLoading,
        message,
        setMessage,
        user,
        notifications,
        enrolledCourses,
        allCourses,
        getCourseDetails,
        setShouldRefetch,
      }}
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
