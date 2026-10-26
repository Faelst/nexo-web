import { http } from '@/lib/api/http'
import { disconnectSocket } from '@/lib/api/socket'
import { sessionStore, type Session } from '@/lib/api/session-store'
import type { User } from '../entities/user'

export const authService = {
  async login(email: string, password: string): Promise<Session> {
    const { accessToken, user } = await http<{ accessToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    })
    const session = { token: accessToken, user }
    sessionStore.set(session)
    return session
  },
  me: () => http<User>('/auth/me'),
  requestPasswordReset: () => http<{ sentTo: string }>('/auth/password-reset', { method: 'POST' }),
  logout() {
    sessionStore.clear()
    disconnectSocket()
  },
}
