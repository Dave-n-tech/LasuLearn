"use client";
import axios from "@/app/api/axios";
import { useAppContext } from "@/app/context/AppContext";
import { Course, EnrolledCourse, Notification, Role, User } from "@/app/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface StudentDashboardContextType {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  user?: User | null;
  enrolledCourses: EnrolledCourse[];
  setEnrolledCourses: React.Dispatch<React.SetStateAction<EnrolledCourse[]>>;
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
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedAuthData = localStorage.getItem("authData");
    const authData = storedAuthData ? JSON.parse(storedAuthData) : null;

    async function fetchData() {
      try {
        const [enrolledRes, allCoursesRes] =
          await Promise.all([
            axios.get("/students/courses/enrollments", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("/students/courses/all", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        // console.log("Enrolled courses: ", enrolledRes.data)
        setEnrolledCourses(enrolledRes.data);
        setAllCourses(allCoursesRes.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    authData?.role === Role.STUDENT && fetchData();
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
        enrolledCourses,
        setEnrolledCourses,
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
