'use client'
import { useParams } from 'next/navigation';
import React from 'react'

export default function page() {
  const { quizId } = useParams<{ quizId: string }>();

  return (
    <div>Single quiz page {quizId}</div>
  )
}
