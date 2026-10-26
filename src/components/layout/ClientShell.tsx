'use client'

import { useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Drawer, Pill } from '@/components/ui'
import { ConversationHistoryProvider } from '@/hooks/useConversationHistory'
import { useSession } from '@/hooks/useSession'
import { Sidebar, clientNav } from './Sidebar'
import { TopBar } from './TopBar'

/** Layout das telas do funcionário: sidebar fixa no desktop e drawer no celular. Requer sessão. */
export function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { session, signOut: endSession } = useSession()
  const user = session!.user

  const active = clientNav.find((item) => pathname.startsWith(item.href)) ?? clientNav[0]
  const signOut = () => {
    endSession()
    router.replace('/login')
  }

  return (
    <ConversationHistoryProvider>
      <div className="flex h-dvh overflow-hidden">
        <div className="hidden md:flex">
          <Sidebar user={user} activeHref={active.href} onSignOut={signOut} />
        </div>
        <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} className="md:hidden">
          <Sidebar user={user} activeHref={active.href} onNavigate={() => setMenuOpen(false)} onSignOut={signOut} />
        </Drawer>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            root="Service desk de TI"
            title={active.label}
            onOpenMenu={() => setMenuOpen(true)}
            actions={
              active.href === '/atendimento' && (
                <Pill tone="success" dot>
                  Assistente online
                </Pill>
              )
            }
          />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </div>
    </ConversationHistoryProvider>
  )
}
