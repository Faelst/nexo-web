import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Card } from '@/components/ui'

const screens = [
  { href: '/login', title: 'Identificação', area: 'Todos' },
  { href: '/atendimento', title: 'Chat com o Nexo Assist', area: 'Funcionário' },
  { href: '/perfil', title: 'Meu perfil', area: 'Funcionário' },
  { href: '/atendente', title: 'Console: conversas e atendimento', area: 'Analista' },
]

export function ScreenIndexView() {
  return (
    <main className="mx-auto max-w-[640px] px-4 py-16">
      <Logo className="mb-6 text-xl" />
      <Card>
        <ul>
          {screens.map((s) => (
            <li key={s.href} className="[&+&]:border-t [&+&]:border-rule">
              <Link href={s.href} className="flex items-center gap-3 px-5 py-4 text-ink-3 hover:bg-desk">
                <span className="hidden w-[84px] text-[12.5px] sm:inline">{s.area}</span>
                <strong className="flex-1 font-medium text-ink">{s.title}</strong>
                <code className="hidden text-[12.5px] sm:inline">{s.href}</code>
                <ArrowUpRight size={16} />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  )
}
