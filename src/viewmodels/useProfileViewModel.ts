'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import type { User } from '@/models/entities/user'
import { authService } from '@/models/services/auth.service'

export function useProfileViewModel() {
  const { session } = useSession()
  const [user, setUser] = useState<User | null>(session?.user ?? null)
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    authService
      .me()
      .then(setUser)
      .catch((e: Error) => setError(e.message))
  }, [])

  async function requestReset() {
    setResetStatus('sending')
    setError(null)
    try {
      await authService.requestPasswordReset()
      setResetStatus('sent')
    } catch (e) {
      setResetStatus('idle')
      setError(e instanceof Error ? e.message : 'Não foi possível enviar o link.')
    }
  }

  return { user, resetStatus, requestReset, error, dismissError: () => setError(null) }
}

export type ProfileViewModel = ReturnType<typeof useProfileViewModel>
