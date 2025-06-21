'use client'

import React, { useState } from 'react'

interface FeedbackButtonsProps {
  onFeedback: (feedback: 'up' | 'down') => void
}

export default function FeedbackButtons({ onFeedback }: FeedbackButtonsProps) {
  const [submitted, setSubmitted] = useState<'up' | 'down' | null>(null)

  const handleFeedback = (feedback: 'up' | 'down') => {
    if (submitted) return // Prevent multiple submissions

    setSubmitted(feedback)
    onFeedback(feedback)
  }

  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600 mb-3">How was this model?</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleFeedback('up')}
          disabled={submitted !== null}
          className={`p-3 rounded-full text-2xl transition-all duration-200 ${
            submitted === 'up'
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Thumbs up"
        >
          👍
        </button>
        <button
          onClick={() => handleFeedback('down')}
          disabled={submitted !== null}
          className={`p-3 rounded-full text-2xl transition-all duration-200 ${
            submitted === 'down'
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Thumbs down"
        >
          👎
        </button>
      </div>
      {submitted && (
        <p className="mt-2 text-sm text-gray-500">
          Thank you for your feedback!
        </p>
      )}
    </div>
  )
}
