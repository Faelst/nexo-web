import { Hand, Headset, CircleCheckBig } from 'lucide-react'
import { Button } from '@/components/ui'
import type { Conversation } from '@/models/entities/conversation'

/** Aviso do estado da conversa para o funcionário quando ela não está com o agent. */
export function ConversationModeBanner({ conversation, onNew }: { conversation: Conversation; onNew: () => void }) {
  if (conversation.mode === 'AGENT') return null

  const content = {
    WAITING_HUMAN: {
      icon: <Hand size={16} />,
      box: 'bg-warning-soft text-warning-text',
      text: 'Sua conversa foi transferida para um analista do Suporte N2. Ele vai responder por aqui; o assistente fica pausado.',
    },
    HUMAN: {
      icon: <Headset size={16} />,
      box: 'bg-success-soft text-success-text',
      text: `${conversation.analyst?.name ?? 'Um analista'} está atendendo você.`,
    },
    CLOSED: {
      icon: <CircleCheckBig size={16} />,
      box: 'bg-desk text-ink-2',
      text: 'Este atendimento foi encerrado.',
    },
  }[conversation.mode]

  return (
    <div className={`mx-auto flex w-full max-w-[808px] items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] ${content.box}`}>
      <span className="flex-none">{content.icon}</span>
      <span className="flex-1">{content.text}</span>
      {conversation.mode === 'CLOSED' && (
        <Button variant="primary" onClick={onNew}>
          Nova conversa
        </Button>
      )}
    </div>
  )
}
