"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLecturerDashboard } from "../../../context/lecturerContext";
import axios from "@/app/api/axios";
import toast from "react-hot-toast";

export default function page() {
  const { courseId, lectureId } = useParams();
  const router = useRouter();
  const { lecturerCourses, setShouldRefresh } = useLecturerDashboard()

  const lecture = lecturerCourses
    .flatMap(course => course.lectures)
    .find(lec => lec.id === Number(lectureId));

  const [title, setTitle] = useState(lecture?.title || "");
  const [videoUrl, setVideoUrl] = useState(lecture?.videoUrl || "");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (videoFile) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("video", videoFile);

        await axios.patch(
          `/lecturers/courses/lectures/${lectureId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.patch(
          `/lecturers/courses/lectures/${lectureId}`,
          { title },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("Lecture updated successfully!");
      setShouldRefresh(true);
      router.push(`/dashboard/lecturer/content`);
    } catch (error) {
      console.error("Error updating lecture:", error);
      toast.error("Failed to update lecture. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button variant="ghost" onClick={() => router.back()}>
        ← Back
      </Button>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Edit Lecture</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Lecture Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Current Video</Label>
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg mt-2"
              />
            </div>

            <div>
              <Label htmlFor="video">Upload New Video (optional)</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setVideoFile(e.target.files ? e.target.files[0] : null)
                }
              />
              {videoFile && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected: {videoFile.name}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="cursor-pointer" disabled={loading}>{loading ? "Saving..." :"Save Changes"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
