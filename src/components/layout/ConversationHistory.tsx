'use client'

import Link from 'next/link'
import { MessageSquarePlus, RotateCw } from 'lucide-react'
import { Spinner, StatusDot } from '@/components/ui'
import { useConversationHistory } from '@/hooks/useConversationHistory'
import { cn } from '@/lib/cn'
import { formatListTime } from '@/lib/format'
import type { Conversation } from '@/models/entities/conversation'
import type { Tone } from '@/models/entities/tone'

const MODE_INFO: Partial<Record<Conversation['mode'], { label: string; tone: Tone }>> = {
  WAITING_HUMAN: { label: 'Aguardando analista', tone: 'warning' },
  HUMAN: { label: 'Com analista', tone: 'success' },
  CLOSED: { label: 'Encerrada', tone: 'neutral' },
}

type Props = { onNavigate?: () => void }

/** Histórico de conversas do funcionário na sidebar: nova conversa + lista das anteriores. */
export function ConversationHistory({ onNavigate }: Props) {
  const { status, error, conversations, activeId, refresh, startNew, starting } = useConversationHistory()
  const activeIsNew = !!activeId && status === 'ready' && !conversations.some((c) => c.id === activeId)

  return (
    <section aria-label="Histórico de conversas" className="mt-5 flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-2.5 pb-1.5">
        <h2 className="text-[11.5px] font-semibold tracking-wide text-ink-3 uppercase">Conversas</h2>
      </div>

      <button
        type="button"
        onClick={() => {
          onNavigate?.()
          void startNew()
        }}
        disabled={starting}
        className="mb-1.5 flex h-9 w-full items-center gap-2.5 rounded-lg border border-dashed border-control px-2.5 text-[13.5px] font-medium text-ink-2 hover:border-cta hover:text-primary-text disabled:opacity-60"
      >
        {starting ? <Spinner className="size-4" /> : <MessageSquarePlus size={16} />}
        Nova conversa
      </button>

      <ul className="-mr-1.5 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pr-1.5">
        {activeIsNew && (
          <li>
            <span className="flex flex-col gap-0.5 rounded-lg bg-primary-soft px-2.5 py-2">
              <span className="truncate text-[13.5px] font-semibold text-primary-text">Nova conversa</span>
              <span className="text-[11.5px] text-ink-3">agora</span>
            </span>
          </li>
        )}

        {status === 'loading' && (
          <li className="flex justify-center py-4 text-ink-3">
            <Spinner />
          </li>
        )}

        {status === 'error' && (
          <li className="px-2.5 py-2 text-[12.5px] text-danger-text">
            {error}{' '}
            <button type="button" onClick={refresh} className="inline-flex items-center gap-1 font-medium underline">
              <RotateCw size={11} /> tentar de novo
            </button>
          </li>
        )}

        {status === 'ready' && conversations.length === 0 && !activeIsNew && (
          <li className="px-2.5 py-2 text-[12.5px] text-ink-3">Suas conversas aparecem aqui.</li>
        )}

        {conversations.map((c) => {
          const active = c.id === activeId
          const info = MODE_INFO[c.mode]
          return (
            <li key={c.id}>
              <Link
                href={`/atendimento/${c.id}`}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col gap-0.5 rounded-lg px-2.5 py-2 hover:bg-desk',
                  active && 'bg-primary-soft hover:bg-primary-soft',
                )}
              >
                <span
                  className={cn('truncate text-[13.5px]', active ? 'font-semibold text-primary-text' : 'font-medium text-ink')}
                >
                  {c.title ?? 'Conversa sem título'}
                </span>
                <span className="flex items-center gap-1.5 text-[11.5px] text-ink-3">
                  {formatListTime(c.lastMessageAt)}
                  {info && (
                    <>
                      <span aria-hidden>·</span>
                      <StatusDot tone={info.tone} />
                      {info.label}
                    </>
                  )}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
