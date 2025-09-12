import { Response } from "express";
import { JwtRequest } from "../../types";
import prisma from "../../utils/prismaClient";

export const getUserNotifications = async (req: JwtRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const createNotification = async (req: JwtRequest, res: Response) => {
  const userId = req.user?.userId;
  const courseId = parseInt(req.params.courseId);
  const { title, message } = req.body;

  if (!userId) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  try {
    // Find all students enrolled in this course
    const enrolledStudents = await prisma.enrollment.findMany({
      where: { courseId: Number(courseId) },
      select: { userId: true },
    });

    if (!enrolledStudents.length) {
      res.status(404).json({ message: "No students enrolled in this course" });
      return;
    }

    // Create notifications for all students
    await prisma.notification.createMany({
      data: enrolledStudents.map((student) => ({
        userId: student.userId,
        title,
        message,
      })),
    });

    res.status(201).json({ message: "Notifications sent successfully" });
  } catch (error) {
    console.error("Error creating notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}

export const markNotificationAsRead = async (req: JwtRequest, res: Response) => {
  const userId = req.user?.userId;
  const notificationId = parseInt(req.params.notificationId);

  if (!userId) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  try {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return 
    }

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read: ", error);
    res.status(500).json({ message: "internal server error" });
  }
};
