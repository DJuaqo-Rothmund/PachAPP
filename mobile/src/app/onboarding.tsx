import { useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { RPG_CLASSES, type RpgClassId } from '@shared/data/classes'
import { ClassAvatar } from '@/components/game'
import { Body, Button, PixelText, Screen } from '@/components/ui'
import { useProfile } from '@/context/ProfileContext'
import { useAsync } from '@/hooks/useAsync'
import { gameApi } from '@/lib/game'
import { classUnlocks } from '@shared/lib/game/classUnlocks'
import { MasterCodeModal } from '@/components/MasterCodeModal'
import { colors, radius, space } from '@/theme'

/** Toques seguidos sobre el Brujo Fitosanitario que abren la clave del modo maestro. */
const MASTER_TAPS = 5
const MASTER_TAP_WINDOW_MS = 1500

export default function OnboardingScreen() {
  const { profile, refresh } = useProfile()
  const [selected, setSelected] = useState<RpgClassId | null>(profile?.rpgClass ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: campaign } = useAsync(() => gameApi.getCampaign(), [])
  const [masterOpen, setMasterOpen] = useState(false)
  const taps = useRef({ count: 0, last: 0 })
  const unlocks = useMemo(() => classUnlocks(profile?.totalXp ?? 0, campaign ?? null), [profile?.totalXp, campaign])

  // 5 toques seguidos al Brujo (sin tocar otra clase entre medio) piden la clave.
  const onCardTap = (id: RpgClassId) => {
    setSelected(id)
    const now = Date.now()
    const t = taps.current
    t.count = id === 'brujo' && now - t.last < MASTER_TAP_WINDOW_MS ? t.count + 1 : id === 'brujo' ? 1 : 0
    t.last = now
    if (t.count >= MASTER_TAPS) {
      t.count = 0
      setMasterOpen(true)
    }
  }

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
      <View style={styles.header}>
        <Body tone="mist" size={14} style={{ flex: 1 }}>
          Tu clase define tu avatar y tu especialidad. Puedes cambiarla después desde tu perfil.
        </Body>
        <Button label="Confirmar" onPress={() => void confirm()} disabled={!selected} loading={saving} />
      </View>
      {selected && (
        <Body tone="mist" size={13} style={{ marginTop: -space.sm }}>
          Elegida: <Body size={13} style={{ color: RPG_CLASSES.find((c) => c.id === selected)?.theme.accent }}>{RPG_CLASSES.find((c) => c.id === selected)?.name}</Body>
        </Body>
      )}

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
              onPress={() => onCardTap(c.id)}
              style={[
                styles.card,
                { borderColor: `${c.theme.accent}55`, backgroundColor: `${c.theme.accentDim}22` },
                active && { borderColor: c.theme.accent, borderWidth: 2 },
                !unlock.selectable && { opacity: 0.5 },
              ]}
            >
              <View style={[styles.avatarBox, { backgroundColor: `${c.theme.accentDim}66`, borderBottomColor: `${c.theme.accent}44` }]}>
                <View style={[styles.specialty, { backgroundColor: c.theme.accentDim }]}>
                  <PixelText size={6} style={{ color: c.theme.accent }}>
                    {c.specialty}
                  </PixelText>
                </View>
                <ClassAvatar rpgClass={c.id} size={76} />
              </View>
              <PixelText size={9} style={{ marginTop: space.md, color: c.theme.accent }}>
                {c.name}
              </PixelText>
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

      <MasterCodeModal visible={masterOpen} onClose={() => setMasterOpen(false)} />
      {error && <Body tone="blood">{error}</Body>}
      <Button label="Confirmar clase" onPress={() => void confirm()} disabled={!selected} loading={saving} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md },
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
  specialty: { position: 'absolute', top: 6, left: 6, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
  avatarBox: {
    height: 108,
    paddingTop: 16,
    borderBottomWidth: 4,
    borderRadius: radius.md,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
