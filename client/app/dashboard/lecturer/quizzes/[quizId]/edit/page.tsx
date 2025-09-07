"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function page() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();

  // Mock quiz data (replace with fetch to your API or DB)
  const [quiz, setQuiz] = useState({
    id: Number(quizId),
    question: "What is 2 + 2?",
    options: ["2", "3", "4", "5"],
    correctAnswer: "4",
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...quiz.options];
    newOptions[index] = value;
    setQuiz({ ...quiz, options: newOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quiz updated:", quiz);
    // TODO: Send update request to backend
    router.push(`/lecturer/quizzes/${quiz.id}`);
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
              {quiz.options.map((option, index) => (
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
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
