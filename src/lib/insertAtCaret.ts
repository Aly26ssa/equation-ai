/** Inserts text at the textarea caret and restores focus. */
export function insertAtCaret(
  el: HTMLTextAreaElement | HTMLInputElement,
  text: string,
): void {
  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0
  const before = el.value.slice(0, start)
  const after = el.value.slice(end)
  el.value = before + text + after
  const pos = start + text.length
  el.setSelectionRange(pos, pos)
  el.focus()
}
