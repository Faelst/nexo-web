import { NexoMark } from '@/components/brand/NexoMark'

const suggestions = [
  'Qual o status do meu chamado?',
  'Minha VPN não conecta',
  'Preciso de acesso a uma pasta no SharePoint',
  'Qual o horário do service desk?',
]

export function ChatEmptyState({ name, onPick, disabled }: { name: string; onPick: (text: string) => void; disabled?: boolean }) {
  return (
    <div className="mx-auto flex max-w-[520px] animate-msg-in flex-col items-center gap-5 px-4 py-10 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft">
        <NexoMark size={24} />
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-[30px] leading-tight tracking-[-0.6px]">Olá, {name.split(' ')[0]}!</h2>
        <p className="text-ink-3">
          Conte o que está acontecendo. Eu consulto seus chamados, busco na central de ajuda e chamo um analista quando
          precisar.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            disabled={disabled}
            onClick={() => onPick(s)}
            className="rounded-full border border-rule px-3 py-1.5 text-[13px] text-ink-2 hover:border-primary hover:text-primary-text disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
