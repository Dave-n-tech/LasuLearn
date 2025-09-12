import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";
import {
  createDiscussionPost,
  createDiscussionPostReply,
  deleteDiscussionPostById,
  deleteReplyPostById,
  getDiscussionPostById,
  getDiscussionsByCourseId,
  getPostReplyById,
  updateDiscussionPostById,
  updateReplyPostById,
} from "../controllers/shared/discussioncontroller";
const router = express.Router();

// discussion posts
router.get(
  "/:courseId",
  verifyToken([Role.STUDENT, Role.LECTURER]),
  getDiscussionsByCourseId
);
router.post(
  "/:courseId/post",
  verifyToken([Role.STUDENT, Role.LECTURER]),
  createDiscussionPost
);
router.get(
  "/:courseId/post/:postId",
  verifyToken([Role.STUDENT, Role.LECTURER]),
  getDiscussionPostById
);
router.patch(
  "/:courseId/post/:postId",
  verifyToken([Role.STUDENT, Role.LECTURER]),
  updateDiscussionPostById
);
router.delete(
  "/:courseId/post/:postId",
  verifyToken([Role.STUDENT, Role.LECTURER]),
  deleteDiscussionPostById
);


// discussion replies
router.post(
  "/post/:postId/reply",
  verifyToken([Role.STUDENT, Role.LECTURER]),
  createDiscussionPostReply
);
router.get(
  "/post/:postId/reply/:replyId",
  verifyToken([Role.STUDENT, Role.LECTURER]),
  getPostReplyById
);
router.patch(
  "/post/:postId/reply/:replyId",
  verifyToken([Role.STUDENT, Role.LECTURER]),
  updateReplyPostById
);
router.delete(
  "/post/:postId/reply/:replyId",
  verifyToken([Role.STUDENT, Role.LECTURER]),
  deleteReplyPostById
);

export default router;
