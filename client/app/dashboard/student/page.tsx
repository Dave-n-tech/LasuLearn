import { BookOpenIcon, CheckCircleIcon, ClockIcon, PlayIcon } from 'lucide-react'
import React from 'react'
import DashbboardStatsComponent from '../components/DashbboardStatsComponent'
import RecentLecturesComponent from '../components/RecentLecturesComponent'

export default function page() {
  return (
    <div className="space-y-6 lg:space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
      </div>
      <DashbboardStatsComponent />
      <RecentLecturesComponent />
    </div>
  )
}
