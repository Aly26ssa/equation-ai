/**
 * Strip common LaTeX / Markdown math delimiters so plain-text bubbles do not show raw `$`.
 * Only removes paired delimiters; unmatched `$` is left as-is.
 */
export function stripMathDelimitersForDisplay(text: string): string {
  let s = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner: string) =>
    inner.trim(),
  )
  let prev: string
  do {
    prev = s
    s = s.replace(/\$([^$\n]+)\$/g, '$1')
  } while (s !== prev)
  s = s.replace(/\\\(([\s\S]*?)\\\)/g, '$1')
  s = s.replace(/\\\[([\s\S]*?)\\\]/g, (_, inner: string) => inner.trim())
  return s
}
