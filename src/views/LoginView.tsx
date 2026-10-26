'use client'

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { Showcase } from '@/components/login/Showcase'
import { Logo } from '@/components/brand/Logo'
import { Alert, Button, Checkbox, Spinner, TextField } from '@/components/ui'
import { loginRules, useLoginViewModel } from '@/viewmodels/useLoginViewModel'

const link = 'text-[13.5px] font-semibold text-primary-text hover:underline'

export function LoginView() {
  const vm = useLoginViewModel()
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = vm.form

  return (
    <div className="flex min-h-dvh">
      <Showcase />

      <section className="flex min-w-0 flex-1 flex-col justify-between gap-8 px-4 py-6 sm:px-14 sm:py-10">
        <div className="flex items-center justify-between gap-4">
          <Logo className="lg:invisible" />
          <p className="text-right text-[13.5px] text-ink-3">
            <span className="hidden sm:inline">Problema para entrar? </span>
            <a href="tel:4000" className={link}>
              Ligue no ramal 4000
            </a>
          </p>
        </div>

        <form onSubmit={vm.submit} noValidate className="flex w-full max-w-[380px] flex-col gap-7 self-center">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-[40px] leading-[1.1] tracking-[-0.8px]">Entrar</h2>
            <p className="text-[15.5px] leading-normal text-ink-3">Use seu e-mail corporativo e a senha da rede Nexo.</p>
          </div>

          <div className="flex flex-col gap-[18px]">
            <TextField
              label="E-mail corporativo"
              type="email"
              autoComplete="username"
              placeholder="nome.sobrenome@nexo.com.br"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email', loginRules.email)}
            />
            <TextField
              label="Senha"
              type={vm.showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••"
              icon={<LockKeyhole size={16} />}
              error={errors.password?.message}
              labelAction={
                <a href="#" className={`${link} font-medium`}>
                  Esqueci minha senha
                </a>
              }
              trailing={
                <button
                  type="button"
                  aria-label={vm.showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={vm.togglePassword}
                  className="grid size-[30px] place-items-center rounded-md text-ink-3 hover:bg-desk"
                >
                  {vm.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              className={vm.showPassword ? undefined : 'tracking-[2px]'}
              {...register('password', loginRules.password)}
            />
            <Checkbox checked={watch('remember')} onChange={(v) => setValue('remember', v)}>
              Manter conectado neste computador
            </Checkbox>
          </div>

          {vm.error && <Alert>{vm.error}</Alert>}

          <Button type="submit" variant="primary" size="lg" className="gap-2 shadow-cta" disabled={vm.submitting}>
            {vm.submitting ? <Spinner /> : null}
            {vm.submitting ? 'Entrando…' : 'Entrar'}
            {!vm.submitting && <ArrowRight size={16} />}
          </Button>

          <p className="border-t border-rule pt-4 text-[12.5px] leading-relaxed text-ink-3">
            Ambiente de demonstração: qualquer senha funciona. Funcionária: <strong>ana.souza@nexo.com.br</strong> ·
            Analista: <strong>rafael.lima@nexo.com.br</strong>
          </p>
        </form>

        <footer className="flex flex-wrap justify-between gap-2 text-[12.5px] text-ink-3">
          <span>© 2026 Nexo · Service desk de TI</span>
          <a href="#" className="hover:text-ink">
            Privacidade e uso de dados
          </a>
        </footer>
      </section>
    </div>
  )
}
