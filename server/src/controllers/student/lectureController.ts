import { Response } from "express";
import { JwtRequest } from "../../types";
import prisma from "../../utils/prismaClient";

export const updateLectureProgress = async (req: JwtRequest, res: Response) => {
  const lectureId = parseInt(req.params.lectureId);
  const {
    watched,
    watchTime,
    skippedTime,
    rewatchTime,
    playbackSpeed,
    videoDuration,
  } = req.body;
  const studentId = req.user?.userId;

  if (!studentId || !lectureId) {
    res.status(400).json({ message: "Missing student or lecture id" });
    return;
  }

  try {
    const existingProgress = await prisma.lectureProgress.findFirst({
      where: {
        userId: studentId,
        lectureId,
      },
    });

    if (existingProgress) {
      let finalWatchTime = existingProgress.watchTime;
      if (watchTime > 0 && existingProgress.watchTime < videoDuration) {
        finalWatchTime = Math.min(
          existingProgress.watchTime + watchTime,
          videoDuration
        );
      }

      const finalSkippedTime =
        skippedTime > 0
          ? existingProgress.skippedTime + skippedTime
          : existingProgress.skippedTime;

      const finalRewatchTime =
        rewatchTime > 0
          ? existingProgress.rewatchTime + rewatchTime
          : existingProgress.rewatchTime;

      const finalPlaybackSpeed = playbackSpeed
        ? (existingProgress.playbackSpeed + playbackSpeed) / 2
        : existingProgress.playbackSpeed;

      const updatedProgress = await prisma.lectureProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          watched: existingProgress.watched || watched,
          watchTime: finalWatchTime,
          skippedTime: finalSkippedTime,
          rewatchTime: finalRewatchTime,
          playbackSpeed: finalPlaybackSpeed,
          completedAt: watched ? new Date() : existingProgress.completedAt,
        },
      });

      res.json({
        message: "Progress updated",
        progress: updatedProgress,
      });
    } else {
      const createdProgress = await prisma.lectureProgress.create({
        data: {
          userId: studentId,
          lectureId,
          watched,
          watchTime: watchTime > 0 ? watchTime : 0,
          skippedTime: skippedTime > 0 ? skippedTime : 0,
          rewatchTime: rewatchTime > 0 ? rewatchTime : 0,
          playbackSpeed: playbackSpeed || 1,
          completedAt: watched ? new Date() : null,
        },
      });

      res.json({
        message: "Progress created",
        progress: createdProgress,
      });
    }
  } catch (error) {
    console.error("Lecture progress update error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const submitQuizResponse = async (req: JwtRequest, res: Response) => {
  const lectureId = parseInt(req.params.lectureId);
  const studentId = req.user?.userId;
  const { responses } = req.body;

  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    res.status(400).json({
      message: "No quiz responses provided",
    });
    return;
  }

  try {
    const results = [];

    for (const { quizId, answer } of responses) {
      const quiz = await prisma.quiz.findUnique({
        where: {
          id: Number(quizId),
        },
      });

      if (!quiz || quiz.lectureId !== lectureId) {
        results.push({
          quizId,
          status: "skipped",
          reason: "Quiz not found or not part of this lecture",
        });
        continue;
      }

      const existingSubmission = await prisma.quizSubmission.findFirst({
        where: {
          userId: studentId,
          quizId: Number(quizId),
        },
      });

      if (existingSubmission && existingSubmission.isCorrect) {
        results.push({
          quizId,
          status: "skipped",
          reason: "Already submitted",
        });
        continue;
      }

      const isCorrect = answer.trim() === quiz.correctAnswer.trim();

      const submission = await prisma.quizSubmission.create({
        data: {
          userId: Number(studentId),
          quizId: Number(quizId),
          lectureId,
          selectedAnswer: answer,
          isCorrect,
        },
      });

      results.push({
        quizId,
        status: "submitted",
        isCorrect,
        submissionId: submission.id,
      });
    }

    res.status(201).json({
      message: "Quiz submissions processed",
      results,
    });
  } catch (error) {
    console.error("Quiz submission error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAttendance = async (req: JwtRequest, res: Response) => {
  const studentId = req.user?.userId;
  const lectureId = parseInt(req.params.lectureId);
  // const { lectureId } = req.body;

  if (!lectureId || isNaN(lectureId)) {
    res.status(400).json({ message: "Invalid lecture ID" });
    return;
  }

  try {
    const lecture = await prisma.lecture.findUnique({
      where: {
        id: lectureId,
      },
      include: {
        quizzes: {
          select: {
            id: true,
          },
        },
        quizSubmissions: {
          where: {
            userId: studentId,
          },
          select: {
            id: true,
            quizId: true,
            isCorrect: true,
            userId: true,
            selectedAnswer: true,
          },
        },
      },
    });

    if (!lecture) {
      res.status(404).json({ message: "lecture not found" });
      return;
    }

    const progress = await prisma.lectureProgress.findFirst({
      where: {
        userId: studentId,
        lectureId,
      },
    });

    if (!progress) {
      res.status(404).json({
        message: "No progress found for this lecture",
      });
      return;
    }

    const totalQuizzes = lecture.quizzes.length;
    let quizPassed = true; // true by default if no quizzes

    const correctAnswers = lecture.quizSubmissions.filter(
      (s) => s.isCorrect
    ).length;

    if (totalQuizzes > 0) {
      quizPassed = correctAnswers >= Math.ceil(totalQuizzes / 2);
    }

    const totalDuration = lecture.duration;
    const watchedPercent = (progress.watchTime / totalDuration) * 100;
    const skippedPercent = (progress.skippedTime / totalDuration) * 100;
    const playbackSpeed = progress.playbackSpeed;
    const quizPercent = totalQuizzes > 0 ? correctAnswers / totalQuizzes : 1;

    const meetsAttendanceCriteria =
      watchedPercent >= 80 && playbackSpeed <= 1.5 && quizPassed;

    const engagementScore = Math.round(
      (watchedPercent * 0.85 + quizPercent * 0.15) * 100
    );

    const responsePayload = {
      watchedPercent,
      skippedPercent,
      playbackSpeed,
      quizPassed,
      engagementScore,
    };

    const existingAttendanceLog = await prisma.attendanceLog.findFirst({
      where: {
        userId: studentId,
        lectureId,
      },
    });

    // attendance does not meet criteria and hasn't been logged
    if (!existingAttendanceLog && !meetsAttendanceCriteria) {
      await prisma.attendanceLog.create({
        data: {
          userId: Number(studentId),
          lectureId,
          engagementScore,
          wasPresent: false,
        },
      });

      res.status(200).json({
        message: quizPassed
          ? "Attendance not marked: Engagement too low"
          : `Attendance not marked: Quiz score is ${correctAnswers} / ${totalQuizzes}`,
        success: false,
        ...responsePayload,
      });
      return;
    }

    // meets the attendance critria but there isn't an existing log
    if (meetsAttendanceCriteria && !existingAttendanceLog) {
      await prisma.attendanceLog.create({
        data: {
          userId: Number(studentId),
          lectureId,
          engagementScore,
          wasPresent: true,
        },
      });

      res.status(200).json({
        message: "Attendance marked successfully",
        success: true,
        ...responsePayload,
      });
      return;
    }

    // attendance meets criteria and has an existing log
    if (meetsAttendanceCriteria && existingAttendanceLog) {
      // if student was not marked present, mark present
      if (!existingAttendanceLog.wasPresent) {
        await prisma.attendanceLog.update({
          where: {
            id: existingAttendanceLog.id,
          },
          data: {
            wasPresent: true,
            engagementScore,
          },
        });

        res.status(200).json({
          message: "Attendance marked successfully",
          success: true,
          ...responsePayload,
        });
      } else {
        res.status(200).json({ message: "Attendance already marked" });
      }
      return;
    }

    // existing log but still doesn't meet attendance criteria
    res.status(200).json({
      message: quizPassed
        ? "Attendance not marked: Engagement too low"
        : `Attendance not marked: Quiz score is ${correctAnswers} / ${totalQuizzes}`,
      success: false,
      ...responsePayload,
    });
  } catch (error) {
    console.error("Error marking attendance: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLectureById = async (req: JwtRequest, res: Response) => {
  const lectureId = parseInt(req.params.lectureId);
  const studentId = req.user?.userId;

  if (!studentId) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  try {
    const lecture = await prisma.lecture.findFirst({
      where: {
        id: lectureId,
      },
      include: {
        quizzes: {
          select: {
            id: true,
            lectureId: true,
            question: true,
            options: true,
          },
        },
      },
    });

    if (!lecture) {
      res.status(404).json({
        message: "Lecture not found.",
      });
    }

    res.status(200).json({ lecture: lecture });
  } catch (error) {
    console.error("Error fetching lecture", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLectureProgress = async (req: JwtRequest, res: Response) => {
  const lectureId = parseInt(req.params.lectureId);
  const studentId = req.user?.userId;

  if (!studentId) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  try {
    const progress = await prisma.lectureProgress.findFirst({
      where: {
        userId: studentId,
        lectureId,
      },
    });

    if (!progress) {
      res.status(404).json({
        message: "Progress not found for this lecture.",
      });
      return;
    }

    res.status(200).json({
      lectureId: progress?.lectureId,
      watched: progress?.watched,
      watchTime: progress?.watchTime,
      skippedTime: progress?.skippedTime,
      playbackSpeed: progress?.playbackSpeed,
      completedAt: progress?.completedAt,
    });
  } catch (error) {
    console.error("Error fetching lecture progress", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllLectureProgressForStudent = async (
  req: JwtRequest,
  res: Response
) => {
  const studentId = req.user?.userId;

  if (!studentId) {
    res.status(401).json({
      message: "Unauthorized: Invalid Student ID",
    });
    return;
  }

  try {
    const progresses = await prisma.user.findMany({
      where: {
        id: studentId,
      },
      include: {
        lectureProgresses: {
          select: {
            lectureId: true,
            watched: true,
            watchTime: true,
            skippedTime: true,
            playbackSpeed: true,
            completedAt: true,
          },
          include: {
            lecture: {
              select: {},
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!progresses) {
      res
        .status(404)
        .json({ message: "lecture progresses not found for student" });
      return;
    }

    res.status(200).json({
      progresses,
    });
  } catch (error) {
    console.error("Error geting student lecture progresses", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
