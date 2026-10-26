import { cn } from '@/lib/cn'

/** Indicador visual de rádio; o estado acessível fica no elemento pai (role="radio"). */
export function RadioMark({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'size-4 flex-none rounded-full transition-shadow',
        checked ? 'shadow-[inset_0_0_0_5px_var(--color-cta)]' : 'shadow-[inset_0_0_0_1.5px_#1b243133]',
      )}
    />
  )
}
