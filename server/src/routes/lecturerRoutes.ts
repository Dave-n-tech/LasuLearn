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
import { addQuizQuestionsToLecture } from "../controllers/student/courseController";

const router = express.Router();

// Routes:

// profile:
// - view own profile
// - update profile info
router.get("/:id", verifyToken([Role.LECTURER]), getLecturerById);
router.patch("/:id", verifyToken([Role.LECTURER]), updateLecturerById);

// Student management
// - get list of students enrolled in a course
// - get a student's attendance log for a course
// - view a student's attendance + quiz performance
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
// - create a new course
// - get all courses taken by the lecturer
// - get detailed info on a specific course
// - update course metadata
// - delete a course
router.post("/courses", verifyToken([Role.LECTURER]), createCourse);
router.get("/courses", verifyToken([Role.LECTURER]), getCoursesByLecturerId);
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

// - upload a new lecture video
router.post(
  "/courses/:courseId/lectures",
  verifyToken([Role.LECTURER]),
  uploadLectureVideo
);

// - get all lectures for a course
router.get(
  "/courses/:courseId/lectures",
  verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]),
  getAllLecturesByCourseId
);

// - get details of a specific lecture
router.get(
  "/courses/lectures/:lectureId",
  verifyToken([Role.STUDENT, Role.LECTURER]),
  getLectureDetailsById
);
// - update lecture metadata
router.patch(
  "/courses/lectures/:lectureId",
  verifyToken([Role.LECTURER, Role.ADMIN]),
  updateLectureById
);
// - delete a lecture
router.delete(
  "/courses/lectures/:lectureId",
  verifyToken([Role.LECTURER, Role.ADMIN]),
  deleteLectureById
);

// Quiz management
// - add quiz questions to a lecture
router.post(
  "/lectures/:lectureId/quizzes",
  verifyToken([Role.LECTURER]),
  addQuizQuestionsToLecture
);
// - view all quiz questions for a lecture
router.get("/lectures/:lectureId/quizzes", verifyToken([Role.LECTURER]));
// - edit a quiz question
router.patch("/lectures/quizzes/:quizId", verifyToken([Role.LECTURER]));
// - delete a quiz question
router.delete("/lectures/quizzes/:quizId", verifyToken([Role.LECTURER]));

// Attendance reports
// - generate course attendance report
router.post(
  "/courses/:courseId/attendance-report",
  verifyToken([Role.LECTURER])
);
// - view/download report for a course
router.get(
  "/courses/:courseId/attendance-report",
  verifyToken([Role.LECTURER])
);

export default router;
