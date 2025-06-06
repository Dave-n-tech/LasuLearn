import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { Role } from "../../generated/prisma";
import { enrollInCourse, getAllCourses, getCourseDetails, getEnrolledCourses } from "../controllers/student/courseController";
import { getAllStudents, getStudentById, updateStudent } from "../controllers/student/studentController";
const router = express.Router();


router.get("/", getAllStudents)
router.get("/:id", getStudentById)
router.patch("/:id", verifyToken([Role.STUDENT]), updateStudent)


// Get all courses available for students
router.get("/courses", verifyToken([Role.STUDENT]), getAllCourses)



// get details for a single course
router.get("/courses/:courseId/details", verifyToken([Role.STUDENT]), getCourseDetails)

//  Get all enrolled courses for a student
router.get("/courses/enrollments", verifyToken([Role.STUDENT]), getEnrolledCourses)

// Enroll a student in a course
router.post("/courses/:courseId/enroll", verifyToken([Role.STUDENT]), enrollInCourse)

export default router;