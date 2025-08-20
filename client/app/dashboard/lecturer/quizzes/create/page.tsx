'use client'
import React, { useState } from 'react'
// import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface QuizQuestion {
  id: number
  question: string
  options: {
    id: number
    text: string
    isCorrect: boolean
  }[]
}
export default function page() {
//   const navigate = useNavigate()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lectureId = searchParams.get('lectureId')
  const [quizTitle, setQuizTitle] = useState('')
  const [quizDescription, setQuizDescription] = useState('')
  const [passingScore, setPassingScore] = useState(60)
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      question: '',
      options: [
        {
          id: 1,
          text: '',
          isCorrect: false,
        },
        {
          id: 2,
          text: '',
          isCorrect: false,
        },
        {
          id: 3,
          text: '',
          isCorrect: false,
        },
        {
          id: 4,
          text: '',
          isCorrect: false,
        },
      ],
    },
  ])
  // Mock lecture data
  const lecture = lectureId
    ? {
        id: parseInt(lectureId),
        title: 'Introduction to Modern Web Development',
        course: 'Advanced Web Development',
      }
    : null
  // Mock lectures for dropdown if no lectureId is provided
  const lectures = [
    {
      id: 1,
      title: 'Introduction to Modern Web Development',
      course: 'Advanced Web Development',
    },
    {
      id: 2,
      title: 'React Fundamentals',
      course: 'Advanced Web Development',
    },
    {
      id: 3,
      title: 'State Management with React Hooks',
      course: 'Advanced Web Development',
    },
    {
      id: 4,
      title: 'Intro to Algorithms',
      course: 'Data Structures and Algorithms',
    },
    {
      id: 5,
      title: 'Sorting Algorithms',
      course: 'Data Structures and Algorithms',
    },
  ]
  const [selectedLecture, setSelectedLecture] = useState(
    lectureId ? parseInt(lectureId) : 0,
  )
  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: questions.length + 1,
      question: '',
      options: [
        {
          id: 1,
          text: '',
          isCorrect: false,
        },
        {
          id: 2,
          text: '',
          isCorrect: false,
        },
        {
          id: 3,
          text: '',
          isCorrect: false,
        },
        {
          id: 4,
          text: '',
          isCorrect: false,
        },
      ],
    }
    setQuestions([...questions, newQuestion])
  }
  const handleRemoveQuestion = (questionId: number) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
  }
  const handleQuestionChange = (questionId: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            question: value,
          }
        }
        return q
      }),
    )
  }
  const handleOptionChange = (
    questionId: number,
    optionId: number,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o) => {
              if (o.id === optionId) {
                return {
                  ...o,
                  text: value,
                }
              }
              return o
            }),
          }
        }
        return q
      }),
    )
  }
  const handleCorrectOptionChange = (questionId: number, optionId: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o) => {
              return {
                ...o,
                isCorrect: o.id === optionId,
              }
            }),
          }
        }
        return q
      }),
    )
  }
  const handleAddOption = (questionId: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [
              ...q.options,
              {
                id: q.options.length + 1,
                text: '',
                isCorrect: false,
              },
            ],
          }
        }
        return q
      }),
    )
  }
  const handleRemoveOption = (questionId: number, optionId: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((o) => o.id !== optionId),
          }
        }
        return q
      }),
    )
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would create the quiz in the database
    alert(`Quiz "${quizTitle}" created successfully!`)
    // Navigate back to the lecture detail page or quiz management
    if (lectureId) {
      router.push(`/lecturer/lectures/${lectureId}`)
    } else {
      router.push('/lecturer/quizzes')
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={
            lectureId ? `/dashboard/lecturer/lectures/${lectureId}` : '/dashboard/lecturer/quizzes'
          }
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
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quiz Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g. Web Development Basics Quiz"
                  required
                />
              </div>
              <div>
                {lecture ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lecture
                    </label>
                    <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-gray-50">
                      <span>{lecture.title}</span>
                      <span className="text-sm text-gray-500">
                        ({lecture.course})
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
                          {lecture.title} ({lecture.course})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={3}
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Brief description of what this quiz covers"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="passing-score"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Passing Score (%)
              </label>
              <input
                type="number"
                id="passing-score"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
                className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                min={0}
                max={100}
                required
              />
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
                        {question.options.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center gap-2"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleCorrectOptionChange(
                                  question.id,
                                  option.id,
                                )
                              }
                              className={`flex items-center justify-center w-6 h-6 rounded-full border ${option.isCorrect ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent'}`}
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) =>
                                handleOptionChange(
                                  question.id,
                                  option.id,
                                  e.target.value,
                                )
                              }
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder={`Option ${option.id}`}
                              required
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveOption(question.id, option.id)
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
            <Link
              href={
                lectureId
                  ? `/lecturer/lectures/${lectureId}`
                  : '/lecturer/quizzes'
              }
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
