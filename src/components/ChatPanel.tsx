import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../lib/mathChat'
import { sendMathMessage } from '../lib/mathChat'
import { stripMathDelimitersForDisplay } from '../lib/stripMathDelimiters'
import { CalculatorModal } from './CalculatorModal'
import { MathKeyboard } from './MathKeyboard'

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'EquationAI — ask me about equations, calculus, algebra, geometry, or notation. I only handle mathematics. Use “Calculator” for quick arithmetic and “Math keyboard” to insert symbols into your message.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [calcOpen, setCalcOpen] = useState(false)
  const [mathKeysOpen, setMathKeysOpen] = useState(false)
  const [slowHint, setSlowHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading) {
      setSlowHint(false)
      return
    }
    const id = window.setTimeout(() => setSlowHint(true), 12_000)
    return () => window.clearTimeout(id)
  }, [loading])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    const nextHistory = [...messages, userMsg]
    setMessages(nextHistory)
    setInput('')
    setError(null)
    setLoading(true)

    try {
      const reply = await sendMathMessage(nextHistory)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-shell">
      <header className="chat-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ∑
          </span>
          <div>
            <h1>EquationAI</h1>
            <p className="tagline">Math-only assistant</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => setCalcOpen(true)}
            aria-haspopup="dialog"
          >
            Calculator
          </button>
          <button
            type="button"
            className={`toolbar-btn ${mathKeysOpen ? 'active' : ''}`}
            onClick={() => setMathKeysOpen((v) => !v)}
            aria-pressed={mathKeysOpen}
          >
            Math keyboard
          </button>
        </div>
      </header>

      <div className="chat-body">
        <ul className="message-list" aria-live="polite">
          {messages.map((m, i) => {
            const raw = m.content
            const shown =
              m.role === 'assistant'
                ? stripMathDelimitersForDisplay(raw)
                : raw
            return (
              <li
                key={i}
                className={`bubble ${m.role === 'user' ? 'user' : 'assistant'}`}
              >
                <span className="bubble-role">
                  {m.role === 'user' ? 'You' : 'EquationAI'}
                </span>
                <div className="bubble-content">
                  {shown.split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              </li>
            )
          })}
          {loading && (
            <li className="bubble assistant thinking" aria-busy="true">
              <span className="bubble-role">EquationAI</span>
              <p className="thinking-line">
                <span className="thinking-prefix">Thinking</span>
                <span className="thinking-dots" aria-hidden="true">
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                </span>
              </p>
              {slowHint && (
                <p className="thinking-hint">
                  Still working — can take up to several
                  minutes. If
                  nothing changes for three minutes, check the red error line
                  below or the browser Network tab for{' '}
                  <code>chat/completions</code>.
                </p>
              )}
            </li>
          )}
        </ul>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      <form className="composer" onSubmit={handleSend}>
        <MathKeyboard inputRef={inputRef} visible={mathKeysOpen} />
        <div className="composer-chatbox">
          <input
            ref={inputRef}
            className="composer-input"
            placeholder="Type a math question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            aria-label="Message"
          />
          <div className="composer-chatbox-actions">
            <button
              type="submit"
              className="send-btn"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </form>

      <CalculatorModal open={calcOpen} onClose={() => setCalcOpen(false)} />
    </div>
  )
}
