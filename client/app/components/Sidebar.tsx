"use client";
import { LogOutIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Role, SidebarLink } from "../types";
import { useAppContext } from "../context/AppContext";

type SideBarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarLinks: SidebarLink[];
  userRole: Role | undefined;
  userName: string;
};

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  sidebarLinks,
  userRole,
  userName,
}: SideBarProps) {
  const pathname = usePathname();
  const {setUser, logout} = useAppContext()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <aside
      className={`
        w-64 bg-white border-r border-gray-200 z-30 h-full flex flex-col
        transition-transform duration-200 ease-in-out
        ${
          isSidebarOpen
            ? "translate-x-0 fixed inset-y-0 left-0"
            : "-translate-x-full fixed inset-y-0 left-0"
        }
        lg:translate-x-0 lg:static lg:block
      `}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex-1">
          <div className="flex items-center justify-between gap-2 mb-8">
            <Link href={"/"} className="text-2xl font-bold text-blue-600">
              LasuVLP
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="font-semibold text-gray-900">
              {userName || "Unavailable"}
            </p>
            <p className="text-sm text-blue-600">
              {userRole || "Role unavailable"}
            </p>
          </div>
          <nav className="space-y-1">
            {sidebarLinks?.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`}
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-6 border-t border-gray-200">
          <button onClick={handleLogout} className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <LogOutIcon className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
