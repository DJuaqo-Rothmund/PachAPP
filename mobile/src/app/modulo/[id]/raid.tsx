import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Animated, Pressable, StyleSheet, View } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { BossSprite, HpBar } from '@/components/game'
import { Body, Button, ErrorPanel, Loader, Panel, PixelText, Screen } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/context/ProfileContext'
import { useToast } from '@/context/ToastContext'
import { useAsync } from '@/hooks/useAsync'
import { gameApi, type AnswerResult, type BossState, type CampaignModule } from '@/lib/game'
import { colors, radius, space } from '@/theme'

export default function RaidScreen() {
  const moduleId = Number(useLocalSearchParams<{ id: string }>().id)
  const { data: campaign, error, loading, reload } = useAsync(() => gameApi.getCampaign(), [moduleId])

  if (loading) return <Loader />
  if (error) {
    return (
      <Screen>
        <ErrorPanel error={error} onRetry={reload} />
      </Screen>
    )
  }

  const module = campaign?.find((m) => m.id === moduleId)
  if (!module || !module.boss) {
    return (
      <Gate title="Sin jefe" text="Este módulo no tiene Boss Raid.">
        <Button label="Volver al mapa" variant="ghost" onPress={() => router.back()} />
      </Gate>
    )
  }
  if (!module.unlocked) {
    return (
      <Gate title="🔒 Módulo bloqueado" text="La comunidad debe derrotar al jefe anterior para abrir este módulo.">
        <Button label="Volver al mapa" variant="ghost" onPress={() => router.back()} />
      </Gate>
    )
  }
  if (!module.codexRead) {
    return (
      <Gate
        title="📜 Primero, el Códice"
        text="Ningún aventurero enfrenta a un jefe sin estudiar. Lee el Códice del módulo para entrar a la batalla."
      >
        <Button label="Leer el Códice" onPress={() => router.replace(`/modulo/${module.id}/codice`)} />
      </Gate>
    )
  }

  return <Raid key={module.id} module={module} boss={module.boss} campaign={campaign!} />
}

function Gate({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <Screen>
      <Panel style={{ alignItems: 'center', gap: space.md }}>
        <PixelText size={11} tone="gold">
          {title}
        </PixelText>
        <Body tone="mist" style={{ textAlign: 'center' }}>
          {text}
        </Body>
        <View style={{ alignSelf: 'stretch' }}>{children}</View>
      </Panel>
    </Screen>
  )
}

