import { cn } from '@/lib/cn'
import { NexoMark } from './NexoMark'

type Props = { inverted?: boolean; className?: string }

export function Logo({ inverted, className }: Props) {
  return (
    <span className={cn('flex items-center gap-2.5 text-base font-bold tracking-[-0.2px]', inverted && 'text-white', className)}>
      <NexoMark size={inverted ? 24 : 20} color={inverted ? '#fff' : undefined} />
      Nexo Assist
    </span>
  )
}
