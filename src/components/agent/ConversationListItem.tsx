import { Avatar, CountBadge, StatusLabel } from '@/components/ui'
import { avatarColors } from '@/lib/avatar'
import { cn } from '@/lib/cn'
import { formatListTime } from '@/lib/format'
import type { Conversation } from '@/models/entities/conversation'
import { conversationTag } from './conversation-tag'

type Props = {
  conversation: Conversation
  meId: string
  active: boolean
  /** Passo atual do agent nesta conversa, se ele estiver trabalhando. */
  thinking?: string | true
  onClick: () => void
}

const PREFIX: Record<string, string> = { AGENT: 'Nexo: ', ANALYST: 'Analista: ', SYSTEM: '' }

export function ConversationListItem({ conversation: c, meId, active, thinking, onClick }: Props) {
  const unread = !active && c.unreadForAnalyst > 0
  const tag = conversationTag(c, meId)
  const colors = avatarColors(c.employee.name)
  const preview = thinking
    ? typeof thinking === 'string'
      ? `Nexo ${thinking}…`
      : 'Nexo digitando…'
    : c.lastMessage
      ? `${PREFIX[c.lastMessage.role] ?? ''}${c.lastMessage.content}`
      : 'Sem mensagens'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active || undefined}
      className={cn('flex w-full items-center gap-3 rounded-xl p-2.5 text-left', active ? 'bg-desk' : 'hover:bg-desk/60')}
    >
      <Avatar
        initials={c.employee.initials}
        size="xl"
        bg={colors.bg}
        fg={colors.fg}
        online={c.employee.online}
        ringClassName={active ? 'ring-desk' : 'ring-paper'}
      />
      <span
        className={cn('flex min-w-0 flex-1 flex-col gap-[3px] border-b pb-2.5', active ? 'border-transparent' : 'border-rule')}
      >
        <span className="flex items-center gap-2">
          <span className={cn('flex-1 truncate text-[15.5px]', unread ? 'font-semibold' : 'font-medium')}>
            {c.employee.name}
          </span>
          <span className={cn('text-[12.5px]', unread ? 'font-semibold text-cta' : 'text-ink-3')}>
            {formatListTime(c.lastMessageAt)}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className={cn('flex-1 truncate text-[13.5px]', thinking ? 'text-success-text italic' : 'text-ink-3')}>
            {preview}
          </span>
          {unread && <CountBadge count={c.unreadForAnalyst} />}
        </span>
        <StatusLabel tone={tag.tone} variant={tag.tinted ? 'tinted' : 'muted'} className="text-[11.5px] font-medium">
          {tag.label}
        </StatusLabel>
      </span>
    </button>
  )
}
