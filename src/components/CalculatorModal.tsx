import { useCallback, useEffect, useState } from 'react'

type Op = '+' | '-' | '*' | '/' | null

function parseDisplay(s: string): number {
  const n = parseFloat(s.replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

export function CalculatorModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [display, setDisplay] = useState('0')
  const [stored, setStored] = useState<number | null>(null)
  const [pendingOp, setPendingOp] = useState<Op>(null)
  const [fresh, setFresh] = useState(true)

  const resetAll = useCallback(() => {
    setDisplay('0')
    setStored(null)
    setPendingOp(null)
    setFresh(true)
  }, [])

  const applyOp = useCallback(
    (a: number, b: number, op: NonNullable<Op>): number => {
      switch (op) {
        case '+':
          return a + b
        case '-':
          return a - b
        case '*':
          return a * b
        case '/':
          return b === 0 ? NaN : a / b
        default:
          return b
      }
    },
    [],
  )

  const digit = (d: string) => {
    if (!fresh) {
      setDisplay((prev) => (prev === '0' ? d : prev + d))
    } else {
      setDisplay(d)
      setFresh(false)
    }
  }

  const dot = () => {
    if (!fresh && display.includes('.')) return
    if (fresh) {
      setDisplay('0.')
      setFresh(false)
      return
    }
    setDisplay((prev) => prev + '.')
  }

  const opClick = (op: NonNullable<Op>) => {
    const current = parseDisplay(display)
    if (stored !== null && pendingOp && !fresh) {
      const next = applyOp(stored, current, pendingOp)
      if (Number.isNaN(next)) {
        setDisplay('Error')
        setStored(null)
        setPendingOp(null)
        setFresh(true)
        return
      }
      setStored(next)
      setDisplay(String(next))
    } else {
      setStored(current)
    }
    setPendingOp(op)
    setFresh(true)
  }

  const equals = () => {
    if (stored === null || !pendingOp) return
    const current = parseDisplay(display)
    const result = applyOp(stored, current, pendingOp)
    if (Number.isNaN(result)) {
      setDisplay('Error')
    } else {
      const out = Object.is(result, -0) ? '0' : String(result)
      setDisplay(out.length > 12 ? result.toPrecision(8) : out)
    }
    setStored(null)
    setPendingOp(null)
    setFresh(true)
  }

  const pct = () => {
    setDisplay(String(parseDisplay(display) / 100))
    setFresh(true)
  }

  const toggleSign = () => {
    if (display === '0' || display === 'Error') return
    setDisplay((d) => (d.startsWith('-') ? d.slice(1) : '-' + d))
  }

  const sqrt = () => {
    const n = parseDisplay(display)
    if (n < 0) {
      setDisplay('Error')
      setFresh(true)
      return
    }
    const r = Math.sqrt(n)
    setDisplay(String(r))
    setFresh(true)
  }

  const square = () => {
    const n = parseDisplay(display)
    setDisplay(String(n * n))
    setFresh(true)
  }

  const backspace = () => {
    if (fresh) return
    setDisplay((d) => {
      if (d.length <= 1) return '0'
      return d.slice(0, -1)
    })
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const btn = (
    label: string,
    onClick: () => void,
    className = '',
    aria?: string,
  ) => (
    <button
      type="button"
      className={`calc-btn ${className}`.trim()}
      onClick={onClick}
      aria-label={aria ?? label}
    >
      {label}
    </button>
  )

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal calc-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calc-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="calc-header">
          <h2 id="calc-title">Calculator</h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close calculator"
          >
            ×
          </button>
        </header>
        <div className="calc-display" aria-live="polite">
          {display}
        </div>
        <div className="calc-grid">
          {btn('C', resetAll, 'calc-op', 'Clear all')}
          {btn('⌫', backspace, 'calc-op', 'Backspace')}
          {btn('%', pct, 'calc-op')}
          {btn('÷', () => opClick('/'), 'calc-op')}

          {btn('7', () => digit('7'))}
          {btn('8', () => digit('8'))}
          {btn('9', () => digit('9'))}
          {btn('×', () => opClick('*'), 'calc-op')}

          {btn('4', () => digit('4'))}
          {btn('5', () => digit('5'))}
          {btn('6', () => digit('6'))}
          {btn('−', () => opClick('-'), 'calc-op')}

          {btn('1', () => digit('1'))}
          {btn('2', () => digit('2'))}
          {btn('3', () => digit('3'))}
          {btn('+', () => opClick('+'), 'calc-op')}

          {btn('±', toggleSign, 'calc-op')}
          {btn('0', () => digit('0'))}
          {btn('.', dot)}
          {btn('=', equals, 'calc-eq')}
        </div>
        <div className="calc-extra">
          {btn('√', sqrt, 'calc-secondary')}
          {btn('x²', square, 'calc-secondary')}
        </div>
      </div>
    </div>
  )
}
