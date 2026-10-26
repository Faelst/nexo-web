import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = { children: ReactNode; inverted?: boolean; className?: string }

export function Kbd({ children, inverted, className }: Props) {
  return (
    <kbd
      className={cn(
        'inline-grid min-w-4 place-items-center rounded-[5px] px-[5px] py-px font-ui text-[11.5px] font-normal',
        inverted ? 'bg-white/15 text-white/80' : 'bg-desk text-ink-3',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
