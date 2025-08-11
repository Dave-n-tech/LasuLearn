"use client";
import { Disc, MessageSquareIcon } from "lucide-react";
import React from "react";
import { useStudentDashboard } from "../student/context/studentContext";
import DiscussionCard from "./DiscussionCard";

export default function CourseDiscussions() {
  const { enrolledCourses } = useStudentDashboard();

  // get number of replies for each discussion post
  const discusionReplies = enrolledCourses.map((enrolled) => {
    return enrolled.course.discussionPosts.reduce((acc, post) => {
      return acc + post.replies.length;
    }, 0);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareIcon className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Course Discussions
            </h2>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700">
            Start New Discussion
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {enrolledCourses.map((enrolled, i) => (
            <DiscussionCard
              key={enrolled.id}
              enrolled={enrolled}
              index={i}
              replies={discusionReplies}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
