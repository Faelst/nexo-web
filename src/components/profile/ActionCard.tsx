import type { ReactNode } from 'react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/cn'

type Props = {
  icon: ReactNode
  title: string
  description: string
  action: ReactNode
  helper?: { icon: ReactNode; text: string; success?: boolean }
}

/** Card com ícone, título, descrição, ação à direita e uma faixa de ajuda opcional. */
export function ActionCard({ icon, title, description, action, helper }: Props) {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-4 p-6">
        <span className="grid size-10 flex-none place-items-center rounded-full bg-desk text-ink-2">{icon}</span>
        <div className="flex min-w-[140px] flex-1 flex-col gap-[3px]">
          <h2 className="font-semibold">{title}</h2>
          <p className="text-[13.5px] text-ink-3">{description}</p>
        </div>
        {action}
      </div>
      {helper && (
        <p
          role="status"
          className={cn(
            'flex items-center gap-2 border-t border-rule px-6 py-3 text-[13px]',
            helper.success ? 'bg-success-soft text-success-text' : 'bg-desk text-ink-3',
          )}
        >
          <span className="flex-none">{helper.icon}</span>
          {helper.text}
        </p>
      )}
    </Card>
  )
}
