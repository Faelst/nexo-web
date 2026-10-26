import { Bot, CircleCheckBig, Hand, Headset } from 'lucide-react'
import { Button, Spinner } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { Conversation } from '@/models/entities/conversation'
import { HANDOFF_LABEL } from './conversation-tag'

type Props = {
  conversation: Conversation
  busy: null | 'assume' | 'release' | 'close' | 'send'
  onAssume: () => void
  onGiveBack: () => void
}

/** Barra exibida enquanto o analista não assumiu a conversa. Mostra o resumo do agent na transferência. */
export function TakeoverBar({ conversation: c, busy, onAssume, onGiveBack }: Props) {
  const firstName = c.employee.name.split(' ')[0]
  const otherAnalyst = c.mode === 'HUMAN'

  const view = {
    WAITING_HUMAN: {
      icon: Hand,
      box: 'bg-warning-soft text-warning-text',
      title: `${firstName} espera um atendente`,
      body: c.handoffReason ? `Agent pausado · ${HANDOFF_LABEL[c.handoffReason]}` : 'Agent pausado',
    },
    AGENT: { icon: Bot, box: 'bg-success-soft text-success-text', title: 'O agent está atendendo', body: 'Você pode assumir a qualquer momento' },
    CLOSED: { icon: CircleCheckBig, box: 'bg-desk text-ink-3', title: 'Conversa encerrada', body: 'Assuma para reabrir o atendimento' },
    HUMAN: { icon: Headset, box: 'bg-primary-soft text-primary-text', title: `Com ${c.analyst?.name ?? 'outro analista'}`, body: 'Outro analista está atendendo esta conversa' },
  }[c.mode]
  const Icon = view.icon

  return (
    <footer className="flex flex-col gap-2.5 border-t border-rule bg-paper px-4 pt-3 pb-3.5 sm:px-5">
      {c.handoffSummary && c.mode === 'WAITING_HUMAN' && (
        <p className="rounded-lg bg-desk px-3 py-2 text-[13px] text-ink-2">
          <strong className="font-semibold">Resumo do agent: </strong>
          {c.handoffSummary}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <span className={cn('grid size-9 flex-none place-items-center rounded-full', view.box)}>
          <Icon size={17} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <strong className="font-semibold">{view.title}</strong>
          <span className="text-[12.5px] text-ink-3">{view.body}</span>
        </div>
        {!otherAnalyst && (
          <div className="flex w-full gap-2 sm:w-auto">
            {c.mode === 'WAITING_HUMAN' && (
              <Button className="flex-1 pr-3.5 pl-3 sm:flex-none" disabled={!!busy} onClick={onGiveBack}>
                <Bot size={15} />
                Devolver<span className="hidden sm:inline"> ao agent</span>
              </Button>
            )}
            <Button variant="primary" className="flex-1 pr-4 sm:flex-none" disabled={!!busy} onClick={onAssume}>
              {busy === 'assume' ? <Spinner className="size-4" /> : <Headset size={16} />}
              Assumir<span className="hidden sm:inline"> atendimento</span>
            </Button>
          </div>
        )}
      </div>
      <div className="flex h-11 items-center rounded-xl bg-desk px-3.5 text-ink-3 opacity-55 select-none">
        Assuma o atendimento para responder
      </div>
    </footer>
  )
}
