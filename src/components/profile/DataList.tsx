import type { ReactNode } from 'react'
import { Card } from '@/components/ui'

export function DataList({ children }: { children: ReactNode }) {
  return (
    <Card>
      <dl>{children}</dl>
    </Card>
  )
}

type RowProps = { label: string; value: ReactNode; aside?: ReactNode }

export function DataRow({ label, value, aside }: RowProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-5 [&+&]:border-t [&+&]:border-rule">
      <dt className="w-full flex-none text-[13.5px] text-ink-3 sm:w-40">{label}</dt>
      <dd className="w-full min-w-0 font-medium break-words sm:w-auto sm:flex-1">{value}</dd>
      {aside}
    </div>
  )
}
