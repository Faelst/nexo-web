import { X } from 'lucide-react'
import { Alert, IconButton, Spinner } from '@/components/ui'
import type { EmployeeTickets } from '@/models/entities/ticket'
import { CurrentTicketCard } from './CurrentTicketCard'
import { TicketHistoryItem } from './TicketHistoryItem'

type Props = {
  ownerName: string
  state: { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; data: EmployeeTickets } | null
  currentNumber: string | null
  assumedBy?: string
  onClose: () => void
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-[12.5px] font-semibold text-ink-3">{children}</h2>
}

export function TicketHistoryPanel({ ownerName, state, currentNumber, assumedBy, onClose }: Props) {
  const firstName = ownerName.split(' ')[0]
  const data = state?.status === 'ready' ? state.data : null
  const all = data ? [...data.open, ...data.closed] : []
  const current = all.find((t) => t.number === currentNumber)
  const others = all.filter((t) => t.number !== currentNumber)

  return (
    <aside className="flex h-full w-[340px] max-w-full flex-none flex-col border-l border-rule bg-paper">
      <header className="flex h-16 flex-none items-center gap-2 border-b border-rule pr-3.5 pl-5">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <strong className="truncate text-[15.5px] font-semibold">Chamados de {firstName}</strong>
          <span className="text-[12.5px] text-ink-3">
            {data ? `${data.open.length} abertos · ${data.closed.length} encerrados` : 'Carregando…'}
          </span>
        </div>
        <IconButton label="Fechar painel" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </header>

      {state?.status === 'loading' && (
        <div className="grid flex-1 place-items-center text-ink-3">
          <Spinner className="size-5" />
        </div>
      )}
      {state?.status === 'error' && <Alert className="m-4">{state.message}</Alert>}
      {data && (
        <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-5 pt-6 pb-5">
          {current && (
            <section className="flex flex-col gap-3">
              <SectionTitle>Desta conversa</SectionTitle>
              <CurrentTicketCard ticket={current} assumedBy={assumedBy} />
            </section>
          )}
          <section className="flex flex-col gap-1">
            <SectionTitle>{current ? 'Outros chamados' : 'Chamados'}</SectionTitle>
            {others.map((t) => (
              <TicketHistoryItem key={t.number} ticket={t} />
            ))}
            {others.length === 0 && <p className="py-3 text-[13.5px] text-ink-3">Nenhum outro chamado.</p>}
          </section>
        </div>
      )}
    </aside>
  )
}
