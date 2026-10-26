import type { ReactNode } from 'react'
import { ChevronRight, Menu } from 'lucide-react'
import { IconButton } from '@/components/ui'

type Props = {
  root: string
  title: string
  actions?: ReactNode
  onOpenMenu?: () => void
}

export function TopBar({ root, title, actions, onOpenMenu }: Props) {
  return (
    <header className="flex h-16 flex-none items-center gap-4 border-b border-rule px-4 md:px-8">
      {onOpenMenu && (
        <IconButton label="Abrir menu" onClick={onOpenMenu} className="-ml-2 md:hidden">
          <Menu size={18} />
        </IconButton>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-2 text-[13.5px] text-ink-3">
        <span className="hidden truncate sm:inline">{root}</span>
        <ChevronRight size={14} className="hidden flex-none sm:inline" />
        <strong className="truncate font-semibold text-ink">{title}</strong>
      </div>
      {actions}
    </header>
  )
}
