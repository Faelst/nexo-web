import type { ReactNode } from 'react'
import { AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type Props = { children: ReactNode; onDismiss?: () => void; action?: ReactNode; className?: string }

/** Mensagem de erro inline, com ação opcional (ex.: "Tentar de novo"). */
export function Alert({ children, onDismiss, action, className }: Props) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-center gap-2.5 rounded-xl border border-danger/20 bg-danger-soft px-3.5 py-2.5 text-[13.5px] text-danger-text',
        className,
      )}
    >
      <AlertCircle size={16} className="flex-none" />
      <span className="flex-1">{children}</span>
      {action}
      {onDismiss && (
        <button type="button" aria-label="Fechar" onClick={onDismiss} className="rounded p-0.5 hover:bg-danger/10">
          <X size={14} />
        </button>
      )}
    </div>
  )
}
