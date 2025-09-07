'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Mock fetch function (replace with your real DB call)
async function getLectureById(lectureId: number) {
  // Example mock data
  return {
    id: lectureId,
    title: "Introduction to Machine Learning",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: 3600,
    createdAt: new Date(),
    quizzes: [
      {
        id: 1,
        lectureId,
        question: "What is supervised learning?",
        options: "A method where the model is trained on labeled data",
        correctAnswer: "A method where the model is trained on labeled data",
      },
    ],
    attendanceLogs: [
      {
        id: 1,
        userId: 101,
        markedAt: new Date(),
        engagementScore: 85,
        wasPresent: true,
      },
      {
        id: 2,
        userId: 102,
        markedAt: new Date(),
        engagementScore: 65,
        wasPresent: false,
      },
    ],
  };
}

export default async function page() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const router = useRouter()
  const lecture = await getLectureById(Number(lectureId));


  return (
    <div className="p-6 space-y-6">
      {/* Back Link */}
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
      </div>

      {/* Lecture Details */}
      <Card>
        <CardHeader>
          <CardTitle>{lecture.title}</CardTitle>
          <p className="text-sm text-gray-500">
            Duration: {Math.floor(lecture.duration / 60)} mins
          </p>
        </CardHeader>
        <CardContent>
          {/* Video */}
          <video
            controls
            src={lecture.videoUrl}
            className="w-full rounded-lg shadow"
          />
        </CardContent>
      </Card>

      {/* Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle>Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          {lecture.quizzes.length === 0 ? (
            <p className="text-gray-500">No quizzes added yet.</p>
          ) : (
            <ul className="space-y-3">
              {lecture.quizzes.map((quiz) => (
                <li key={quiz.id} className="border p-3 rounded-md">
                  <p className="font-medium">{quiz.question}</p>
                  <p className="text-sm text-gray-500">
                    Correct Answer: {quiz.correctAnswer}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {lecture.attendanceLogs.length === 0 ? (
            <p className="text-gray-500">No attendance records yet.</p>
          ) : (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Student ID</th>
                  <th className="p-2">Present</th>
                  <th className="p-2">Engagement Score</th>
                  <th className="p-2">Marked At</th>
                </tr>
              </thead>
              <tbody>
                {lecture.attendanceLogs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="p-2">{log.userId}</td>
                    <td className="p-2">
                      {log.wasPresent ? "✅ Yes" : "❌ No"}
                    </td>
                    <td className="p-2">{log.engagementScore}</td>
                    <td className="p-2">
                      {new Date(log.markedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Edit Button */}
      {/* <Link href={`/lecturer/courses/${params.courseId}/lectures/${lectureId}/edit`}>
        <Button>Edit Lecture</Button>
      </Link> */}
    </div>
  );
}
