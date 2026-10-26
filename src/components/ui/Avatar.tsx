import { cn } from '@/lib/cn'

type Size = 'sm' | 'md' | 'lg' | 'xl'

const sizes: Record<Size, { box: string; text: string; dot: string }> = {
  sm: { box: 'size-[34px]', text: 'text-[12.5px] font-bold', dot: 'size-2.5' },
  md: { box: 'size-9', text: 'text-[12.5px] font-bold', dot: 'size-2.5' },
  lg: { box: 'size-10', text: 'text-[14.5px] font-semibold', dot: 'size-2.5' },
  xl: { box: 'size-[46px]', text: 'text-[15.5px] font-semibold', dot: 'size-[11px]' },
}

type Props = {
  initials: string
  size?: Size
  /** Cores próprias do contato; sem elas usa o azul padrão. */
  bg?: string
  fg?: string
  online?: boolean
  /** Cor do anel do indicador online — deve ser igual ao fundo atrás do avatar. */
  ringClassName?: string
  className?: string
}

export function Avatar({ initials, size = 'md', bg, fg, online, ringClassName = 'ring-paper', className }: Props) {
  const s = sizes[size]
  return (
    <span
      className={cn(
        'relative grid flex-none place-items-center rounded-full',
        !bg && 'bg-primary-soft text-primary-text',
        s.box,
        s.text,
        className,
      )}
      style={bg ? { background: bg, color: fg } : undefined}
    >
      {initials}
      {online && (
        <span className={cn('absolute right-0 bottom-0 rounded-full bg-success ring-2', s.dot, ringClassName)} />
      )}
    </span>
  )
}
