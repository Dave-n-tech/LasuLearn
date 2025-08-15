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
  console.log("Enrolled Course:", enrolled);

  const latestPost = enrolled.course.discussionPosts[0];
  const latestReply = latestPost?.replies?.[0];

  // console.log("Latest Post:", latestPost);
  return (
    <Link href={`/dashboard/discussions/${enrolled.courseId}`}>
      <div className="p-4 rounded-lg hover:bg-gray-50 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">
            {`${enrolled.course.title} - ${enrolled.course.code} discussions`}
          </h3>
          <span className="text-sm text-gray-600">
            {enrolled.course.discussionPosts?.length > 0
              ? formatDistanceToNow(
                  new Date(enrolled.course.discussionPosts[0].createdAt),
                  { addSuffix: true }
                )
              : "No posts yet"}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Latest reply: {enrolled.course.discussionPosts?.length > 0 ? enrolled.course.discussionPosts[0].content : "No discussions yet"}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{replies[index]} replies</span>
        </div>
      </div>
    </Link>
  );
}
