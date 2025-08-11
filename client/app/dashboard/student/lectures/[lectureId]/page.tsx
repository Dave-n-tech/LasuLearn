import LectureViewer from "@/app/dashboard/components/LectureViewer";
import { HomeIcon, MoveLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: {
    lectureId: string;
  };
};

export default async function page({ params }: Props) {
  const { lectureId } = params;

  // figure out a way to redirect the user back to the route they're coming from

  return (
    <div className="px-6 py-2">
      <div className="mb-6 flex justify-between items-center gap-2">
        <Link href={"/dashboard/student"}>
          <HomeIcon
            size={24}
            className="mb-2 text-blue-500 hover:text-blue-700"
          />
        </Link>
        <Link href={"/dashboard/student/lectures"}>
          <span className="mb-4 text-blue-500 hover:text-blue-700 font-semibold">
            <MoveLeft size={18} className="inline" />
            back to Lectures
          </span>
        </Link>
      </div>
      
      <LectureViewer lectureId={lectureId} />
    </div>
  );
}
