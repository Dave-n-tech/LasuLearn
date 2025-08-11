import { BookOpenIcon } from 'lucide-react'
import React from 'react'
import CourseCard from '../../components/CourseCard'

export default function page() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
      <CourseCard />
    </div>
  )
}
