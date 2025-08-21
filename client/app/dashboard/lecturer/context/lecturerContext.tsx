"use client";
import axios from "@/app/api/axios";
import { useAppContext } from "@/app/context/AppContext";
import { LecturerDashboardData, User } from "@/app/types";
import { createContext, useContext, useEffect, useState } from "react";

interface LecturerDashboardContextType {
  user: User | null;
  lecturerCourses: LecturerDashboardData[];
  setLecturerCourses: React.Dispatch<
    React.SetStateAction<LecturerDashboardData[]>
  >;
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
  const [lecturerCourses, setLecturerCourses] = useState<
    LecturerDashboardData[]
  >([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    async function fetchData() {
      try {
        const res = await axios.get("/lecturers/courses/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(res.data);
        setLecturerCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchData();
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
