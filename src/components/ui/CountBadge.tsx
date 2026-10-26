import { cn } from '@/lib/cn'

type Props = { count: number; size?: 'sm' | 'md'; className?: string }

export function CountBadge({ count, size = 'md', className }: Props) {
  return (
    <span
      className={cn(
        'grid flex-none place-items-center rounded-full bg-cta font-bold text-white',
        size === 'md' ? 'h-5 min-w-5 px-1.5 text-[11.5px]' : 'h-4 min-w-4 px-[5px] text-[10px]',
        className,
      )}
    >
      {count}
    </span>
  )
}
