"use client";
import { FilterIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useStudentDashboard } from "../context/studentContext";
import CourseSection from "../../components/CourseSection";

type Filter = "all" | "in-progress" | "completed" | "not-started";

export default function page() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { enrolledCourses } = useStudentDashboard();

  const toggleCourse = (courseId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Lectures</h1>
      </div>

      {enrolledCourses.map((enrolled) => (
        <CourseSection
          key={enrolled.course.id}
          enrolled={enrolled}
          expanded={!!expanded[enrolled.course.id]}
          onToggle={() => toggleCourse(enrolled.course.id)}
        />
      ))}
    </div>
  );
}
