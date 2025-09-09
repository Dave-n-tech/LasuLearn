"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import axios from "@/app/api/axios";
import toast from "react-hot-toast";
import { useLecturerDashboard } from "../../context/lecturerContext";

export default function page() {
  const router = useRouter();
  const { setShouldRefresh } = useLecturerDashboard()
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !code || !description || !thumbnail) {
      alert("Please fill in all fields and upload a thumbnail.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("code", code);
    formData.append("description", description);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const res = await axios.post("/lecturers/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Course created successfully!");
      setShouldRefresh(true)
      router.push("/dashboard/lecturer/courses");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong creating the course.");
    } finally {
      setLoading(false);
    }

    console.log("Course created");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
      </div>

      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Create a New Course</h2>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Course Title */}
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Course Code */}
            <div>
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                name="code"
                placeholder="e.g. CSC401"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter course description"
                className="resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Thumbnail Upload */}
            <div>
              <Label htmlFor="thumbnail">Course Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {thumbnail && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {thumbnail.name}
                </p>
              )}
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="mt-2 h-32 w-auto rounded-md border"
                />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="cursor-pointer" disabled={loading}>
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
