"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Course, DiscussionPost, LecturerCourse } from "@/app/types";
import { ArrowLeftIcon, ReplyIcon, SendIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useAppContext } from "@/app/context/AppContext";
import axios from "@/app/api/axios";
import { useStudentDashboard } from "@/app/dashboard/student/context/studentContext";
import { useLecturerDashboard } from "@/app/dashboard/lecturer/context/lecturerContext";

export default function Page() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAppContext();
  const {
    enrolledCourses,
    setShouldRefetch,
    loading,
    setLoading,
    error,
    setError,
  } = useStudentDashboard();
  const { lecturerCourses, setShouldRefresh } = useLecturerDashboard();
  const [course, setCourse] = useState<LecturerCourse | Course>({} as Course);
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const token = localStorage.getItem("authToken");
  const currentUserId = String(user?.id);

  const postDiscussionUrl = "/discussions/:courseId/post";
  const postReplyUrl = "/discussions/post/:postId/reply";

  useEffect(() => {
    const foundCourse =
      enrolledCourses.find(
        (enrolled) => String(enrolled.course.id) === String(courseId)
      )?.course ||
      lecturerCourses.find((course) => String(course.id) === String(courseId));
    setCourse(foundCourse || ({} as Course));
    setDiscussionPosts(foundCourse?.discussionPosts || []);
  }, [courseId, enrolledCourses]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        postDiscussionUrl.replace(":courseId", courseId),
        {
          content: newPost,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("New discussion post created:", res.data.createdPost);
    } catch (error) {
      console.error("Error creating discussion post:", error);
      setError("An error occurred while sending post. Please try again!");
    } finally {
      setShouldRefetch((prev) => !prev);
      setShouldRefresh((prev) => !prev);
      setLoading(false);
    }
    setNewPost("");
  };

  const handlePostReply = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        postReplyUrl.replace(":postId", postId),
        {
          content: replyContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("New reply post created:", res.data);
    } catch (error) {
      console.error("Error creating reply:", error);
      setError("An error occurred while sending reply. Please try again!");
    } finally {
      setShouldRefetch((prev) => !prev);
      setLoading(false);
    }
    setReplyContent("");
    setReplyingTo(null);
  };

  const toggleReplyForm = (postId: string) => {
    setReplyingTo(replyingTo === postId ? null : postId);
    setReplyContent("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
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

      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-white shadow-sm">
        <Link
          href="/dashboard/discussions"
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {course.title} Discussions
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {discussionPosts.map((post) => {
          const isCurrentUser = String(post.userId) === currentUserId;
          return (
            <div
              key={post.id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  isCurrentUser ? "bg-blue-600 text-white" : "bg-white border"
                }`}
              >
                <div className="flex items-center justify-between mb-1 gap-12">
                  <span className="text-sm font-medium">
                    {isCurrentUser ? "You" : post.user?.firstName || "Unknown"}
                  </span>
                  <span className="text-xs opacity-75">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm">{post.content}</p>
                <button
                  onClick={() => toggleReplyForm(post.id)}
                  className="mt-2 text-xs flex items-center gap-1 opacity-75 hover:opacity-100"
                >
                  <ReplyIcon className="w-3 h-3" /> Reply
                </button>

                {replyingTo === post.id && (
                  <form
                    onSubmit={(e) => handlePostReply(post.id, e)}
                    className="mt-2 flex gap-2"
                  >
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-grow px-2 py-1 text-sm border rounded"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Send"
                      )}
                    </button>
                  </form>
                )}

                {/* Replies */}
                {(post.replies ?? []).length > 0 && (
                  <div className="mt-3 space-y-2">
                    {(post.replies ?? []).map((reply) => {
                      const isReplyUser =
                        String(reply.userId) === currentUserId;
                      return (
                        <div
                          key={reply.id}
                          className={`flex ${
                            isReplyUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] p-2 rounded-lg text-sm ${
                              isReplyUser
                                ? "bg-blue-100"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1 gap-8">
                              <span className="block text-xs opacity-80">
                                {isReplyUser
                                  ? "You"
                                  : reply.user?.firstName || "Unknown"}
                              </span>
                              <span className="text-xs opacity-50">
                                {formatDistanceToNow(
                                  new Date(reply.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                            <p>{reply.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handlePostSubmit}
        className="flex items-center gap-2 p-4 bg-white border-t sticky bottom-0"
      >
        <input
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer disabled:bg-gray-500 bg-blue-600 text-white p-2 rounded-lg "
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
