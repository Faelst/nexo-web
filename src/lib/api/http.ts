import { API_URL } from './config'
import { sessionStore } from './session-store'

/** Erro da API com a mensagem já pronta para exibir (o Nest pode devolver uma lista). */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

type Options = { method?: 'GET' | 'POST'; body?: unknown; auth?: boolean }

export async function http<T>(path: string, { method = 'GET', body, auth = true }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  const token = sessionStore.get()?.token
  if (auth && token) headers.authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua conexão.', 0)
  }

  if (response.status === 401 && auth) {
    sessionStore.clear()
    if (typeof window !== 'undefined') window.location.href = '/login'
  }
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string | string[] }
    const message = Array.isArray(data.message) ? data.message[0] : data.message
    throw new ApiError(message ?? 'Algo deu errado. Tente novamente.', response.status)
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
