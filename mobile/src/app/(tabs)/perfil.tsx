import { Alert, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { RPG_CLASSES } from '@shared/data/classes'
import { ClassAvatar } from '@/components/game'
import { Body, Button, Panel, PixelText, Screen } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/context/ProfileContext'
import { levelFromXp, resetDemo } from '@/lib/game'
import { colors, radius, space } from '@/theme'

// La colección de emblemas se agrega en el hito 2.
export default function ProfileScreen() {
  const { demoMode, user, signOut } = useAuth()
  const { profile, refresh } = useProfile()
  if (!profile) return null

  const cls = RPG_CLASSES.find((c) => c.id === profile.rpgClass)
  const level = levelFromXp(profile.totalXp)

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

      <Button label="Cambiar clase" variant="ghost" onPress={() => router.push('/onboarding')} />
      {demoMode ? (
        <Button label="Reiniciar demo" variant="ghost" onPress={confirmReset} />
      ) : (
        <Button label="Cerrar sesión" variant="ghost" onPress={() => void signOut()} />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  avatarBox: {
    width: 128,
    height: 128,
    borderRadius: radius.lg,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.stone, overflow: 'hidden', marginTop: 6 },
})
