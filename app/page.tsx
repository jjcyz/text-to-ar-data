'use client'

import React, { useState } from 'react'
import ModelViewer from './components/ModelViewer'
import FeedbackButtons from './components/FeedbackButtons'
import SemanticTest from './components/SemanticTest'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [modelName, setModelName] = useState<string | null>(null)
  const [matchingMethod, setMatchingMethod] = useState<string | null>(null)
  const [promptId, setPromptId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate model')
      }

      const data = await response.json()
      setModelUrl(data.modelUrl)
      setModelName(data.modelName)
      setMatchingMethod(data.matchingMethod)
      setPromptId(data.promptId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = async (feedback: 'up' | 'down') => {
    if (!promptId) return

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptId, feedback }),
      })
    } catch (err) {
      console.error('Failed to submit feedback:', err)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Text to AR
        </h1>
        <p className="text-lg text-gray-600">
          Describe a 3D object or scene and see it come to life in AR
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Powered by AI semantic similarity matching
        </p>
      </div>

      {/* Semantic Test Component - Remove this after testing */}
      <SemanticTest />

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your 3D object or scene
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., a wooden chair next to a desk, a red apple on a table, a modern vase..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate 3D Model'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {modelUrl && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Generated Model</h2>
            <div className="flex items-center space-x-2">
              {modelName && (
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {modelName}
                </span>
              )}
              {matchingMethod && (
                <span className={`text-xs px-2 py-1 rounded ${
                  matchingMethod === 'semantic'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {matchingMethod === 'semantic' ? 'AI Semantic' : 'Keyword Fallback'}
                </span>
              )}
            </div>
          </div>
          <ModelViewer modelUrl={modelUrl} />
          <FeedbackButtons onFeedback={handleFeedback} />
        </div>
      )}
    </main>
  )
}
