"use client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Role } from "../types";
import { useAppContext } from "../context/AppContext";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    matricNo: "",
    level: "",
    faculty: "",
    department: "",
    email: "",
    password: "",
    role: Role.STUDENT,
  });
  const pathname = usePathname();
  const { register, error, setError, loading, setLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (pathname) {
      if (pathname.endsWith("student")) {
        if (formData.role !== Role.STUDENT) {
          setFormData((prevState) => ({ ...prevState, role: Role.STUDENT }));
          console.log("Role set to STUDENT based on path");
        }
      } else if (pathname.endsWith("lecturer")) {
        if (formData.role !== Role.LECTURER) {
          setFormData((prevState) => ({ ...prevState, role: Role.LECTURER }));
          console.log("Role set to LECTURER based on path");
        }
      } else if (pathname.endsWith("admin")) {
        if (formData.role !== Role.ADMIN) {
          setFormData((prevState) => ({ ...prevState, role: Role.ADMIN }));
          console.log("Role set to ADMIN based on path");
        }
      }
    }
  }, [pathname, formData.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data: ", formData);

    setLoading(true);
    try {
      await register(formData);
      setFormData({
        firstName: "",
        lastName: "",
        matricNo: "",
        level: "",
        faculty: "",
        department: "",
        email: "",
        password: "",
        role: Role.STUDENT,
      });

      //  route to dashboard
      const dashboardPath =
        formData.role === Role.STUDENT
          ? "/dashboard/student"
          : formData.role === Role.LECTURER
          ? "/dashboard/lecturer"
          : "/dashboard/admin";

      router.push(dashboardPath);
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (error) {
      setError(null);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setError(null)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l3.029-2.651-3.029-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.183l2.651-3.029a1.2 1.2 0 1 1 1.697 1.697L11.819 10l3.029 2.651a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}

      <div>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-gray-700"
        >
          First Name
        </label>
        <div className="mt-1">
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-gray-700"
        >
          Last Name
        </label>
        <div className="mt-1">
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          University Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      {pathname.endsWith("/student") && (
        <>
          <div>
            <label
              htmlFor="matricNo"
              className="block text-sm font-medium text-gray-700"
            >
              Matric No
            </label>
            <input
              id="matricNo"
              name="matricNo"
              type="text"
              required
              value={formData.matricNo}
              onChange={handleInputChange}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="level"
              className="block text-sm font-medium text-gray-700"
            >
              Level
            </label>
            <select
              name="level"
              id="level"
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={formData.level}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Level</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
            </select>
          </div>
        </>
      )}

      {(pathname.endsWith("/lecturer") || pathname.endsWith("/student")) && (
        <>
          <div>
            <label
              htmlFor="faculty"
              className="block text-sm font-medium text-gray-700"
            >
              Faculty
            </label>
            <input
              id="faculty"
              name="faculty"
              type="text"
              required
              value={formData.faculty}
              onChange={handleInputChange}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              required
              value={formData.department}
              onChange={handleInputChange}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="disabled:bg-blue-200 flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
}
