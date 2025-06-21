# Text to AR

A Next.js 14 application that generates 3D models from text descriptions with AR (Augmented Reality) support using model-viewer.

## Features

- **Text-to-3D Generation**: Describe objects or scenes and get 3D models
- **AR Support**: View generated models in augmented reality
- **Interactive 3D Viewer**: Rotate, zoom, and explore models
- **User Feedback**: Rate generated models with thumbs up/down
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Database**: Stores prompts, models, and feedback in Supabase

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd text-to-ar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Go to Settings > API to get your project URL and anon key
   - Copy `env.example` to `.env.local` and fill in your Supabase credentials

4. **Create database tables**
   Run these SQL commands in your Supabase SQL editor:

   ```sql
   -- Create prompts table
   CREATE TABLE prompts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     text TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create models table
   CREATE TABLE models (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
     model_url TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create feedback table
   CREATE TABLE feedback (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     model_id UUID REFERENCES models(id) ON DELETE CASCADE,
     feedback TEXT CHECK (feedback IN ('up', 'down')) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security (optional)
   ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE models ENABLE ROW LEVEL SECURITY;
   ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

1. **Describe an object**: Enter a description like "a wooden chair next to a desk"
2. **Generate model**: Click the "Generate 3D Model" button
3. **View in 3D**: The model will appear in the viewer below
4. **AR experience**: Click "View in AR" to see the model in augmented reality
5. **Provide feedback**: Use the thumbs up/down buttons to rate the model

## API Endpoints

### POST /api/generate
Generates a 3D model from text description.

**Request:**
```json
{
  "prompt": "a wooden chair next to a desk"
}
```

**Response:**
```json
{
  "modelUrl": "https://example.com/model.glb",
  "promptId": "uuid-string"
}
```

### POST /api/feedback
Stores user feedback for a generated model.

**Request:**
```json
{
  "promptId": "uuid-string",
  "feedback": "up"
}
```

**Response:**
```json
{
  "success": true
}
```

## Database Schema

### Tables

- **prompts**: Stores user text descriptions
- **models**: Links prompts to generated model URLs
- **feedback**: Stores user ratings for models

### Relationships

- `models.prompt_id` → `prompts.id`
- `feedback.model_id` → `models.id`

## Model Mapping

The application currently maps specific keywords to pre-uploaded models:

- `apple` → Astronaut model
- `chair` → Astronaut model
- `vase` → Astronaut model
- `desk` → Astronaut model
- `table` → Astronaut model
- `wooden` → Astronaut model
- `red` → Astronaut model
- `modern` → Astronaut model

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
