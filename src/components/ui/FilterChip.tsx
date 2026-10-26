import { cn } from '@/lib/cn'

type Props = {
  label: string
  count?: number
  active: boolean
  onClick: () => void
}

export function FilterChip({ label, count, active, onClick }: Props) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-[9px] py-1.5 text-[12.5px] font-medium',
        active ? 'bg-primary-soft text-primary-text' : 'bg-desk text-ink-2 hover:bg-rule',
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn('font-semibold', active ? 'text-primary-text' : 'text-ink-3')}>{count}</span>
      )}
    </button>
  )
}
