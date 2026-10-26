/** Mensagem de um analista no chat do funcionário. */
export function StaffBubble({ name, team, text }: { name: string; team: string | null; text: string }) {
  return (
    <div className="flex animate-msg-in flex-col items-start gap-1.5">
      <div className="flex items-center gap-1.5 text-[12.5px]">
        <strong className="font-semibold text-ink">{name}</strong>
        {team && (
          <span className="rounded-md bg-success-soft px-1.5 py-px text-[11px] font-semibold text-success-text">{team}</span>
        )}
      </div>
      <div className="w-[600px] max-w-full rounded-[4px_12px_12px_12px] bg-bubble-human px-4 py-3 leading-normal">{text}</div>
    </div>
  )
}
