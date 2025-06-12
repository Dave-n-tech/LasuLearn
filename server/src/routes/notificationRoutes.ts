import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { Role } from "../../generated/prisma";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../controllers/shared/notificationController";
const router = express.Router();

router.get(
  "/",
  verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]),
  getUserNotifications
);

router.patch(
  "/:notificationId/mark-as-read",
  verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]),
  markNotificationAsRead
);

export default router;
