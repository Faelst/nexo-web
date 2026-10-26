'use client'

import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  onClose: () => void
  side?: 'left' | 'right'
  /** Classes aplicadas ao container: use breakpoints para desativar o drawer em telas grandes. */
  className?: string
  children: ReactNode
}

/** Painel deslizante para telas pequenas, com overlay e fechamento por Esc. */
export function Drawer({ open, onClose, side = 'left', className, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div className={cn('fixed inset-0 z-40', !open && 'pointer-events-none', className)} aria-hidden={!open}>
      <div
        className={cn('absolute inset-0 bg-ink/40 transition-opacity', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute inset-y-0 flex max-w-[86vw] bg-paper shadow-card transition-transform duration-200',
          side === 'left' ? 'left-0' : 'right-0',
          !open && (side === 'left' ? '-translate-x-full' : 'translate-x-full'),
        )}
      >
        {children}
      </div>
    </div>
  )
}
