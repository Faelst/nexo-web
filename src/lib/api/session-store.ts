import type { User } from '@/models/entities/user'

export type Session = { token: string; user: User }

const KEY = 'nexo.session'

/** Persistência da sessão no navegador (token JWT + dados do usuário). */
export const sessionStore = {
  get(): Session | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(KEY)
      return raw ? (JSON.parse(raw) as Session) : null
    } catch {
      return null
    }
  },
  set(session: Session) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(session))
    } catch {
      /* armazenamento indisponível: a sessão vale só enquanto a aba estiver aberta */
    }
  },
  clear() {
    try {
      window.localStorage.removeItem(KEY)
    } catch {
      /* ignora */
    }
  },
}
