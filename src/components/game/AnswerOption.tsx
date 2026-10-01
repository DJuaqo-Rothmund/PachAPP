export type OptionState = 'idle' | 'picked' | 'correct' | 'wrong' | 'dim'

export function optionState(option: string, picked: string | null, result: { correctAnswer: string } | null): OptionState {
  if (!result) return option === picked ? 'picked' : 'idle'
  if (option === result.correctAnswer) return 'correct'
  if (option === picked) return 'wrong'
  return 'dim'
}

const OPTION_STYLES: Record<OptionState, string> = {
  idle: 'border-rune hover:border-moss hover:bg-stone',
  picked: 'border-moss bg-stone animate-pulse',
  correct: 'border-moss bg-moss/15 text-bone',
  wrong: 'border-blood bg-blood/15 text-bone',
  dim: 'border-rune opacity-40',
}

export function AnswerOption({
  label,
  letter,
  state,
  disabled,
  onClick,
}: {
  label: string
  letter: string
  state: OptionState
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition disabled:cursor-default ${OPTION_STYLES[state]}`}
    >
      <span className="pixel-title flex h-7 w-7 shrink-0 items-center justify-center rounded bg-void text-[10px] text-mist">
        {letter}
      </span>
      <span className="text-sm">{label}</span>
    </button>
  )
}
