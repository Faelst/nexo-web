import { LogOut, MessageCircle } from 'lucide-react'
import { NexoMark } from '@/components/brand/NexoMark'
import { Avatar, CountBadge, IconButton } from '@/components/ui'
import type { User } from '@/models/entities/user'

export function AgentRail({ analyst, unread, onSignOut }: { analyst: User; unread: number; onSignOut: () => void }) {
  return (
    <nav className="hidden w-16 flex-none flex-col items-center gap-1.5 border-r border-rule bg-desk py-4 md:flex">
      <div className="grid size-10 place-items-center pb-2">
        <NexoMark size={22} />
      </div>
      <button
        type="button"
        aria-label="Conversas"
        className="relative grid size-10 place-items-center rounded-xl bg-paper text-ink shadow-[0_1px_2px_#1b24311a]"
      >
        <MessageCircle size={19} />
        {unread > 0 && <CountBadge count={unread} size="sm" className="absolute top-1 left-6 ring-2 ring-desk" />}
      </button>
      <div className="mt-auto flex flex-col items-center gap-2">
        <IconButton label="Sair" onClick={onSignOut}>
          <LogOut size={17} />
        </IconButton>
        <span title={`${analyst.name} · ${analyst.team ?? ''}`}>
          <Avatar initials={analyst.initials} online ringClassName="ring-desk" />
        </span>
      </div>
    </nav>
  )
}
