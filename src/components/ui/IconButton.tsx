import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { label: string }

export function IconButton({ label, className, type = 'button', ...props }: Props) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn('grid size-9 flex-none place-items-center rounded-full text-ink-2 hover:bg-desk', className)}
      {...props}
    />
  )
}