function Raid({ module, boss, campaign }: { module: CampaignModule; boss: BossState; campaign: CampaignModule[] }) {
  const { refresh } = useProfile()
  const { announceBadges } = useToast()
  const { demoMode } = useAuth()

  const [hp, setHp] = useState(boss.currentHp)
  const [defeated, setDefeated] = useState(boss.defeated)
  const [unlockedModuleId, setUnlockedModuleId] = useState<number | null>(null)
  const { shakeStyle, damageStyle, damage, hit } = useHitAnimation()

  // HP en vivo: los golpes de toda la comunidad llegan por Realtime.
  // El HP solo baja, así que un evento atrasado nunca "cura" al jefe.
  useEffect(
    () =>
      gameApi.subscribeBoss(boss.id, (b) => {
        setHp((current) => Math.min(current, b.currentHp))
        if (b.defeated) setDefeated(true)
      }),
    [boss.id],
  )

  const [practice, setPractice] = useState(false)
  const { data: questions, error, loading, reload } = useAsync(() => gameApi.getQuestions(module.id), [module.id, practice])
  const queue = useMemo(
    () => (questions ? (practice ? questions : questions.filter((q) => !q.alreadyAnswered)) : []),
    [questions, practice],
  )

  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [answerError, setAnswerError] = useState<string | null>(null)
  const [stats, setStats] = useState({ answered: 0, correct: 0, xp: 0, damage: 0 })

  const current = queue[index]
  const finished = !loading && questions !== null && index >= queue.length

  const submit = async (option: string) => {
    if (!current || result || submitting) return
    setPicked(option)
    setSubmitting(true)
    setAnswerError(null)
    try {
      const r = await gameApi.answer(current.id, option)
      setResult(r)
      setStats((s) => ({
        answered: s.answered + 1,
        correct: s.correct + (r.correct ? 1 : 0),
        xp: s.xp + r.xpGained,
        damage: s.damage + r.damageDealt,
      }))
      if (r.damageDealt > 0) {
        setHp((h) => Math.min(h, r.bossHp))
        hit(r.damageDealt)
      }
      if (r.bossDefeated) setDefeated(true)
      if (r.unlockedModuleId !== null) setUnlockedModuleId(r.unlockedModuleId)
      announceBadges(r.newBadges)
      if (r.xpGained > 0) void refresh()
    } catch (e) {
      setAnswerError(e instanceof Error ? e.message : 'No se pudo enviar la respuesta')
      setPicked(null)
    } finally {
      setSubmitting(false)
    }
  }

  const next = () => {
    setIndex((i) => i + 1)
    setPicked(null)
    setResult(null)
  }

  const startPractice = () => {
    setPractice(true)
    setIndex(0)
    setPicked(null)
    setResult(null)
  }

  const unlockedModule = campaign.find((m) => m.id === (unlockedModuleId ?? (defeated ? boss.unlocksModuleId : null)))

  return (
    <Screen>
      <Stack.Screen options={{ title: `Raid · ${module.title}` }} />

      {/* Jefe */}
      <Panel>
        <View style={styles.bossRow}>
          <View style={styles.bossBox}>
            <Animated.View style={shakeStyle}>
              <BossSprite size={72} defeated={defeated} />
            </Animated.View>
            <Animated.View pointerEvents="none" style={[styles.damage, damageStyle]}>
              <PixelText size={12} tone="gold">
                −{damage}
              </PixelText>
            </Animated.View>
          </View>
          <View style={{ flex: 1 }}>
            <PixelText size={10} tone="blood">
              {boss.name}
            </PixelText>
            <Body tone="mist" size={13} style={{ marginTop: 2 }}>
              {boss.title}
            </Body>
          </View>
        </View>
        <View style={{ marginTop: space.md }}>
          <HpBar current={hp} max={boss.maxHp} />
        </View>
        {demoMode && (
          <Body tone="gold" size={11} style={{ marginTop: space.sm, textAlign: 'center', opacity: 0.8 }}>
            Demo: una comunidad simulada ya dejó al jefe malherido.
          </Body>
        )}
        {defeated && (
          <View style={styles.defeated}>
            <PixelText size={9} tone="gold" style={{ textAlign: 'center' }}>
              ¡Jefe derrotado!
            </PixelText>
            {unlockedModule ? (
              <Button
                label={`Abrir Módulo ${unlockedModule.id}: ${unlockedModule.title}`}
                style={{ marginTop: space.md }}
                onPress={() => router.replace(`/modulo/${unlockedModule.id}/codice`)}
              />
            ) : (
              <Body tone="mist" size={13} style={{ marginTop: space.sm, textAlign: 'center' }}>
                Sigue respondiendo para ganar XP.
              </Body>
            )}
          </View>
        )}
      </Panel>

      {/* Preguntas */}
      {error ? (
        <ErrorPanel error={error} onRetry={reload} />
      ) : loading || !questions ? (
        <Panel>
          <Body tone="mist">Invocando preguntas…</Body>
        </Panel>
      ) : finished ? (
        <Summary stats={stats} nothingPending={stats.answered === 0 && !practice} onPractice={startPractice} />
      ) : current ? (
        <Panel>
          <View style={styles.row}>
            <Body tone="mist" size={12}>
              Pregunta {index + 1} de {queue.length}
              {practice ? ' · práctica' : ''}
            </Body>
            <Body tone="gold" size={12}>
              +{stats.xp} XP · −{stats.damage} HP
            </Body>
          </View>

          {current.isBossFinal && (
            <View style={styles.special}>
              <PixelText size={8} tone="blood">
                ⚔ Ataque especial del jefe
              </PixelText>
            </View>
          )}
          <Body weight="semibold" size={18} style={{ marginTop: space.md, lineHeight: 25 }}>
            {current.prompt}
          </Body>

          <View style={{ gap: space.sm, marginTop: space.lg }}>
            {current.options.map((option, i) => (
              <OptionButton
                key={option}
                label={option}
                letter={String.fromCharCode(65 + i)}
                state={optionState(option, picked, result)}
                disabled={Boolean(result) || submitting}
                onPress={() => void submit(option)}
              />
            ))}
          </View>

          {answerError && (
            <Body tone="blood" style={{ marginTop: space.md }}>
              {answerError}
            </Body>
          )}

          {result && (
            <View style={{ marginTop: space.lg, gap: space.md }}>
              <Feedback result={result} bossName={boss.name} />
              <Button label={index + 1 < queue.length ? 'Siguiente' : 'Ver resultado'} onPress={next} />
            </View>
          )}
        </Panel>
      ) : null}
    </Screen>
  )
}

