"use client";
import Image from "next/image";
import UserMenu from "../layout/userMenu";
import lasuLogo from "../../public/logos/lasu_logo.png";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Link from "next/link";

export const Navbar = () => {
  const { user } = useAppContext();

  return (
    <header className="bg-blue-950 sticky top-0 z-50 shadow max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Image
          src={lasuLogo}
          alt="Lasu Logo"
          className="w-8 h-8 text-teal-400"
          width={20}
          height={50}
        />
        <Link href={"/"} className="text-2xl font-bold text-white">LasuVLP</Link>
      </div>

      <div className="flex flex-row gap-2 items-center">
        {/* <Link
          href={"/"}
          className="text-white hover:bg-blue-500 rounded-md px-4 py-2"
        >
          Dashboard
        </Link> */}
        {user && (
          <Link
            href={"/dashboard/${user.role}"}
            className="text-white hover:bg-blue-500 rounded-md px-4 py-2"
          >
            Dashboard
          </Link>
        )}

        {user ? (
          <UserMenu />
        ) : (
          <div className="flex flex-row items-center gap-2">
            <Link
              href={"/login/student"}
              className="text-white hover:bg-blue-500 rounded-md px-4 py-2"
            >
              Login
            </Link>

            <Link
              href={"/register/student"}
              className="text-white border hover:border-blue-500 hover:bg-blue-500 rounded-md px-4 py-2"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
