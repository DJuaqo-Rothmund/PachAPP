import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { RPG_CLASSES, type RpgClassId } from '@shared/data/classes'
import { ClassAvatar } from '@/components/game'
import { Body, Button, PixelText, Screen } from '@/components/ui'
import { useProfile } from '@/context/ProfileContext'
import { gameApi } from '@/lib/game'
import { colors, radius, space } from '@/theme'

export default function OnboardingScreen() {
  const { profile, refresh } = useProfile()
  const [selected, setSelected] = useState<RpgClassId | null>(profile?.rpgClass ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const confirm = async () => {
    if (!selected) return
    setSaving(true)
    setError(null)
    try {
      await gameApi.setRpgClass(selected)
      await refresh()
      router.replace('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar la clase')
      setSaving(false)
    }
  }

  return (
    <Screen>
      <Body tone="mist">Tu clase define tu avatar y tu especialidad. Puedes cambiarla después desde tu perfil.</Body>

      <View style={styles.grid}>
        {RPG_CLASSES.map((c) => {
          const active = selected === c.id
          return (
            <Pressable
              key={c.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={c.name}
              onPress={() => setSelected(c.id)}
              style={[styles.card, active && styles.cardActive]}
            >
              <View style={styles.avatarBox}>
                <ClassAvatar rpgClass={c.id} size={72} />
              </View>
              <PixelText size={9} style={{ marginTop: space.md }}>
                {c.name}
              </PixelText>
              <Body tone="moss" weight="semibold" size={12} style={{ marginTop: space.xs }}>
                {c.specialty}
              </Body>
              <Body tone="mist" size={13} style={{ marginTop: space.xs }}>
                {c.description}
              </Body>
            </Pressable>
          )
        })}
      </View>

      {error && <Body tone="blood">{error}</Body>}
      <Button label="Confirmar clase" onPress={() => void confirm()} disabled={!selected} loading={saving} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  card: {
    width: '47.5%',
    flexGrow: 1,
    backgroundColor: colors.crypt,
    borderColor: colors.rune,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
  },
  cardActive: { borderColor: colors.moss, borderWidth: 2 },
  avatarBox: {
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
