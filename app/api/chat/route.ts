export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Combine chat history into a single prompt string
  const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n')

  // Send request to your Hugging Face Space's /chat endpoint
  const response = await fetch('https://mirxakamran893-logiqcurve-wordpress-bot.hf.space/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: prompt,
      history: [] // Can also pass real history later if needed
    })
  })

  // Gradio returns plain text response
  const text = await response.text()

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
