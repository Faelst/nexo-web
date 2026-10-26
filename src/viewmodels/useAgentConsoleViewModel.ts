'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { useSocketEvent, useSocketReconnect } from '@/hooks/useSocketEvent'
import type { AgentStatus, Conversation, ConversationFilter } from '@/models/entities/conversation'
import type { Message } from '@/models/entities/message'
import type { EmployeeTickets } from '@/models/entities/ticket'
import { analystService } from '@/models/services/analyst.service'

type Load<T> = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; data: T }

const byRecent = (a: Conversation, b: Conversation) => b.lastMessageAt.localeCompare(a.lastMessageAt)
const upsertMessage = (list: Message[], message: Message) =>
  list.some((m) => m.id === message.id) ? list.map((m) => (m.id === message.id ? message : m)) : [...list, message]

export function useAgentConsoleViewModel() {
  const { session, signOut } = useSession()
  const me = session!.user

  const [list, setList] = useState<Load<Conversation[]>>({ status: 'loading' })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<Load<{ conversation: Conversation; messages: Message[] }> | null>(null)
  const [tickets, setTickets] = useState<Load<EmployeeTickets> | null>(null)
  const [thinking, setThinking] = useState<Record<string, string | true>>({})
  const [filter, setFilter] = useState<ConversationFilter>('para-voce')
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState<null | 'assume' | 'release' | 'close' | 'send'>(null)
  const [error, setError] = useState<string | null>(null)
  const [mobilePane, setMobilePane] = useState<'list' | 'conversation'>('list')
  /** Painel de chamados: coluna fixa em telas largas e drawer nas menores. */
  const [historyOpen, setHistoryOpen] = useState(true)
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false)

  const loadList = useCallback(() => {
    analystService
      .list()
      .then((data) => setList({ status: 'ready', data: data.sort(byRecent) }))
      .catch((e: Error) => setList({ status: 'error', message: e.message }))
  }, [])

  const loadTickets = useCallback((employeeId: string, silent = false) => {
    if (!silent) setTickets({ status: 'loading' })
    analystService
      .employeeTickets(employeeId)
      .then((t) => setTickets({ status: 'ready', data: t }))
      .catch((e: Error) => setTickets({ status: 'error', message: e.message }))
  }, [])

  const loadDetail = useCallback((id: string) => {
    setDetail({ status: 'loading' })
    analystService
      .get(id)
      .then((data) => {
        setDetail({ status: 'ready', data })
        loadTickets(data.conversation.employee.id)
      })
      .catch((e: Error) => setDetail({ status: 'error', message: e.message }))
    void analystService.markRead(id).catch(() => undefined)
  }, [loadTickets])

  useEffect(loadList, [loadList])
  useSocketReconnect(() => {
    loadList()
    if (selectedId) loadDetail(selectedId)
  }, list.status !== 'loading')

  /* ---------- Tempo real ---------- */

  useSocketEvent<Conversation>('conversation:updated', (conversation) => {
    setList((prev) => {
      if (prev.status !== 'ready') return prev
      const exists = prev.data.some((c) => c.id === conversation.id)
      const data = exists ? prev.data.map((c) => (c.id === conversation.id ? conversation : c)) : [conversation, ...prev.data]
      return { status: 'ready', data: data.sort(byRecent) }
    })
    if (detail?.status === 'ready' && detail.data.conversation.id === conversation.id) {
      const before = detail.data.conversation
      // Mudou o modo ou o chamado vinculado: o status dos chamados pode ter mudado também
      if (before.mode !== conversation.mode || before.ticketNumber !== conversation.ticketNumber) {
        loadTickets(conversation.employee.id, true)
      }
      setDetail({ status: 'ready', data: { ...detail.data, conversation } })
    }
  })

  const onMessage = (message: Message) => {
    setDetail((prev) =>
      prev?.status === 'ready' && prev.data.conversation.id === message.conversationId
        ? { status: 'ready', data: { ...prev.data, messages: upsertMessage(prev.data.messages, message) } }
        : prev,
    )
    // Conversa aberta na tela: mensagens novas já contam como lidas
    if (message.conversationId === selectedId && message.role === 'USER') {
      void analystService.markRead(message.conversationId).catch(() => undefined)
    }
  }
  useSocketEvent<Message>('message:new', onMessage)
  useSocketEvent<Message>('message:updated', onMessage)

  useSocketEvent<AgentStatus>('agent:status', (event) => {
    setThinking((prev) => {
      const next = { ...prev }
      if (event.status === 'idle') delete next[event.conversationId]
      else next[event.conversationId] = event.step ?? prev[event.conversationId] ?? true
      return next
    })
  })

  /* ---------- Derivados ---------- */

  const conversations = useMemo(() => (list.status === 'ready' ? list.data : []), [list])

  const matches: Record<ConversationFilter, (c: Conversation) => boolean> = useMemo(
    () => ({
      todas: () => true,
      'para-voce': (c) => c.mode === 'WAITING_HUMAN',
      'com-agent': (c) => c.mode === 'AGENT',
      minhas: (c) => c.mode === 'HUMAN' && c.analyst?.id === me.id,
    }),
    [me.id],
  )

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return conversations.filter(
      (c) =>
        (matches[filter](c) || c.id === selectedId) &&
        (!q ||
          `${c.employee.name} ${c.ticketNumber ?? ''} ${c.lastMessage?.content ?? ''}`.toLowerCase().includes(q)),
    )
  }, [conversations, filter, query, selectedId, matches])

  const filters = (
    [
      ['todas', 'Todas'],
      ['para-voce', 'Para você'],
      ['com-agent', 'Com o agent'],
      ['minhas', 'Minhas'],
    ] as const
  ).map(([id, label]) => ({
    id,
    label,
    count: id === 'todas' ? undefined : conversations.filter(matches[id]).length,
  }))

  const selected = detail?.status === 'ready' ? detail.data.conversation : null
  const assignedToMe = selected?.mode === 'HUMAN' && selected.analyst?.id === me.id
  const unreadTotal = conversations.reduce((sum, c) => sum + (c.id === selectedId ? 0 : c.unreadForAnalyst), 0)

  /* ---------- Ações ---------- */

  function select(id: string) {
    setSelectedId(id)
    setMobilePane('conversation')
    setError(null)
    loadDetail(id)
  }

  async function run(kind: NonNullable<typeof busy>, action: () => Promise<unknown>) {
    setBusy(kind)
    setError(null)
    try {
      await action()
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível concluir.')
      return false
    } finally {
      setBusy(null)
    }
  }

  return {
    me,
    signOut,
    list,
    reloadList: loadList,
    conversations: visible,
    filters,
    filter,
    setFilter,
    query,
    setQuery,
    unreadTotal,
    selectedId,
    select,
    detail,
    retryDetail: () => selectedId && loadDetail(selectedId),
    selected,
    assignedToMe,
    thinking,
    tickets,
    busy,
    error,
    dismissError: () => setError(null),
    assume: () => selectedId && run('assume', () => analystService.assume(selectedId)),
    release: () => selectedId && run('release', () => analystService.release(selectedId)),
    close: () => selectedId && run('close', () => analystService.close(selectedId)),
    send: async (text: string) =>
      !!selectedId &&
      run('send', async () => {
        const message = await analystService.send(selectedId, text)
        onMessage(message)
      }),
    mobilePane,
    backToList: () => setMobilePane('list'),
    historyOpen,
    historyDrawerOpen,
    openHistory: (wide: boolean) => (wide ? setHistoryOpen(true) : setHistoryDrawerOpen(true)),
    closeHistory: () => {
      setHistoryOpen(false)
      setHistoryDrawerOpen(false)
    },
  }
}

export type AgentConsoleViewModel = ReturnType<typeof useAgentConsoleViewModel>
