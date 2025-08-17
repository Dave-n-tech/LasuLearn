-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LectureProgress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "watched" BOOLEAN NOT NULL DEFAULT false,
    "watchTime" INTEGER NOT NULL DEFAULT 0,
    "skippedTime" INTEGER NOT NULL DEFAULT 0,
    "rewatchTime" INTEGER NOT NULL DEFAULT 0,
    "playbackSpeed" REAL NOT NULL DEFAULT 1.0,
    "completedAt" DATETIME,
    CONSTRAINT "LectureProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LectureProgress_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LectureProgress" ("completedAt", "id", "lectureId", "playbackSpeed", "skippedTime", "userId", "watchTime", "watched") SELECT "completedAt", "id", "lectureId", "playbackSpeed", "skippedTime", "userId", "watchTime", "watched" FROM "LectureProgress";
DROP TABLE "LectureProgress";
ALTER TABLE "new_LectureProgress" RENAME TO "LectureProgress";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
