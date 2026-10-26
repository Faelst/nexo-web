import type { User } from './user'

export type ConversationMode = 'AGENT' | 'WAITING_HUMAN' | 'HUMAN' | 'CLOSED'
export type HandoffReason = 'PEDIDO_USUARIO' | 'CRITICO' | 'VENCIDO' | 'BAIXA_CONFIANCA'

/** Espelha `ConversationDto` da API. */
export type Conversation = {
  id: string
  mode: ConversationMode
  /** Gerado a partir da primeira mensagem do funcionário. */
  title: string | null
  employee: User & { online: boolean }
  analyst: { id: string; name: string } | null
  ticketNumber: string | null
  handoffReason: HandoffReason | null
  handoffSummary: string | null
  lastConfidence: number | null
  userMessageCount: number
  unreadForAnalyst: number
  lastMessage: { role: string; content: string; createdAt: string } | null
  lastMessageAt: string
  createdAt: string
}

export type ConversationFilter = 'todas' | 'para-voce' | 'com-agent' | 'minhas'

export type AgentStatus = { conversationId: string; status: 'thinking' | 'idle'; step?: string }
