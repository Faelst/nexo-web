'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { sessionStore, type Session } from '@/lib/api/session-store'
import { authService } from '@/models/services/auth.service'

type SessionState = {
  status: 'loading' | 'authenticated' | 'anonymous'
  session: Session | null
  signIn: (email: string, password: string) => Promise<Session>
  signOut: () => void
}

const SessionContext = createContext<SessionState | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setSession(sessionStore.get())
    setLoaded(true)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await authService.login(email, password)
    setSession(next)
    return next
  }, [])

  const signOut = useCallback(() => {
    authService.logout()
    setSession(null)
  }, [])

  const value = useMemo<SessionState>(
    () => ({ status: !loaded ? 'loading' : session ? 'authenticated' : 'anonymous', session, signIn, signOut }),
    [loaded, session, signIn, signOut],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession precisa estar dentro de <SessionProvider>')
  return ctx
}
