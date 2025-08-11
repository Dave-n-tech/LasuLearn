"use client";
import { useEffect, useState } from "react";
import { useStudentDashboard } from "../../context/studentContext";
import { useParams } from "next/navigation";
import { DiscussionPost } from "@/app/types";


export default function page() {
  const { courseId } = useParams<{ courseId: string }>();
  const { enrolledCourses } = useStudentDashboard();
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
  const [newPost, setNewPost] = useState("");


  useEffect(() => {
    const course = enrolledCourses.find(
      (enrolled) => String(enrolled.course.id) === String(courseId)
    )?.course;


    const posts = course?.discussionPosts;
    console.log("Discussion posts for course: ", posts);
    setDiscussionPosts(posts || []);
  }, [courseId]);

  


  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;


    const newDiscussionPost: DiscussionPost = {
      id: Date.now().toString(),
      courseId: courseId,
      content: newPost,
      createdAt: new Date(),
    };


    setDiscussionPosts([newDiscussionPost, ...discussionPosts]);
    setNewPost("");
  };


  return <div>discussions for course {courseId}</div>;
}



