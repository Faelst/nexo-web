import { LogOut, MessageSquare, UserRound } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import type { User } from '@/models/entities/user'
import { ConversationHistory } from './ConversationHistory'
import { NavItem } from './NavItem'
import { UserCard } from './UserCard'

export const clientNav = [
  { href: '/atendimento', label: 'Atendimento', icon: MessageSquare },
  { href: '/perfil', label: 'Meu perfil', icon: UserRound },
]

type Props = {
  user: User
  activeHref: string
  onNavigate?: () => void
  onSignOut: () => void
}

export function Sidebar({ user, activeHref, onNavigate, onSignOut }: Props) {
  return (
    <aside className="flex h-full w-[248px] flex-none flex-col border-r border-rule bg-paper px-3.5 pt-5 pb-3.5">
      <Logo className="px-2" />
      <nav className="mt-[22px] flex flex-col gap-0.5">
        {clientNav.map((item) => (
          <NavItem key={item.href} {...item} active={activeHref === item.href} onClick={onNavigate} />
        ))}
      </nav>
      <ConversationHistory onNavigate={onNavigate} />
      <UserCard user={user} />
      <NavItem icon={LogOut} label="Sair" onClick={onSignOut} />
    </aside>
  )
}
