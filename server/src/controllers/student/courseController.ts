import { Request, Response } from "express";
import { JwtRequest } from "../../types";
import prisma from "../../utils/prismaClient";

// get all courses available for students
export const getAllCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
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
export const getCourseDetails = async (
  req: JwtRequest,
  res: Response
): Promise<void> => {
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
    }

    res.json(course);
    return;
  } catch (error) {
    console.error("an error occurred");
    res.status(500).json({ message: "Error finding course" });
  }
};

// get list of enrolled courses for a student
export const getEnrolledCourses = async (
  req: JwtRequest,
  res: Response
): Promise<void> => {
  const studentId = req.user?.userId;

  try {
    const enrolledCourses = await prisma.enrollment.findMany({
      where: {
        userId: studentId,
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

// enroll studnt in a course
export const enrollInCourse = async (
  req: JwtRequest,
  res: Response
): Promise<void> => {
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
    return;
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Error enrolling in course" });
  }
};
