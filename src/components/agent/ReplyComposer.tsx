'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SendHorizontal } from 'lucide-react'
import { Spinner } from '@/components/ui'

type Props = {
  onSend: (text: string) => Promise<boolean>
  sending: boolean
  placeholder: string
}

export function ReplyComposer({ onSend, sending, placeholder }: Props) {
  const { register, handleSubmit, reset, watch, setFocus } = useForm<{ text: string }>({ defaultValues: { text: '' } })
  const text = watch('text')

  useEffect(() => setFocus('text'), [setFocus])

  const submit = handleSubmit(async ({ text }) => {
    if (await onSend(text.trim())) reset()
  })

  return (
    <form onSubmit={submit} className="flex items-center gap-3 border-t border-rule bg-paper px-4 pt-2.5 pb-3.5 sm:px-5">
      <input
        aria-label="Mensagem"
        autoComplete="off"
        placeholder={placeholder}
        className="h-11 min-w-0 flex-1 rounded-xl border border-transparent bg-desk px-3.5 outline-none focus:border-cta focus:bg-paper"
        {...register('text', { required: true, maxLength: 2000, validate: (v) => v.trim().length > 0 })}
      />
      <button
        type="submit"
        aria-label="Enviar"
        disabled={sending || !text.trim()}
        className="grid size-11 flex-none place-items-center rounded-full bg-cta text-white disabled:opacity-50"
      >
        {sending ? <Spinner className="size-4" /> : <SendHorizontal size={18} />}
      </button>
    </form>
  )
}
