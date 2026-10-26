'use client'

import { useForm } from 'react-hook-form'
import { ArrowUp } from 'lucide-react'
import { Spinner } from '@/components/ui'

type Props = {
  onSend: (text: string) => Promise<boolean>
  sending: boolean
  disabled?: boolean
  disabledReason?: string
  used: number
  max: number
}

export function ChatComposer({ onSend, sending, disabled, disabledReason, used, max }: Props) {
  const { register, handleSubmit, reset, watch } = useForm<{ text: string }>({ defaultValues: { text: '' } })
  const text = watch('text')

  const submit = handleSubmit(async ({ text }) => {
    if (await onSend(text)) reset()
  })

  return (
    <form onSubmit={submit} className="mx-auto flex w-full max-w-[856px] flex-col gap-1.5 px-4 pt-2.5 pb-4 sm:px-6">
      <div className="flex h-12 items-center gap-2 rounded-xl border border-control bg-paper pr-1.5 pl-4 transition-colors focus-within:border-cta">
        <input
          aria-label="Mensagem"
          autoComplete="off"
          disabled={disabled}
          placeholder={disabled ? disabledReason : 'Escreva para o Nexo…'}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-3"
          {...register('text', { required: true, maxLength: 2000, validate: (v) => v.trim().length > 0 })}
        />
        <button
          type="submit"
          disabled={disabled || sending || !text.trim()}
          aria-label="Enviar"
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-cta px-3 text-[13.5px] font-semibold text-white disabled:opacity-50"
        >
          {sending ? <Spinner className="size-3.5" /> : <ArrowUp size={14} strokeWidth={2.5} />}
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </div>
      <p className="self-end text-[12.5px] text-ink-3">
        {used}/{max} mensagens nesta sessão
      </p>
    </form>
  )
}
