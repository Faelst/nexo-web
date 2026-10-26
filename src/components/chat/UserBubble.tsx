export function UserBubble({ text }: { text: string }) {
  return (
    <div className="max-w-[min(520px,85%)] animate-msg-in self-end rounded-[12px_12px_4px_12px] bg-ink px-4 py-[11px] leading-[1.45] text-white">
      {text}
    </div>
  )
}
