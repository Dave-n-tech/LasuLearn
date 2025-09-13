"use client";
import React from "react";
import { PlayIcon, UsersIcon, BookOpenIcon } from "lucide-react";
import Link from "next/link";
import { useAppContext } from "../context/AppContext";

export default function HeroSection() {
  const { user } = useAppContext();

  return (
    <section className="bg-gradient-to-br from-blue-800 via-blue-900 to-teal-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Smarter Learning,
              <br />
              <span className="text-teal-300">Smarter Attendance</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Transform your university's learning experience with our advanced
              video-based platform. Track attendance through intelligent
              playback monitoring and interactive quizzes.
            </p>
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href={`/dashboard/${user.role.toLowerCase()}/?id=${user.id}`}
                  className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors mb-12"
                >
                  Dashboard
                </Link>
                <Link
                  href={"https://forms.gle/ChLQD5SbsPB6YUBt9"}
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors mb-12"
                >
                  Share Feedback
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href={"/login/student"}
                  className="text-center bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                >
                  Login as Student
                </Link>
                <Link
                  href={"/login/lecturer"}
                  className="text-center bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                >
                  Login as Lecturer
                </Link>
                <Link
                  href={"https://forms.gle/ChLQD5SbsPB6YUBt9"}
                  className="text-center bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                >
                  Share Feedback
                </Link>
                {/* <Link href={"/login/admin"} className="text-center bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Admin Access
              </Link> */}
              </div>
            )}
            <div className="flex items-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <PlayIcon className="w-5 h-5" />
                <span>Video Lectures</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                <span>Smart Attendance</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5" />
                <span>Interactive Quizzes</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="bg-blue-600 h-32 rounded-md flex items-center justify-center">
                  <PlayIcon className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-white/20 h-3 rounded-full">
                  <div className="bg-teal-400 h-3 rounded-full w-3/4"></div>
                </div>
                <p className="text-sm text-blue-100">Lecture Progress: 75%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
