import { Link } from 'react-router-dom'
import { CoopBossFrame } from './BossFrames'
import { HpBar } from './HpBar'
import { formatRaidReset } from '../../lib/game/raid'
import type { CampaignModule } from '../../lib/game'

/** Qué puede hacer el jugador frente al jefe cooperativo de un módulo. */
export type RaidAction =
  | { kind: 'join'; label: string }
  | { kind: 'locked'; text: string }
  | { kind: 'waiting'; text: string }
  | { kind: 'defeated'; text: string }
  | { kind: 'none' }

export function raidAction(module: CampaignModule, tester: boolean): RaidAction {
  const boss = module.boss
  if (!boss) return { kind: 'none' }
  if (boss.defeated) return { kind: 'defeated', text: '🏆 La comunidad derrotó a este jefe' }
  if (!module.unlocked) return { kind: 'locked', text: '🔒 Derrota al jefe anterior para desbloquear' }
  const pendingSubbosses = module.subbossesTotal - module.subbossesDefeated
  if (pendingSubbosses > 0 && !tester) {
    return { kind: 'locked', text: `🔒 Derrota ${pendingSubbosses === 1 ? 'al último subjefe' : `a los ${pendingSubbosses} subjefes restantes`} para unirte` }
  }
  const { status, answered, total, nextResetAt } = module.raid
  if (status === 'in_progress') return { kind: 'join', label: `⚔ Continuar Raid · ${answered}/${total}` }
  if (status === 'available' || (status === 'done' && tester)) return { kind: 'join', label: '⚔ Unirse al Boss Raid' }
  if (status === 'done') return { kind: 'waiting', text: `⏳ Ya combatiste esta semana · vuelve el ${formatRaidReset(nextResetAt)}` }
  return { kind: 'none' }
}

interface BossCardProps {
  module: CampaignModule
  tester?: boolean
  /** compact: para el mapa de campaña. full: para la vista del módulo. */
  variant?: 'compact' | 'full'
}

/**
 * Tarjeta del Jefe Cooperativo: retrato en marco de hierro oxidado, nombre pixel,
 * barra de HP segmentada y el botón chunky para entrar al Boss Raid semanal.
 */
export function BossCard({ module, tester = false, variant = 'full' }: BossCardProps) {
  const boss = module.boss
  if (!boss) return null
  const action = raidAction(module, tester)
  const compact = variant === 'compact'

  return (
    <div>
      <CoopBossFrame bossId={boss.id} spriteUrl={module.spriteUrl} bgTheme={module.bgTheme} name={boss.name} title={compact ? undefined : boss.title} defeated={boss.defeated} size={compact ? 'sm' : 'md'}>
        <div className="mt-3">
          {boss.defeated ? (
            <p className="font-title text-2xl leading-none text-gold">✦ Derrotado ✦</p>
          ) : (
            <HpBar current={boss.currentHp} max={boss.maxHp} size={compact ? 'sm' : 'lg'} segments={compact ? 10 : 25} />
          )}
          {compact && !boss.defeated && (
            <p className="font-title mt-1 text-lg leading-none text-mist">
              {boss.currentHp.toLocaleString('es-CL')} / {boss.maxHp.toLocaleString('es-CL')} HP
            </p>
          )}
        </div>
      </CoopBossFrame>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {action.kind === 'join' ? (
          <Link to={`/modulos/${module.id}/raid`} className="btn-primary">
            {action.label}
          </Link>
        ) : action.kind === 'none' ? null : (
          <p className={`text-sm ${action.kind === 'defeated' ? 'text-gold' : 'text-mist'}`}>{action.text}</p>
        )}
        {tester && action.kind === 'join' && module.subbossesDefeated < module.subbossesTotal && (
          <span className="font-title text-lg leading-none text-gold">Modo maestro: acceso anticipado</span>
        )}
      </div>
    </div>
  )
}
