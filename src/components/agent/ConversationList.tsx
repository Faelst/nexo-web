import { Alert, Button, FilterChip, Pill, SearchInput, Spinner } from '@/components/ui'
import type { Conversation, ConversationFilter } from '@/models/entities/conversation'
import { ConversationListItem } from './ConversationListItem'

type Props = {
  state: 'loading' | 'error' | 'ready'
  errorMessage?: string
  onRetry: () => void
  conversations: Conversation[]
  meId: string
  selectedId: string | null
  thinking: Record<string, string | true>
  onSelect: (id: string) => void
  filters: { id: ConversationFilter; label: string; count?: number }[]
  filter: ConversationFilter
  onFilterChange: (f: ConversationFilter) => void
  query: string
  onQueryChange: (q: string) => void
  className?: string
}

export function ConversationList(props: Props) {
  const { conversations, filters, filter, query } = props

  return (
    <aside className={props.className}>
      <header className="flex flex-col gap-3 px-4 pt-4 pb-2.5">
        <div className="flex items-center gap-2">
          <h1 className="flex-1 text-xl font-bold tracking-[-0.3px]">Conversas</h1>
          <Pill tone="success" dot>
            Disponível
          </Pill>
        </div>
        <SearchInput
          value={query}
          onChange={(e) => props.onQueryChange(e.target.value)}
          placeholder="Pesquisar conversa ou chamado"
          aria-label="Pesquisar conversa ou chamado"
        />
        <div role="tablist" className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <FilterChip
              key={f.id}
              label={f.label}
              count={f.count}
              active={filter === f.id}
              onClick={() => props.onFilterChange(f.id)}
            />
          ))}
        </div>
      </header>

      {props.state === 'loading' && (
        <div className="grid flex-1 place-items-center text-ink-3">
          <Spinner className="size-5" />
        </div>
      )}
      {props.state === 'error' && (
        <div className="p-4">
          <Alert action={<Button onClick={props.onRetry}>Tentar de novo</Button>}>{props.errorMessage}</Alert>
        </div>
      )}
      {props.state === 'ready' && (
        <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {conversations.map((c) => (
            <li key={c.id}>
              <ConversationListItem
                conversation={c}
                meId={props.meId}
                active={c.id === props.selectedId}
                thinking={props.thinking[c.id]}
                onClick={() => props.onSelect(c.id)}
              />
            </li>
          ))}
          {conversations.length === 0 && (
            <li className="px-4 py-8 text-center text-[13.5px] text-ink-3">Nenhuma conversa neste filtro.</li>
          )}
        </ul>
      )}
    </aside>
  )
}
