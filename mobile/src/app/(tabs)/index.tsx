import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { CoopBossFrame, HpBar, LivesHearts } from '@/components/game'
import { Body, Button, ErrorPanel, Panel, PixelText, Screen } from '@/components/ui'
import { useProfile } from '@/context/ProfileContext'
import { useLives } from '@/context/LivesContext'
import { MasterPanel } from '@/components/MasterPanel'
import { useAsync } from '@/hooks/useAsync'
import { useClassTheme } from '@/hooks/useClassTheme'
import { gameApi, levelFromXp, type CampaignModule } from '@/lib/game'
import { formatRaidReset } from '@shared/lib/game/raid'
import { colors, radius, space } from '@/theme'

export default function MapScreen() {
  const { profile } = useProfile()
  const { lives } = useLives()
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
        <View style={styles.row}>
          <PixelText size={14}>Mapa de campaña</PixelText>
          <LivesHearts lives={lives} size={18} />
        </View>
        <Body tone="mist" style={{ marginTop: space.sm }}>
          Estudia cada Códice, vence a los subjefes y únete a la comunidad contra el jefe cooperativo.
        </Body>
        {profile?.isTester && (
          <PixelText size={8} tone="gold" style={{ marginTop: space.sm }}>
            🔮 Modo maestro activo
          </PixelText>
        )}
      </View>

      <MasterPanel onDone={reload} />

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
  const { accent } = useClassTheme()
  const { profile } = useProfile()
  const hasTree = m.subbossesTotal > 0
  const raidGated = hasTree && m.subbossesDefeated < m.subbossesTotal && !profile?.isTester
  const progress = m.questionCount > 0 ? (m.answeredCount / m.questionCount) * 100 : 0
  const boss = m.boss

  return (
    <Panel style={!m.unlocked && { opacity: 0.55 }}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Body tone="mist" size={12}>
            Módulo {m.id}
          </Body>
          <PixelText size={12} style={{ marginTop: 4 }}>
            {m.title}
          </PixelText>
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
        <View style={{ marginTop: space.md }}>
          <CoopBossFrame bossId={boss.id} spriteUrl={m.spriteUrl} name={boss.name} defeated={boss.defeated} spriteSize={44}>
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
          </CoopBossFrame>
        </View>
      )}

      {m.unlocked && hasTree ? (
        <>
          <View style={[styles.row, { marginTop: space.md }]}>
            <Body tone="mist" size={11}>
              Subjefes
            </Body>
            <Body tone="mist" size={11}>
              {m.subbossesDefeated}/{m.subbossesTotal}
            </Body>
          </View>
          <View style={styles.segments}>
            {Array.from({ length: m.subbossesTotal }, (_, i) => (
              <View key={i} style={[styles.segment, { backgroundColor: i < m.subbossesDefeated ? colors.gold : colors.rune }]} />
            ))}
          </View>
          {boss &&
            (raidGated ? (
              <Body tone="mist" size={12} style={{ marginTop: space.md }}>
                🔒 Derrota a los {m.subbossesTotal} subjefes para unirte al Boss Raid
              </Body>
            ) : (
              <RaidStatusLine module={m} />
            ))}
          <Button label="Entrar al módulo" style={{ marginTop: space.md }} onPress={() => router.push(`/modulo/${m.id}`)} />
          {!raidGated && (m.raid.status === 'available' || m.raid.status === 'in_progress') && (
            <Button
              label={m.raid.status === 'in_progress' ? 'Continuar raid' : 'Boss Raid semanal'}
              variant="ghost"
              style={{ marginTop: space.sm }}
              onPress={() => router.push(`/modulo/${m.id}/raid`)}
            />
          )}
        </>
      ) : m.unlocked ? (
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
            <View style={{ width: `${progress}%`, height: '100%', backgroundColor: accent }} />
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
  segments: { flexDirection: 'row', gap: 4, marginTop: 4 },
  segment: { flex: 1, height: 6, borderRadius: 2 },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.stone, overflow: 'hidden', marginTop: 4 },
})
