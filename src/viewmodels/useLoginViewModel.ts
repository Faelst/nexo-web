'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { homeFor } from '@/components/auth/RequireRole'
import { useSession } from '@/hooks/useSession'

export type LoginForm = {
  email: string
  password: string
  remember: boolean
}

export function useLoginViewModel() {
  const router = useRouter()
  const { status, session, signIn } = useSession()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginForm>({
    mode: 'onTouched',
    defaultValues: { email: '', password: '', remember: true },
  })

  // Já autenticado: vai direto para a área do papel
  useEffect(() => {
    if (status === 'authenticated') router.replace(homeFor(session!.user.role))
  }, [status, session, router])

  const submit = form.handleSubmit(async ({ email, password }) => {
    try {
      const { user } = await signIn(email.trim().toLowerCase(), password)
      router.push(homeFor(user.role))
    } catch (error) {
      form.setError('root', { message: error instanceof Error ? error.message : 'Não foi possível entrar.' })
    }
  })

  return {
    form,
    submit,
    showPassword,
    togglePassword: () => setShowPassword((v) => !v),
    submitting: form.formState.isSubmitting,
    error: form.formState.errors.root?.message,
  }
}

/** Regras de validação do formulário (espelham o LoginDto da API). */
export const loginRules = {
  email: {
    required: 'Informe seu e-mail corporativo.',
    pattern: { value: /^[^\s@]+@nexo\.com\.br$/i, message: 'Use seu e-mail corporativo (@nexo.com.br).' },
  },
  password: {
    required: 'Informe a senha.',
    maxLength: { value: 128, message: 'Senha muito longa.' },
  },
}

export type LoginViewModel = ReturnType<typeof useLoginViewModel>
