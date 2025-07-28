import { CalendarIcon, ClockIcon } from "lucide-react";
import React from "react";

export default function page() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Classes
            </h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50"
              >
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    Advanced Web Development
                  </h3>
                  <p className="text-sm text-gray-600">
                    Room 301 • Dr. Sarah Johnson
                  </p>
                </div>
                <div className="text-sm text-gray-600">Tomorrow, 10:00 AM</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
