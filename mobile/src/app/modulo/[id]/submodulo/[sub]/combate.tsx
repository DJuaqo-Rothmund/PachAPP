import { useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Gate, OptionButton, optionState, useHitAnimation } from '@/components/BattleScreen'
import { HpBar, LivesHearts, OutOfLives, SubbossFrame, SubbossSprite } from '@/components/game'
import { Body, Button, ErrorPanel, Loader, Panel, PixelText, Screen } from '@/components/ui'
import { useLives } from '@/context/LivesContext'
import { useProfile } from '@/context/ProfileContext'
import { useToast } from '@/context/ToastContext'
import { useAsync } from '@/hooks/useAsync'
import { gameApi, type SubbossAnswerResult, type SubmoduleNode } from '@/lib/game'
import { colors, radius, space } from '@/theme'

/** Duelo individual contra el subjefe de un submódulo. Cada error gasta una vida. */
export default function SubbossScreen() {
  const params = useLocalSearchParams<{ id: string; sub: string }>()
  const moduleId = Number(params.id)
  const submoduleId = params.sub ?? ''
  const [round, setRound] = useState(0)
  const { profile } = useProfile()
  const { data: tree, error, loading, reload } = useAsync(() => gameApi.getModuleTree(moduleId), [moduleId])

  if (loading) return <Loader />
  if (error) {
    return (
      <Screen>
        <ErrorPanel error={error} onRetry={reload} />
      </Screen>
    )
  }
  const node = tree?.find((n) => n.id === submoduleId)
  if (!tree || !node) {
    return (
      <Gate title="Sin subjefe" text="Este submódulo no existe.">
        <Button label="Volver" variant="ghost" onPress={() => router.back()} />
      </Gate>
    )
  }
  // En modo maestro se puede combatir sin leer el Códice.
  if (!node.unlocked || (!node.codexRead && !profile?.isTester)) {
    return (
      <Gate title="📜 Primero, el Códice" text="Ningún aventurero enfrenta a un subjefe sin estudiar. Lee el Códice del submódulo.">
        <Button label="Leer el Códice" onPress={() => router.replace(`/modulo/${moduleId}/submodulo/${node.id}`)} />
      </Gate>
    )
  }
  const nextNode = tree.find((n) => n.order === node.order + 1) ?? null
  return <Fight key={`${node.id}-${round}`} moduleId={moduleId} node={node} nextNode={nextNode} onRetry={() => setRound((r) => r + 1)} />
}

function Fight({
  moduleId,
  node,
  nextNode,
  onRetry,
}: {
  moduleId: number
  node: SubmoduleNode
  nextNode: SubmoduleNode | null
  onRetry: () => void
}) {
  const { refresh } = useProfile()
  const { lives, setLivesLeft, refresh: refreshLives } = useLives()
  const { announceBadges } = useToast()
  const { shakeStyle, damageStyle, damage, hit } = useHitAnimation()

  const { data: fight, error, loading, reload } = useAsync(() => gameApi.startSubboss(node.id), [node.id])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [result, setResult] = useState<SubbossAnswerResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [answerError, setAnswerError] = useState<string | null>(null)
  const [hp, setHp] = useState<number | null>(null)
  const [over, setOver] = useState<SubbossAnswerResult | null>(null)

  const outOfLives = Boolean(lives && !lives.unlimited && lives.lives <= 0)
  const codexPath = `/modulo/${moduleId}/submodulo/${node.id}`

  if ((outOfLives && !over && !result) || error?.message.includes('Sin vidas')) {
    return (
      <Screen>
        <Panel style={{ gap: space.md }}>
          <OutOfLives lives={lives} />
          <Button label="Repasar Códice" variant="ghost" onPress={() => router.replace(codexPath)} />
        </Panel>
      </Screen>
    )
  }
  if (error) {
    return (
      <Screen>
        <ErrorPanel error={error} onRetry={reload} />
      </Screen>
    )
  }
  if (loading || !fight) return <Loader />

  const current = fight.questions[index]
  const currentHp = hp ?? fight.hp
  const lastQuestion = index + 1 >= fight.questions.length

  const submit = async (option: string) => {
    if (!current || result || submitting) return
    setPicked(option)
    setSubmitting(true)
    setAnswerError(null)
    try {
      const r = await gameApi.answerSubboss(node.id, current.id, option)
      setResult(r)
      setHp(r.subbossHp)
      setLivesLeft(r.livesLeft)
      if (r.damageDealt > 0) hit(r.damageDealt)
      announceBadges(r.newBadges)
      if (r.xpGained > 0) void refresh()
    } catch (e) {
      setAnswerError(e instanceof Error ? e.message : 'No se pudo enviar la respuesta')
      setPicked(null)
      void refreshLives()
    } finally {
      setSubmitting(false)
    }
  }

  const next = () => {
    if (result?.fightOver || lastQuestion) {
      setOver(result)
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setResult(null)
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: node.subboss.name }} />
      <SubbossFrame
        submoduleId={node.id}
        name={node.subboss.name}
        title={node.subboss.title}
        spriteSize={64}
        sprite={
          <View>
            <Animated.View style={shakeStyle}>
              <SubbossSprite submoduleId={node.id} size={64} defeated={Boolean(over?.subbossDefeated)} />
            </Animated.View>
            <Animated.View pointerEvents="none" style={[styles.damage, damageStyle]}>
              <PixelText size={11} tone="gold">
                −{damage}
              </PixelText>
            </Animated.View>
          </View>
        }
      >
        <View style={{ marginTop: space.sm }}>
          <HpBar current={currentHp} max={fight.maxHp} />
        </View>
      </SubbossFrame>
      <View style={styles.livesRow}>
        <Body tone="mist" size={12}>
          Vidas de hoy
        </Body>
        <LivesHearts lives={lives} size={20} />
      </View>

      {over ? (
        <Summary result={over} node={node} nextNode={nextNode} moduleId={moduleId} onRetry={onRetry} canRetry={!lives || lives.unlimited || lives.lives > 0} />
      ) : current ? (
        <Panel>
          <View style={styles.row}>
            <Body tone="mist" size={12}>
              Pregunta {fight.answered + index + 1} de {fight.total}
            </Body>
            <Body tone="gold" size={12}>
              {currentHp}/{fight.maxHp} HP
            </Body>
          </View>
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
              <Body tone={result.correct ? 'moss' : 'blood'}>
                {result.correct
                  ? `¡Golpe certero! −${result.damageDealt} HP${result.awarded ? ` · +${result.xpGained} XP` : ''}`
                  : `Fallaste: pierdes una vida${lives?.unlimited ? ' (modo maestro: ∞)' : ''}.`}
              </Body>
              <Button label={result.fightOver || lastQuestion ? 'Ver resultado' : 'Siguiente'} onPress={next} />
            </View>
          )}
        </Panel>
      ) : null}
    </Screen>
  )
}

