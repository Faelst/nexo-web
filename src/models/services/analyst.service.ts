import { http } from '@/lib/api/http'
import type { Conversation } from '../entities/conversation'
import type { Message } from '../entities/message'
import type { EmployeeTickets } from '../entities/ticket'

export const analystService = {
  list: () => http<Conversation[]>('/analyst/conversations'),
  get: (id: string) => http<{ conversation: Conversation; messages: Message[] }>(`/analyst/conversations/${id}`),
  markRead: (id: string) => http<void>(`/analyst/conversations/${id}/read`, { method: 'POST' }),
  assume: (id: string) => http<Conversation>(`/analyst/conversations/${id}/assume`, { method: 'POST' }),
  release: (id: string) => http<Conversation>(`/analyst/conversations/${id}/release`, { method: 'POST' }),
  close: (id: string) => http<Conversation>(`/analyst/conversations/${id}/close`, { method: 'POST' }),
  send: (id: string, text: string) =>
    http<Message>(`/analyst/conversations/${id}/messages`, { method: 'POST', body: { text } }),
  employeeTickets: (employeeId: string) => http<EmployeeTickets>(`/analyst/employees/${employeeId}/tickets`),
}
