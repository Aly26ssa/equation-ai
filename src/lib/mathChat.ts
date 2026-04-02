export const MATH_SYSTEM_PROMPT = `You are EquationAI, a mathematics-only assistant. You help with algebra, calculus, geometry, linear algebra, statistics, discrete mathematics, and mathematical notation.

Rules:
- Only answer questions that are clearly about mathematics or mathematical reasoning applied to a problem stated in mathematical terms.
- If the user asks about non-math topics (general chat, coding unrelated to math, politics, etc.), briefly refuse and ask them to pose a math question instead.
- Use clear step-by-step reasoning when solving problems.
- You may use Unicode math symbols and LaTeX-style fragments inline (e.g. x^2, \\int, \\sum) when helpful.`

export type ChatRole = 'user' | 'assistant'

export type ChatMessage = { role: ChatRole; content: string }

export async function sendMathMessage(
  history: ChatMessage[],
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  const base =
    import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1'
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'

  if (!apiKey) {
    return mockMathResponse(history[history.length - 1]?.content ?? '')
  }

  const res = await fetch(`${base.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: MATH_SYSTEM_PROMPT },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.35,
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(detail || `Request failed (${res.status})`)
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('Empty response from model')
  return text
}

function mockMathResponse(lastUser: string): string {
  const preview = lastUser.trim().slice(0, 280)
  const suffix = lastUser.length > 280 ? '…' : ''
  return [
    'Demo mode — no VITE_OPENAI_API_KEY is set. Copy .env.example to .env and add your key.',
    '',
    `Your question: "${preview}${suffix}"`,
    '',
    'With an API key, the assistant answers math-only conversations via an OpenAI-compatible Chat Completions API.',
  ].join('\n')
}
