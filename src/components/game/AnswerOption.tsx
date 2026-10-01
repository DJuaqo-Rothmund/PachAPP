export type OptionState = 'idle' | 'picked' | 'correct' | 'wrong' | 'dim'

export function optionState(option: string, picked: string | null, result: { correctAnswer: string } | null): OptionState {
  if (!result) return option === picked ? 'picked' : 'idle'
  if (option === result.correctAnswer) return 'correct'
  if (option === picked) return 'wrong'
  return 'dim'
}

const OPTION_STYLES: Record<OptionState, string> = {
  idle: 'border-[#0a0907] bg-stone hover:border-[var(--skin-accent)] hover:brightness-110 active:translate-y-[3px] active:shadow-pressed',
  picked: 'border-[var(--skin-accent)] bg-stone animate-pulse',
  correct: 'border-moss bg-[color-mix(in_srgb,var(--color-moss)_22%,var(--color-stone))] text-bone',
  wrong: 'border-blood bg-[color-mix(in_srgb,var(--color-blood)_22%,var(--color-stone))] text-bone',
  dim: 'border-[#0a0907] bg-stone opacity-40',
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
      className={`flex items-center gap-3 border-2 px-4 py-3 text-left shadow-bevel-sm transition disabled:cursor-default ${OPTION_STYLES[state]}`}
    >
      <span className="font-title well flex h-8 w-8 shrink-0 items-center justify-center text-xl leading-none text-gold">
        {letter}
      </span>
      <span className="text-sm">{label}</span>
    </button>
  )
}
