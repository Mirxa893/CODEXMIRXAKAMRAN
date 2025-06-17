// /app/api/chat/route.ts

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n')

  const response = await fetch('https://mirxakamran893-logiqcurve-wordpress-bot.hf.space/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // ✅ REMOVE Authorization header – not needed and may break Hugging Face Space call
    },
    body: JSON.stringify({ message: prompt })  // ✅ Match your Gradio client input
  })

  const result = await response.json()

  // ✅ Handle response
  const text = result?.data ?? result?.message ?? '⚠️ No response from model.'

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
