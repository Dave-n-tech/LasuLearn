"use client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function page() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  // Mock data for now (you’ll fetch real course data from DB/API later)
  const [courseTitle, setCourseTitle] = useState("Introduction to Computer Science");
  const [courseCode, setCourseCode] = useState("CSC101");
  const [courseDescription, setCourseDescription] = useState("This course introduces the fundamentals of computer science, covering algorithms, data structures, and programming basics.");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to update course in DB
    console.log({
      courseTitle,
      courseCode,
      courseDescription,
    });
    router.push(`/dashboard/lecturer/courses/${courseId}`); // or wherever you want after saving
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
              <label className="block text-sm font-medium mb-1">Course Title</label>
              <Input 
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Course Code</label>
              <Input 
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Course Thumbnail</label>
              <Input type="file" accept="image/*" />
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing thumbnail.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea 
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
