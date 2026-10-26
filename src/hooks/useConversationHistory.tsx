'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { Conversation } from '@/models/entities/conversation'
import { chatService } from '@/models/services/chat.service'
import { useSocketEvent, useSocketReconnect } from './useSocketEvent'

type HistoryState = {
  status: 'loading' | 'error' | 'ready'
  error: string | null
  conversations: Conversation[]
  /** Conversa aberta no chat (destacada no histórico). */
  activeId: string | null
  setActiveId: (id: string | null) => void
  refresh: () => void
  startNew: () => Promise<void>
  starting: boolean
}

const HistoryContext = createContext<HistoryState | null>(null)

const byRecent = (a: Conversation, b: Conversation) => b.lastMessageAt.localeCompare(a.lastMessageAt)

/** Histórico de conversas do funcionário, compartilhado entre a sidebar e o chat, atualizado em tempo real. */
export function ConversationHistoryProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<HistoryState['status']>('loading')
  const [error, setError] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)

  const refresh = useCallback(() => {
    chatService
      .list()
      .then((list) => {
        setConversations(list.sort(byRecent))
        setStatus('ready')
        setError(null)
      })
      .catch((e: Error) => {
        setStatus('error')
        setError(e.message)
      })
  }, [])

  useEffect(refresh, [refresh])
  useSocketReconnect(refresh, status !== 'loading')

  // Conversa nova ou atualizada (título, modo, última mensagem): entra/atualiza no topo
  useSocketEvent<Conversation>('conversation:updated', (conversation) => {
    if (!conversation.lastMessage) return
    setConversations((prev) => [conversation, ...prev.filter((c) => c.id !== conversation.id)].sort(byRecent))
  })

  const startNew = useCallback(async () => {
    setStarting(true)
    try {
      const snapshot = await chatService.startNew()
      router.push(`/atendimento/${snapshot.conversation.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível iniciar uma conversa.')
    } finally {
      setStarting(false)
    }
  }, [router])

  const value = useMemo<HistoryState>(
    () => ({ status, error, conversations, activeId, setActiveId, refresh, startNew, starting }),
    [status, error, conversations, activeId, refresh, startNew, starting],
  )

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export function useConversationHistory() {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useConversationHistory precisa estar dentro de <ConversationHistoryProvider>')
  return ctx
}
