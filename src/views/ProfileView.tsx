'use client'

import { CircleCheckBig, KeyRound, Lock, Mail, RotateCcwKey } from 'lucide-react'
import { ActionCard } from '@/components/profile/ActionCard'
import { DataList, DataRow } from '@/components/profile/DataList'
import { Alert, Button, Spinner } from '@/components/ui'
import { useProfileViewModel } from '@/viewmodels/useProfileViewModel'

export function ProfileView() {
  const { user, resetStatus, requestReset, error, dismissError } = useProfileViewModel()
  const sent = resetStatus === 'sent'

  if (!user) {
    return (
      <div className="grid flex-1 place-items-center text-ink-3">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-10 sm:py-12">
      <div className="mx-auto flex max-w-[600px] flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-[-0.4px]">Meu perfil</h1>
          <p className="text-ink-3">Seus dados de acesso ao service desk de TI.</p>
        </div>

        {error && <Alert onDismiss={dismissError}>{error}</Alert>}

        <DataList>
          <DataRow label="Nome" value={user.name} />
          {user.department && <DataRow label="Área" value={user.department} />}
          <DataRow
            label="E-mail corporativo"
            value={user.email}
            aside={
              <span className="inline-flex items-center gap-[5px] text-[12.5px] whitespace-nowrap text-ink-3">
                <Lock size={13} />
                Gerenciado pela TI
              </span>
            }
          />
        </DataList>

        <ActionCard
          icon={<KeyRound size={18} />}
          title="Senha"
          description={`Alterada há ${user.passwordChangedDaysAgo} dias`}
          action={
            <Button
              className="pr-3.5 pl-3 disabled:text-success-text disabled:opacity-100"
              disabled={resetStatus !== 'idle'}
              onClick={requestReset}
            >
              {resetStatus === 'sending' ? <Spinner className="size-3.5" /> : <RotateCcwKey size={15} />}
              {{ idle: 'Redefinir senha', sending: 'Enviando…', sent: 'Link enviado' }[resetStatus]}
            </Button>
          }
          helper={{
            icon: sent ? <CircleCheckBig size={14} /> : <Mail size={14} />,
            success: sent,
            text: sent
              ? `Enviamos o link de redefinição para ${user.email}. Ele vale por 30 minutos.`
              : `Enviaremos um link de redefinição para ${user.email}.`,
          }}
        />
      </div>
    </div>
  )
}
