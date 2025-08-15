"use client";
import { useAppContext } from "@/app/context/AppContext";
import { useState } from "react";
import axios from "@/app/api/axios";
import { useRouter } from "next/navigation";
import { Role } from "@/app/types";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function page() {
  const { user, setUser } = useAppContext();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // patch
  const updateStudentUrl = "/students/:id";
  const updateLecturerUrl = "/lecturers/:id";

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const updateUrl =
      user?.role === Role.STUDENT
        ? updateStudentUrl
        : user?.role === Role.LECTURER
        ? updateLecturerUrl
        : "/";

    const profileUrl = `/dashboard/${user?.role.toLowerCase()}/profile`;

    try {
      const { data } = await axios.patch(
        updateUrl.replace(":id", String(user?.id)),
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("updated user: ", data.updatedStudent);
      setUser((prev) => ({
        ...prev,
        ...data.updatedStudent,
      }));
      setSuccess("Profile updated successfully!");
        setTimeout(() => router.push(profileUrl), 1500);
    } catch (err: any) {
      console.error("Error updating profile", error);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow rounded">
      <div className="flex items-center gap-2 p-2 bg-white shadow-sm">
        <Link
          href={`/dashboard/${user?.role.toLowerCase()}/profile`}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900 truncate">back</h1>
      </div>
      <h1 className="text-2xl font-bold mb-4"> Edit Profile</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-500 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
