'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useConversationHistory } from '@/hooks/useConversationHistory'
import { useSocketEvent, useSocketReconnect } from '@/hooks/useSocketEvent'
import type { AgentStatus, Conversation } from '@/models/entities/conversation'
import type { Message } from '@/models/entities/message'
import type { Ticket } from '@/models/entities/ticket'
import { chatService } from '@/models/services/chat.service'

type LoadState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready' }

const upsert = (list: Message[], message: Message) =>
  list.some((m) => m.id === message.id) ? list.map((m) => (m.id === message.id ? message : m)) : [...list, message]

/** Chat de uma conversa do histórico (`conversationId`) ou da conversa em andamento mais recente. */
export function useClientChatViewModel(conversationId?: string) {
  const history = useConversationHistory()
  const [load, setLoad] = useState<LoadState>({ status: 'loading' })
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [maxMessages, setMaxMessages] = useState(30)
  /** Passos que o agent está executando agora (chegam ao vivo pelo socket). */
  const [agent, setAgent] = useState<{ thinking: boolean; steps: string[] }>({ thinking: false, steps: [] })
  const [sending, setSending] = useState(false)
  const [busyDraft, setBusyDraft] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const applySnapshot = useCallback((snapshot: Awaited<ReturnType<typeof chatService.current>>) => {
    setConversation(snapshot.conversation)
    setMessages(snapshot.messages)
    setMaxMessages(snapshot.maxMessages)
    setLoad({ status: 'ready' })
  }, [])

  const { setActiveId, startNew: startNewConversation } = history
  const reload = useCallback(() => {
    ;(conversationId ? chatService.open(conversationId) : chatService.current())
      .then(applySnapshot)
      .catch((e: Error) => setLoad({ status: 'error', message: e.message }))
  }, [applySnapshot, conversationId])

  // Destaca no histórico a conversa aberta
  useEffect(() => {
    setActiveId(conversation?.id ?? null)
  }, [conversation?.id, setActiveId])
  useEffect(() => () => setActiveId(null), [setActiveId])

  useEffect(reload, [reload])
  useSocketReconnect(reload, load.status !== 'loading')

  const isCurrent = (conversationId: string) => conversationId === conversation?.id

  useSocketEvent<Message>('message:new', (message) => {
    if (isCurrent(message.conversationId)) setMessages((prev) => upsert(prev, message))
  })
  useSocketEvent<Message>('message:updated', (message) => {
    if (isCurrent(message.conversationId)) setMessages((prev) => upsert(prev, message))
  })
  useSocketEvent<Conversation>('conversation:updated', (next) => {
    if (isCurrent(next.id)) setConversation(next)
  })
  useSocketEvent<AgentStatus>('agent:status', (event) => {
    if (!isCurrent(event.conversationId)) return
    setAgent((prev) =>
      event.status === 'idle'
        ? { thinking: false, steps: [] }
        : { thinking: true, steps: event.step && !prev.steps.includes(event.step) ? [...prev.steps, event.step] : prev.steps },
    )
  })

  /* ---------- Derivados ---------- */

  const lastMessage = messages.at(-1)
  const mode = conversation?.mode ?? 'AGENT'
  const used = conversation?.userMessageCount ?? 0
  const limitReached = used >= maxMessages
  const closed = mode === 'CLOSED'

  /** Resposta do funcionário logo após cada mensagem do agent (marca a opção escolhida). */
  const answers = useMemo(() => {
    const map: Record<string, string> = {}
    messages.forEach((m, i) => {
      const next = messages[i + 1]
      if (m.role === 'AGENT' && next?.role === 'USER') map[m.id] = next.content
    })
    return map
  }, [messages])

  /** Opções e seletores só ficam ativos na última mensagem, com o agent livre. */
  const interactiveId =
    lastMessage?.role === 'AGENT' && mode === 'AGENT' && !agent.thinking && !sending ? lastMessage.id : null

  /* ---------- Ações ---------- */

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim()
      if (!clean || sending || !conversation) return false
      setSending(true)
      setError(null)
      try {
        const message = await chatService.send(conversation.id, clean)
        setMessages((prev) => upsert(prev, message))
        return true
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Não foi possível enviar.')
        return false
      } finally {
        setSending(false)
      }
    },
    [sending, conversation],
  )

  async function runDraftAction(draftId: string, action: () => Promise<unknown>) {
    setBusyDraft(draftId)
    setError(null)
    try {
      await action()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível concluir.')
    } finally {
      setBusyDraft(null)
    }
  }


  return {
    load,
    reload,
    conversation,
    mode,
    messages,
    answers,
    interactiveId,
    agent,
    sending,
    used,
    maxMessages,
    limitReached,
    closed,
    error,
    dismissError: () => setError(null),
    send,
    selectTicket: (ticket: Ticket) => send(`${ticket.number} · ${ticket.title}`),
    busyDraft,
    confirmDraft: (draftId: string, edits?: { title?: string; description?: string }) =>
      runDraftAction(draftId, () => chatService.confirmDraft(draftId, edits)),
    cancelDraft: (draftId: string) => runDraftAction(draftId, () => chatService.cancelDraft(draftId)),
    startNew: startNewConversation,
  }
}

export type ClientChatViewModel = ReturnType<typeof useClientChatViewModel>
