import { ClientChatView } from '@/views/ClientChatView'

export const metadata = { title: 'Atendimento · Nexo Assist' }

export default async function ConversaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // `key` reinicia o estado do chat ao trocar de conversa no histórico
  return <ClientChatView key={id} conversationId={id} />
}
