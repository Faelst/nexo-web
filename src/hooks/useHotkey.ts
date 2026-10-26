import { useEffect, useRef } from 'react'

/** Registra um atalho de teclado global enquanto `enabled` for verdadeiro. */
export function useHotkey(handler: (e: KeyboardEvent) => void, enabled = true) {
  const saved = useRef(handler)
  useEffect(() => {
    saved.current = handler
  })

  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if ((tag === 'INPUT' || tag === 'TEXTAREA') && !(e.metaKey || e.ctrlKey)) return
      saved.current(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled])
}
