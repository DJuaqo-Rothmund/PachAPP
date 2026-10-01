import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { CoopBossFrame, HpBar, LivesHearts, SubbossFrame } from '@/components/game'
import { Body, Button, ErrorPanel, Loader, Panel, PixelText, Screen } from '@/components/ui'
import { useLives } from '@/context/LivesContext'
import { useProfile } from '@/context/ProfileContext'
import { useAsync } from '@/hooks/useAsync'
import { gameApi, type CampaignModule, type SubmoduleNode } from '@/lib/game'
import { formatRaidReset } from '@shared/lib/game/raid'
import { colors, radius, space } from '@/theme'

/** Árbol del módulo: Submódulos (Códice + Subjefe) → Jefe Cooperativo. */
export default function ModuleScreen() {
  const moduleId = Number(useLocalSearchParams<{ id: string }>().id)
  const { lives } = useLives()
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([gameApi.getCampaign(), gameApi.getModuleTree(moduleId)]),
    [moduleId],
  )
  // Al volver de un Códice o un combate, refrescar el progreso.
  useFocusEffect(useCallback(() => reload(), [reload]))

  if (loading && !data) return <Loader />
  if (error) {
    return (
      <Screen>
        <ErrorPanel error={error} onRetry={reload} />
      </Screen>
    )
  }

  const [campaign, tree] = data!
  const module = campaign.find((m) => m.id === moduleId)
  if (!module) {
    return (
      <Screen>
        <Panel>
          <Body tone="mist">Este módulo no existe.</Body>
        </Panel>
      </Screen>
    )
  }
  const defeated = tree.filter((n) => n.subboss.defeated).length

  return (
    <Screen>
      <Stack.Screen options={{ title: `Módulo ${module.id}` }} />
      <View>
        <PixelText size={12}>{module.title}</PixelText>
        <Body tone="mist" size={14} style={{ marginTop: space.sm }}>
          {module.summary}
        </Body>
        <View style={{ marginTop: space.md }}>
          <LivesHearts lives={lives} size={20} showCountdown />
        </View>
      </View>

      {tree.length > 0 && (
        <View>
          <View style={styles.row}>
            <Body tone="mist" size={11}>
              Subjefes derrotados
            </Body>
            <Body tone="mist" size={11}>
              {defeated}/{tree.length}
            </Body>
          </View>
          <View style={styles.segments}>
            {tree.map((n) => (
              <View
                key={n.id}
                style={[styles.segment, { backgroundColor: n.subboss.defeated ? colors.gold : n.unlocked ? 'rgba(74, 222, 128, 0.4)' : colors.rune }]}
              />
            ))}
          </View>
        </View>
      )}

      {tree.map((node) => (
        <SubmoduleStep key={node.id} moduleId={module.id} node={node} />
      ))}
      <BossStep module={module} ready={tree.length === 0 || defeated === tree.length} />
    </Screen>
  )
}

