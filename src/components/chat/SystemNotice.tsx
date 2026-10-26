/** Evento da conversa (transferência, analista assumiu…). */
export function SystemNotice({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium text-ink-3 before:h-px before:flex-1 before:bg-rule after:h-px after:flex-1 after:bg-rule">
      <span className="text-center">{text}</span>
    </div>
  )
}
