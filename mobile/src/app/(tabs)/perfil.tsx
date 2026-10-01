import { useCallback, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { RPG_CLASSES } from '@shared/data/classes'
import { BadgeIcon, ClassAvatar, LivesHearts } from '@/components/game'
import { Body, Button, ErrorPanel, Panel, PixelText, Screen } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/context/ProfileContext'
import { useLives } from '@/context/LivesContext'
import { MasterPanel } from '@/components/MasterPanel'
import { useAsync } from '@/hooks/useAsync'
import { loadBadgeCatalog } from '@/lib/badgeCatalog'
import { gameApi, levelFromXp, resetDemo } from '@/lib/game'
import { colors, radius, space } from '@/theme'

export default function ProfileScreen() {
  const { demoMode, user, signOut } = useAuth()
  const { profile, refresh } = useProfile()
  const { lives, refresh: refreshLives } = useLives()
  const [leavingMaster, setLeavingMaster] = useState(false)
  const badges = useAsync(() => Promise.all([loadBadgeCatalog(), gameApi.getMyBadges()]), [])
  useFocusEffect(useCallback(() => badges.reload(), [badges.reload]))
  if (!profile) return null

  const [catalog, earned] = badges.data ?? [[], []]
  const earnedMap = new Map(earned.map((b) => [b.badgeId, b.earnedAt]))

  const cls = RPG_CLASSES.find((c) => c.id === profile.rpgClass)
  const level = levelFromXp(profile.totalXp)

  const deactivateMaster = async () => {
    setLeavingMaster(true)
    try {
      await gameApi.deactivateMasterMode()
      await Promise.all([refresh(), refreshLives()])
    } finally {
      setLeavingMaster(false)
    }
  }

  const confirmReset = () =>
    Alert.alert('Reiniciar demo', '¿Borrar todo tu progreso de la demo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar',
        style: 'destructive',
        onPress: () => {
          resetDemo()
          void refresh()
        },
      },
    ])

  return (
    <Screen>
      <Panel style={{ alignItems: 'center' }}>
        <View style={styles.avatarBox}>
          <ClassAvatar rpgClass={profile.rpgClass} size={96} />
        </View>
        <Body weight="semibold" size={18} style={{ marginTop: space.md }}>
          {profile.displayName}
        </Body>
        <Body tone="moss">{cls?.name}</Body>
        <Body tone="mist" size={12}>
          {user?.email ?? cls?.specialty}
        </Body>
        {profile.isTester && (
          <PixelText size={8} tone="gold" style={{ marginTop: space.sm }}>
            🔮 Modo maestro
          </PixelText>
        )}
        <View style={[styles.row, styles.lives]}>
          <Body tone="mist" size={12}>
            Vidas de hoy
          </Body>
          <LivesHearts lives={lives} size={18} showCountdown />
        </View>

        <View style={{ alignSelf: 'stretch', marginTop: space.lg }}>
          <View style={styles.row}>
            <PixelText size={10} tone="gold">
              Nivel {level.level}
            </PixelText>
            <Body tone="mist" size={12}>
              {profile.totalXp} XP total
            </Body>
          </View>
          <View style={styles.track}>
            <View style={{ width: `${level.pct}%`, height: '100%', backgroundColor: colors.gold }} />
          </View>
          <Body tone="mist" size={11} style={{ textAlign: 'right', marginTop: 4 }}>
            {level.toNext} XP para el nivel {level.level + 1}
          </Body>
        </View>
      </Panel>

      <Panel>
        <View style={styles.row}>
          <PixelText size={10}>Emblemas</PixelText>
          <Body tone="mist" size={12}>
            {earnedMap.size} / {catalog.length}
          </Body>
        </View>
        {badges.error ? (
          <View style={{ marginTop: space.md }}>
            <ErrorPanel error={badges.error} onRetry={badges.reload} />
          </View>
        ) : (
          <View style={styles.badgeGrid}>
            {catalog.map((badge) => {
              const earnedAt = earnedMap.get(badge.id)
              return (
                <View key={badge.id} style={[styles.badge, earnedAt ? styles.badgeEarned : null]}>
                  <BadgeIcon icon={badge.icon} size={40} locked={!earnedAt} />
                  <Body weight="medium" size={13} tone={earnedAt ? 'bone' : 'mist'} style={styles.center}>
                    {badge.name}
                  </Body>
                  <Body tone="mist" size={11} style={styles.center}>
                    {badge.description}
                  </Body>
                  {earnedAt && (
                    <Body tone="gold" size={10} style={styles.center}>
                      {new Date(earnedAt).toLocaleDateString('es-CL')}
                    </Body>
                  )}
                </View>
              )
            })}
          </View>
        )}
      </Panel>

      <MasterPanel onDone={badges.reload} />
      <Button label="Cambiar clase" variant="ghost" onPress={() => router.push('/onboarding')} />
      {profile.isTester && (
        <Button label="Desactivar modo maestro" variant="ghost" loading={leavingMaster} onPress={() => void deactivateMaster()} />
      )}
      {demoMode ? (
        <Button label="Reiniciar demo" variant="ghost" onPress={confirmReset} />
      ) : (
        <Button label="Cerrar sesión" variant="ghost" onPress={() => void signOut()} />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  lives: { alignSelf: 'stretch', marginTop: space.md, backgroundColor: colors.stone, borderRadius: radius.md, padding: space.sm },
  avatarBox: {
    width: 128,
    height: 128,
    borderRadius: radius.lg,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.md },
  badge: {
    width: '48%',
    flexGrow: 1,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.rune,
    borderRadius: radius.md,
    padding: space.md,
  },
  badgeEarned: { borderColor: 'rgba(250, 204, 21, 0.4)', backgroundColor: 'rgba(250, 204, 21, 0.05)' },
  center: { textAlign: 'center' },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.stone, overflow: 'hidden', marginTop: 6 },
})
