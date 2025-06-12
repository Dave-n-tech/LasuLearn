import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { Role } from "../../generated/prisma";
import { enrollInCourse, getAllCourses, getCourseDetails, getEnrolledCourses} from "../controllers/student/courseController";
import { getAllStudents, getStudentById, updateStudent } from "../controllers/student/studentController";
import { getLectureProgress, getAllLectureProgressForStudent, markAttendance, submitQuizResponse, updateLectureProgress } from "../controllers/student/lectureController";
const router = express.Router();

// students
router.get("/", getAllStudents)
router.get("/:id", getStudentById)
router.patch("/:id", verifyToken([Role.STUDENT]), updateStudent)

// courses
router.get("/courses", verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]), getAllCourses)
router.get("/courses/:courseId/details", verifyToken([Role.STUDENT]), getCourseDetails)
router.get("/courses/enrollments", verifyToken([Role.STUDENT]), getEnrolledCourses)
router.post("/courses/:courseId/enroll", verifyToken([Role.STUDENT]), enrollInCourse)

// lectures
router.get("/lectures/progress", verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]), getAllLectureProgressForStudent) // get all lecture progresses for a student
router.get("/lectures/:lectureId/progress", verifyToken([Role.STUDENT]), getLectureProgress)
router.patch("/lectures/:lectureId/progress", verifyToken([Role.STUDENT]), updateLectureProgress)
router.post("/lectures/:lectureId/quizzes/submit", verifyToken([Role.STUDENT]), submitQuizResponse) // submit quiz response
router.post("/lectures/:lectureId/attendance", verifyToken([Role.STUDENT]) , markAttendance)

// discussions
// router.get("/discussions", verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]), getAllDiscussions)
// router.get("/discussions/:discussionId", verifyToken([Role.STUDENT, Role.LECTURER, Role.ADMIN]), getDiscussionById)

export default router;