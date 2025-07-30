import { PrismaClient } from '../generated/prisma';
import {Course, Lecture, Quiz, Role, User} from "../generated/prisma"
import { hash } from 'bcrypt';
import { faker } from '@faker-js/faker';


const prisma = new PrismaClient();

async function main() {
  console.log('--- Start Seeding Database ---');

  // 1. Clean up existing data (order matters due to foreign key constraints)
  console.log('Cleaning up existing data...');
  await prisma.notification.deleteMany({});
  await prisma.quizSubmission.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.attendanceLog.deleteMany({});
  await prisma.lectureProgress.deleteMany({});
  await prisma.lecture.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.discussionReply.deleteMany({});
  await prisma.discussionPost.deleteMany({});
  await prisma.attendanceReport.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Existing data cleaned.');

  // 2. Seed Users (ADMIN, LECTURER, STUDENT)
  console.log('Seeding Users...');
  const defaultPassword = await hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@lasuvlp.com',
      password: await hash('adminpass', 10),
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.ADMIN,
    },
  });
  console.log(`Created Admin User: ${adminUser.email}`);

  const lecturerUsers: User[] = [];
  for (let i = 0; i < 3; i++) {
    const lecturer = await prisma.user.create({
      data: {
        email: `lecturer${i + 1}@lasuvlp.com`,
        password: defaultPassword,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: Role.LECTURER,
      },
    });
    lecturerUsers.push(lecturer);
    console.log(`Created Lecturer: ${lecturer.email}`);
  }

  const studentUsers: User[] = [];
  for (let i = 0; i < 10; i++) {
    const student = await prisma.user.create({
      data: {
        email: `student${i + 1}@lasuvlp.com`,
        password: defaultPassword,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: Role.STUDENT,
        matricNo: `LASU/${faker.string.numeric(2)}/${faker.string.numeric(5)}`,
      },
    });
    studentUsers.push(student);
    console.log(`Created Student: ${student.email}`);
  }
  console.log('Users seeded.');

  // 3. Seed Courses (created by lecturers)
  console.log('Seeding Courses...');
  const courses: Course[] = [];
  for (let i = 0; i < 5; i++) {
    const course = await prisma.course.create({
      data: {
        title: faker.lorem.words(3) + ' Course',
        code: faker.string.alphanumeric(3).toUpperCase() + faker.string.numeric(3),
        description: faker.lorem.paragraph(),
        lecturerId: lecturerUsers[i % lecturerUsers.length].id, // Assign to a random lecturer
      },
    });
    courses.push(course);
    console.log(`Created Course: ${course.title} (${course.code})`);
  }
  console.log('Courses seeded.');

  // 4. Seed Enrollments (students enrolling in courses)
  console.log('Seeding Enrollments...');
  for (const student of studentUsers) {
    // Each student enrolls in 2-3 random courses
    const numCoursesToEnroll = faker.number.int({ min: 2, max: 3 });
    const enrolledCourseIds = new Set<number>();

    while (enrolledCourseIds.size < numCoursesToEnroll) {
      const randomCourse = faker.helpers.arrayElement(courses);
      if (!enrolledCourseIds.has(randomCourse.id)) {
        await prisma.enrollment.create({
          data: {
            userId: student.id,
            courseId: randomCourse.id,
          },
        });
        enrolledCourseIds.add(randomCourse.id);
        console.log(`Student ${student.email} enrolled in ${randomCourse.title}`);
      }
    }
  }
  console.log('Enrollments seeded.');

  // 5. Seed Lectures (for each course)
  console.log('Seeding Lectures...');
  const lectures: Lecture[] = [];
  for (const course of courses) {
    for (let i = 0; i < 3; i++) { // 3 lectures per course
      const lecture = await prisma.lecture.create({
        data: {
          title: `${course.title} - Lecture ${i + 1}`,
          videoUrl: faker.internet.url() + '/lecture-video.mp4', // Placeholder URL
          courseId: course.id,
          duration: faker.number.int({ min: 1800, max: 3600 }), // 30-60 minutes in seconds
        },
      });
      lectures.push(lecture);
      console.log(`Created Lecture: ${lecture.title}`);
    }
  }
  console.log('Lectures seeded.');

  // 6. Seed Lecture Progress (students watching lectures)
  console.log('Seeding Lecture Progress...');
  for (const student of studentUsers) {
    // Get courses the student is enrolled in
    const studentEnrollments = await prisma.enrollment.findMany({
      where: { userId: student.id },
      include: { course: { include: { lectures: true } } },
    });

    for (const enrollment of studentEnrollments) {
      for (const lecture of enrollment.course.lectures) {
        // Simulate some progress
        const watched = faker.datatype.boolean();
        const watchTime = watched ? faker.number.int({ min: 100, max: lecture.duration }) : 0;
        const skippedTime = watched ? faker.number.int({ min: 0, max: 100 }) : 0;

        await prisma.lectureProgress.create({
          data: {
            userId: student.id,
            lectureId: lecture.id,
            watched: watched,
            watchTime: watchTime,
            skippedTime: skippedTime,
            playbackSpeed: faker.helpers.arrayElement([1.0, 1.25, 1.5, 2.0]),
            completedAt: watched ? faker.date.recent() : null,
          },
        });
        console.log(`Student ${student.email} progress for ${lecture.title}`);
      }
    }
  }
  console.log('Lecture Progress seeded.');

  // 7. Seed Attendance Logs
  console.log('Seeding Attendance Logs...');
  for (const student of studentUsers) {
    const studentLectures = await prisma.lecture.findMany({
      where: {
        course: {
          enrollments: {
            some: { userId: student.id }
          }
        }
      }
    });

    for (const lecture of studentLectures) {
      if (faker.datatype.boolean()) { // Simulate random attendance
        await prisma.attendanceLog.create({
          data: {
            userId: student.id,
            lectureId: lecture.id,
            engagementScore: faker.number.int({ min: 50, max: 100 }),
            wasPresent: true,
          },
        });
        console.log(`Student ${student.email} attended ${lecture.title}`);
      }
    }
  }
  console.log('Attendance Logs seeded.');

  // 8. Seed Quizzes
  console.log('Seeding Quizzes...');
  const quizzes: Quiz[] = [];
  for (const lecture of lectures) {
    const numQuizzes = faker.number.int({ min: 1, max: 2 }); // 1-2 quizzes per lecture
    for (let i = 0; i < numQuizzes; i++) {
      const options = faker.helpers.shuffle(['A', 'B', 'C', 'D']);
      const quiz = await prisma.quiz.create({
        data: {
          question: faker.lorem.sentence() + '?',
          options: JSON.stringify(options), // Store as JSON string
          correctAnswer: faker.helpers.arrayElement(options),
          lectureId: lecture.id,
        },
      });
      quizzes.push(quiz);
      console.log(`Created Quiz for ${lecture.title}`);
    }
  }
  console.log('Quizzes seeded.');

  // 9. Seed Quiz Submissions
  console.log('Seeding Quiz Submissions...');
  for (const student of studentUsers) {
    const studentQuizzes = await prisma.quiz.findMany({
      where: {
        lecture: {
          course: {
            enrollments: {
              some: { userId: student.id }
            }
          }
        }
      }
    });

    for (const quiz of studentQuizzes) {
      if (faker.datatype.boolean()) { // Simulate random submission
        const options = JSON.parse(quiz.options);
        const selectedAnswer: string = faker.helpers.arrayElement(options);
        const isCorrect = selectedAnswer === quiz.correctAnswer;

        await prisma.quizSubmission.create({
          data: {
            userId: student.id,
            quizId: quiz.id,
            lectureId: quiz.lectureId,
            selectedAnswer: selectedAnswer,
            isCorrect: isCorrect,
          },
        });
        console.log(`Student ${student.email} submitted quiz ${quiz.id}`);
      }
    }
  }
  console.log('Quiz Submissions seeded.');

  // 10. Seed Notifications
  console.log('Seeding Notifications...');
  for (const user of [...studentUsers, ...lecturerUsers, adminUser]) {
    for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) { // 1-3 notifications per user
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: faker.lorem.sentence(3),
          message: faker.lorem.paragraph(1),
          isRead: faker.datatype.boolean(),
        },
      });
    }
    console.log(`Created notifications for ${user.email}`);
  }
  console.log('Notifications seeded.');

  // 11. Seed Attendance Reports (by lecturers for their courses)
  console.log('Seeding Attendance Reports...');
  for (const lecturer of lecturerUsers) {
    const lecturerCourses = await prisma.course.findMany({
      where: { lecturerId: lecturer.id },
    });
    for (const course of lecturerCourses) {
      if (faker.datatype.boolean()) { // Simulate random report generation
        await prisma.attendanceReport.create({
          data: {
            courseId: course.id,
            lecturerId: lecturer.id,
            reportUrl: faker.internet.url() + '/attendance-report.pdf', // Placeholder URL
          },
        });
        console.log(`Created Attendance Report for ${course.title} by ${lecturer.email}`);
      }
    }
  }
  console.log('Attendance Reports seeded.');

  // 12. Seed Discussion Posts
  console.log('Seeding Discussion Posts...');
  for (const course of courses) {
    // Random user (student or lecturer) creates a post
    const randomUser = faker.helpers.arrayElement([...studentUsers, ...lecturerUsers]);
    for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) { // 1-3 posts per course
      const post = await prisma.discussionPost.create({
        data: {
          userId: randomUser.id,
          courseId: course.id,
          content: faker.lorem.paragraph(2),
        },
      });
      console.log(`Created Discussion Post in ${course.title} by ${randomUser.email}`);

      // 13. Seed Discussion Replies
      for (let j = 0; j < faker.number.int({ min: 0, max: 2 }); j++) { // 0-2 replies per post
        const randomReplier = faker.helpers.arrayElement([...studentUsers, ...lecturerUsers]);
        await prisma.discussionReply.create({
          data: {
            postId: post.id,
            userId: randomReplier.id,
            content: faker.lorem.sentence(),
          },
        });
        console.log(`Created Reply to Post ${post.id} by ${randomReplier.email}`);
      }
    }
  }
  console.log('Discussion Posts and Replies seeded.');

  console.log('--- Seeding Finished Successfully ---');
}

// Execute the main seeding function
main()
  .catch((e) => {
    console.error('An error occurred during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Disconnect Prisma Client after seeding
  });