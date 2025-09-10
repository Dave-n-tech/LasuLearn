import { Response } from "express";
import prisma from "../../utils/prismaClient";
import { JwtRequest } from "../../types";
import fileUpload from "express-fileupload";
import cloudinary from "../../utils/cloudinary";
import { Role } from "../../../generated/prisma";

export const getStudentsEnrolledInCourse = async (
  req: JwtRequest,
  res: Response
) => {
  const courseId = parseInt(req.params.courseId);

  try {
    const enrolledStudents = await prisma.enrollment.findMany({
      where: {
        courseId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            matricNo: true,
            email: true,
          },
        },
      },
    });

    if (enrolledStudents.length === 0) {
      res.json({ message: "No students enrolled in this course" });
      return;
    }

    res.status(200).json({ enrolledStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentCourseAttendanceLog = async (
  req: JwtRequest,
  res: Response
) => {
  const courseId = parseInt(req.params.courseId);
  const studentId = parseInt(req.params.studentId);

  try {
    const courseAttendance = await prisma.lecture.findMany({
      where: {
        courseId,
      },
      include: {
        attendanceLogs: {
          where: {
            userId: studentId,
          },
          select: {
            userId: true,
            markedAt: true,
            engagementScore: true,
            wasPresent: true,
          },
        },
      },
    });

    if (courseAttendance.length == 0) {
      res.status(404).json({ message: "no attendance for this course" });
    }

    res.status(200).json({ courseAttendance });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentPerformanceInCourse = async (
  req: JwtRequest,
  res: Response
) => {
  const studentId = parseInt(req.params.studentId);
  const courseId = parseInt(req.params.courseId);

  try {
    // Fetch all lectures for the course
    const lectures = await prisma.lecture.findMany({
      where: { courseId },
      include: {
        quizzes: true,
      },
    });

    const performanceData = await Promise.all(
      lectures.map(async (lecture) => {
        // Get attendance log for the student for this lecture
        const attendanceLog = await prisma.attendanceLog.findFirst({
          where: {
            lectureId: lecture.id,
            userId: studentId,
          },
        });

        // Get quiz submissions for this lecture
        const quizSubmissions = await prisma.quizSubmission.findMany({
          where: {
            lectureId: lecture.id,
            userId: studentId,
          },
        });

        // Calculate score: correct answers / total questions
        const totalQuestions = lecture.quizzes.length;
        const correctAnswers = quizSubmissions.filter(
          (sub) =>
            lecture.quizzes.find((q) => q.id === sub.quizId)?.correctAnswer ===
            sub.selectedAnswer
        ).length;

        const quizScore =
          totalQuestions > 0
            ? Math.round((correctAnswers / totalQuestions) * 100)
            : null;

        return {
          lectureId: lecture.id,
          lectureTitle: lecture.title,
          attendanceMarked: attendanceLog?.wasPresent || false,
          engagementScore: attendanceLog?.engagementScore || 0,
          quizScore,
        };
      })
    );

    res.status(200).json({
      studentId,
      courseId,
      performance: performanceData,
    });
  } catch (error) {
    console.error("Error fetching student performance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createCourse = async (req: JwtRequest, res: Response) => {
  const lecturerId = req.user?.userId;
  const { title, code, description } = req.body;

  try {
    let thumbnailUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "course_thumbnails",
      });
      thumbnailUrl = result.secure_url;
    }

    const createdCourse = await prisma.course.create({
      data: {
        title,
        code,
        description,
        lecturerId: Number(lecturerId),
        thumbnail: thumbnailUrl,
      },
    });

    res.status(200).json({
      message: "Course created successfully",
      course: createdCourse,
    });
  } catch (error) {
    console.error("Error creating course: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoursesByLecturerId = async (
  req: JwtRequest,
  res: Response
) => {
  const lecturerId = req.user?.userId;

  if (!lecturerId) {
    res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        lecturerId,
      },
      include: {
        enrollments: {
          select: {
            id: true,
            courseId: true,
            userId: true,
            enrolledAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                matricNo: true,
                email: true,
                enrollments: {
                  select: {
                    id: true,
                    courseId: true,
                  },
                },
                attendanceLogs: {
                  select: {
                    id: true,
                    lectureId: true,
                    engagementScore: true,
                  },
                },
                lectureProgresses: {
                  select: {
                    id: true,
                    lectureId: true,
                    watched: true,
                    completedAt: true,
                    watchTime: true,
                    playbackSpeed: true,
                    skippedTime: true,
                  },
                },
              },
            },
          },
        },
        lectures: {
          select: {
            id: true,
            courseId: true,
            title: true,
            videoUrl: true,
            createdAt: true,
            duration: true,
            quizzes: {
              select: {
                id: true,
                lectureId: true,
                question: true,
                options: true,
                correctAnswer: true,
              },
            },
            quizSubmissions: {
              select: {
                id: true,
                userId: true,
                isCorrect: true,
                selectedAnswer: true,
                quizId: true,
                lectureId: true,
                submittedAt: true,
              },
            },
            attendanceLogs: {
              select: {
                id: true,
                engagementScore: true,
                wasPresent: true,
                markedAt: true,
                userId: true,
              },
            },
            progresses: {
              select: {
                id: true,
                watchTime: true,
              },
            },
          },
        },
        discussionPosts: {
          select: {
            id: true,
            userId: true,
            courseId: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
            replies: {
              select: {
                id: true,
                postId: true,
                userId: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (courses.length == 0) {
      res.status(200).json({ message: "No courses found", courses: [] });
      return;
    }

    res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourseDetailsById = async (req: JwtRequest, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  const lecturerId = req.user?.userId;

  try {
    const courseInfo = await prisma.course.findFirst({
      where: {
        id: courseId,
        lecturerId,
      },
      include: {
        enrollments: true,
        lectures: true,
        attendanceReports: true,
      },
    });

    if (!courseInfo) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.status(200).json({
      courseInfo,
    });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCourseById = async (req: JwtRequest, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  const { title, code, description } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        title,
        code,
        description,
      },
    });

    res.json({
      message: "Course updated successfully",
      courseId: updatedCourse.id,
    });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCourseById = async (req: JwtRequest, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadLectureVideo = async (req: JwtRequest, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  const { title } = req.body;

  if (!req.file) {
    console.log("No file uploaded");
    res.status(400).json({ message: "No video file uploaded" });
    return;
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "lecture_videos",
    });

    const newLecture = await prisma.lecture.create({
      data: {
        title,
        videoUrl: result.secure_url,
        courseId,
        duration: parseInt(result.duration) || 0,
      },
    });

    res.status(201).json({
      message: "Lecture video uploaded successfully",
      lecture: newLecture,
    });
  } catch (error) {
    console.error("Error uploading lecture video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllLecturesByCourseId = async (
  req: JwtRequest,
  res: Response
) => {
  const courseId = parseInt(req.params.courseId);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (isNaN(courseId)) {
    res.status(400).json({ message: "Invalid course ID" });
    return;
  }

  try {
    const lectures = await prisma.lecture.findMany({
      where: {
        courseId,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        duration: true,
        createdAt: true,
      },
    });

    if (lectures.length === 0) {
      res.status(404).json({ message: "No lectures found for this course." });
      return;
    }

    res.status(200).json({ courseId, lectures });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLectureDetailsById = async (req: JwtRequest, res: Response) => {
  const lectureId = parseInt(req.params.lectureId);
  const userId = req.user?.userId;

  if (isNaN(lectureId)) {
    res.status(400).json({ message: "Invalid lecture ID" });
    return;
  }

  try {
    const lecture = await prisma.lecture.findUnique({
      where: {
        id: lectureId,
      },
      include: {
        course: {
          select: { id: true, title: true, code: true },
        },
        quizzes: {
          select: {
            id: true,
            question: true,
            options: true, // remember: this is stored as a JSON string
          },
        },
        progresses: {
          where: {
            userId,
          },
          select: {
            id: true,
            watched: true,
            watchTime: true,
            skippedTime: true,
            playbackSpeed: true,
            completedAt: true,
          },
        },
      },
    });

    if (!lecture) {
      res.status(404).json({ message: "Lecture not found" });
      return;
    }

    const progress = lecture.progresses[0] || null;

    res.status(200).json({
      id: lecture.id,
      title: lecture.title,
      videoUrl: lecture.videoUrl,
      createdAt: lecture.createdAt,
      course: lecture.course,
      quizzes: lecture.quizzes,
      progress,
    });
  } catch (error) {
    console.error("Error fetching lecture details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLectureById = async (req: JwtRequest, res: Response) => {
  const lectureId = parseInt(req.params.lectureId);
  const { title, videoUrl, duration } = req.body;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (isNaN(lectureId)) {
    res.status(400).json({ message: "Invalid lecture ID" });
    return;
  }

  if (!title && !videoUrl && duration) {
    res.status(400).json({ message: "No valid fields to update" });
    return;
  }

  try {
    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        course: true,
      },
    });

    if (!lecture) {
      res.status(404).json({ message: "Lecture not found" });
      return;
    }

    const isOwner = lecture.course.lecturerId === userId;

    if (userRole !== Role.ADMIN && !isOwner) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const updatedlecture = await prisma.lecture.update({
      where: { id: lectureId },
      data: {
        title: title ?? lecture.title,
        videoUrl: videoUrl ?? lecture.videoUrl,
        duration: duration ?? lecture.duration,
      },
    });

    res.status(200).json({
      message: "Lecture updated successfully",
      lecture: updatedlecture,
    });
  } catch (error) {
    console.error("Error updating lecture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteLectureById = async (req: JwtRequest, res: Response) => {
  const lectureId = parseInt(req.params.lectureId);
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (isNaN(lectureId)) {
    res.status(400).json({ message: "Invalid lecture ID" });
    return;
  }

  try {
    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        course: true,
      },
    });

    if (!lecture) {
      res.status(404).json({ message: "Lecture not found" });
      return;
    }

    const isOwner = lecture.course.lecturerId === userId;

    if (userRole !== Role.ADMIN && !isOwner) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    // Delete associated lecture data first (if cascading is not enabled)
    await prisma.lectureProgress.deleteMany({ where: { lectureId } });
    await prisma.quiz.deleteMany({ where: { lectureId } });
    await prisma.attendanceLog.deleteMany({ where: { lectureId } });

    // Delete lecture
    await prisma.lecture.delete({
      where: { id: lectureId },
    });

    res.status(200).json({
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
