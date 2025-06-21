import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Text to AR',
  description: 'Generate 3D models from text descriptions with AR support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="module"
          src="https://unpkg.com/@google/model-viewer@^3.4.0/dist/model-viewer.min.js"
        />
        <script
          noModule
          src="https://unpkg.com/@google/model-viewer@^3.4.0/dist/model-viewer-legacy.js"
        />
      </head>
      <body className={`${inter.className} text-black`}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}
