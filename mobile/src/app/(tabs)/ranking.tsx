import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { RPG_CLASSES } from '@shared/data/classes'
import { ClassAvatar } from '@/components/game'
import { Body, ErrorPanel, Panel, PixelText, Screen } from '@/components/ui'
import { useProfile } from '@/context/ProfileContext'
import { useAsync } from '@/hooks/useAsync'
import { gameApi } from '@/lib/game'
import { colors, space } from '@/theme'

const MEDALS = [colors.gold, colors.bone, colors.orange]

export default function RankingScreen() {
  const { profile } = useProfile()
  const { data: rows, error, loading, reload } = useAsync(() => gameApi.getLeaderboard(), [])
  useFocusEffect(useCallback(() => reload(), [reload]))
  const monthName = new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })

  return (
    <Screen>
      <View>
        <PixelText size={14}>Ranking mensual</PixelText>
        <Body tone="mist" style={{ marginTop: space.sm }}>
          XP ganada en {monthName}. Se reinicia cada mes.
        </Body>
      </View>

      {error ? (
        <ErrorPanel error={error} onRetry={reload} />
      ) : loading && !rows ? (
        <Panel>
          <Body tone="mist">Cargando…</Body>
        </Panel>
      ) : !rows || rows.length === 0 ? (
        <Panel>
          <Body tone="mist">Aún no hay aventureros en el ranking este mes. ¡Sé el primero!</Body>
        </Panel>
      ) : (
        <Panel style={{ padding: 0 }}>
          {rows.map((row, i) => {
            const isMe = row.userId === profile?.id
            const cls = RPG_CLASSES.find((c) => c.id === row.rpgClass)
            return (
              <View
                key={row.userId}
                style={[styles.row, i > 0 && styles.divider, isMe && { backgroundColor: 'rgba(74, 222, 128, 0.1)' }]}
              >
                <PixelText size={11} style={{ width: 44, color: MEDALS[row.rank - 1] ?? colors.mist }}>
                  #{row.rank}
                </PixelText>
                <ClassAvatar rpgClass={row.rpgClass} size={36} />
                <View style={{ flex: 1 }}>
                  <Body weight="medium" numberOfLines={1}>
                    {row.displayName}
                    {isMe ? '  (tú)' : ''}
                  </Body>
                  <Body tone="mist" size={12}>
                    {cls?.name ?? 'Sin clase'}
                  </Body>
                </View>
                <PixelText size={10} tone="gold">
                  {row.monthlyXp} XP
                </PixelText>
              </View>
            )
          })}
        </Panel>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.md },
  divider: { borderTopWidth: 1, borderTopColor: colors.rune },
})
