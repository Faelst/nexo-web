import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-cta font-semibold text-white hover:bg-cta-hover',
  secondary: 'border border-control bg-paper text-ink-2 shadow-control hover:bg-desk',
  ghost: 'text-ink-2 hover:bg-desk',
  danger: 'bg-danger-soft font-semibold text-danger-text hover:bg-danger/15',
}

const sizes: Record<Size, string> = {
  md: 'h-9 px-3.5 text-[13.5px]',
  lg: 'h-11 px-4 text-[15.5px]',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export function Button({ variant = 'secondary', size = 'md', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-[7px] rounded-lg font-medium whitespace-nowrap transition-colors disabled:cursor-default disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
