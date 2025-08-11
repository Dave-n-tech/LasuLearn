import { CourseLectureProgress, EnrolledCourse } from "./types";

export function getLectureCompletionStats(enrolledCourses: EnrolledCourse[]) {
  return enrolledCourses.reduce(
    (acc, enrolled) => {
      acc.total += enrolled.course.lectures.length;

      acc.completed += enrolled.course.lectures.filter((lecture) =>
        lecture.progresses.some((progress) => progress.watched)
      ).length;

      return acc;
    },
    { total: 0, completed: 0 }
  );
}

export function calculateCourseProgress(enrolled: EnrolledCourse): number {
  const lectures = enrolled.course.lectures ?? [];
  const completed = lectures.filter((l) =>
    l.progresses?.some((p) => p.watched === true)
  ).length;
  
  return lectures.length > 0
    ? Math.round((completed / lectures.length) * 100)
    : 0;
}

export function calculateLectureProgress(lecture: CourseLectureProgress) {
  const progresses = lecture.progresses ?? [];

  return progresses[-1]?.watched
    ? 100
    : !progresses[-1]?.watched && progresses[-1]?.watchTime > 0
    ? Math.round((progresses[-1]?.watchTime / lecture.duration) * 100)
    : 0;
}
