import type { ReactNode } from 'react'
import type { Tone } from '@/models/entities/tone'
import { toneStyles } from '@/lib/tone'
import { cn } from '@/lib/cn'
import { StatusDot } from './StatusDot'

type Props = {
  tone: Tone
  children: ReactNode
  /** `tinted` colore o texto com o tom; `muted` usa o cinza padrão. */
  variant?: 'tinted' | 'muted'
  dotSize?: 'sm' | 'md'
  className?: string
}

export function StatusLabel({ tone, children, variant = 'tinted', dotSize = 'sm', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap',
        variant === 'tinted' ? toneStyles[tone].text : 'text-ink-3',
        className,
      )}
    >
      <StatusDot tone={tone} size={dotSize} />
      {children}
    </span>
  )
}
