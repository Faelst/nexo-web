import { ArrowRightLeft, Bot, CircleCheckBig, Headset } from 'lucide-react'

export function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex justify-center pb-1">
      <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-ink-3">{label}</span>
    </div>
  )
}

const icons = { transfer: ArrowRightLeft, headset: Headset, bot: Bot, check: CircleCheckBig }

export function SystemDivider({ text, icon }: { text: string; icon: keyof typeof icons }) {
  const Icon = icons[icon]
  return (
    <div className="flex items-center gap-3 pt-[18px] pb-1 text-xs font-medium text-ink-3 before:h-px before:flex-1 before:bg-ink/8 after:h-px after:flex-1 after:bg-ink/8">
      <span className="inline-flex items-center gap-1.5 text-center">
        <Icon size={13} className="flex-none" />
        {text}
      </span>
    </div>
  )
}
