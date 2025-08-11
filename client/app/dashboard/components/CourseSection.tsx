import { EnrolledCourse } from '@/app/types'
import { BookOpenIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import LectureItem from './LectureItem'
import { calculateCourseProgress } from '@/app/helpers'


type Props = {
  enrolled: EnrolledCourse
  expanded: boolean
  onToggle: () => void
}

export default function CourseSection({ enrolled, expanded, onToggle }: Props) {
  const { course } = enrolled
  const progress = calculateCourseProgress(enrolled)

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div
        className="p-6 border-b border-gray-100 flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <BookOpenIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{`${course.code} - ${course.title}`}</h3>
            <p className="text-sm text-gray-600">
              Instructor: {course.lecturer.firstName} {course.lecturer.lastName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <div className="text-sm text-gray-600 mb-1">Course Progress</div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 h-2 rounded-full w-32">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
          </div>
          {expanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="divide-y divide-gray-100">
          {course.lectures.map((lecture) => (
            <LectureItem
              key={lecture.id}
              lecture={lecture}
              userId={enrolled.user.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
