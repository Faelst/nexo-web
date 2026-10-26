import { OptionButton } from './OptionButton'

type Props = {
  text?: string
  question?: string
  options?: string[]
  numbered?: boolean
  /** Opção já escolhida pelo usuário. */
  selected?: string
  disabled?: boolean
  onChoose?: (option: string) => void
}

export function AgentBubble({ text, question, options, numbered, selected, disabled, onChoose }: Props) {
  return (
    <div className="flex w-[600px] max-w-full flex-col gap-3 rounded-[4px_12px_12px_12px] border border-rule bg-paper px-4 py-3 leading-normal">
      {text && <p className="whitespace-pre-line">{text}</p>}
      {question && <p className="font-semibold">{question}</p>}
      {options && (
        <div className="flex flex-wrap gap-1.5">
          {options.map((option, i) => (
            <OptionButton
              key={option}
              label={option}
              shortcut={numbered && !disabled ? i + 1 : undefined}
              selected={selected?.startsWith(option)}
              disabled={disabled}
              onClick={() => onChoose?.(option)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
