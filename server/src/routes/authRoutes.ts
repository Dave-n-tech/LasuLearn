import express from "express";
const router = express.Router();
import { login, registerStudent, registerLecturer, registerAdmin, refreshAccessToken, logout, verifyAccessToken } from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";
import { Role } from "../../generated/prisma";

// shared login
router.post("/login", login);

// student register
router.post("/student/register", registerStudent);
// Lecturer register
router.post("/lecturer/register", registerLecturer)
// admin register
router.post("/admin/register", registerAdmin)
// refresh token
router.post("/refresh_token", refreshAccessToken)
// verify token
router.get("/verify_token", verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]), verifyAccessToken )
// logout
router.post("/logout", logout)

export default router;
