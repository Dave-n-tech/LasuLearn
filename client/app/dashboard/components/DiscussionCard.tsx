import { EnrolledCourse } from "@/app/types";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type DiscussionCardProps = {
  enrolled: EnrolledCourse;
  index: number;
  replies: number[];
};

export default function DiscussionCard({
  enrolled,
  index,
  replies,
}: DiscussionCardProps) {
  return (
    <Link
      href={`/dashboard/student/discussions/${enrolled.courseId}`}
    >
      <div className="p-4 rounded-lg hover:bg-gray-50 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">
            {`${enrolled.course.code} discussions`}
          </h3>
          <span className="text-sm text-gray-600">
            {formatDistanceToNow(
              new Date(enrolled.course.discussionPosts[0].createdAt),
              { addSuffix: true }
            )}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Latest reply: {enrolled.course.discussionPosts[0].content}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{replies[index]} replies</span>
        </div>
      </div>
    </Link>
  );
}
