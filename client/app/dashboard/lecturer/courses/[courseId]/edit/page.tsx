"use client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useLecturerDashboard } from "../../../context/lecturerContext";
import axios from "@/app/api/axios";
import toast from "react-hot-toast";

export default function page() {
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  const { lecturerCourses, setShouldRefresh } = useLecturerDashboard();
  const [loading, setLoading] = useState(false);

  const course = lecturerCourses.find((c) => c.id === Number(courseId));

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // Mock data for now (you’ll fetch real course data from DB/API later)
  const [courseTitle, setCourseTitle] = useState(course?.title || "");
  const [courseCode, setCourseCode] = useState(course?.code || "");
  const [courseDescription, setCourseDescription] = useState(course?.description || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { data } = await axios.patch(
        `/lecturers/courses/${courseId}`,
        {
          title: courseTitle,
          code: courseCode,
          description: courseDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Course updated:", data);
      toast.success("Course updated successfully");
      setShouldRefresh(true);
      router.push(`/dashboard/lecturer/courses/${courseId}`);
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
      setLoading(false);
    } finally{
      setLoading(false)
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
      </div>

      {/* Edit Course Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Course Title
              </label>
              <Input
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Course Code
              </label>
              <Input
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Course Thumbnail
              </label>
              <Input type="file" accept="image/*" />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to keep existing thumbnail.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
