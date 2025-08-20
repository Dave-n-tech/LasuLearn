"use client"; 
import React from "react";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  BookOpenIcon,
  CheckCircleIcon,
} from "lucide-react";
import Link from "next/link";

// Mock lecturer data
const mockLecturer = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@university.edu",
  phone: "+234 801 234 5678",
  department: "Computer Science",
  faculty: "Faculty of Science",
  coursesTaught: [
    { id: 1, name: "Data Structures" },
    { id: 2, name: "Operating Systems" },
    { id: 3, name: "Software Engineering" },
  ],
  completedCourses: 2, // e.g., courses fully taught or delivered
};

export default function LecturerProfilePage() {
  const userName = `${mockLecturer.firstName} ${mockLecturer.lastName}`;
  const totalCourses = mockLecturer.coursesTaught.length;
  const completedCourses = mockLecturer.completedCourses;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {userName}
              </h2>
              <p className="text-sm text-gray-600">{mockLecturer.department}</p>
              <p className="text-sm text-gray-600">{mockLecturer.faculty}</p>
            </div>
            <Link
              href={"/dashboard/edit-profile"}
              className="ml-auto px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <button>Edit Profile</button>
            </Link>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MailIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{mockLecturer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{mockLecturer.phone}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Teaching Overview
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpenIcon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Courses Taught</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalCourses}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Completed Courses</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{`${completedCourses} / ${totalCourses}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

