import { formatDateTime, formatRelative } from '@/lib/format'
import type { Ticket, TicketField } from '@/models/entities/ticket'
import { InfoCard } from './InfoCard'

const PRIORITY_DOT: Record<Ticket['priority'], TicketField['dot']> = {
  CRITICA: 'danger',
  ALTA: 'warning',
  MEDIA: 'neutral',
  BAIXA: 'neutral',
}

export function ticketFields(ticket: Ticket): TicketField[] {
  return [
    { label: 'Categoria', value: ticket.categoryLabel },
    { label: 'Prioridade', value: ticket.priorityLabel, dot: PRIORITY_DOT[ticket.priority] },
    { label: 'Aberto em', value: formatDateTime(ticket.createdAt) },
    ticket.status === 'RESOLVIDO' && ticket.resolvedAt
      ? { label: 'Resolvido', value: formatRelative(ticket.resolvedAt) }
      : {
          label: 'Última atualização',
          value: formatRelative(ticket.updatedAt),
          ...(ticket.overdue && { note: '· prazo vencido', tone: 'warning' as const }),
        },
  ]
}

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <InfoCard>
      <InfoCard.Header
        kind={ticket.typeLabel === 'Requisição' ? 'Requisição' : 'Chamado'}
        reference={ticket.number}
        status={{ label: ticket.overdue ? `${ticket.statusLabel} · vencido` : ticket.statusLabel, tone: ticket.tone }}
      >
        <InfoCard.Title>{ticket.title}</InfoCard.Title>
        <InfoCard.Description>{ticket.description}</InfoCard.Description>
      </InfoCard.Header>
      <InfoCard.Fields fields={ticketFields(ticket)} />
    </InfoCard>
  )
}
