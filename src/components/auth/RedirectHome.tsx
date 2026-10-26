'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui'
import { useSession } from '@/hooks/useSession'
import { homeFor } from './RequireRole'

/** Rota raiz: sem sessão vai para o login; com sessão, para a área do papel (chat ou painel do atendente). */
export function RedirectHome() {
  const { status, session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'anonymous') router.replace('/login')
    else if (status === 'authenticated') router.replace(homeFor(session!.user.role))
  }, [status, session, router])

  return (
    <div className="grid h-dvh place-items-center text-ink-3">
      <Spinner className="size-6" />
    </div>
  )
}
