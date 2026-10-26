import { ArrowRightLeft, Headset } from 'lucide-react'
import { StatusLabel } from '@/components/ui'
import { formatRelative } from '@/lib/format'
import type { Ticket } from '@/models/entities/ticket'

export function CurrentTicketCard({ ticket, assumedBy }: { ticket: Ticket; assumedBy?: string }) {
  return (
    <div className="flex flex-col gap-3.5 rounded-xl bg-desk p-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[12.5px] font-medium text-ink-3">
          {ticket.number}
          <StatusLabel tone={ticket.tone} dotSize="md" className="font-semibold">
            {ticket.overdue ? `${ticket.statusLabel} · vencido` : ticket.statusLabel}
          </StatusLabel>
        </div>
        <strong className="text-[15.5px] leading-snug font-semibold">{ticket.title}</strong>
        <span className="text-[13.5px] text-ink-3">
          {ticket.categoryLabel} · prioridade {ticket.priorityLabel.toLowerCase()} · prazo {ticket.dueLabel}
        </span>
      </div>
      <div className="flex items-center gap-2 border-t border-rule pt-3 text-[12.5px] text-ink-3">
        {assumedBy ? <Headset size={15} /> : <ArrowRightLeft size={15} />}
        <span className="flex-1 text-[13.5px] text-ink-2">
          {assumedBy ? `Em atendimento com ${assumedBy}` : 'Vinculado a esta conversa'}
        </span>
        <time>{formatRelative(ticket.updatedAt)}</time>
      </div>
    </div>
  )
}
