"use client";
import React, { useState, createContext, useContext, useEffect } from "react";
import {
  AppContextType,
  LoginFormData,
  RegisterFormData,
  Role,
  SidebarLink,
  User,
} from "../types";
import {
  BarChart3Icon,
  BookOpenIcon,
  CalendarIcon,
  HomeIcon,
  MessageSquareIcon,
  PlayIcon,
  PlusCircleIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import axios from "../api/axios";
import { getCookie } from "cookies-next/client";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshCookie = getCookie("refresh_token");

  const StudentSideBarLinks: SidebarLink[] = [
    {
      icon: HomeIcon,
      label: "Overview",
      href: "/dashboard/student",
    },
    {
      icon: PlayIcon,
      label: "My Lectures",
      href: "/dashboard/student/lectures",
    },
    {
      icon: BookOpenIcon,
      label: "Courses",
      href: "/dashboard/student/courses",
    },
    {
      icon: PlusCircleIcon,
      label: "Add Courses",
      href: "/dashboard/student/add-courses",
    },
    {
      icon: CalendarIcon,
      label: "Schedule",
      href: "/dashboard/student/schedule",
    },
    {
      icon: MessageSquareIcon,
      label: "Discussions",
      href: "/dashboard/student/discussions",
    },
  ];
  const LecturerSideBarLinks: SidebarLink[] = [
    {
      icon: HomeIcon,
      label: "Overview",
      href: "/dashboard/lecturer",
    },
    {
      icon: UsersIcon,
      label: "Students",
      href: "/dashboard/lecturer/students",
    },
    {
      icon: VideoIcon,
      label: "Content",
      href: "/dashboard/lecturer/content",
    },
    {
      icon: BarChart3Icon,
      label: "Analytics",
      href: "/dashboard/lecturer/analytics",
    },
    {
      icon: CalendarIcon,
      label: "Schedule",
      href: "/dashboard/lecturer/schedule",
    },
    {
      icon: MessageSquareIcon,
      label: "Discussions",
      href: "/dashboard/lecturer/discussions",
    },
  ];

  const refreshAccessToken = async (): Promise<{
    access_token: string;
    user: User;
  } | null> => {
    setError(null);
    try {
      const refreshResponse = await axios.post(
        "/auth/refresh_token",
        {},
        {
          withCredentials: true,
        }
      );
      const { access_token, user } = refreshResponse.data;

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("authData", JSON.stringify(user));
      setUser(user);
      console.log("Token refreshed via cookie and user set.");

      return { access_token, user };
    } catch (refreshError: any) {
      console.error("Failed to refresh token via cookie:", refreshError);
      setError(refreshError.message || "Session expired. Please log in again.");

      // Clear all client-side tokens if refresh fails
      localStorage.removeItem("authToken");
      localStorage.removeItem("authData");
      setUser(null);
      return null;
    }
  };

  const login = async (formData: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/auth/login", formData, {
        withCredentials: true,
      });
      const { access_token, user } = response.data;
      setUser(user);
      localStorage.setItem("authToken", access_token);
      localStorage.setItem("authData", JSON.stringify(user));
      console.log("User logged in:", user);
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.response.data.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: RegisterFormData) => {
    setLoading(true);
    setError(null);
    const endpoint =
      formData.role === Role.STUDENT
        ? "/auth/student/register"
        : "/auth/lecturer/register";

    const credentials = {
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      password: formData.password,
      matricNo: formData.matricNo,
    };

    try {
      const response = await axios.post(`${endpoint}`, credentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const { access_token, user } = await response.data;
      setUser(user);

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("authData", JSON.stringify(user));
      console.log("user registered: ", user);
    } catch (error: any) {
      console.error("Registration failed: ", error);
      setError(
        error.response.data.message || "Registration failed, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authData");
      console.log("User logged out.");
    } catch (error: any) {
      console.error("Logout failed:", error);
      setError(
        error.response?.data?.message || "Logout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem("authToken");
        const storedAuthData = localStorage.getItem("authData");

        if (storedAuthData) {
          try {
            const parsedUser = JSON.parse(storedAuthData);
            setUser(parsedUser);
          } catch (e) {
            console.error("Failed to parse user data from localStorage", e);
            localStorage.removeItem("authData");
          }
        }

        if (accessToken) {
          try {
            const response = await axios.get("/auth/verify_token", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              withCredentials: true,
            });
            const { user } = response.data;
            localStorage.setItem("authData", JSON.stringify(user));
            setUser(user);
            console.log("Access token verified and user set.");
            setLoading(false);
            return;
          } catch (error: any) {
            console.warn(
              "Access token verification failed, attempting refresh:",
              error
            );
            // Fall through to refresh token logic if access token is invalid
          }
        }

        // If no valid access token and cookie present, try to refresh
        if (refreshCookie) {
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            setUser(null);
          }
        }
      } catch (error: any) {
        console.error("Initial authentication check failed:", error);
        setError(
          error.response?.data?.message || "Failed to establish session."
        );
        localStorage.removeItem("authToken");
        localStorage.removeItem("authData");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        error,
        setError,
        loading,
        refreshAccessToken,
        login,
        register,
        logout,
        StudentSideBarLinks,
        LecturerSideBarLinks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
