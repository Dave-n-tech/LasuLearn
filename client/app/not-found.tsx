// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse">
        404
      </h1>
      <p className="mt-4 text-3xl font-semibold text-gray-300">
        Page Not Found
      </p>
      <p className="mt-2 text-lg text-gray-400 text-center max-w-md">
        Oops! The page you're looking for doesn't exist. It might have been
        moved or deleted.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
