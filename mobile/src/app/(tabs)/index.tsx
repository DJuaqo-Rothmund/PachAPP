import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { BossSprite, HpBar } from '@/components/game'
import { Body, Button, ErrorPanel, Panel, PixelText, Screen } from '@/components/ui'
import { useProfile } from '@/context/ProfileContext'
import { useAsync } from '@/hooks/useAsync'
import { gameApi, levelFromXp, type CampaignModule } from '@/lib/game'
import { formatRaidReset } from '@shared/lib/game/raid'
import { colors, radius, space } from '@/theme'

export default function MapScreen() {
  const { profile } = useProfile()
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([gameApi.getCampaign(), gameApi.getLeaderboard(), gameApi.getMyBadges()]),
    [],
  )
  // Al volver de un raid, refrescar HP, progreso y desbloqueos.
  useFocusEffect(useCallback(() => reload(), [reload]))

  const [campaign, leaderboard, badges] = data ?? [null, null, null]
  const myRow = leaderboard?.find((r) => r.userId === profile?.id)
  const level = levelFromXp(profile?.totalXp ?? 0)

  const kpis = [
    { label: 'XP del mes', value: String(myRow?.monthlyXp ?? 0) },
    { label: 'Nivel', value: String(level.level) },
    { label: 'Emblemas', value: badges ? String(badges.length) : '—' },
    { label: 'Ranking', value: myRow ? `#${myRow.rank}` : '—' },
  ]

  return (
    <Screen>
      <View>
        <PixelText size={14}>Mapa de campaña</PixelText>
        <Body tone="mist" style={{ marginTop: space.sm }}>
          Lee el Códice, responde y derrota al jefe para avanzar.
        </Body>
      </View>

      <View style={styles.kpis}>
        {kpis.map((k) => (
          <Panel key={k.label} style={styles.kpi}>
            <Body tone="mist" size={11} style={{ textTransform: 'uppercase' }}>
              {k.label}
            </Body>
            <PixelText size={16} tone="gold" style={{ marginTop: space.sm }}>
              {loading && !data ? '…' : k.value}
            </PixelText>
          </Panel>
        ))}
      </View>

      {error ? (
        <ErrorPanel error={error} onRetry={reload} />
      ) : (
        campaign?.map((m) => <ModuleCard key={m.id} module={m} />)
      )}
    </Screen>
  )
}

function ModuleCard({ module: m }: { module: CampaignModule }) {
  const progress = m.questionCount > 0 ? (m.answeredCount / m.questionCount) * 100 : 0
  const boss = m.boss

  return (
    <Panel style={!m.unlocked && { opacity: 0.55 }}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Body tone="mist" size={12}>
            Módulo {m.id}
          </Body>
          <Body weight="semibold" size={17}>
            {m.title}
          </Body>
        </View>
        {m.codexRead && (
          <View style={styles.chip}>
            <Body tone="moss" size={11}>
              Códice leído
            </Body>
          </View>
        )}
      </View>
      <Body tone="mist" size={14} style={{ marginTop: space.sm }}>
        {m.summary}
      </Body>

      {boss && (
        <View style={styles.bossRow}>
          <BossSprite size={40} defeated={boss.defeated} />
          <View style={{ flex: 1 }}>
            <Body tone="blood" size={13} numberOfLines={1}>
              {boss.name}
            </Body>
            {boss.defeated ? (
              <PixelText size={8} tone="gold" style={{ marginTop: 4 }}>
                Derrotado
              </PixelText>
            ) : (
              <View style={{ marginTop: 6 }}>
                <HpBar current={boss.currentHp} max={boss.maxHp} compact />
                <Body tone="mist" size={11} style={{ marginTop: 2 }}>
                  {boss.currentHp} / {boss.maxHp} HP
                </Body>
              </View>
            )}
          </View>
        </View>
      )}

      {m.unlocked ? (
        <>
          <View style={[styles.row, { marginTop: space.md }]}>
            <Body tone="mist" size={11}>
              Tu progreso
            </Body>
            <Body tone="mist" size={11}>
              {m.answeredCount}/{m.questionCount}
            </Body>
          </View>
          <View style={styles.progressTrack}>
            <View style={{ width: `${progress}%`, height: '100%', backgroundColor: colors.moss }} />
          </View>
          {boss && <RaidStatusLine module={m} />}
          <View style={[styles.row, { gap: space.sm, marginTop: space.md }]}>
            <Button label="Códice" variant="ghost" style={{ flex: 1 }} onPress={() => router.push(`/modulo/${m.id}/codice`)} />
            <Button label="Entrenar" variant="ghost" style={{ flex: 1 }} onPress={() => router.push(`/modulo/${m.id}/entrenar`)} />
          </View>
          {(m.raid.status === 'available' || m.raid.status === 'in_progress') && (
            <Button
              label={m.raid.status === 'in_progress' ? 'Continuar raid' : 'Boss Raid semanal'}
              style={{ marginTop: space.sm }}
              onPress={() => router.push(`/modulo/${m.id}/raid`)}
            />
          )}
        </>
      ) : (
        <Body tone="mist" size={13} style={{ marginTop: space.md }}>
          🔒 Derrota al jefe anterior para desbloquear
        </Body>
      )}
    </Panel>
  )
}

function RaidStatusLine({ module: m }: { module: CampaignModule }) {
  const { status, answered, total, nextResetAt } = m.raid
  const text: Record<typeof status, string> = {
    available: `⚔ Batalla semanal disponible · ${total} preguntas`,
    in_progress: `⚔ Batalla en curso · ${answered}/${total} respondidas`,
    done: `⏳ Ya combatiste esta semana · vuelve el ${formatRaidReset(nextResetAt)}`,
    defeated: '🏆 La comunidad derrotó a este jefe',
    none: '',
  }
  return (
    <Body tone={status === 'done' ? 'mist' : 'gold'} size={12} style={{ marginTop: space.md }}>
      {text[status]}
    </Body>
  )
}

const styles = StyleSheet.create({
  kpis: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  kpi: { width: '47.5%', flexGrow: 1, padding: space.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chip: { backgroundColor: 'rgba(74, 222, 128, 0.15)', borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 2 },
  bossRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginTop: space.md,
    backgroundColor: colors.stone,
    borderRadius: radius.md,
    padding: space.md,
  },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.stone, overflow: 'hidden', marginTop: 4 },
})
