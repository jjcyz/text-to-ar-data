'use client'

import React from 'react'

interface ModelViewerProps {
  modelUrl: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any
    }
  }
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
  return (
    <div className="w-full">
      <model-viewer
        src={modelUrl}
        alt="3D Model"
        camera-controls
        auto-rotate
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        ar-placement="floor"
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        shadow-softness="0.5"
        camera-orbit="0deg 75deg 75%"
        min-camera-orbit="auto auto 25%"
        max-camera-orbit="auto auto 200%"
        field-of-view="30deg"
        min-field-of-view="10deg"
        max-field-of-view="45deg"
        interaction-prompt="auto"
        loading="eager"
        reveal="auto"
        ar-button
        style={{
          width: '100%',
          height: '400px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          View in AR
        </button>
      </model-viewer>
    </div>
  )
}
