export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Format messages into a single prompt
  const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n')

  // Call your Hugging Face Space API
  const response = await fetch('https://mirxakamran893-logiqcurve-wordpress-bot.hf.space//chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: prompt,
      history: []
    })
  })

  const text = await response.text()

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