function Summary({
  result,
  node,
  nextNode,
  moduleId,
  onRetry,
  canRetry,
}: {
  result: SubbossAnswerResult | null
  node: SubmoduleNode
  nextNode: SubmoduleNode | null
  moduleId: number
  onRetry: () => void
  canRetry: boolean
}) {
  if (result?.subbossDefeated) {
    return (
      <Panel style={{ alignItems: 'center', gap: space.md }}>
        <PixelText size={11} tone="gold">
          ¡Subjefe derrotado!
        </PixelText>
        <Body tone="mist" style={{ textAlign: 'center' }}>
          {node.subboss.name} cae.{' '}
          {nextNode ? `Se abre el submódulo ${nextNode.order}: ${nextNode.title}.` : 'Ya puedes unirte al Boss Raid cooperativo del módulo.'}
        </Body>
        <View style={{ alignSelf: 'stretch', gap: space.sm }}>
          {nextNode ? (
            <Button label="📜 Siguiente Códice" onPress={() => router.replace(`/modulo/${moduleId}/submodulo/${nextNode.id}`)} />
          ) : (
            <Button label="♛ Ir al Jefe Cooperativo" onPress={() => router.back()} />
          )}
          <Button label="Volver al módulo" variant="ghost" onPress={() => router.back()} />
        </View>
      </Panel>
    )
  }
  const noLives = !canRetry
  return (
    <Panel style={{ alignItems: 'center', gap: space.md }}>
      <PixelText size={11} tone="blood">
        {noLives ? 'Sin vidas por hoy' : 'El subjefe resistió'}
      </PixelText>
      <Body tone="mist" style={{ textAlign: 'center' }}>
        {noLives
          ? 'Te quedaste sin vidas. Vuelven a las 00:00 (hora de Chile): repasa el Códice mientras tanto.'
          : `${node.subboss.name} sigue en pie. Repasa el Códice y vuelve a intentarlo: el duelo se reinicia con su HP completo.`}
      </Body>
      <View style={{ alignSelf: 'stretch', gap: space.sm }}>
        {canRetry && <Button label="⚔ Reintentar" onPress={onRetry} />}
        <Button label="Repasar Códice" variant="ghost" onPress={() => router.replace(`/modulo/${moduleId}/submodulo/${node.id}`)} />
      </View>
    </Panel>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  damage: { position: 'absolute', top: 0, alignSelf: 'center' },
  livesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.crypt,
    borderColor: colors.rune,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
})
