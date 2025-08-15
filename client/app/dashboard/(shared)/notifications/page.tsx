"use client";
import React from "react";
import { useStudentDashboard } from "../../student/context/studentContext";
import { formatDistanceToNow } from "date-fns";
import axios from "@/app/api/axios";

export default function page() {
  const { notifications, setNotifications } = useStudentDashboard();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const markAsReadUrl = "/notifications/:notificationId/mark-as-read";

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.patch(
        markAsReadUrl.replace(":notificationId", notificationId),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state without full refetch
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {/* <button className="text-sm text-blue-600 hover:text-blue-700">
          Mark all as read
        </button> */}
      </div>
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            console.log("CreatedAt:", notification.createdAt, notification);
            return (
              <div
                key={notification.id}
                className={`${
                  notification.isRead ? "bg-gray-200" : "bg-white"
                } rounded-xl shadow-sm p-6 ${
                  !notification.isRead && "hover:bg-gray-50"
                } transition-colors`}
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {notification.createdAt
                          ? formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                              }
                            )
                          : "just now"}
                      </span>
                    </div>

                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="cursor-pointer mt-2 text-xs text-blue-600 hover:text-blue-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <span className="text-gray-500">No notifications available</span>
        )}
      </div>
    </div>
  );
}
