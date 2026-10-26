import type { Tone } from './tone'

/** Espelha `TicketDto` da API. */
export type Ticket = {
  number: string
  type: 'INC' | 'REQ'
  typeLabel: string
  title: string
  description: string
  category: string
  categoryLabel: string
  priority: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA'
  priorityLabel: string
  status: 'ABERTO' | 'EM_ANDAMENTO' | 'AGUARDANDO_ANALISTA' | 'APROVADO' | 'RESOLVIDO'
  statusLabel: string
  tone: Tone
  affected: string
  affectedLabel: string
  createdAt: string
  updatedAt: string
  dueAt: string
  dueLabel: string
  overdue: boolean
  resolvedAt: string | null
}

export type TicketField = {
  label: string
  value: string
  /** Mostra um ponto colorido antes do valor (ex.: prioridade). */
  dot?: Tone
  note?: string
  tone?: Tone
}

export type EmployeeTickets = { open: Ticket[]; closed: Ticket[] }
