import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { Role } from "../../generated/prisma";
import {
  getLecturerById,
  updateLecturerById,
} from "../controllers/lecturer/lecturerController";
import {
  createCourse,
  deleteCourseById,
  deleteLectureById,
  getAllLecturesByCourseId,
  getCourseDetailsById,
  getCoursesByLecturerId,
  getLectureDetailsById,
  getStudentCourseAttendanceLog,
  getStudentPerformanceInCourse,
  getStudentsEnrolledInCourse,
  updateCourseById,
  updateLectureById,
  uploadLectureVideo,
} from "../controllers/lecturer/lecturerCourseController";
import {
  addLectureQuizzes,
  deleteQuizById,
  generateAttendanceReport,
  getAttendanceReport,
  getLectureQuizzes,
  getQuizById,
  updateQuizById,
} from "../controllers/student/courseController";

const router = express.Router();

// Routes:

// profile:
router.get("/:id", verifyToken([Role.LECTURER]), getLecturerById);
router.patch("/:id", verifyToken([Role.LECTURER]), updateLecturerById);

// Student management
router.get(
  "/courses/:courseId/students",
  verifyToken([Role.LECTURER]),
  getStudentsEnrolledInCourse
);
router.get(
  "/courses/:courseId/students/:studentId/attendance",
  verifyToken([Role.LECTURER]),
  getStudentCourseAttendanceLog
);
router.get(
  "/courses/:courseId/students/:studentId/performance",
  verifyToken([Role.LECTURER]),
  getStudentPerformanceInCourse
);

// Course management:
router.post("/courses", verifyToken([Role.LECTURER]), createCourse);
router.get("/courses/all", verifyToken([Role.LECTURER]), getCoursesByLecturerId);
router.get(
  "/courses/:courseId",
  verifyToken([Role.LECTURER]),
  getCourseDetailsById
);
router.patch(
  "/courses/:courseId",
  verifyToken([Role.LECTURER]),
  updateCourseById
);
router.delete(
  "/courses/:courseId",
  verifyToken([Role.LECTURER]),
  deleteCourseById
);

// Lecture and Content management:

router.post(
  "/courses/:courseId/lectures",
  verifyToken([Role.LECTURER]),
  uploadLectureVideo
);

router.get(
  "/courses/:courseId/lectures",
  verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]),
  getAllLecturesByCourseId
);

router.get(
  "/courses/lectures/:lectureId",
  verifyToken([Role.STUDENT, Role.LECTURER]),
  getLectureDetailsById
);

router.patch(
  "/courses/lectures/:lectureId",
  verifyToken([Role.LECTURER, Role.ADMIN]),
  updateLectureById
);

router.delete(
  "/courses/lectures/:lectureId",
  verifyToken([Role.LECTURER, Role.ADMIN]),
  deleteLectureById
);

// Quiz management
router.post(
  "/lectures/:lectureId/quizzes",
  verifyToken([Role.LECTURER, Role.ADMIN]),
  addLectureQuizzes
);

router.get(
  "/lectures/:lectureId/quizzes",
  verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]),
  getLectureQuizzes
);

router.get(
  "/lectures/quizzes/:quizId",
  verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]),
  getQuizById
);

router.patch(
  "/lectures/quizzes/:quizId",
  verifyToken([Role.LECTURER, Role.ADMIN]),
  updateQuizById
);

router.delete(
  "/lectures/quizzes/:quizId",
  verifyToken([Role.LECTURER, Role.ADMIN]),
  deleteQuizById
);


// Attendance reports
router.post(
  "/courses/:courseId/attendance-report",
  verifyToken([Role.LECTURER, Role.ADMIN]),
  generateAttendanceReport
);

router.get(
  "/courses/:courseId/attendance-report",
  verifyToken([Role.LECTURER, Role.ADMIN]),
  getAttendanceReport
);

export default router;
