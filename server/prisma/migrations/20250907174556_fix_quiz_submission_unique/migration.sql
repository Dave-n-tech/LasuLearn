/*
  Warnings:

  - A unique constraint covering the columns `[userId,quizId]` on the table `QuizSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "QuizSubmission_userId_lectureId_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "matricNo" TEXT,
    "level" TEXT,
    "faculty" TEXT,
    "department" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "department", "email", "faculty", "firstName", "id", "lastName", "level", "matricNo", "password", "role") SELECT "createdAt", "department", "email", "faculty", "firstName", "id", "lastName", "level", "matricNo", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_matricNo_key" ON "User"("matricNo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "QuizSubmission_userId_quizId_key" ON "QuizSubmission"("userId", "quizId");
