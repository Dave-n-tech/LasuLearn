import { PlayIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type LectureCardProps = {
  lectureId: string;
  title: string;
  courseTitle: string;
  duration: number;
  percentageCompleted: number;
};

export default function RecentLectureCard({
  lectureId,
  title,
  courseTitle,
  duration,
  percentageCompleted,
}: LectureCardProps) {
  return (
    <Link href={`/dashboard/student/lectures/${lectureId}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg hover:bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-3 rounded-lg">
            <PlayIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{title.toUpperCase()}</h3>
            <p className="text-sm text-gray-600">
              {`${courseTitle} • ${Math.round(duration / 60)} mins`}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-600 sm:ml-auto">
          {`${percentageCompleted}% completed`}
        </div>
      </div>
    </Link>
  );
}
