"use client";
import React, { useState, useEffect } from "react";
import { MenuIcon, BellIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { Role, SidebarLink } from "../types";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { StudentdDashboardProvider } from "./student/context/studentContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading, StudentSideBarLinks, LecturerSideBarLinks } =
    useAppContext();
  const router = useRouter();
  const userName =
    `${user?.firstName} ${user?.lastName}`.trim() || "Unavailable";

  const sidebarLinks: SidebarLink[] =
    user?.role === Role.STUDENT
      ? StudentSideBarLinks
      : user?.role === Role.LECTURER
      ? LecturerSideBarLinks
      : [];

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login/student");
      return;
    }
  }, [loading, user]);

  // Data fetching for dashboard data will be handled here

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading dashboard...</p>
        {/* You can add a spinner here */}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        sidebarLinks={sidebarLinks}
        userRole={user?.role}
        userName={userName}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
              <Link
                href={"/"}
                className="text-xl font-bold text-blue-600 lg:hidden ml-3"
              >
                LasuVLP
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/dashboard/${user?.role.toLowerCase()}/notifications`}
                className="text-gray-500 hover:text-gray-700 relative"
              >
                <BellIcon className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </Link>
              <Link
                href={`/dashboard/${user?.role.toLowerCase()}/profile`}
                className="text-gray-500 hover:text-gray-700"
              >
                <UserIcon className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <StudentdDashboardProvider>{children}</StudentdDashboardProvider>
          </div>
        </div>
      </main>
    </div>
  );
}
