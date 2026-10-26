import { StatusDot } from '@/components/ui'

/** Prévia ilustrativa de uma conversa, exibida na vitrine do login. */
export function ConversationPreview() {
  return (
    <div className="flex w-[500px] max-w-full flex-col gap-2.5 rounded-2xl border border-white/8 bg-white/4 p-[18px] text-[13.5px] xl:ml-24">
      <div className="self-end rounded-[12px_12px_4px_12px] bg-paper px-3.5 py-[9px] text-ink">
        Meu notebook não conecta na VPN. Erro 809.
      </div>
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex flex-wrap gap-x-1.5 text-[12.5px]">
          <strong className="font-semibold text-white/80">Nexo Assist</strong>
          <span className="text-white/45">consultou seus chamados · criou um chamado</span>
        </div>
        <div className="w-[380px] max-w-full rounded-[4px_12px_12px_12px] bg-white/8 px-3.5 py-2.5 leading-normal text-white">
          Pronto: abri o chamado com prioridade alta. Um analista fala com você em até 4 h úteis.
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-paper px-3 py-[7px] text-[12.5px] text-ink-3">
          <StatusDot tone="warning" size="md" />
          <strong className="font-semibold text-ink">INC-20517</strong>
          Rede e VPN · Alta · em até 4 h
        </div>
      </div>
    </div>
  )
}
