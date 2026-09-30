import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { RPG_CLASSES, type RpgClassId } from '@shared/data/classes'
import { ClassAvatar } from '@/components/game'
import { Body, Button, PixelText, Screen } from '@/components/ui'
import { useProfile } from '@/context/ProfileContext'
import { useAsync } from '@/hooks/useAsync'
import { gameApi } from '@/lib/game'
import { classUnlocks } from '@shared/lib/game/classUnlocks'
import { colors, radius, space } from '@/theme'

export default function OnboardingScreen() {
  const { profile, refresh } = useProfile()
  const [selected, setSelected] = useState<RpgClassId | null>(profile?.rpgClass ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: campaign } = useAsync(() => gameApi.getCampaign(), [])
  const unlocks = useMemo(() => classUnlocks(profile?.totalXp ?? 0, campaign ?? null), [profile?.totalXp, campaign])

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
          const unlock = unlocks[c.id]
          return (
            <Pressable
              key={c.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: active, disabled: !unlock.selectable }}
              disabled={!unlock.selectable}
              accessibilityLabel={c.name}
              onPress={() => setSelected(c.id)}
              style={[styles.card, active && { borderColor: c.theme.accent, borderWidth: 2 }, !unlock.selectable && { opacity: 0.5 }]}
            >
              <View style={[styles.avatarBox, { backgroundColor: `${c.theme.accentDim}66` }]}>
                <ClassAvatar rpgClass={c.id} size={72} />
              </View>
              <PixelText size={9} style={{ marginTop: space.md }}>
                {c.name}
              </PixelText>
              <Body weight="semibold" size={12} style={{ marginTop: space.xs, color: c.theme.accent }}>
                {c.specialty}
              </Body>
              <Body tone="mist" size={13} style={{ marginTop: space.xs }}>
                {c.description}
              </Body>
              {unlock.requirement && (
                <Body tone="mist" size={11} style={styles.unlock}>
                  {unlock.earned ? '🔓 Recompensa obtenida' : `🔒 Recompensa: ${unlock.requirement}`}
                  {!unlock.earned && unlock.selectable ? ' · libre en la beta' : ''}
                </Body>
              )}
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
  unlock: { marginTop: space.sm, backgroundColor: colors.stone, borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 3 },
  avatarBox: {
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
