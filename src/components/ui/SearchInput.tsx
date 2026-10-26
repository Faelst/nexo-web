import type { InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex h-9 items-center gap-2.5 rounded-full bg-desk px-3 text-ink-3 focus-within:ring-1 focus-within:ring-cta">
      <Search size={15} />
      <input
        type="search"
        className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-3"
        {...props}
      />
    </label>
  )
}
