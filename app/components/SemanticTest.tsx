'use client'

import React, { useState } from 'react'
import { findMostSimilarModelClient } from '@/lib/semantic-similarity-client'

const testPrompts = [
  'a wooden chair next to a desk',
  'a red apple on a table',
  'a modern vase with flowers',
  'an astronaut in space',
  'a desk lamp for studying',
  'a sturdy wooden table for dining',
  'something to sit on',
  'a piece of fruit',
  'decorative item for the home',
  'studying at a coffee shop',
  'exploring the milky way',
  'lighting for my office'
]

export default function SemanticTest() {
  const [results, setResults] = useState<Array<{
    prompt: string
    modelName: string
    method: string
    loading: boolean
  }>>([])

  const testSemanticSimilarity = async () => {
    const newResults = testPrompts.map(prompt => ({
      prompt,
      modelName: '',
      method: '',
      loading: true
    }))

    setResults(newResults)

    for (let i = 0; i < testPrompts.length; i++) {
      try {
        const model = await findMostSimilarModelClient(testPrompts[i])
        setResults(prev => prev.map((result, index) =>
          index === i
            ? { ...result, modelName: model.name, method: 'semantic', loading: false }
            : result
        ))
      } catch (error) {
        console.error(`Error testing prompt "${testPrompts[i]}":`, error)
        setResults(prev => prev.map((result, index) =>
          index === i
            ? { ...result, modelName: 'Error', method: 'failed', loading: false }
            : result
        ))
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Semantic Similarity Test</h2>
      <p className="text-sm text-gray-600 mb-4">
        Test the semantic similarity matching with different prompts
      </p>

      <button
        onClick={testSemanticSimilarity}
        className="bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors mb-4"
      >
        Run Semantic Tests
      </button>

      <div className="space-y-2">
        {results.map((result, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{result.prompt}</p>
            </div>
            <div className="flex items-center space-x-2">
              {result.loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : (
                <>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {result.modelName}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    result.method === 'semantic'
                      ? 'bg-green-100 text-green-800'
                      : result.method === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.method === 'semantic' ? 'AI Semantic' :
                     result.method === 'failed' ? 'Failed' : 'Keyword'}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