/** Sacudida del jefe y número de daño flotante en cada golpe. */
function useHitAnimation() {
  const shake = useRef(new Animated.Value(0)).current
  const float = useRef(new Animated.Value(1)).current
  const [damage, setDamage] = useState(0)

  const hit = (amount: number) => {
    setDamage(amount)
    shake.setValue(0)
    float.setValue(0)
    Animated.parallel([
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0.5, duration: 70, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]),
      Animated.timing(float, { toValue: 1, duration: 900, useNativeDriver: true }),
    ]).start()
  }

  return {
    hit,
    damage,
    shakeStyle: { transform: [{ translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-8, 8] }) }] },
    damageStyle: {
      opacity: float.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
      transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -28] }) }],
    },
  }
}

type OptionState = 'idle' | 'picked' | 'correct' | 'wrong' | 'dim'

function optionState(option: string, picked: string | null, result: AnswerResult | null): OptionState {
  if (!result) return option === picked ? 'picked' : 'idle'
  if (option === result.correctAnswer) return 'correct'
  if (option === picked) return 'wrong'
  return 'dim'
}

const OPTION_STYLES: Record<OptionState, object> = {
  idle: { borderColor: colors.rune },
  picked: { borderColor: colors.moss, backgroundColor: colors.stone },
  correct: { borderColor: colors.moss, backgroundColor: 'rgba(74, 222, 128, 0.15)' },
  wrong: { borderColor: colors.blood, backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  dim: { borderColor: colors.rune, opacity: 0.4 },
}

function OptionButton({
  label,
  letter,
  state,
  disabled,
  onPress,
}: {
  label: string
  letter: string
  state: OptionState
  disabled: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected: state === 'picked' || state === 'correct' }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.option, OPTION_STYLES[state], pressed && !disabled && { backgroundColor: colors.stone }]}
    >
      <View style={styles.letter}>
        <PixelText size={9} tone="mist">
          {letter}
        </PixelText>
      </View>
      <Body size={15} style={{ flex: 1 }}>
        {label}
      </Body>
    </Pressable>
  )
}

function Feedback({ result, bossName }: { result: AnswerResult; bossName: string }) {
  if (result.finalBlow) {
    return (
      <Body tone="gold" weight="semibold">
        ¡GOLPE FINAL! Derrotaste a {bossName}. +{result.xpGained} XP
      </Body>
    )
  }
  if (!result.correct) return <Body tone="blood">Fallaste. La respuesta correcta está marcada en verde.</Body>
  if (!result.awarded) return <Body tone="moss">Correcto. Ya la habías acertado antes, así que no suma XP.</Body>
  return (
    <Body tone="moss">
      ¡Golpe certero! +{result.xpGained} XP{result.damageDealt > 0 ? ` · −${result.damageDealt} HP al jefe` : ''}
    </Body>
  )
}

function Summary({
  stats,
  nothingPending,
  onPractice,
}: {
  stats: { answered: number; correct: number; xp: number; damage: number }
  nothingPending: boolean
  onPractice: () => void
}) {
  return (
    <Panel style={{ alignItems: 'center', gap: space.md }}>
      <PixelText size={11} tone="moss">
        {nothingPending ? 'Módulo dominado' : 'Batalla terminada'}
      </PixelText>
      <Body tone="mist" style={{ textAlign: 'center' }}>
        {nothingPending
          ? 'Ya acertaste todas las preguntas de este módulo. Puedes practicar, pero no sumará XP ni daño.'
          : `Acertaste ${stats.correct} de ${stats.answered} preguntas.`}
      </Body>
      {!nothingPending && (
        <View style={[styles.row, { gap: space.md, alignSelf: 'stretch' }]}>
          <View style={styles.stat}>
            <Body tone="mist" size={12}>
              XP ganada
            </Body>
            <PixelText size={14} tone="gold" style={{ marginTop: space.sm }}>
              +{stats.xp}
            </PixelText>
          </View>
          <View style={styles.stat}>
            <Body tone="mist" size={12}>
              Daño al jefe
            </Body>
            <PixelText size={14} tone="blood" style={{ marginTop: space.sm }}>
              −{stats.damage}
            </PixelText>
          </View>
        </View>
      )}
      <View style={{ alignSelf: 'stretch', gap: space.sm }}>
        <Button label="Practicar todas" variant="ghost" onPress={onPractice} />
        <Button label="Volver al mapa" onPress={() => router.back()} />
      </View>
    </Panel>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bossRow: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  bossBox: {
    width: 96,
    height: 96,
    borderRadius: radius.lg,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  damage: { position: 'absolute', top: 4 },
  defeated: {
    marginTop: space.md,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.5)',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderRadius: radius.md,
    padding: space.md,
  },
  special: {
    alignSelf: 'flex-start',
    marginTop: space.md,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    minHeight: 56,
  },
  letter: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.void,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stat: { flex: 1, backgroundColor: colors.stone, borderRadius: radius.md, padding: space.md, alignItems: 'center' },
})

