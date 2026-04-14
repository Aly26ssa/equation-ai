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
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim()
  const base = (
    import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1'
  ).trim()
  const model = (
    import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'
  ).trim()

  if (!apiKey) {
    return mockMathResponse(history[history.length - 1]?.content ?? '')
  }

  const url = `${base.replace(/\/$/, '')}/chat/completions`
  // Local models can be slow on first run; avoid an indefinite "Thinking…" with no feedback.
  const timeoutMs = 180_000
  const controller = new AbortController()
  const t = window.setTimeout(() => controller.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: 'system', content: MATH_SYSTEM_PROMPT },
          ...history.map((m) => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.35,
      }),
    })
  } catch (e) {
    const aborted =
      e instanceof DOMException
        ? e.name === 'AbortError'
        : e instanceof Error && e.name === 'AbortError'
    if (aborted) {
      throw new Error(
        `No response after ${timeoutMs / 1000}s. Is Ollama running (ollama serve)? For large models, the first answer can take several minutes — try again or use a smaller model tag.`,
      )
    }
    throw e
  } finally {
    window.clearTimeout(t)
  }

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(detail || `Request failed (${res.status})`)
  }

  const data = (await res.json()) as {
    choices?: Array<{
      message?: { content?: string | null; reasoning?: string | null }
    }>
  }
  const msg = data.choices?.[0]?.message
  const text =
    (msg?.content && String(msg.content).trim()) ||
    (msg?.reasoning && String(msg.reasoning).trim()) ||
    ''
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
