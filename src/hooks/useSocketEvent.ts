'use client'

import { useEffect, useRef } from 'react'
import { getSocket } from '@/lib/api/socket'

/** Assina um evento do Socket.IO enquanto o componente estiver montado. */
export function useSocketEvent<T>(event: string, handler: (payload: T) => void, enabled = true) {
  const saved = useRef(handler)
  useEffect(() => {
    saved.current = handler
  })

  useEffect(() => {
    if (!enabled) return
    const socket = getSocket()
    const listener = (payload: T) => saved.current(payload)
    socket.on(event, listener)
    return () => {
      socket.off(event, listener)
    }
  }, [event, enabled])
}

/** Executa `onReconnect` quando o socket reconecta (para ressincronizar o estado). */
export function useSocketReconnect(onReconnect: () => void, enabled = true) {
  useSocketEvent<void>('connect', onReconnect, enabled)
}