function SubmoduleStep({ moduleId, node }: { moduleId: number; node: SubmoduleNode }) {
  const { profile } = useProfile()
  const tester = Boolean(profile?.isTester)
  const base = `/modulo/${moduleId}/submodulo/${node.id}`
  return (
    <Panel style={!node.unlocked && { opacity: 0.55 }}>
      <View style={[styles.row, { justifyContent: 'flex-start', gap: space.md }]}>
        <View style={[styles.marker, { backgroundColor: node.subboss.defeated ? colors.gold : node.unlocked ? colors.moss : colors.stone }]}>
          <PixelText size={9} style={{ color: node.unlocked ? colors.void : colors.mist }}>
            {node.subboss.defeated ? '✓' : String(node.order)}
          </PixelText>
        </View>
        <View style={{ flex: 1 }}>
          <Body tone="mist" size={11} style={{ textTransform: 'uppercase' }}>
            Submódulo {node.order}
          </Body>
          <Body weight="semibold" size={16}>
            {node.title}
          </Body>
        </View>
      </View>
      <Body tone="mist" size={13} style={{ marginTop: space.sm }}>
        {node.description}
      </Body>

      <View style={{ marginTop: space.md }}>
        <SubbossFrame submoduleId={node.id} name={node.subboss.name} title={node.subboss.title} defeated={node.subboss.defeated} spriteSize={40}>
          <View style={{ marginTop: 6 }}>
            <HpBar current={node.subboss.hp} max={node.subboss.maxHp} compact />
            <Body tone="mist" size={11} style={{ marginTop: 2 }}>
              {node.subboss.defeated ? 'Derrotado' : `${node.subboss.hp} / ${node.subboss.maxHp} HP`} · duelo individual
            </Body>
          </View>
        </SubbossFrame>
      </View>

      {!node.unlocked ? (
        <Body tone="mist" size={13} style={{ marginTop: space.md }}>
          🔒 Derrota al subjefe anterior
        </Body>
      ) : (
        <View style={{ gap: space.sm, marginTop: space.md }}>
          <Button
            label={node.codexRead ? '📜 Repasar Códice' : '📜 Leer Códice'}
            variant={node.codexRead ? 'ghost' : 'primary'}
            onPress={() => router.push(base)}
          />
          {(node.codexRead || tester) && (!node.subboss.defeated || tester) && (
            <Button label={node.subboss.defeated ? '⚔ Repetir combate' : '⚔ Combatir'} onPress={() => router.push(`${base}/combate`)} />
          )}
          {node.checkpointsTotal > 0 && (
            <Body tone="mist" size={11}>
              Checkpoints {node.checkpointsPassed}/{node.checkpointsTotal}
            </Body>
          )}
        </View>
      )}
    </Panel>
  )
}

function BossStep({ module, ready }: { module: CampaignModule; ready: boolean }) {
  const { profile } = useProfile()
  const boss = module.boss
  if (!boss) return null
  const tester = Boolean(profile?.isTester)
  const status = module.raid.status
  const canRaid = (ready || tester) && (status === 'available' || status === 'in_progress' || (tester && status === 'done'))

  return (
    <View style={{ gap: space.md }}>
      <CoopBossFrame bossId={boss.id} name={boss.name} title={boss.title} defeated={boss.defeated}>
        <View style={{ marginTop: 6 }}>
          <HpBar current={boss.currentHp} max={boss.maxHp} compact />
          <Body tone="mist" size={11} style={{ marginTop: 2 }}>
            {boss.defeated ? 'Derrotado por la comunidad' : `${boss.currentHp} / ${boss.maxHp} HP · toda la comunidad`}
          </Body>
        </View>
      </CoopBossFrame>
      {boss.defeated ? (
        <Body tone="gold">🏆 La comunidad derrotó a este jefe</Body>
      ) : !ready && !tester ? (
        <Body tone="mist" size={13}>
          🔒 Derrota a todos los subjefes para unirte al Boss Raid
        </Body>
      ) : canRaid ? (
        <Button
          label={status === 'in_progress' ? '⚔ Continuar Boss Raid' : '⚔ Unirse al Boss Raid'}
          onPress={() => router.push(`/modulo/${module.id}/raid`)}
        />
      ) : status === 'done' ? (
        <Body tone="mist" size={13}>
          ⏳ Ya combatiste esta semana · vuelve el {formatRaidReset(module.raid.nextResetAt)}
        </Body>
      ) : null}
      {!ready && tester && !boss.defeated && (
        <Body tone="gold" size={11}>
          Modo maestro: acceso anticipado
        </Body>
      )}
      {module.questionCount > 0 && <Button label="Entrenar" variant="ghost" onPress={() => router.push(`/modulo/${module.id}/entrenar`)} />}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  segments: { flexDirection: 'row', gap: 4, marginTop: 4 },
  segment: { flex: 1, height: 8, borderRadius: 2 },
  marker: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
})
