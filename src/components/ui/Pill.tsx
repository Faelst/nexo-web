import type { ReactNode } from 'react'
import type { Tone } from '@/models/entities/tone'
import { toneStyles } from '@/lib/tone'
import { cn } from '@/lib/cn'
import { StatusDot } from './StatusDot'

type Props = {
  tone: Tone
  children: ReactNode
  icon?: ReactNode
  /** Mostra um ponto de status quando não há ícone. */
  dot?: boolean
  className?: string
}

export function Pill({ tone, children, icon, dot, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[7px] rounded-full px-2.5 py-[5px] text-[12.5px] font-semibold whitespace-nowrap',
        toneStyles[tone].soft,
        toneStyles[tone].text,
        className,
      )}
    >
      {icon ?? (dot && <StatusDot tone={tone} size="md" />)}
      {children}
    </span>
  )
}
