import { Request, Response } from "express";
import { JwtRequest } from "../../types";
import prisma from "../../utils/prismaClient";
import { Role } from "../../../generated/prisma";
import { Quiz } from "../../../generated/prisma";
import { v4 as uuidv4 } from "uuid";
import { Parser } from "json2csv";
import { uploadToCloudinary } from "../../utils/cloudinary";
import axios from "axios";

// get all courses available for students
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany();

    if (!courses) {
      res.status(404).json({ message: "No courses available" });
      return;
    }

    res.json(courses);
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Error getting available courses" });
  }
};

// get details of course
export const getCourseDetails = async (req: JwtRequest, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  const studentId = req.user?.userId;

  try {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: studentId,
        courseId,
      },
    });

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        lecturer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        lectures: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            createdAt: true,
            attendanceLogs: {
              where: {
                userId: studentId,
              },
              select: {
                engagementScore: true,
                markedAt: true,
                wasPresent: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      res.status(404).json({ message: "course not found" });
      return;
    }

    if (!enrollment) {
      res.json({
        message: "You are not enrolled in this course",
        data: {
          courseId: course.id,
          title: course.title,
          description: course.description,
        },
      });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error("an error occurred");
    res.status(500).json({ message: "Error finding course" });
  }
};

// get list of enrolled courses for a student
export const getEnrolledCourses = async (req: JwtRequest, res: Response) => {
  const studentId = req.user?.userId;

  try {
    const enrolledCourses = await prisma.enrollment.findMany({
      where: {
        userId: studentId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            code: true,
            lecturer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            lectures: {
              select: {
                id: true,
                title: true,
                videoUrl: true,
                duration: true,
                createdAt: true,
                attendanceLogs: {
                  where: {
                    userId: studentId,
                  },
                  select: {
                    engagementScore: true,
                    markedAt: true,
                    wasPresent: true,
                  },
                },
                progresses: {
                  where: {
                    userId: studentId,
                  },
                  select: {
                    id: true,
                    watched: true,
                    watchTime: true,
                    skippedTime: true,
                    completedAt: true,
                  },
                }
              },
              orderBy: {
                createdAt: "asc",
              },
            }
          },
        },
      },
    });

    if (!enrolledCourses) {
      res.status(404).json({ message: "No courses enrolled" });
      return;
    }

    res.json(enrolledCourses);
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Error getting courses enrolled" });
  }
};

// enroll student in a course
export const enrollInCourse = async (req: JwtRequest, res: Response) => {
  const studentId = req.user?.userId;
  const courseId = parseInt(req.params.courseId);

  if (!courseId || !studentId) {
    res.status(400).json({
      message: "Missing course or student id",
    });
    return;
  }

  try {
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: studentId,
        courseId,
      },
    });

    if (existingEnrollment) {
      res.status(409).json({ message: "Already enrolled in this course" });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: studentId,
        courseId,
      },
    });

    res
      .status(201)
      .json({ message: "Successfully enrolled in course", enrollment });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Error enrolling in course" });
  }
};

