import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon?: ReactNode
  /** Elemento ao lado do rótulo (ex.: link "Esqueci minha senha"). */
  labelAction?: ReactNode
  /** Elemento dentro do campo, à direita (ex.: botão mostrar senha). */
  trailing?: ReactNode
  /** Mensagem de validação exibida abaixo do campo. */
  error?: string
}

export function TextField({ label, icon, labelAction, trailing, error, className, id, ...props }: Props) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-[13.5px] font-medium">
          {label}
        </label>
        {labelAction}
      </div>
      <div
        className={cn(
          'group flex h-11 items-center gap-2.5 rounded-lg border border-control bg-paper pr-2 pl-3.5 text-ink-3 shadow-[0_1px_2px_#1b24310a] transition focus-within:border-cta focus-within:text-primary-text focus-within:ring-[0.5px] focus-within:ring-cta',
          error && 'border-danger focus-within:border-danger focus-within:ring-danger',
        )}
      >
        {icon}
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'h-full min-w-0 flex-1 bg-transparent text-[14.5px] text-ink outline-none placeholder:text-ink-3',
            className,
          )}
          {...props}
        />
        {trailing}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-[12.5px] text-danger-text">
          {error}
        </p>
      )}
    </div>
  )
}
