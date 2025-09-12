import React from "react";
import { BookOpenIcon, MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import lasuLogo from "../../public/logos/lasu_logo.png";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={lasuLogo}
                alt="Lasu Logo"
                className="w-8 h-8 text-teal-400"
                width={20}
                height={50}
              />
              <span className="text-2xl font-bold">LASULEARN</span>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering universities with intelligent learning solutions and
              smart attendance tracking.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MailIcon className="w-4 h-4" />
                <span>davidobadimeji1@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" />
                <span>09076803274</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4" />
                <span>Lagos State Univesity Ojo Campus</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Virtual Learning Platform. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
