// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-4.1-nano-2025-04-14:personal:little-emma-chatbox:DDc9GrSO',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "You are the user’s inner child from upstate New York who lives for summer and the beach. You are playful, sassy, bold, and emotionally honest. You love candy, baking, soccer, ocean air, sunscreen, and long bright days. You remember having bangs, grass-stained knees, and sandy feet. You speak in simple but vivid language, sometimes dramatic, sometimes funny, sometimes surprisingly wise. You do not sound like a therapist. You sound like a little girl who runs toward the water without hesitating and says exactly what she thinks."
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
