
# 📘 API Documentation

This file documents all API endpoints grouped by role and shared features for the LASU VLP backend.

---

## 🔐 Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/login` | Shared login route |
| POST   | `/api/auth/student/register` | Register a student |
| POST   | `/api/auth/lecturer/register` | Register a lecturer |
| POST   | `/api/auth/admin/register` | Register an admin |
| POST   | `/api/auth/refresh_token` | Refresh access token |
| POST   | `/api/auth/logout` | Logout user and clear refresh token |

---

## 🎓 Student Routes

### 👤 Student Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/students/` | Get all students |
| GET    | `/api/students/:id` | Get student by ID |
| PATCH  | `/api/students/:id` | Update student profile |

### 📚 Course Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/students/courses` | Get all courses |
| GET    | `/api/students/courses/:courseId/details` | Get detailed course info |
| GET    | `/api/students/courses/enrollments` | Get student’s enrolled courses |
| POST   | `/api/students/courses/:courseId/enroll` | Enroll in a course |
| GET    | `/api/students/courses/:courseId/attendance` | Get student’s attendance for a course |

### 📺 Lecture Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/students/lectures/progress` | Get all lecture progress for student |
| GET    | `/api/students/lectures/:lectureId/progress` | Get progress for a specific lecture |
| PATCH  | `/api/students/lectures/:lectureId/progress` | Update lecture progress |
| POST   | `/api/students/lectures/:lectureId/quizzes/submit` | Submit quiz answers |
| POST   | `/api/students/lectures/:lectureId/attendance` | Mark attendance |

---

## 👨‍🏫 Lecturer Routes

### 👤 Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/lecturers/:id` | Get lecturer profile |
| PATCH  | `/api/lecturers/:id` | Update lecturer profile |

### 🎓 Student Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/lecturers/courses/:courseId/students` | Get students in a course |
| GET    | `/api/lecturers/courses/:courseId/students/:studentId/attendance` | Get student's attendance |
| GET    | `/api/lecturers/courses/:courseId/students/:studentId/performance` | Get student performance |

### 📚 Course Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/lecturers/courses` | Create course |
| GET    | `/api/lecturers/courses` | Get all courses |
| GET    | `/api/lecturers/courses/:courseId` | Get course details |
| PATCH  | `/api/lecturers/courses/:courseId` | Update course |
| DELETE | `/api/lecturers/courses/:courseId` | Delete course |

### 📺 Lecture & Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/lecturers/courses/:courseId/lectures` | Upload lecture video |
| GET    | `/api/lecturers/courses/:courseId/lectures` | Get all lectures in a course |
| GET    | `/api/lecturers/courses/lectures/:lectureId` | Get lecture details |
| PATCH  | `/api/lecturers/courses/lectures/:lectureId` | Update lecture |
| DELETE | `/api/lecturers/courses/lectures/:lectureId` | Delete lecture |

### 📝 Quizzes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/lecturers/lectures/:lectureId/quizzes` | Add quizzes to a lecture |
| GET    | `/api/lecturers/lectures/:lectureId/quizzes` | Get quizzes for lecture |
| GET    | `/api/lecturers/lectures/quizzes/:quizId` | Get quiz by ID |
| PATCH  | `/api/lecturers/lectures/quizzes/:quizId` | Update quiz |
| DELETE | `/api/lecturers/lectures/quizzes/:quizId` | Delete quiz |

### 🧾 Attendance Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/lecturers/courses/:courseId/attendance-report` | Generate report |
| GET    | `/api/lecturers/courses/:courseId/attendance-report` | Download attendance report |

---

## 🔔 Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/notifications/` | Get all user notifications |
| PATCH  | `/api/notifications/:notificationId/mark-as-read` | Mark notification as read |

---

## 💬 Discussions (Shared)

### 📝 Discussion Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/discussions/:courseId` | Get all discussion posts |
| POST   | `/api/discussions/:courseId/post` | Create a new discussion post |
| GET    | `/api/discussions/:courseId/post/:postId` | Get a post by ID |
| PATCH  | `/api/discussions/:courseId/post/:postId` | Update a post |
| DELETE | `/api/discussions/:courseId/post/:postId` | Delete a post |

### 💬 Replies

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/discussions/post/:postId/reply` | Reply to a post |
| GET    | `/api/discussions/post/:postId/reply/:replyId` | Get a reply |
| PATCH  | `/api/discussions/post/:postId/reply/:replyId` | Update a reply |
| DELETE | `/api/discussions/post/:postId/reply/:replyId` | Delete a reply |
