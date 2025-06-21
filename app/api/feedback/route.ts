import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { promptId, feedback } = await request.json()

    if (!promptId || typeof promptId !== 'string') {
      return NextResponse.json(
        { error: 'promptId is required and must be a string' },
        { status: 400 }
      )
    }

    if (!feedback || !['up', 'down'].includes(feedback)) {
      return NextResponse.json(
        { error: 'feedback is required and must be "up" or "down"' },
        { status: 400 }
      )
    }

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables not found, skipping feedback storage')
      return NextResponse.json({
        success: true,
        message: 'Feedback received (demo mode)'
      })
    }

    // Skip database operations for demo prompt IDs
    if (promptId.startsWith('demo-')) {
      console.log('Demo feedback received:', { promptId, feedback })
      return NextResponse.json({
        success: true,
        message: 'Demo feedback received'
      })
    }

    // Get the model ID for this prompt
    const { data: modelData, error: modelError } = await supabase
      .from('models')
      .select('id')
      .eq('prompt_id', promptId)
      .single()

    if (modelError || !modelData) {
      console.error('Error finding model:', modelError)
      return NextResponse.json(
        { error: 'Model not found for this prompt' },
        { status: 404 }
      )
    }

    // Store feedback in database
    const { error: feedbackError } = await supabase
      .from('feedback')
      .insert([{
        model_id: modelData.id,
        feedback
      }])

    if (feedbackError) {
      console.error('Error storing feedback:', feedbackError)
      return NextResponse.json(
        { error: 'Failed to store feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
