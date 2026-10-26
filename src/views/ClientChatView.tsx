'use client'

import { AgentBubble } from '@/components/chat/AgentBubble'
import { AgentMessage } from '@/components/chat/AgentMessage'
import { ChatComposer } from '@/components/chat/ChatComposer'
import { ChatEmptyState } from '@/components/chat/ChatEmptyState'
import { ConversationModeBanner } from '@/components/chat/ConversationModeBanner'
import { DraftTicketCard } from '@/components/chat/DraftTicketCard'
import { StaffBubble } from '@/components/chat/StaffBubble'
import { SystemNotice } from '@/components/chat/SystemNotice'
import { TicketCard } from '@/components/chat/TicketCard'
import { TicketSelector } from '@/components/chat/TicketSelector'
import { UserBubble } from '@/components/chat/UserBubble'
import { Alert, Button, Spinner } from '@/components/ui'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { useHotkey } from '@/hooks/useHotkey'
import { useSession } from '@/hooks/useSession'
import type { Message } from '@/models/entities/message'
import { useClientChatViewModel, type ClientChatViewModel } from '@/viewmodels/useClientChatViewModel'

export function ClientChatView({ conversationId }: { conversationId?: string }) {
  const vm = useClientChatViewModel(conversationId)
  const { session } = useSession()
  const scrollRef = useAutoScroll<HTMLDivElement>(`${vm.messages.length}-${vm.agent.steps.length}-${vm.agent.thinking}`)

  useInteractiveHotkeys(vm)

  if (vm.load.status === 'loading') {
    return (
      <div className="grid flex-1 place-items-center text-ink-3">
        <Spinner className="size-6" label="Carregando conversa" />
      </div>
    )
  }

  if (vm.load.status === 'error') {
    return (
      <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center px-4">
        <Alert
          action={
            <Button size="md" onClick={vm.reload}>
              Tentar de novo
            </Button>
          }
        >
          {vm.load.message}
        </Alert>
      </div>
    )
  }

  const empty = vm.messages.length === 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {empty ? (
          <div className="my-auto">
            <ChatEmptyState name={session?.user.name ?? ''} onPick={(t) => void vm.send(t)} disabled={vm.sending} />
          </div>
        ) : (
          <div className="mx-auto mt-auto flex w-full max-w-[856px] flex-col gap-5 px-4 pt-7 pb-1 sm:px-6">
            {vm.messages.map((message) => (
              <ChatMessage key={message.id} message={message} vm={vm} />
            ))}
            {vm.agent.thinking && <AgentMessage live steps={vm.agent.steps} />}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 px-4 pt-2 sm:px-6">
        {vm.conversation && <ConversationModeBanner conversation={vm.conversation} onNew={() => void vm.startNew()} />}
        {vm.limitReached && !vm.closed && (
          <div className="mx-auto flex w-full max-w-[808px] items-center gap-2.5 rounded-xl bg-desk px-3.5 py-2.5 text-[13.5px] text-ink-2">
            <span className="flex-1">Você atingiu o limite de {vm.maxMessages} mensagens desta sessão.</span>
            <Button variant="primary" onClick={() => void vm.startNew()}>
              Nova conversa
            </Button>
          </div>
        )}
        {vm.error && (
          <Alert className="mx-auto w-full max-w-[808px]" onDismiss={vm.dismissError}>
            {vm.error}
          </Alert>
        )}
      </div>

      <ChatComposer
        onSend={vm.send}
        sending={vm.sending}
        disabled={vm.limitReached || vm.closed}
        disabledReason={vm.closed ? 'Atendimento encerrado' : 'Limite de mensagens desta sessão atingido'}
        used={vm.used}
        max={vm.maxMessages}
      />
    </div>
  )
}

function ChatMessage({ message, vm }: { message: Message; vm: ClientChatViewModel }) {
  switch (message.role) {
    case 'USER':
      return <UserBubble text={message.content} />
    case 'SYSTEM':
      return <SystemNotice text={message.content} />
    case 'ANALYST':
      return <StaffBubble name={message.author?.name ?? 'Analista'} team={message.author?.team ?? null} text={message.content} />
    case 'AGENT':
      return <AgentReply message={message} vm={vm} />
  }
}

function AgentReply({ message, vm }: { message: Message; vm: ClientChatViewModel }) {
  const interactive = vm.interactiveId === message.id
  const answer = vm.answers[message.id]
  const options = message.parts.find((p) => p.type === 'options')

  return (
    <AgentMessage steps={message.decision?.steps} decision={message.decision}>
      {message.parts.map((part, i) => {
        switch (part.type) {
          case 'ticket-select':
            return (
              <TicketSelector
                key={i}
                tickets={part.tickets}
                selected={answer?.split(' · ')[0]}
                disabled={!interactive}
                onSelect={(t) => void vm.selectTicket(t)}
              />
            )
          case 'ticket':
            return <TicketCard key={i} ticket={part.ticket} />
          case 'draft':
            return (
              <DraftTicketCard
                key={part.draftId}
                draft={part}
                busy={vm.busyDraft === part.draftId}
                onConfirm={(edits) => void vm.confirmDraft(part.draftId, edits)}
                onCancel={() => void vm.cancelDraft(part.draftId)}
              />
            )
          default:
            return null
        }
      })}
      {(message.content || options) && (
        <AgentBubble
          text={message.content}
          question={options?.type === 'options' ? options.question : undefined}
          options={options?.type === 'options' ? options.options : undefined}
          numbered={interactive}
          selected={answer}
          disabled={!interactive}
          onChoose={(option) => void vm.send(option)}
        />
      )}
    </AgentMessage>
  )
}

/** Atalhos da última mensagem: 1–4 escolhem a opção; ⌘/Ctrl+Enter confirma o rascunho pendente. */
function useInteractiveHotkeys(vm: ClientChatViewModel) {
  const message = vm.messages.find((m) => m.id === vm.interactiveId)
  const options = message?.parts.find((p) => p.type === 'options')
  const draft = message?.parts.find((p) => p.type === 'draft' && p.status === 'PENDING')

  useHotkey(
    (e) => {
      if (draft?.type === 'draft' && (e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        void vm.confirmDraft(draft.draftId)
        return
      }
      if (options?.type === 'options' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const option = options.options[Number(e.key) - 1]
        if (option) void vm.send(option)
      }
    },
    !!message && (!!options || !!draft) && !vm.busyDraft,
  )
}
