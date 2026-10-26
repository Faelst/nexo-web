'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Kbd, Spinner } from '@/components/ui'
import type { DraftPart } from '@/models/entities/message'
import type { Tone } from '@/models/entities/tone'
import { InfoCard } from './InfoCard'

const statusOf: Record<DraftPart['status'] | 'EDITING', { label: string; tone: Tone }> = {
  PENDING: { label: 'Aguardando confirmação', tone: 'warning' },
  EDITING: { label: 'Editando', tone: 'primary' },
  CONFIRMED: { label: 'Confirmado', tone: 'success' },
  CANCELED: { label: 'Cancelado', tone: 'neutral' },
}

const inputClass = 'w-full rounded-lg border border-control px-2 py-1.5 outline-none focus:border-cta aria-[invalid=true]:border-danger'

type EditForm = { title: string; description: string }

type Props = {
  draft: DraftPart
  busy: boolean
  onConfirm: (edits?: Partial<EditForm>) => void
  onCancel: () => void
}

/** Rascunho de chamado/atualização: nada é criado até o funcionário confirmar aqui. */
export function DraftTicketCard({ draft, busy, onConfirm, onCancel }: Props) {
  const [editing, setEditing] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditForm>({ defaultValues: { title: draft.title, description: draft.description } })

  const pending = draft.status === 'PENDING'
  const status = statusOf[editing ? 'EDITING' : draft.status]
  const isUpdate = draft.kind === 'UPDATE'

  const confirm = handleSubmit((values) => {
    setEditing(false)
    onConfirm(isDirty ? { ...(isUpdate ? {} : { title: values.title }), description: values.description } : undefined)
  })

  return (
    <InfoCard muted={draft.status === 'CANCELED'}>
      <InfoCard.Header
        kind={isUpdate ? 'Atualização de chamado' : 'Novo chamado'}
        reference={`Rascunho ${draft.code}`}
        status={{ ...status, label: draft.ticketNumber && draft.status === 'CONFIRMED' ? `${status.label} · ${draft.ticketNumber}` : status.label }}
      >
        {editing ? (
          <form id={`draft-${draft.draftId}`} onSubmit={confirm} className="flex flex-col gap-1.5">
            {!isUpdate && (
              <>
                <input
                  aria-label="Título"
                  aria-invalid={!!errors.title}
                  className={`${inputClass} text-lg font-semibold`}
                  {...register('title', {
                    required: 'Informe o título.',
                    minLength: { value: 5, message: 'Use pelo menos 5 caracteres.' },
                    maxLength: { value: 120, message: 'Use no máximo 120 caracteres.' },
                  })}
                />
                {errors.title && <p className="text-[12.5px] text-danger-text">{errors.title.message}</p>}
              </>
            )}
            <textarea
              aria-label={isUpdate ? 'Informação a adicionar' : 'Descrição'}
              aria-invalid={!!errors.description}
              rows={3}
              className={`${inputClass} resize-y text-[13.5px] leading-normal`}
              {...register('description', {
                required: 'Informe a descrição.',
                minLength: { value: 10, message: 'Descreva com pelo menos 10 caracteres.' },
                maxLength: { value: 1500, message: 'Use no máximo 1500 caracteres.' },
              })}
            />
            {errors.description && <p className="text-[12.5px] text-danger-text">{errors.description.message}</p>}
          </form>
        ) : (
          <>
            <InfoCard.Title>{draft.title}</InfoCard.Title>
            <InfoCard.Description>{draft.description}</InfoCard.Description>
          </>
        )}
      </InfoCard.Header>

      <InfoCard.Fields fields={draft.fields} />

      {pending && (
        <InfoCard.Actions>
          {editing ? (
            <Button type="submit" form={`draft-${draft.draftId}`} variant="primary" disabled={busy}>
              {busy && <Spinner className="size-3.5" />}
              Salvar e confirmar
            </Button>
          ) : (
            <>
              <Button variant="primary" className="gap-2 pr-2.5 pl-3.5" disabled={busy} onClick={() => onConfirm()}>
                {busy && <Spinner className="size-3.5" />}
                Confirmar
                <Kbd inverted className="hidden sm:inline-grid">
                  ⌘↵
                </Kbd>
              </Button>
              <Button disabled={busy} onClick={() => setEditing(true)}>
                Editar
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => {
              if (editing) {
                reset()
                setEditing(false)
              } else onCancel()
            }}
          >
            {editing ? 'Descartar edição' : 'Cancelar'}
          </Button>
        </InfoCard.Actions>
      )}
    </InfoCard>
  )
}
