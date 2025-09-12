"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLecturerDashboard } from "../../context/lecturerContext";
import axios from "@/app/api/axios";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const { lecturerCourses, setShouldRefresh } = useLecturerDashboard();
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState<number | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const sendNotifications = async (courseId: number) => {
    const course = lecturerCourses.find((c) => c.id === courseId);

    try {
      const res = await axios.post(
        `/notifications/course/${courseId}`,
        {
          title: "New Lecture added",
          message: `A new lecture titled "${title}" has been added to your course ${course?.title}-${course?.code}. Check it out!`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Notifications sent to enrolled students.");
    } catch (error) {
      console.error("Error sending notifications:", error);
      toast.error("Failed to send notifications to students.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !courseId || !videoFile) {
      alert("Please fill in all fields and upload a video.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", videoFile);

    setLoading(true);
    try {
      const res = await axios.post(
        `/lecturers/courses/${courseId}/lectures`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      toast.success("Lecture created successfully!");
      await sendNotifications(courseId);
      setShouldRefresh(true);
      router.push(`/dashboard/lecturer/courses/${courseId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create lecture. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Create New Lecture</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Lecture Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Lecture Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter lecture title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Select Course */}
        <div className="space-y-2">
          <Label>Select Course</Label>
          <Select onValueChange={(value) => setCourseId(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a course" />
            </SelectTrigger>
            <SelectContent>
              {lecturerCourses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Video */}
        <div className="space-y-2">
          <Label htmlFor="video">Upload Lecture Video</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Submit */}
        <Button
          disabled={loading}
          type="submit"
          className="w-full cursor-pointer"
        >
          {loading ? "creating..." : "Create Lecture"}
        </Button>
      </form>
    </div>
  );
}
