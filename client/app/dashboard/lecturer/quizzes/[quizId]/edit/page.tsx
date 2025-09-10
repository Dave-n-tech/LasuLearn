"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLecturerDashboard } from "../../../context/lecturerContext";
import axios from "@/app/api/axios";
import toast from "react-hot-toast";

export default function page() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();
  const { lecturerCourses, setShouldRefresh } = useLecturerDashboard();
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const foundQuiz = lecturerCourses
    .flatMap((c) => c.lectures.flatMap((lecture) => lecture.quizzes))
    .find((q) => q.id === Number(quizId));

  const [quiz, setQuiz] = useState(() => {
    if (foundQuiz) {
      return {
        ...foundQuiz,
        options:
          typeof foundQuiz.options === "string"
            ? (JSON.parse(foundQuiz.options))
            : (foundQuiz.options),
      };
    }
    return {
      id: Number(quizId),
      lectureId: "",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    };
  });

  const normalizedOptions = Array.isArray(quiz.options)
  ? quiz.options
  : (() => {
      try {
        return JSON.parse(quiz.options as unknown as string);
      } catch {
        return [];
      }
    })();


  useEffect(() => {
    console.log("Found quiz:", foundQuiz);
    console.log(quiz)
  }, [])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...quiz.options];
    newOptions[index] = value;
    setQuiz({ ...quiz, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { data } = await axios.patch(
        `/lecturers/lectures/quizzes/${quiz.id}`,
        {
          question: quiz.question,
          options: JSON.stringify(quiz.options),
          correctAnswer: quiz.correctAnswer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      console.log("Quiz updated:", data);
      toast.success("Quiz updated successfully");
      router.push(`/dashboard/lecturer/quizzes`);
      setShouldRefresh(true);
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast.error("Failed to update quiz");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Question */}
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={quiz.question}
                onChange={(e) => setQuiz({ ...quiz, question: e.target.value })}
                required
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <Label>Options</Label>
              {normalizedOptions.map((option: string, index: number) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
              ))}
            </div>

            {/* Correct Answer */}
            <div>
              <Label htmlFor="correctAnswer">Correct Answer</Label>
              <Input
                id="correctAnswer"
                value={quiz.correctAnswer}
                onChange={(e) =>
                  setQuiz({ ...quiz, correctAnswer: e.target.value })
                }
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
