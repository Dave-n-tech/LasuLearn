/*
  Warnings:

  - A unique constraint covering the columns `[userId,quizId,lectureId]` on the table `QuizSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuizSubmission_userId_quizId_lectureId_key" ON "QuizSubmission"("userId", "quizId", "lectureId");
