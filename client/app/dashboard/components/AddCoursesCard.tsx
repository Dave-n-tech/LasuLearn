import { Course } from "@/app/types";
import { BookOpenIcon, PlusIcon } from "lucide-react";
import React from "react";

type CardProps = {
  course: Course;
  enroll: (courseId: string) => Promise<any>;
  loading: boolean;
};

export default function AddCoursesCard({
  course,
  enroll,
  loading,
}: CardProps) {

  const handleClick = async () => {
    await enroll(String(course.id));
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpenIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{`${course.code} - ${course.title}`}</h3>
              <p className="text-sm text-gray-600">{`Instructor: ${course.lecturer.firstName} ${course.lecturer.lastName}`}</p>
              <p className="text-gray-400 text-sm my-2">{`${course.description?.substring(
                0,
                100
              )}...`}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {course.enrollments.length} enrolled
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClick}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            {loading ? "Enrolling..." : "Enroll"}
          </button>
        </div>
      </div>
    </>
  );
}
