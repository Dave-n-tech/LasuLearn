import { Navbar } from "@/app/components/Navbar";
import RegisterForm from "@/app/components/RegisterForm";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Admin Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Get started on your admin portal
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <RegisterForm />
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Not an admin?
                  </span>
                </div>
              </div>
              <Link
                href="/register/lecturer"
                className="mt-1 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Lecturer Registration
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
