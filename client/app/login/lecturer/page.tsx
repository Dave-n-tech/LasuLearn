import LoginForm from "@/app/components/LoginForm";
import { Navbar } from "@/app/components/Navbar";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Lecturer Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your teaching portal
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm />
            <div className="mt-6">
              <div className="relative">

                {/* horizontal line */}
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Not a lecturer?
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <Link
                  href="/login/student"
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Student Login
                </Link>
                {/* <Link
                  href="/login/admin"
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Admin Login
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
