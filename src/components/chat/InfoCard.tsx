import type { ReactNode } from 'react'
import { Card, StatusLabel } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { TicketField } from '@/models/entities/ticket'
import type { Tone } from '@/models/entities/tone'
import { FieldValue } from './FieldValue'

/** Card rico usado no chat (rascunho de chamado, detalhes do chamado). Composto por partes reutilizáveis. */
export function InfoCard({ muted, children }: { muted?: boolean; children: ReactNode }) {
  return <Card className={cn('w-full animate-msg-in', muted && 'opacity-60')}>{children}</Card>
}

type HeaderProps = {
  kind: string
  reference: string
  status: { label: string; tone: Tone }
  children: ReactNode
}

function Header({ kind, reference, status, children }: HeaderProps) {
  return (
    <div className="flex flex-col gap-1.5 px-[18px] pt-4 pb-3.5">
      <div className="flex flex-wrap items-center gap-2 pb-0.5 text-[12.5px] text-ink-3">
        <span className="font-medium">{kind}</span>
        <span className="size-[3px] rounded-full bg-rule" />
        <span>{reference}</span>
        <StatusLabel tone={status.tone} className="ml-auto font-medium">
          {status.label}
        </StatusLabel>
      </div>
      {children}
    </div>
  )
}

function Title({ children }: { children: ReactNode }) {
  return <h3 className="text-lg leading-tight font-semibold tracking-[-0.2px]">{children}</h3>
}

function Description({ children }: { children: ReactNode }) {
  return <p className="text-[13.5px] leading-normal text-ink-2">{children}</p>
}

function Fields({ fields }: { fields: TicketField[] }) {
  return (
    <dl className="mx-[18px] mb-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-rule pt-3 sm:grid-flow-col sm:grid-cols-none sm:auto-cols-fr">
      {fields.map((field) => (
        <div key={field.label} className="flex min-w-0 flex-col gap-1">
          <dt className="text-[12.5px] text-ink-3">{field.label}</dt>
          <dd>
            <FieldValue field={field} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Actions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 border-t border-rule bg-desk py-2 pr-3.5 pl-2">{children}</div>
  )
}

InfoCard.Header = Header
InfoCard.Title = Title
InfoCard.Description = Description
InfoCard.Fields = Fields
InfoCard.Actions = Actions
