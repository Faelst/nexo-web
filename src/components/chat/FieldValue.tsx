import { StatusDot } from '@/components/ui'
import { toneStyles } from '@/lib/tone'
import { cn } from '@/lib/cn'
import type { TicketField } from '@/models/entities/ticket'

export function FieldValue({ field }: { field: TicketField }) {
  return (
    <span className={cn('flex flex-wrap items-center gap-1.5 font-medium', field.tone && toneStyles[field.tone].text)}>
      {field.dot && <StatusDot tone={field.dot} />}
      {field.value}
      {field.note && <span className="text-[13.5px] font-normal text-ink-3">{field.note}</span>}
    </span>
  )
}
