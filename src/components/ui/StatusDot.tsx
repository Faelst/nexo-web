import type { Tone } from '@/models/entities/tone'
import { toneStyles } from '@/lib/tone'
import { cn } from '@/lib/cn'

type Props = { tone: Tone; size?: 'sm' | 'md'; pulse?: boolean; className?: string }

export function StatusDot({ tone, size = 'sm', pulse, className }: Props) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block flex-none rounded-full',
        size === 'sm' ? 'size-1.5' : 'size-[7px]',
        toneStyles[tone].dot,
        pulse && 'animate-live',
        className,
      )}
    />
  )
}
