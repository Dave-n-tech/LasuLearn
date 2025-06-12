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
        creaatedAt: "desc",
      },
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    res.status(500).json({ message: "internal server error" });
  }
};

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
