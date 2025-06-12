import express from "express";
const router = express.Router();
import { login, registerStudent, registerLecturer, registerAdmin, refreshAccessToken, logout } from "../controllers/authController";

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
// logout
router.post("/logout", logout)

export default router;
