import { formatDay, formatTime, isSameDay } from '@/lib/format'
import type { Message, MessagePart } from '@/models/entities/message'
import { ThreadBubble } from './ThreadBubble'
import { DayDivider, SystemDivider } from './ThreadDividers'

/** Resume os blocos ricos que o funcionário viu, para o analista entender o contexto. */
function describePart(part: MessagePart): string {
  switch (part.type) {
    case 'options':
      return `Opções: ${part.options.join(' · ')}`
    case 'ticket-select':
      return `Mostrou ${part.tickets.length} chamados para escolher`
    case 'ticket':
      return `Card do ${part.ticket.number}${part.ticket.overdue ? ' (vencido)' : ''}`
    case 'draft': {
      const status = { PENDING: 'aguardando confirmação', CONFIRMED: 'confirmado', CANCELED: 'cancelado' }[part.status]
      return `Rascunho ${part.code}: ${part.title} — ${status}`
    }
  }
}

function systemIcon(text: string) {
  if (text.includes('assumiu')) return 'headset' as const
  if (text.includes('Devolvida')) return 'bot' as const
  if (text.includes('encerrado')) return 'check' as const
  return 'transfer' as const
}

export function Thread({ messages, thinking }: { messages: Message[]; thinking?: string | true }) {
  return (
    <div className="mt-auto flex flex-col px-4 pt-5 pb-4 sm:px-10">
      {messages.map((m, i) => {
        const previous = messages[i - 1]
        const day = !previous || !isSameDay(previous.createdAt, m.createdAt) ? (
          <DayDivider key={`day-${m.id}`} label={formatDay(m.createdAt)} />
        ) : null

        const item = (() => {
          switch (m.role) {
            case 'SYSTEM':
              return <SystemDivider key={m.id} text={m.content} icon={systemIcon(m.content)} />
            case 'USER':
              return (
                <ThreadBubble
                  key={m.id}
                  variant="client"
                  text={m.content}
                  time={formatTime(m.createdAt)}
                  grouped={previous?.role === 'USER' && !day}
                />
              )
            case 'AGENT':
              return (
                <ThreadBubble
                  key={m.id}
                  variant="ai"
                  text={m.content}
                  time={formatTime(m.createdAt)}
                  sender={{ name: 'Nexo Assist', tag: 'IA' }}
                  decision={m.decision}
                  extra={m.parts.map(describePart)}
                />
              )
            case 'ANALYST':
              return (
                <ThreadBubble
                  key={m.id}
                  variant="human"
                  text={m.content}
                  time={formatTime(m.createdAt)}
                  sender={{ name: m.author?.name ?? 'Analista', tag: m.author?.team ?? 'Suporte' }}
                />
              )
          }
        })()

        return day ? [day, item] : item
      })}
      {thinking && (
        <p className="animate-msg-in self-end px-1 pt-3 text-[12px] text-ink-3 italic">
          Nexo Assist {typeof thinking === 'string' ? `${thinking}…` : 'está respondendo…'}
        </p>
      )}
    </div>
  )
}
