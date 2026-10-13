/** Golpe que el escenario de batalla debe animar. `key` distinto en cada respuesta reinicia la animación. */
export interface StageEvent {
  kind: 'attack' | 'hurt'
  key: number
  /** Daño al enemigo (número flotante). Sin daño, el golpe se anima sin número. */
  damage?: number
}

/** fighting: combate en curso. victory: el enemigo cayó. defeat: el héroe quedó sin vidas o perdió el duelo. */
export type StageOutcome = 'fighting' | 'victory' | 'defeat'

/** Evento siguiente a partir de una respuesta: acierto = el héroe ataca; error = el enemigo contraataca. */
export function nextStageEvent(prev: StageEvent | null, correct: boolean, damage: number): StageEvent {
  return { kind: correct ? 'attack' : 'hurt', key: (prev?.key ?? 0) + 1, damage: damage > 0 ? damage : undefined }
}
