export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Format messages into a single prompt
  const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n')

  // Call Hugging Face Space API
  const response = await fetch('https://mirxakamran893-LOGIQCURVECHATIQBOT.hf.space/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: prompt,
      history: []
    })
  })

  // Expecting JSON like { role: "assistant", content: "response here" }
  const json = await response.json()

  // Return only the assistant's content
  return new Response(json.content || "Something went wrong", {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
