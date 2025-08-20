/*
  Warnings:

  - A unique constraint covering the columns `[userId,lectureId]` on the table `QuizSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "QuizSubmission_userId_quizId_lectureId_key";

-- CreateIndex
CREATE UNIQUE INDEX "QuizSubmission_userId_lectureId_key" ON "QuizSubmission"("userId", "lectureId");
