"use client";
import axios from "@/app/api/axios";
import { useAppContext } from "@/app/context/AppContext";
import { LecturerCourse, Role, User } from "@/app/types";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface LecturerDashboardContextType {
  user: User | null;
  lecturerCourses: LecturerCourse[];
  setLecturerCourses: React.Dispatch<React.SetStateAction<LecturerCourse[]>>;
}

const lecturerDashboardContext = createContext<
  LecturerDashboardContextType | undefined
>(undefined);

export function LecturerDashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAppContext();
  const [lecturerCourses, setLecturerCourses] = useState<LecturerCourse[]>([]);
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedAuthData = localStorage.getItem("authData");
    const authData = storedAuthData ? JSON.parse(storedAuthData) : null;

    async function fetchData() {
      try {
        const res = await axios.get("/lecturers/courses/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("from the fetchData function", res.data);
        setLecturerCourses(res.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    authData?.role === Role.LECTURER && fetchData();
  }, []);

  return (
    <lecturerDashboardContext.Provider
      value={{ user, lecturerCourses, setLecturerCourses }}
    >
      {children}
    </lecturerDashboardContext.Provider>
  );
}

export const useLecturerDashboard = () => {
  const context = useContext(lecturerDashboardContext);
  if (context === undefined) {
    throw new Error(
      "useLecturerDashboard must be used within a LecturerDashboardProvider"
    );
  }
  return context;
};
