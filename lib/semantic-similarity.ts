import { pipeline, env } from '@xenova/transformers'

// Configure transformers to use local models
env.allowLocalModels = true
env.allowRemoteModels = false

// Define 3D model descriptions with their URLs
export interface ModelDescription {
  id: string
  name: string
  description: string
  url: string
  tags: string[]
}

export const MODEL_DESCRIPTIONS: ModelDescription[] = [
  {
    id: 'astronaut',
    name: 'Astronaut',
    description: 'A detailed 3D model of an astronaut in a space suit, perfect for space-themed scenes or educational content about space exploration.',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    tags: ['astronaut', 'space', 'suit', 'helmet', 'cosmonaut', 'spaceman', 'nasa', 'rocket', 'moon', 'mars']
  },
  {
    id: 'chair',
    name: 'Wooden Chair',
    description: 'A classic wooden chair with traditional design, suitable for dining rooms, offices, or any indoor setting.',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder - replace with actual chair model
    tags: ['chair', 'wooden', 'furniture', 'seat', 'dining', 'office', 'table', 'desk', 'wood', 'traditional']
  },
  {
    id: 'vase',
    name: 'Modern Vase',
    description: 'A sleek, modern vase with clean lines and contemporary design, perfect for displaying flowers or as a decorative piece.',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder - replace with actual vase model
    tags: ['vase', 'modern', 'decorative', 'flowers', 'ceramic', 'glass', 'contemporary', 'design', 'interior', 'decoration']
  },
  {
    id: 'apple',
    name: 'Red Apple',
    description: 'A realistic red apple with natural texture and shine, ideal for still life scenes, educational content, or food-related applications.',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder - replace with actual apple model
    tags: ['apple', 'red', 'fruit', 'food', 'fresh', 'healthy', 'natural', 'shiny', 'round', 'organic']
  },
  {
    id: 'table',
    name: 'Wooden Table',
    description: 'A sturdy wooden table with natural grain texture, suitable for dining, work, or as a surface for various objects.',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder - replace with actual table model
    tags: ['table', 'wooden', 'furniture', 'dining', 'work', 'surface', 'wood', 'sturdy', 'natural', 'grain']
  },
  {
    id: 'lamp',
    name: 'Desk Lamp',
    description: 'A modern desk lamp with adjustable arm and LED lighting, perfect for office spaces or study areas.',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder - replace with actual lamp model
    tags: ['lamp', 'desk', 'light', 'modern', 'office', 'study', 'LED', 'adjustable', 'illumination', 'work']
  }
]

// Cache for the embedding pipeline
let embeddingPipeline: any = null

// Initialize the embedding pipeline
async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    try {
      // Use a lightweight sentence embedding model
      embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    } catch (error) {
      console.error('Failed to load embedding model:', error)
      throw new Error('Failed to initialize semantic similarity service')
    }
  }
  return embeddingPipeline
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}

// Get embedding for a text
async function getTextEmbedding(text: string): Promise<number[]> {
  const pipeline = await getEmbeddingPipeline()
  const result = await pipeline(text, { pooling: 'mean', normalize: true })
  return Array.from(result.data)
}

// Find the most similar model based on semantic similarity
export async function findMostSimilarModel(userPrompt: string): Promise<ModelDescription> {
  try {
    // Get embedding for user prompt
    const promptEmbedding = await getTextEmbedding(userPrompt);
    if (!promptEmbedding || promptEmbedding.every(x => x === 0)) {
      throw new Error('Embedding failed or is empty');
    }

    let bestMatch = MODEL_DESCRIPTIONS[0]
    let bestSimilarity = -1

    // Compare with each model description
    for (const model of MODEL_DESCRIPTIONS) {
      // Create a comprehensive description combining name, description, and tags
      const modelText = `${model.name} ${model.description} ${model.tags.join(' ')}`
      const modelEmbedding = await getTextEmbedding(modelText)

      const similarity = cosineSimilarity(promptEmbedding, modelEmbedding)

      if (similarity > bestSimilarity) {
        bestSimilarity = similarity
        bestMatch = model
      }
    }

    console.log(`Best match: ${bestMatch.name} (similarity: ${bestSimilarity.toFixed(3)})`)
    return bestMatch

  } catch (error) {
    console.error('Error in semantic similarity matching:', error)
    // Fallback to first model if embedding fails
    return MODEL_DESCRIPTIONS[0]
  }
}

// Alternative simple keyword-based fallback (for when transformers fail)
export function findModelByKeywords(prompt: string): ModelDescription {
  const lowerPrompt = prompt.toLowerCase()

  // Check for exact keyword matches first
  for (const model of MODEL_DESCRIPTIONS) {
    for (const tag of model.tags) {
      if (lowerPrompt.includes(tag)) {
        return model
      }
    }
  }

  // Check for partial matches in description
  for (const model of MODEL_DESCRIPTIONS) {
    const words = model.description.toLowerCase().split(' ')
    for (const word of words) {
      if (word.length > 3 && lowerPrompt.includes(word)) {
        return model
      }
    }
  }

  // Default fallback
  return MODEL_DESCRIPTIONS[0]
}
