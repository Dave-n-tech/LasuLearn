# LASULEARN – Virtual Learning Platform

LASULEARN is a scalable, production-ready virtual learning platform designed for universities to improve course delivery, student engagement, and attendance accountability. Unlike traditional learning management systems that rely on login-based or manual attendance, LASULEARN introduces **playback-based attendance monitoring**, ensuring that attendance reflects actual student participation.

This project was developed as a **project-based software engineering solution** and validated through real user testing, system analytics, and performance evaluation.

---

## 🚀 Key Features

### 🎓 Course & Lecture Management

* Lecturers can create courses and upload lecture videos
* Structured lecture organization by course
* Support for multiple departments and cohorts

### ▶️ Playback-Based Attendance Tracking

* Attendance derived from real engagement signals:

  * Watch time
  * Playback speed
  * Skipping and rewinding behavior
  * Tab switching / inactivity detection
* Prevents passive or fraudulent attendance logging

### 🧠 In-Video Quizzes

* Time-limited quizzes embedded within lectures
* Reinforces learning and validates attention
* Quiz completion contributes to attendance validation

### 📊 Learning Progress Tracking

* Tracks lecture completion per student
* Aggregates quiz performance and engagement metrics
* Enables instructors to monitor class-level analytics

### 💬 Discussion Forums

* Peer-to-peer and student–lecturer interaction
* Encourages collaborative learning

### 🔔 Notifications System

* Broadcast notifications for:

  * New lecture uploads
  * Course updates and announcements

---

## 🏗️ System Architecture

### Frontend

* **Next.js (React)**
* Tailwind CSS for responsive UI
* Context-based state management
* Client-side playback monitoring

### Backend

* **Node.js + Express**
* RESTful API architecture
* **PostgreSQL** with Prisma ORM
* Modular separation of concerns (auth, courses, lectures, quizzes, notifications)

### Database

* PostgreSQL (production)
* SQLite (development)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📦 Installation & Setup

### Prerequisites

* Node.js (v18+ recommended)
* PostgreSQL
* npm or yarn

### Clone Repository

```bash
git clone https://github.com/Dave-n-tech/LasuLearn.git
cd LasuLearn
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:port/db
ACCESS_TOKEN_SECRET=xxxx
REFRESH_TOKEN_SECRET=xxxx

CLOUDINARY_CLOUD_NAME=project-name
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
CLOUDINARY_URL=xxxx
```

Run migrations and generate Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Start backend server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Authentication & Security

* JWT-based authentication
* Role-based access control (Student / Lecturer)
* Secure API routes with middleware validation

---

## 🧠 Design Philosophy

LASULEARN is built on the principle that **attendance should reflect engagement, not presence**. By coupling playback analytics with assessment signals, the platform ensures:

* Fair attendance verification
* Improved learning accountability
* Better insight for instructors

---

## 📈 Future Improvements

* Live classes and real-time chat
* Offline lecture downloads with sync
* AI-powered learning analytics
* Gamification (badges, leaderboards)
* Advanced performance dashboards

---

## 🧑‍💻 Author

**Obadimeji David**
Software Engineer (Full-Stack)

* GitHub: [https://github.com/Dave-n-tech](https://github.com/Dave-n-tech)
* LinkedIn: [https://linkedin.com/in/david-obadimeji](https://www.linkedin.com/in/david-obadimeji-04595b282)
* Email: [davidobadimeji1@gmail.com](mailto:davidobadimeji1@gmail.com)

---

## 📄 License

This project is licensed for academic and demonstration purposes.

---

> LASULEARN — redefining attendance through engagement.
