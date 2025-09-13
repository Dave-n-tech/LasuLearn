"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLecturerDashboard } from "../../context/lecturerContext";
import axios from "@/app/api/axios";
import toast from "react-hot-toast";
import { QuizQuestion } from "@/app/types";

export default function page() {
  const router = useRouter();
  const { lecturerCourses, setShouldRefresh } = useLecturerDashboard();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      lectureId: "", // initialize empty, will be set later
      question: "",
      options: ["", "", "", ""], // just strings
      correctAnswer: "",
    },
  ]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const lectures = lecturerCourses.flatMap((course) =>
    course.lectures.map((lecture) => ({
      ...lecture,
      courseTitle: course.title,
    }))
  );

  const [selectedLecture, setSelectedLecture] = useState(0);

  const lecture = selectedLecture
    ? lectures.find((lec) => lec.id === Number(selectedLecture))
    : null;

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: questions.length + 1,
      lectureId: "",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (questionId: number) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleQuestionChange = (questionId: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, question: value } : q
      )
    );
  };

  const handleOptionChange = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o, i) => (i === optionIndex ? value : o)),
            }
          : q
      )
    );
  };

  const handleCorrectOptionChange = (
    questionId: number,
    optionIndex: number
  ) => {
    setQuestions(
      questions.map((q) => {
        console.log(q.options[optionIndex]);

        return q.id === questionId
          ? {
              ...q,
              correctAnswer: q.options[optionIndex], // store the string
            }
          : q;
      })
    );
  };

  const handleAddOption = (questionId: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [...q.options, ""],
          };
        }
        return q;
      })
    );
  };

  const handleRemoveOption = (questionId: number, option: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((o) => o !== option),
          };
        }
        return q;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post(
        `/lecturers/lectures/${selectedLecture}/quizzes`,
        {
          quizzes: questions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Succesfully created quiz", res.data);
      toast.success("Quiz created successfully");
      setShouldRefresh(true);
      router.push("/dashboard/lecturer/quizzes");
    } catch (error) {
      console.error("Error creating quiz", error);
      toast.error(
        "An error occurred while creating the quiz! Kindly try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={"/dashboard/lecturer/quizzes"}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quiz Details</h2>
          <p className="text-gray-600">Create a new quiz for your students</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {lecture ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lecture
                    </label>
                    <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-gray-50">
                      <span>{lecture.title}</span>
                      <span className="text-sm text-gray-500">
                        ({lecture.courseTitle})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="lecture"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select Lecture
                    </label>
                    <select
                      id="lecture"
                      value={selectedLecture}
                      onChange={(e) =>
                        setSelectedLecture(parseInt(e.target.value))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value={0} disabled>
                        Select a lecture
                      </option>
                      {lectures.map((lecture) => (
                        <option key={lecture.id} value={lecture.id}>
                          {lecture.title} ({lecture.courseTitle})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quiz Questions
            </h3>
            <div className="space-y-8">
              {questions.map((question, questionIndex) => (
                <div
                  key={question.id}
                  className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Question {questionIndex + 1}
                    </h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`question-${question.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Question Text
                      </label>
                      <input
                        type="text"
                        id={`question-${question.id}`}
                        value={question.question}
                        onChange={(e) =>
                          handleQuestionChange(question.id, e.target.value)
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter your question here"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answer Options
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleCorrectOptionChange(question.id, index)
                              }
                              className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                                option === question.correctAnswer
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-gray-300 text-transparent"
                              }`}
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  question.id,
                                  index,
                                  e.target.value
                                )
                              }
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder={`Option ${index}`}
                              required
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveOption(question.id, option)
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <XIcon className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                        {question.options.length < 6 && (
                          <button
                            type="button"
                            onClick={() => handleAddOption(question.id)}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <PlusIcon className="w-4 h-4" />
                            Add Option
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Click the circle to mark the correct answer.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="w-5 h-5" />
                Add Question
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="disabled:bg-blue-200 cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