// get attendance for all lectures of a course
export const getStudentCourseAttendance = async (
  req: JwtRequest,
  res: Response
) => {
  const courseId = parseInt(req.params.courseId);
  const studentId = req.user?.userId;

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

export const addLectureQuizzes = async (req: JwtRequest, res: Response) => {
  const lectureId = parseInt(req.params.lectureId);
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  // array of quiz questions
  const quizzes: Quiz[] = req.body.quizzes;

  if (isNaN(lectureId)) {
    res.status(400).json({ message: "Invalid lecture Id" });
  }

  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    res.status(400).json({ message: "Quizzes are required." });
    return;
  }

  try {
    const lecture = await prisma.lecture.findFirst({
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

    const created = await prisma.quiz.createMany({
      data: quizzes.map((quiz: Quiz) => ({
        lectureId,
        question: quiz.question,
        options: JSON.stringify(quiz.options),
        correctAnswer: quiz.correctAnswer,
      })),
    });

    res.status(201).json({
      message: "Quizzes added successfully",
      added: created.count,
    });
  } catch (error) {
    console.error("Error adding quizzes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getLectureQuizzes = async (req: JwtRequest, res: Response) => {
  const lectureId = parseInt(req.params.lectureId);
  const userRole = req.user?.role;

  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        id: lectureId,
      },
      orderBy: { id: "asc" },
    });

    if (!quizzes || quizzes.length === 0) {
      res.status(404).json({ message: "No quizzes found for this lecture." });
      return;
    }

    // Hide correct answers for students
    const formatted = quizzes.map((quiz) => ({
      id: quiz.id,
      question: quiz.question,
      options: JSON.parse(quiz.options),
      ...(userRole !== Role.STUDENT && { correctAnswer: quiz.correctAnswer }),
    }));

    res.status(200).json({ quizzes: formatted });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuizById = async (req: JwtRequest, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const userRole = req.user?.role;

  try {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });

    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    const formatted = {
      id: quiz.id,
      question: quiz.question,
      options: JSON.parse(quiz.options),
      ...(userRole !== Role.STUDENT && { correctAnswer: quiz.correctAnswer }),
    };

    res.status(200).json({ quiz: formatted });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateQuizById = async (req: JwtRequest, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const { question, options, correctAnswer } = req.body;

  try {
    const updated = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        question,
        options: JSON.stringify(options),
        correctAnswer,
      },
    });

    res.status(200).json({ message: "Quiz updated", updated });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteQuizById = async (req: JwtRequest, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const userRole = req.user?.role;

  if (userRole !== Role.LECTURER && userRole !== Role.ADMIN) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  try {
    await prisma.quiz.delete({ where: { id: quizId } });

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const generateAttendanceReport = async (
  req: JwtRequest,
  res: Response
) => {
  const courseId = parseInt(req.params.courseId);
  const lecturerId = req.user?.userId;
  const role = req.user?.role;

  if (!lecturerId || (role !== Role.LECTURER && role !== Role.ADMIN)) {
    res.status(403).json({ message: "Not authorized" });
    return;
  }

  try {
    const attendanceLogs = await prisma.attendanceLog.findMany({
      where: {
        lecture: { courseId },
      },
      include: {
        user: true,
        lecture: {
          include: {
            course: true
          }
        },
      },
    });

    if (attendanceLogs.length === 0) {
      res.status(404).json({ message: "No attendance data found" });
      return;
    }

    const formatted = attendanceLogs.map((log) => ({
      student: `${log.user.firstName} ${log.user.lastName}`,
      matricNo: log.user.matricNo,
      lecture: log.lecture.title,
      course: log.lecture.course.code,
      date: log.markedAt.toLocaleString(),
      present: log.wasPresent,
      engagementScore: log.engagementScore,
    }));

    const parser = new Parser();
    const csv = parser.parse(formatted);

    // Upload to Cloudinary or local storage
    const buffer = Buffer.from(csv, "utf-8");
    const cloudinaryResult = await uploadToCloudinary(
      buffer,
      `attendance-report-${uuidv4()}.csv`,
      "text/csv"
    );

    const savedReport = await prisma.attendanceReport.create({
      data: {
        courseId,
        lecturerId,
        reportUrl: cloudinaryResult.secure_url,
      },
    });

    res.status(201).json({
      message: "Attendance report generated successfully",
      report: savedReport,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAttendanceReport = async (req: JwtRequest, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  const userId = req.user?.userId;
  const role = req.user?.role;

  if (!userId || (role !== Role.LECTURER && role !== Role.ADMIN)) {
    res.status(403).json({ message: "Not authorized" });
    return;
  }

  try {
    const report = await prisma.attendanceReport.findFirst({
      where: {
        courseId,
        lecturerId: userId,
      },
      orderBy: { generatedAt: "desc" },
    });

    if (!report || !report.reportUrl) {
      res.status(404).json({ message: "Report not found" });
      return; 
    }

    const fileResponse = await axios.get(report.reportUrl, {
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="attendance_report_course_${courseId}.csv"`
    );

    res.send(fileResponse.data);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
