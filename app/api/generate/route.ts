import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Mock model URLs for different keywords
const MODEL_MAPPINGS: Record<string, string> = {
  'apple': 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  'chair': 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  'vase': 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  'desk': 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  'table': 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  'wooden': 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  'red': 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  'modern': 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      )
    }

    // Find matching model based on keywords
    const lowerPrompt = prompt.toLowerCase()
    let modelUrl = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb' // Default

    for (const [keyword, url] of Object.entries(MODEL_MAPPINGS)) {
      if (lowerPrompt.includes(keyword)) {
        modelUrl = url
        break
      }
    }

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables not found, skipping database operations')
      return NextResponse.json({
        modelUrl,
        promptId: 'demo-' + Date.now() // Generate a demo ID
      })
    }

    // Store prompt in database
    const { data: promptData, error: promptError } = await supabase
      .from('prompts')
      .insert([{ text: prompt }])
      .select()
      .single()

    if (promptError) {
      console.error('Error storing prompt:', promptError)
      // Return the model URL even if database storage fails
      return NextResponse.json({
        modelUrl,
        promptId: 'demo-' + Date.now(),
        warning: 'Model generated but feedback storage may not work'
      })
    }

    // Store model in database
    const { data: modelData, error: modelError } = await supabase
      .from('models')
      .insert([{
        prompt_id: promptData.id,
        model_url: modelUrl
      }])
      .select()
      .single()

    if (modelError) {
      console.error('Error storing model:', modelError)
      // Return the model URL even if database storage fails
      return NextResponse.json({
        modelUrl,
        promptId: promptData.id,
        warning: 'Model generated but feedback storage may not work'
      })
    }

    return NextResponse.json({
      modelUrl,
      promptId: promptData.id
    })

  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
