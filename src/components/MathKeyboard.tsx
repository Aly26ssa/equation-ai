import type { RefObject } from 'react'
import { insertAtCaret } from '../lib/insertAtCaret'

/** Each entry: label shown on button, text inserted into the input */
const MATH_KEYS: { label: string; insert: string; title?: string }[] = [
  { label: '+', insert: '+' },
  { label: '−', insert: '−', title: 'Minus' },
  { label: '×', insert: '×' },
  { label: '÷', insert: '÷' },
  { label: '=', insert: '=' },
  { label: '≠', insert: '≠' },
  { label: '≤', insert: '≤' },
  { label: '≥', insert: '≥' },
  { label: '≈', insert: '≈' },
  { label: '∞', insert: '∞' },
  { label: 'π', insert: 'π' },
  { label: 'θ', insert: 'θ' },
  { label: 'λ', insert: 'λ' },
  { label: '√', insert: '√', title: 'Square root' },
  { label: '√(', insert: '√(', title: 'Sqrt with opening paren' },
  { label: '∑', insert: '∑' },
  { label: '∏', insert: '∏' },
  { label: '∫', insert: '∫' },
  { label: '∂', insert: '∂' },
  { label: '∇', insert: '∇' },
  { label: '°', insert: '°' },
  { label: '²', insert: '²' },
  { label: '³', insert: '³' },
  { label: '^', insert: '^' },
  { label: 'sin', insert: 'sin(', title: 'Sine' },
  { label: 'cos', insert: 'cos(', title: 'Cosine' },
  { label: 'tan', insert: 'tan(', title: 'Tangent' },
  { label: 'log', insert: 'log(', title: 'Logarithm' },
  { label: 'ln', insert: 'ln(', title: 'Natural log' },
  { label: 'lim', insert: 'lim', title: 'Limit' },
  { label: '(', insert: '(' },
  { label: ')', insert: ')' },
  { label: '[', insert: '[' },
  { label: ']', insert: ']' },
  { label: '{', insert: '{' },
  { label: '}', insert: '}' },
]

export function MathKeyboard({
  inputRef,
  visible,
}: {
  inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement | null>
  visible: boolean
}) {
  if (!visible) return null

  return (
    <div className="math-keyboard" role="group" aria-label="Math symbols keyboard">
      {MATH_KEYS.map((k, i) => (
        <button
          key={i}
          type="button"
          className="math-key"
          title={k.title ?? k.insert}
          onClick={() => {
            const el = inputRef.current
            if (el) insertAtCaret(el, k.insert)
          }}
        >
          {k.label}
        </button>
      ))}
    </div>
  )
}
