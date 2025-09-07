"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save course data
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
              <Input id="title" name="title" placeholder="Enter course title" required />
            </div>

            {/* Course Code */}
            <div>
              <Label htmlFor="code">Course Code</Label>
              <Input id="code" name="code" placeholder="e.g. CSC401" required />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter course description"
                className="resize-none"
              />
            </div>

            {/* Thumbnail Upload */}
            <div>
              <Label htmlFor="thumbnail">Course Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              />
              {thumbnail && (
                <p className="text-sm text-gray-600 mt-1">Selected: {thumbnail.name}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Create Course</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
