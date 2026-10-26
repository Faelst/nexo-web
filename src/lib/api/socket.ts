import { io, type Socket } from 'socket.io-client'
import { API_URL } from './config'
import { sessionStore } from './session-store'

let socket: Socket | null = null
let socketToken: string | null = null

/** Socket único por sessão, autenticado com o JWT no handshake. */
export function getSocket(): Socket {
  const token = sessionStore.get()?.token ?? null
  if (socket && socketToken === token) return socket
  socket?.disconnect()
  socketToken = token
  socket = io(API_URL, { auth: { token }, transports: ['websocket'] })
  socket.on('auth:error', () => {
    sessionStore.clear()
    window.location.href = '/login'
  })
  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
  socketToken = null
}

export type Ack<T> = { ok: true; data: T } | { ok: false; error: string }

/** Emite um evento e transforma o ack de erro em exceção. */
export async function emitWithAck<T>(event: string, payload: unknown): Promise<T> {
  const response = (await getSocket().timeout(15_000).emitWithAck(event, payload)) as Ack<T>
  if (!response.ok) throw new Error(response.error)
  return response.data
}
