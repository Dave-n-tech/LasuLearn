import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { Role } from "../../generated/prisma";
import { enrollInCourse, getAllCourses, getCourseDetails, getEnrolledCourses, getStudentCourseAttendance} from "../controllers/student/courseController";
import { getAllStudents, getStudentById, updateStudentById } from "../controllers/student/studentController";
import { getLectureProgress, getAllLectureProgressForStudent, markAttendance, submitQuizResponse, updateLectureProgress } from "../controllers/student/lectureController";
const router = express.Router();

// students
router.get("/", getAllStudents)
router.get("/:id", verifyToken([Role.STUDENT]), getStudentById)
router.patch("/:id", verifyToken([Role.STUDENT]), updateStudentById)

// courses
router.get("/courses", verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]), getAllCourses)
router.get("/courses/:courseId/details", verifyToken([Role.STUDENT]), getCourseDetails)
router.get("/courses/enrollments", verifyToken([Role.STUDENT]), getEnrolledCourses)
router.post("/courses/:courseId/enroll", verifyToken([Role.STUDENT]), enrollInCourse)
router.get("/courses/:courseId/attendance", verifyToken([Role.STUDENT]), getStudentCourseAttendance)

// lectures
router.get("/lectures/progress", verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]), getAllLectureProgressForStudent) // get all lecture progresses for a student
router.get("/lectures/:lectureId/progress", verifyToken([Role.STUDENT]), getLectureProgress)
router.patch("/lectures/:lectureId/progress", verifyToken([Role.STUDENT]), updateLectureProgress)
router.post("/lectures/:lectureId/quizzes/submit", verifyToken([Role.STUDENT]), submitQuizResponse) // submit quiz response
router.post("/lectures/:lectureId/attendance", verifyToken([Role.STUDENT]) , markAttendance)


export default router;