import { EnrolledCourse } from "./types";

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
