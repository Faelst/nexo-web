import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

const base = 'flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium text-ink-2 hover:bg-desk'

type Props = {
  icon: LucideIcon
  label: string
  active?: boolean
} & ({ href: string; onClick?: () => void } | { href?: undefined; onClick: () => void })

export function NavItem({ icon: Icon, label, active, href, onClick }: Props) {
  const className = cn(base, active && 'bg-primary-soft font-semibold text-primary-text hover:bg-primary-soft')
  const content = (
    <>
      <Icon size={16} className={active ? 'text-primary-text' : 'text-ink-3'} />
      {label}
    </>
  )

  return href ? (
    <Link href={href} className={className} aria-current={active ? 'page' : undefined} onClick={onClick}>
      {content}
    </Link>
  ) : (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  )
}
