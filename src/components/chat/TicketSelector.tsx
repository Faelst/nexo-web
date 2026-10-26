import { Card, RadioMark, StatusLabel } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatShortDate } from '@/lib/format'
import type { Ticket } from '@/models/entities/ticket'

type Props = {
  tickets: Ticket[]
  selected?: string
  disabled?: boolean
  onSelect: (ticket: Ticket) => void
}

export function TicketSelector({ tickets, selected, disabled, onSelect }: Props) {
  if (tickets.length === 0) return null

  return (
    <Card role="radiogroup" aria-label="Seus chamados abertos" className="w-full animate-msg-in">
      {tickets.map((ticket) => {
        const checked = ticket.number === selected
        return (
          <button
            key={ticket.number}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onSelect(ticket)}
            className={cn(
              'flex min-h-[46px] w-full items-center gap-3.5 px-4 py-2 text-left [&+&]:border-t [&+&]:border-rule',
              !disabled && 'hover:bg-desk',
              checked && 'bg-cta/[0.04]',
            )}
          >
            <RadioMark checked={checked} />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3.5">
              <span className="text-[12.5px] font-medium whitespace-nowrap text-ink-3">{ticket.number}</span>
              <span className="truncate font-medium sm:flex-1">{ticket.title}</span>
            </span>
            <StatusLabel tone={ticket.tone} variant="muted" className="hidden text-[12.5px] md:inline-flex">
              {ticket.overdue ? 'Vencido' : ticket.statusLabel}
            </StatusLabel>
            <span className="hidden w-11 text-right text-[12.5px] whitespace-nowrap text-ink-3 sm:inline">
              {formatShortDate(ticket.createdAt)}
            </span>
          </button>
        )
      })}
    </Card>
  )
}
