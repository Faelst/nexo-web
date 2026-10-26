'use client'

import { useState } from 'react'
import { CheckCheck, ChevronDown } from 'lucide-react'
import { DecisionDetails } from '@/components/chat/DecisionDetails'
import { cn } from '@/lib/cn'
import type { Decision } from '@/models/entities/message'

type Props = {
  variant: 'client' | 'ai' | 'human'
  text: string
  time: string
  /** Segunda mensagem seguida do mesmo autor: cantos arredondados e menos espaço. */
  grouped?: boolean
  sender?: { name: string; tag: string }
  decision?: Decision | null
  /** Itens extras exibidos na bolha (ex.: blocos que o agent mostrou). */
  extra?: string[]
}

const bubble = {
  client: 'rounded-[4px_12px_12px_12px] bg-paper',
  ai: 'rounded-[12px_4px_12px_12px] bg-bubble-ai',
  human: 'rounded-[12px_4px_12px_12px] bg-bubble-human',
}

export function ThreadBubble({ variant, text, time, grouped, sender, decision, extra }: Props) {
  const [open, setOpen] = useState(false)
  const outgoing = variant !== 'client'
  const confidence = decision?.confidence

  return (
    <div
      className={cn('flex animate-msg-in flex-col gap-1', outgoing ? 'items-end' : 'items-start', grouped ? 'pt-[3px]' : 'pt-4')}
    >
      {sender && (
        <div className="flex items-center gap-1.5 px-1">
          <strong className="text-xs font-semibold text-ink-2">{sender.name}</strong>
          <span
            className={cn(
              'rounded-md px-1.5 py-px text-[11px] font-semibold',
              variant === 'ai' ? 'bg-primary-soft text-primary-text' : 'bg-success-soft text-success-text',
            )}
          >
            {sender.tag}
          </span>
          {decision && (
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                'inline-flex items-center gap-0.5 text-[11px] font-medium hover:underline',
                confidence != null && confidence < 0.5 ? 'text-danger-text' : 'text-primary-text',
              )}
            >
              {confidence != null ? `${Math.round(confidence * 100)}%` : 'decisão'}
              <ChevronDown size={11} className={cn('transition-transform', open && 'rotate-180')} />
            </button>
          )}
        </div>
      )}
      {open && decision && <DecisionDetails decision={decision} className="w-[460px]" />}
      <div
        className={cn(
          'flex max-w-[min(420px,85%)] flex-wrap items-end gap-x-2.5 gap-y-0.5 px-3 pt-2 pb-1.5 leading-[1.45] shadow-bubble',
          bubble[variant],
          grouped && 'rounded-xl',
        )}
      >
        <p className="flex-auto whitespace-pre-line">{text}</p>
        {extra?.map((item) => (
          <span key={item} className="w-full text-[12.5px] text-ink-3">
            {item}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-[3px] pb-px text-[11px] text-ink-3">
          {time}
          {outgoing && <CheckCheck size={14} className="text-primary" />}
        </span>
      </div>
    </div>
  )
}
