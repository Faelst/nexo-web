import type { Ticket, TicketField } from './ticket'

/** Contrato dos blocos ricos de mensagem (espelha `message-parts.ts` da API). */
export type DraftPart = {
  type: 'draft'
  draftId: string
  code: string
  kind: 'CREATE' | 'UPDATE'
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED'
  ticketNumber?: string
  title: string
  description: string
  fields: TicketField[]
}

export type MessagePart =
  | { type: 'options'; question?: string; options: string[] }
  | { type: 'ticket-select'; tickets: Ticket[] }
  | { type: 'ticket'; ticket: Ticket }
  | DraftPart

export type ToolCall = {
  tool: string
  label: string
  input: unknown
  ok: boolean
  durationMs: number
  summary: string
}

/** Registro de transparência de cada resposta do agent. */
export type Decision = {
  intent: string
  action: string
  confidence: number | null
  reasoning: string
  steps: string[]
  toolCalls: ToolCall[]
  model: string | null
  latencyMs: number | null
  inputTokens: number | null
  outputTokens: number | null
}

export type MessageRole = 'USER' | 'AGENT' | 'ANALYST' | 'SYSTEM'

export type Message = {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  author: { name: string; team: string | null } | null
  parts: MessagePart[]
  createdAt: string
  decision: Decision | null
}
