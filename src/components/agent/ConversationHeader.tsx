import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Avatar, IconButton } from '@/components/ui'
import { avatarColors } from '@/lib/avatar'
import type { Conversation } from '@/models/entities/conversation'

type Props = {
  conversation: Conversation
  onBack: () => void
  actions: ReactNode
}

export function ConversationHeader({ conversation: c, onBack, actions }: Props) {
  const colors = avatarColors(c.employee.name)
  const subtitle = [
    c.employee.online ? 'online' : 'offline',
    c.employee.department,
    c.mode === 'WAITING_HUMAN' ? c.ticketNumber : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <header className="flex h-16 flex-none items-center gap-2 border-b border-rule bg-paper pr-2 pl-2 sm:gap-3 sm:pr-4 sm:pl-5">
      <IconButton label="Voltar para conversas" onClick={onBack} className="lg:hidden">
        <ArrowLeft size={18} />
      </IconButton>
      <Avatar initials={c.employee.initials} size="lg" bg={colors.bg} fg={colors.fg} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <strong className="truncate text-[15.5px] font-semibold">{c.employee.name}</strong>
        <span className="truncate text-[12.5px] text-ink-3">{subtitle}</span>
      </div>
      {actions}
    </header>
  )
}
