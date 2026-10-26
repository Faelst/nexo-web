export function TypingDots() {
  return (
    <span className="inline-flex gap-[3px]" role="status" aria-label="digitando">
      {[0, 150, 300].map((delay) => (
        <i
          key={delay}
          className="size-[5px] animate-typing rounded-full bg-ink-3"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}
