'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui'
import { useSession } from '@/hooks/useSession'
import type { Role } from '@/models/entities/user'

export const homeFor = (role: Role) => (role === 'ANALYST' ? '/atendente' : '/atendimento')

/** Protege uma área por papel: sem sessão vai para o login; papel errado vai para a área certa. */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { status, session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'anonymous') router.replace('/login')
    else if (status === 'authenticated' && session!.user.role !== role) router.replace(homeFor(session!.user.role))
  }, [status, session, role, router])

  if (status !== 'authenticated' || session!.user.role !== role) {
    return (
      <div className="grid h-dvh place-items-center text-ink-3">
        <Spinner className="size-6" />
      </div>
    )
  }
  return <>{children}</>
}
