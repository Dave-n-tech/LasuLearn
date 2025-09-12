"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Edit, MoveLeft, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { useLecturerDashboard } from "../../context/lecturerContext";

export default function page() {
  const { courseId } = useParams<{ courseId: string }>();
  const { lecturerCourses } = useLecturerDashboard();

  const course = lecturerCourses.find((c) => c.id === Number(courseId));

  if (!course) {
    return (
      <div className="p-6">
        <p className="text-red-500">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-4">
        <Link href={"/dashboard/lecturer/courses"}>
          <Button variant="outline" className="flex items-center gap-2">
            ← Back to courses
          </Button>
        </Link>
      </div>

      {/* Thumbnail + Title */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Course Info */}
      <Card className="shadow-md">
        <CardHeader className="flex justify-between items-center flex-wrap">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            {course.title} ({course.code})
          </CardTitle>

          {/* Edit Button */}
          <Link href={`/dashboard/lecturer/courses/${course.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Course
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-700">{course.description}</p>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.enrollments.length} Enrolled
            </span>
            <span className="flex items-center gap-1">
              📚 {course.lectures.length} Lectures
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Lecture Videos */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Lecture Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {course.lectures?.map((lecture) => (
            <Card key={lecture.id} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle>{lecture.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Duration: {lecture.duration} seconds
                </p>
                <Link href={`/dashboard/lecturer/content/${lecture.id}`}>
                  <Button variant="secondary" className="mt-3">
                    View Lecture
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
