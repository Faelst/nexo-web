import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}

export function Checkbox({ checked, onChange, children }: Props) {
  return (
    <label className="flex cursor-pointer items-center gap-[9px] pt-0.5 text-[13.5px] text-ink-2">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="grid size-[18px] place-items-center rounded-md border-[1.5px] border-ink/20 text-white peer-checked:border-cta peer-checked:bg-cta peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cta">
        {checked && <Check size={12} strokeWidth={3} />}
      </span>
      {children}
    </label>
  )
}
