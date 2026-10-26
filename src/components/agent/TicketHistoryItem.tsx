import { ChevronRight } from 'lucide-react'
import { StatusDot } from '@/components/ui'
import { formatShortDate } from '@/lib/format'
import type { Ticket } from '@/models/entities/ticket'

export function TicketHistoryItem({ ticket }: { ticket: Ticket }) {
  const meta =
    ticket.status === 'RESOLVIDO' && ticket.resolvedAt
      ? `Resolvido em ${formatShortDate(ticket.resolvedAt)}`
      : ticket.overdue
        ? `${ticket.statusLabel} · vencido`
        : ticket.statusLabel

  return (
    <div className="flex w-full items-center gap-3 border-b border-rule py-3 text-left text-ink-3 last:border-b-0">
      <StatusDot tone={ticket.tone} size="md" className={ticket.tone === 'neutral' ? 'opacity-70' : undefined} />
      <span className="flex min-w-0 flex-1 flex-col gap-[3px] text-[12.5px]">
        <strong className="truncate text-[14.5px] font-medium text-ink">{ticket.title}</strong>
        <span>
          {ticket.number} · {meta}
        </span>
      </span>
      <ChevronRight size={16} />
    </div>
  )
}
