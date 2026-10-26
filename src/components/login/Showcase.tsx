import { Logo } from '@/components/brand/Logo'
import { ConversationPreview } from './ConversationPreview'
import { StatList } from './StatList'

const stats = [
  { value: '8 s', label: 'primeira resposta, em média' },
  { value: '72%', label: 'resolvidos sem fila' },
  { value: '6', label: 'analistas online agora', live: true },
]

/** Coluna escura do login (somente em telas grandes). */
export function Showcase() {
  return (
    <section className="hidden w-[min(800px,56%)] flex-none flex-col justify-between gap-10 overflow-hidden bg-ink px-16 pt-10 pb-12 text-white lg:flex">
      <Logo inverted className="text-[17px]" />
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-[18px]">
          <p className="text-[13.5px] font-medium text-white/55">Service desk de TI da Nexo</p>
          <h1 className="font-display text-[44px] leading-[1.04] tracking-[-1.2px] xl:text-[54px]">
            Seu problema de TI, resolvido em uma conversa.
          </h1>
          <p className="max-w-[520px] text-base leading-[1.55] text-white/65">
            Descreva o que está acontecendo. O assistente consulta seus chamados, busca na central de ajuda e chama um
            analista quando precisa.
          </p>
        </div>
        <ConversationPreview />
      </div>
      <StatList stats={stats} />
    </section>
  )
}
