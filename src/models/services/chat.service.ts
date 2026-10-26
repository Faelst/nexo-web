import { http } from '@/lib/api/http'
import { emitWithAck } from '@/lib/api/socket'
import type { Conversation } from '../entities/conversation'
import type { Message } from '../entities/message'
import type { Ticket } from '../entities/ticket'

export type ChatSnapshot = { conversation: Conversation; messages: Message[]; maxMessages: number }

/** Chat do funcionário: leitura via REST, ações via Socket.IO (com ack). */
export const chatService = {
  current: () => http<ChatSnapshot>('/chat/current'),
  /** Histórico de conversas do funcionário (as que têm mensagens). */
  list: () => http<Conversation[]>('/chat/conversations'),
  open: (conversationId: string) => http<ChatSnapshot>(`/chat/conversations/${conversationId}`),
  startNew: () => http<ChatSnapshot>('/chat/conversations', { method: 'POST' }),
  send: (conversationId: string, text: string) => emitWithAck<Message>('chat:send', { conversationId, text }),
  confirmDraft: (draftId: string, edits?: { title?: string; description?: string }) =>
    emitWithAck<Ticket>('draft:confirm', { draftId, ...edits }),
  cancelDraft: (draftId: string) => emitWithAck<void>('draft:cancel', { draftId }),
}
