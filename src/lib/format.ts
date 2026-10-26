const TZ = 'America/Sao_Paulo'

/** "10:05" */
export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: TZ })

/** "16 out" */
export const formatShortDate = (iso: string) =>
  new Date(iso)
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: TZ })
    .replace(' de ', ' ')
    .replace('.', '')

/** "16 out, 14:20" */
export const formatDateTime = (iso: string) => `${formatShortDate(iso)}, ${formatTime(iso)}`

const dayKey = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { timeZone: TZ })

/** "Hoje", "Ontem" ou "16 out" — para separadores de dia. */
export function formatDay(iso: string, now = new Date()) {
  const yesterday = new Date(now.getTime() - 86_400_000)
  if (dayKey(iso) === dayKey(now.toISOString())) return 'Hoje'
  if (dayKey(iso) === dayKey(yesterday.toISOString())) return 'Ontem'
  return formatShortDate(iso)
}

export const isSameDay = (a: string, b: string) => dayKey(a) === dayKey(b)

/** Horário para listas: "10:05" hoje, "ontem" ou "16 out". */
export function formatListTime(iso: string, now = new Date()) {
  const day = formatDay(iso, now)
  return day === 'Hoje' ? formatTime(iso) : day === 'Ontem' ? 'ontem' : day
}

/** "há 5 dias", "há 3 h", "agora" */
export function formatRelative(iso: string, now = new Date()) {
  const minutes = Math.round((now.getTime() - new Date(iso).getTime()) / 60_000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `há ${hours} h`
  const days = Math.round(hours / 24)
  return days === 1 ? 'há 1 dia' : `há ${days} dias`
}
