"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Edit, MoveLeft, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

type Lecture = {
  id: number;
  title: string;
  duration: string;
};

type Course = {
  id: string;
  title: string;
  code: string;
  description: string;
  lecturer: string;
  studentsEnrolled: number;
  lectures: number;
  thumbnail: string;
};

export default function page() {
  const { courseId } = useParams<{ courseId: string }>();

  const mockCourses = [
    {
      id: "1",
      title: "Advanced Web Development",
      code: "CSC401",
      description:
        "Modern web development techniques focusing on React, Node.js, and cloud deployment.",
      lecturer: "Dr. Jane Doe",
      studentsEnrolled: 120,
      lectures: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      lectureVideos: [
        { id: 1, title: "What is AI?", duration: "12:45" },
        { id: 2, title: "History of AI", duration: "18:20" },
        { id: 3, title: "Search Algorithms", duration: "25:10" },
      ],
    },
    {
      id: "2",
      title: "Data Structures and Algorithms",
      code: "CSC402",
      description:
        "Fundamental computer science concepts with practical implementations in JavaScript.",
      lecturer: "Mr. John Smith",
      studentsEnrolled: 95,
      lectures: 8,
      thumbnail:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      lectureVideos: [],
    },
    {
      id: "3",
      title: "Mobile App Development",
      code: "CSC403",
      description:
        "Cross-platform mobile development with React Native and Expo.",
      lecturer: "Mr. John Smith",
      studentsEnrolled: 95,
      lectures: 8,
      thumbnail:
        "https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      lectureVideos: [],
    },
    {
      id: "4",
      title: "UI/UX Design Principles",
      code: "CSC404",
      description:
        "Design thinking and user experience fundamentals for digital products.",
      lecturer: "Mr. John Smith",
      studentsEnrolled: 95,
      lectures: 8,
      thumbnail:
        "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      lectureVideos: [],
    },
    {
      id: "5",
      title: "Cloud Computing",
      code: "CSC405",
      description:
        "AWS, Azure, and Google Cloud fundamentals with practical deployment strategies.",
      lecturer: "Mr. John Smith",
      studentsEnrolled: 95,
      lectures: 8,
      thumbnail:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      lectureVideos: [],
    },
  ];

  const course = mockCourses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="p-6">
        <p className="text-red-500">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Link href={"/dashboard/lecturer/courses"}>
        <span className="mb-4 text-blue-500 hover:text-blue-700 font-semibold">
          <MoveLeft size={18} className="inline" />
          back to courses
        </span>
      </Link>

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
        <CardHeader className="flex justify-between items-center">
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
              {course.studentsEnrolled} Enrolled
            </span>
            <span className="flex items-center gap-1">
              📚 {course.lectures} Lectures
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Lecture Videos */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Lecture Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {course.lectureVideos?.map((lecture) => (
            <Card key={lecture.id} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle>{lecture.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Duration: {lecture.duration}
                </p>
                <Button variant="secondary" className="mt-3">
                  View Lecture
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
