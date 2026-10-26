import { Kbd } from '@/components/ui'
import { cn } from '@/lib/cn'

type Props = {
  label: string
  shortcut?: number
  selected?: boolean
  disabled?: boolean
  onClick: () => void
}

export function OptionButton({ label, shortcut, selected, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-[7px] rounded-lg border border-rule bg-paper px-3 py-[7px] text-[13.5px] leading-tight font-medium transition-colors',
        !disabled && 'hover:border-primary',
        disabled && !selected && 'text-ink-3',
        selected && 'border-primary bg-primary-soft text-primary-text',
      )}
    >
      {shortcut !== undefined && <Kbd>{shortcut}</Kbd>}
      {label}
    </button>
  )
}
