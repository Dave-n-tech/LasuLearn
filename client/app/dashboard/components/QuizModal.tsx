"use client";

import { Dispatch, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/app/types";

interface QuizModalProps {
  questions: QuizQuestion[];
  isOpen: boolean;
  setQuizCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  onSubmit: (responses: { quizId: number; answer: string }[]) => void;
}

export default function QuizModal({
  questions,
  isOpen,
  setQuizCompleted,
  onClose,
  onSubmit,
}: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<
    { quizId: number; answer: string }[]
  >([]);
  const [timeLeft, setTimeLeft] = useState(10);

  const currentQuestion = questions[currentQuestionIndex];

  // Countdown logic
  useEffect(() => {
    if (!isOpen) return;
    if (timeLeft <= 0) {
      // Record unanswered question with empty string
      const newResponse = { quizId: currentQuestion.id, answer: "" };
      const updatedResponses = [...responses, newResponse];

      setResponses(updatedResponses);
      handleNext(updatedResponses);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isOpen]);

  const handleAnswer = (option: string) => {
    const newResponse = { quizId: currentQuestion.id, answer: option || "" };
    const updatedResponses = [...responses, newResponse];

    setResponses(updatedResponses);
    // console.log("answer from handleAnswer function:", newResponse);
    handleNext(updatedResponses);
  };

  const handleNext = (updatedResponses = responses) => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setTimeLeft(10);
    } else {
      // Quiz finished
      setQuizCompleted(true)
      onSubmit(updatedResponses);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <p className="mb-4">{currentQuestion.question}</p>

        <div className="space-y-2">
          {currentQuestion.options.map((option, idx) => (
            <Button
              key={idx}
              onClick={() => handleAnswer(option)}
              className="w-full justify-start"
            >
              {option}
            </Button>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>Time left: {timeLeft}s</span>
          <span>
            {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
