import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.discussionReply.deleteMany();
  await prisma.discussionPost.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lecture.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const passwordHash = await bcrypt.hash("password123", 10);

  // Create Lecturers
  const lecturer1 = await prisma.user.create({
    data: {
      email: "jane.doe@lasu.edu",
      password: passwordHash,
      firstName: "Jane",
      lastName: "Doe",
      role: Role.LECTURER,
      faculty: "Science",
      department: "Computer Science",
    },
  });

  const lecturer2 = await prisma.user.create({
    data: {
      email: "john.smith@lasu.edu",
      password: passwordHash,
      firstName: "John",
      lastName: "Smith",
      role: Role.LECTURER,
      faculty: "Engineering",
      department: "Electrical Engineering",
    },
  });

  // Create Students
  const student1 = await prisma.user.create({
    data: {
      email: "maria.adewale@student.lasu.edu",
      password: passwordHash,
      firstName: "Maria",
      lastName: "Adewale",
      role: Role.STUDENT,
      matricNo: "CSC/2020/001",
      level: "400",
      faculty: "Science",
      department: "Computer Science",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "ibrahim.olatunji@student.lasu.edu",
      password: passwordHash,
      firstName: "Ibrahim",
      lastName: "Olatunji",
      role: Role.STUDENT,
      matricNo: "CSC/2020/002",
      level: "400",
      faculty: "Science",
      department: "Computer Science",
    },
  });

  const student3 = await prisma.user.create({
    data: {
      email: "chioma.okeke@student.lasu.edu",
      password: passwordHash,
      firstName: "Chioma",
      lastName: "Okeke",
      role: Role.STUDENT,
      matricNo: "EEE/2020/003",
      level: "400",
      faculty: "Engineering",
      department: "Electrical Engineering",
    },
  });

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: "Introduction to Artificial Intelligence",
      code: "CSC401",
      description:
        "Fundamentals of AI including search, reasoning, and machine learning.",
      lecturerId: lecturer1.id,
      thumbnail: "https://placehold.co/600x400/AI",
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "Power Systems Engineering",
      code: "EEE402",
      description: "Study of power generation, transmission, and distribution.",
      lecturerId: lecturer2.id,
      thumbnail: "https://placehold.co/600x400/Power",
    },
  });

  // Enroll students
  await prisma.enrollment.createMany({
    data: [
      { userId: student1.id, courseId: course1.id },
      { userId: student2.id, courseId: course1.id },
      { userId: student3.id, courseId: course2.id },
    ],
  });

  // Lectures for AI Course
  const lecture1 = await prisma.lecture.create({
    data: {
      title: "History and Applications of AI",
      videoUrl: "https://example.com/ai-lecture1.mp4",
      duration: 3600,
      courseId: course1.id,
    },
  });

  const lecture2 = await prisma.lecture.create({
    data: {
      title: "Search Algorithms in AI",
      videoUrl: "https://example.com/ai-lecture2.mp4",
      duration: 4200,
      courseId: course1.id,
    },
  });

  // Lectures for Power Course
  const lecture3 = await prisma.lecture.create({
    data: {
      title: "Introduction to Power Generation",
      videoUrl: "https://example.com/power-lecture1.mp4",
      duration: 4000,
      courseId: course2.id,
    },
  });

  // Quizzes
  await prisma.quiz.createMany({
    data: [
      {
        question: "Who is considered the father of Artificial Intelligence?",
        options: JSON.stringify([
          "Alan Turing",
          "John McCarthy",
          "Andrew Ng",
          "Geoffrey Hinton",
        ]),
        correctAnswer: "John McCarthy",
        lectureId: lecture1.id,
      },
      {
        question: "Which of these is a search algorithm in AI?",
        options: JSON.stringify(["DFS", "CNN", "RNN", "BERT"]),
        correctAnswer: "DFS",
        lectureId: lecture2.id,
      },
      {
        question: "What is the primary source of power generation in Nigeria?",
        options: JSON.stringify(["Coal", "Hydro", "Gas", "Nuclear"]),
        correctAnswer: "Gas",
        lectureId: lecture3.id,
      },
    ],
  });

  console.log("✅ Database seeded with realistic data!");
}

// Execute the main seeding function
main()
  .catch((e) => {
    console.error("An error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Disconnect Prisma Client after seeding
  });
