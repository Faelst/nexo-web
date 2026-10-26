import type { Conversation } from '@/models/entities/conversation'
import type { Tone } from '@/models/entities/tone'

/** Etiqueta de estado de uma conversa no console (texto + tom), derivada do modo e do motivo. */
export function conversationTag(c: Conversation, meId: string): { label: string; tone: Tone; tinted: boolean } {
  switch (c.mode) {
    case 'WAITING_HUMAN':
      if (c.handoffReason === 'BAIXA_CONFIANCA') {
        const pct = c.lastConfidence !== null ? ` · confiança ${Math.round(c.lastConfidence * 100)}%` : ''
        return { label: `Agent pediu ajuda${pct}`, tone: 'warning', tinted: true }
      }
      return { label: `Transferida${c.ticketNumber ? ` · ${c.ticketNumber}` : ''}`, tone: 'danger', tinted: true }
    case 'HUMAN':
      return c.analyst?.id === meId
        ? { label: 'Você está atendendo', tone: 'cta', tinted: true }
        : { label: `Com ${c.analyst?.name ?? 'analista'}`, tone: 'primary', tinted: false }
    case 'AGENT':
      return { label: 'Agent atendendo', tone: 'success', tinted: false }
    case 'CLOSED':
      return { label: 'Encerrada', tone: 'neutral', tinted: false }
  }
}

export const HANDOFF_LABEL = {
  PEDIDO_USUARIO: 'a pedido do funcionário',
  CRITICO: 'caso crítico',
  VENCIDO: 'chamado vencido',
  BAIXA_CONFIANCA: 'o agent não teve segurança',
} as const
