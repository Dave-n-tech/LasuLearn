"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function page() {
  const { courseId, lectureId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("Sample Lecture Title");
  const [videoUrl, setVideoUrl] = useState("https://example.com/video.mp4");
  const [duration, setDuration] = useState(45);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: handle API request to update lecture
    // If videoFile exists, upload new file before saving changes
    console.log({
      title,
      duration,
      videoUrl,
      newVideo: videoFile,
    });

    router.push(`/lecturer/courses/${courseId}/lectures/${lectureId}`);
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
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
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
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
