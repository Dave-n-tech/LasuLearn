import { BookOpenIcon, PlusIcon, SearchIcon } from "lucide-react";
import React from "react";

export default function page() {
  const availableCourses = [
    {
      id: 1,
      title: "Advanced Web Development",
      instructor: "Dr. Sarah Johnson",
      schedule: "Mon, Wed 10:00 AM",
      duration: "12 weeks",
      enrolled: 45,
      capacity: 60,
    },
    {
      id: 2,
      title: "Data Structures and Algorithms",
      instructor: "Prof. Michael Chen",
      schedule: "Tue, Thu 2:00 PM",
      duration: "16 weeks",
      enrolled: 38,
      capacity: 50,
    },
    // ... more courses
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Add Courses</h1>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Search courses..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64"
          />
        </div>
      </div>
      <div className="grid gap-6">
        {availableCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpenIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {course.schedule}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {course.duration}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {course.enrolled}/{course.capacity} enrolled
                    </span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="w-5 h-5" />
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
