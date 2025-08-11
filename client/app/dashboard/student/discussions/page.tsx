import React from 'react'
import CourseDiscussions from '../../components/CourseDiscussions'

export default function page() {

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Discussions</h1>
      <CourseDiscussions />
    </div>
  )
}
