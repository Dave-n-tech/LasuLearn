import prisma from "../utils/prismaClient";

export const createNotification = async (
  userIds: number[],
  title: string,
  message: string
) => {
  const notifications = userIds.map((userId) => ({
    userId,
    title,
    message,
  }));

  try {
    const notification = await prisma.notification.createMany({
      data: notifications,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification: ", error);
    throw new Error("Failed to create notification");
  }
};
