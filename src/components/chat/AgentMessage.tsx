'use client'

import { useState, type ReactNode } from 'react'
import { Check, ChevronDown, Loader2 } from 'lucide-react'
import { TypingDots } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { Decision } from '@/models/entities/message'
import { DecisionDetails } from './DecisionDetails'

type Props = {
  steps?: string[]
  decision?: Decision | null
  /** Agent trabalhando agora: o último passo aparece em andamento. */
  live?: boolean
  children?: ReactNode
}

/** Mensagem do assistente: linha de status (o que ele fez), conteúdo e o detalhe da decisão sob demanda. */
export function AgentMessage({ steps = [], decision, live, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex animate-msg-in flex-col items-start gap-1.5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-ink-3">
        <strong className="font-semibold text-ink">Nexo Assist</strong>
        {steps.map((step, i) => {
          const running = live && i === steps.length - 1
          return (
            <span key={step} className={cn('inline-flex items-center gap-[5px]', running && 'text-ink-2')}>
              {running ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              {step}
            </span>
          )
        })}
        {live && steps.length === 0 && <TypingDots />}
        {decision && (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-0.5 rounded font-medium text-primary-text hover:underline"
          >
            {open ? 'Ocultar detalhes' : 'Por quê?'}
            <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
          </button>
        )}
      </div>
      {open && decision && <DecisionDetails decision={decision} />}
      {children}
    </div>
  )
}
