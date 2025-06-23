# Semantic Similarity Implementation for Text-to-AR

This document describes the implementation of semantic similarity using `@xenova/transformers` to replace the hardcoded keyword mapping system.

## Overview

The Text-to-AR project now uses local semantic similarity to match user prompts to the most relevant 3D models. This provides much more intelligent and flexible matching compared to the previous hardcoded keyword system.


### How It Works

1. **Text Embedding**: User prompts are converted to high-dimensional vectors using the `all-MiniLM-L6-v2` model
2. **Model Descriptions**: Each 3D model has a rich description including name, description, and tags
3. **Cosine Similarity**: The system calculates cosine similarity between the user prompt embedding and each model's description embedding
4. **Best Match**: The model with the highest similarity score is selected
5. **Fallback**: If semantic matching fails, the system falls back to keyword-based matching

## Model Descriptions

The system includes 6 different model types with rich descriptions:

- **Astronaut**: Space-themed content, NASA, rockets, etc.
- **Wooden Chair**: Furniture, traditional design, indoor settings
- **Modern Vase**: Decorative items, contemporary design, flowers
- **Red Apple**: Food items, fresh produce, natural objects
- **Wooden Table**: Furniture, work surfaces, dining
- **Desk Lamp**: Lighting, office equipment, modern design

## Installation

1. Install the required dependency:
```bash
npm install @xenova/transformers
```

2. The Next.js configuration has been updated to handle:
   - Web workers for transformers.js
   - WASM file loading
   - Cross-origin policies for shared array buffers

## Usage

### Server-Side (API Route)

```typescript
import { findMostSimilarModel, findModelByKeywords } from '@/lib/semantic-similarity'

// Try semantic similarity first
try {
  const model = await findMostSimilarModel(userPrompt)
} catch (error) {
  // Fallback to keyword matching
  const model = findModelByKeywords(userPrompt)
}
```

### Client-Side (Browser)

```typescript
import { findMostSimilarModelClient } from '@/lib/semantic-similarity-client'

const model = await findMostSimilarModelClient(userPrompt)
```

## Features

### Robust Error Handling

- **Graceful Degradation**: Falls back to keyword matching if semantic similarity fails
- **Network Resilience**: Handles model loading failures gracefully
- **Browser Compatibility**: Works across different browsers with proper fallbacks

### Performance Optimizations

- **Model Caching**: Embedding pipeline is cached to avoid repeated initialization
- **Lightweight Model**: Uses `all-MiniLM-L6-v2` for fast inference
- **Local Processing**: All processing happens locally, no external API calls

## Configuration

### Environment Variables

No additional environment variables are required. The system works entirely locally.

### Model Configuration

To add new models, update the `MODEL_DESCRIPTIONS` array in both:
- `lib/semantic-similarity.ts` (server-side)
- `lib/semantic-similarity-client.ts` (client-side)

Each model should include:
- `id`: Unique identifier
- `name`: Human-readable name
- `description`: Detailed description for semantic matching
- `url`: 3D model URL
- `tags`: Array of relevant keywords

## Troubleshooting

### Common Issues

1. **Disk Space**: The transformers package requires significant disk space for model downloads
2. **Memory Usage**: The embedding model loads into memory on first use
3. **Browser Compatibility**: Some browsers may require specific CORS headers

### Debugging

- Check browser console for embedding model loading messages
- Look for similarity scores in the console output
- Verify that fallback keyword matching works when semantic matching fails

## Future Enhancements

1. **More Models**: Add more diverse 3D models with rich descriptions
2. **Custom Embeddings**: Allow users to upload custom 3D models with descriptions
3. **Similarity Thresholds**: Implement minimum similarity thresholds for better matching
4. **Batch Processing**: Optimize for handling multiple prompts simultaneously
5. **Model Fine-tuning**: Fine-tune the embedding model on domain-specific data

## Performance Notes

- **First Load**: Initial model download may take 10-30 seconds
- **Subsequent Uses**: Embedding generation is typically 100-500ms
- **Memory**: ~50MB for the embedding model
- **Browser Support**: Requires SharedArrayBuffer support (most modern browsers)
