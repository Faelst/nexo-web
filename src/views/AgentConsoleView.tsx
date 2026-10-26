'use client'

import { Bot, CircleCheckBig, PanelRightOpen } from 'lucide-react'
import { AgentRail } from '@/components/agent/AgentRail'
import { ConversationHeader } from '@/components/agent/ConversationHeader'
import { ConversationList } from '@/components/agent/ConversationList'
import { ReplyComposer } from '@/components/agent/ReplyComposer'
import { TakeoverBar } from '@/components/agent/TakeoverBar'
import { Thread } from '@/components/agent/Thread'
import { TicketHistoryPanel } from '@/components/agent/TicketHistoryPanel'
import { Alert, Button, Drawer, IconButton, Pill, Spinner } from '@/components/ui'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { cn } from '@/lib/cn'
import type { ConversationMode } from '@/models/entities/conversation'
import type { Tone } from '@/models/entities/tone'
import { useAgentConsoleViewModel } from '@/viewmodels/useAgentConsoleViewModel'

const modePill: Record<Exclude<ConversationMode, 'HUMAN'>, { tone: Tone; label: string }> = {
  WAITING_HUMAN: { tone: 'warning', label: 'Aguardando atendente' },
  AGENT: { tone: 'success', label: 'Agent atendendo' },
  CLOSED: { tone: 'neutral', label: 'Encerrada' },
}

export function AgentConsoleView() {
  const vm = useAgentConsoleViewModel()
  const detail = vm.detail?.status === 'ready' ? vm.detail.data : null
  const thinking = vm.selectedId ? vm.thinking[vm.selectedId] : undefined
  const scrollRef = useAutoScroll<HTMLDivElement>(`${vm.selectedId}-${detail?.messages.length}-${String(thinking)}`)

  const panel = vm.selected && (
    <TicketHistoryPanel
      ownerName={vm.selected.employee.name}
      state={vm.tickets}
      currentNumber={vm.selected.ticketNumber}
      assumedBy={vm.selected.mode === 'HUMAN' ? vm.selected.analyst?.name : undefined}
      onClose={vm.closeHistory}
    />
  )

  return (
    <div className="flex h-dvh overflow-hidden">
      <AgentRail analyst={vm.me} unread={vm.unreadTotal} onSignOut={vm.signOut} />

      {/* Lista: sempre visível no desktop; no celular só quando nenhuma conversa está aberta */}
      <ConversationList
        className={cn(
          'w-full flex-col border-r border-rule lg:flex lg:w-[340px] lg:flex-none xl:w-[380px]',
          vm.mobilePane === 'list' ? 'flex' : 'hidden',
        )}
        state={vm.list.status}
        errorMessage={vm.list.status === 'error' ? vm.list.message : undefined}
        onRetry={vm.reloadList}
        conversations={vm.conversations}
        meId={vm.me.id}
        selectedId={vm.selectedId}
        thinking={vm.thinking}
        onSelect={vm.select}
        filters={vm.filters}
        filter={vm.filter}
        onFilterChange={vm.setFilter}
        query={vm.query}
        onQueryChange={vm.setQuery}
      />

      <main
        className={cn('min-w-0 flex-1 flex-col bg-canvas lg:flex', vm.mobilePane === 'conversation' ? 'flex' : 'hidden')}
      >
        {!vm.detail && (
          <div className="grid flex-1 place-items-center px-6 text-center text-ink-3">
            Selecione uma conversa para ver o histórico e atender.
          </div>
        )}
        {vm.detail?.status === 'loading' && (
          <div className="grid flex-1 place-items-center text-ink-3">
            <Spinner className="size-6" />
          </div>
        )}
        {vm.detail?.status === 'error' && (
          <div className="p-6">
            <Alert action={<Button onClick={vm.retryDetail}>Tentar de novo</Button>}>{vm.detail.message}</Alert>
          </div>
        )}

        {detail && vm.selected && (
          <>
            <ConversationHeader
              conversation={vm.selected}
              onBack={vm.backToList}
              actions={
                <>
                  {vm.assignedToMe ? (
                    <>
                      <Button className="gap-1.5 pr-3 pl-2.5 shadow-none" disabled={!!vm.busy} onClick={vm.release}>
                        {vm.busy === 'release' ? <Spinner className="size-3.5" /> : <Bot size={14} />}
                        <span className="hidden sm:inline">Devolver ao agent</span>
                      </Button>
                      <Button variant="danger" className="gap-1.5 pr-3 pl-2.5" disabled={!!vm.busy} onClick={vm.close}>
                        {vm.busy === 'close' ? <Spinner className="size-3.5" /> : <CircleCheckBig size={14} />}
                        <span className="hidden sm:inline">Encerrar atendimento</span>
                      </Button>
                    </>
                  ) : (
                    vm.selected.mode !== 'HUMAN' && (
                      <Pill
                        tone={modePill[vm.selected.mode].tone}
                        icon={vm.selected.mode === 'CLOSED' ? <CircleCheckBig size={14} /> : <Bot size={14} />}
                        className="hidden px-[11px] py-1.5 sm:inline-flex"
                      >
                        {modePill[vm.selected.mode].label}
                      </Pill>
                    )
                  )}
                  <IconButton
                    label="Mostrar chamados"
                    onClick={() => vm.openHistory(window.matchMedia('(min-width: 1280px)').matches)}
                    className={cn(vm.historyOpen && 'xl:hidden')}
                  >
                    <PanelRightOpen size={18} />
                  </IconButton>
                </>
              }
            />

            <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <Thread messages={detail.messages} thinking={thinking} />
            </div>

            {vm.error && (
              <div className="bg-paper px-4 pt-3 sm:px-5">
                <Alert onDismiss={vm.dismissError}>{vm.error}</Alert>
              </div>
            )}

            {vm.assignedToMe ? (
              <ReplyComposer
                key={vm.selected.id}
                onSend={vm.send}
                sending={vm.busy === 'send'}
                placeholder={`Escreva para ${vm.selected.employee.name.split(' ')[0]}…`}
              />
            ) : (
              <TakeoverBar conversation={vm.selected} busy={vm.busy} onAssume={vm.assume} onGiveBack={vm.release} />
            )}
          </>
        )}
      </main>

      {/* Painel de chamados: coluna fixa em telas largas, drawer abaixo de xl */}
      {panel && vm.historyOpen && <div className="hidden xl:flex">{panel}</div>}
      <Drawer side="right" open={!!panel && vm.historyDrawerOpen} onClose={vm.closeHistory} className="xl:hidden">
        {panel}
      </Drawer>
    </div>
  )
}
