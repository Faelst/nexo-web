import { StatusDot } from '@/components/ui'

type Stat = { value: string; label: string; live?: boolean }

export function StatList({ stats }: { stats: Stat[] }) {
  return (
    <dl className="flex border-t border-white/10 pt-6">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-1 flex-col gap-1.5 [&+&]:border-l [&+&]:border-white/10 [&+&]:pl-6">
          <dt className="flex items-center gap-2 font-display text-[34px] tracking-[-0.6px]">
            {stat.value}
            {stat.live && <StatusDot tone="success" pulse className="size-2" />}
          </dt>
          <dd className="text-[13.5px] text-white/55">{stat.label}</dd>
        </div>
      ))}
    </dl>
  )
}
