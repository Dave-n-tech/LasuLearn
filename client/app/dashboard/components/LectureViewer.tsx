"use client";
import { useEffect, useState } from "react";
import axios from "@/app/api/axios";
import { CourseLecture } from "@/app/types";
import VideoPlayer from "./VideoPlayer";

type Props = {
  lectureId: string;
};

export default function LectureViewer({ lectureId }: Props) {
  const [lecture, setLecture] = useState<CourseLecture | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecture = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Access token not found");
      
      try {
        const res = await axios.get(`/students/lectures/${lectureId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        setLecture(data.lecture);
        // console.log("lecture data: ", data.lecture)
      } catch (err: any) {
        setError(err.message || "An error occurred");
        console.error("Error getting lecture: ", error);
      }
    };

    fetchLecture();
  }, [lectureId]);

  if (error) return <div>Error: {error}</div>;
  if (!lecture) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Title: {lecture.title}</h1>
      <VideoPlayer src={lecture.videoUrl} lecture={lecture} />
      <p className="text-sm text-gray-600 font-sans mt-8 bg-gray-300 rounded-md p-2">Tip: Watch in fullscreen view, so you can attempt the quizzes properly</p>
    </div>
  );
}
