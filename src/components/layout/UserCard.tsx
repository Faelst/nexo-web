import { Avatar } from '@/components/ui'
import type { User } from '@/models/entities/user'

export function UserCard({ user }: { user: User }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 border-t border-rule px-2 pt-3.5 pb-1">
      <Avatar initials={user.initials} size="sm" />
      <div className="flex min-w-0 flex-col gap-px">
        <strong className="text-[13.5px] font-semibold">{user.name}</strong>
        <span className="truncate text-[11.5px] text-ink-3">{user.email}</span>
      </div>
    </div>
  )
}
