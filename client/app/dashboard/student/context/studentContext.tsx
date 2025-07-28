'use client';
import { useAppContext } from "@/app/context/AppContext";
import { User } from "@/app/types";
import React, { createContext, useContext } from "react";

interface StudentDashboardContextType {
  loading: boolean;
  user: User | null;
}

// data to return
/**
 * Enrolled courses
 * total hours watched
 * completed quizzes
 * recent lectures with progress
 * courses with progress on lectures watched
 * Courses available to enroll in
*/

const StudentDashboardContext = createContext<StudentDashboardContextType | undefined>(undefined);

export function StudentdDashboardProvider({ children }: {children: React.ReactNode}){
  const [loading, setLoading] = React.useState<boolean>(false);
  const { user } = useAppContext()

  return (
    <StudentDashboardContext.Provider value={{ loading, user }}>
      {children}
    </StudentDashboardContext.Provider>
  );
}

export const useStudentDashboard = () => {
  const context = useContext(StudentDashboardContext);
  if (context === undefined) {
    throw new Error('useStudentDashboard must be used within a StudentDashboardProvider');
  }
  return context;
};