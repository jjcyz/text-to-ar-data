import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { findMostSimilarModel, findModelByKeywords } from '@/lib/semantic-similarity'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      )
    }

    // Use semantic similarity to find the most relevant model
    let modelDescription
    let matchingMethod = 'semantic'

    try {
      modelDescription = await findMostSimilarModel(prompt)
    } catch (error) {
      console.warn('Semantic similarity failed, falling back to keyword matching:', error)
      modelDescription = findModelByKeywords(prompt)
      matchingMethod = 'keyword'
    }

    const modelUrl = modelDescription.url

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables not found, skipping database operations')
      return NextResponse.json({
        modelUrl,
        promptId: 'demo-' + Date.now(), // Generate a demo ID
        modelName: modelDescription.name,
        matchingMethod
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
        modelName: modelDescription.name,
        matchingMethod,
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
        modelName: modelDescription.name,
        matchingMethod,
        warning: 'Model generated but feedback storage may not work'
      })
    }

    return NextResponse.json({
      modelUrl,
      promptId: promptData.id,
      modelName: modelDescription.name,
      matchingMethod
    })

  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
