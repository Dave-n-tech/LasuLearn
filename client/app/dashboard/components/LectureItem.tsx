import { CourseLectureProgress } from "@/app/types";
import { formatDistanceToNow } from "date-fns";
import { PlayIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  lecture: CourseLectureProgress;
  userId: string;
};

export default function LectureItem({ lecture, userId }: Props) {
  const progress = lecture.progresses.find((p) => p.userId === userId);
  let percent = progress
    ? Math.round((progress.watchTime / lecture.duration) * 100)
    : 0;
  
  return (
    <Link href={`/dashboard/student/lectures/${lecture.id}`}>
      <div className="p-4 hover:bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <PlayIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{lecture.title}</h4>
              <p className="text-sm text-gray-600">
                Duration:{" "}
                {lecture.duration < 60
                  ? `${lecture.duration} sec${
                      lecture.duration === 1 ? "" : "s"
                    }`
                  : `${Math.round(lecture.duration / 60)} min${
                      Math.round(lecture.duration / 60) === 1 ? "" : "s"
                    }`}
              </p>
            </div>
          </div>
          <div className="sm:ml-auto">
            <div className="flex flex-col sm:items-end">
              <div className="text-sm text-gray-600 mb-1">
                {percent === 0
                  ? "Not started"
                  : percent === 100 && progress?.watched
                  ? "Completed"
                  : `${percent}% completed`}
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 h-2 rounded-full w-32">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {progress?.watched &&
                    `Completed:  
                  ${
                    progress && progress.completedAt !== null
                      ? formatDistanceToNow(new Date(progress.completedAt), {
                          addSuffix: true,
                        })
                      : "Not completed"
                  }`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
