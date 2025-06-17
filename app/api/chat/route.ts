// /app/api/chat/route.ts

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Format messages into one prompt
  const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n')

  // Send the prompt to your Hugging Face Space
  const response = await fetch('https://mirxakamran893-logiqcurve-wordpress-bot.hf.space/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
    },
    body: JSON.stringify({ data: [prompt] })  // Gradio API expects `data` as array
  })

  const result = await response.json()

  // Extract the model response
  const text = result?.data?.[0] || '⚠️ No response from model.'

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
