import { useState } from 'react'
import { Linking, View } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { OptionButton, optionState } from '@/components/BattleScreen'
import { SubbossFrame } from '@/components/game'
import { Body, Button, ErrorPanel, Loader, Panel, PixelText, Screen } from '@/components/ui'
import { useToast } from '@/context/ToastContext'
import { useAsync } from '@/hooks/useAsync'
import { gameApi } from '@/lib/game'
import type { CodexCheckpoint } from '@shared/data/types'
import { space } from '@/theme'

/** Códice de un submódulo: texto, video (cuando exista) y checkpoints de control. */
export default function SubmoduleCodexScreen() {
  const params = useLocalSearchParams<{ id: string; sub: string }>()
  const moduleId = Number(params.id)
  const submoduleId = params.sub ?? ''
  const { announceBadges } = useToast()
  const [marking, setMarking] = useState(false)
  const [markError, setMarkError] = useState<string | null>(null)
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([gameApi.getModuleTree(moduleId), gameApi.getSubmoduleCodex(submoduleId)]),
    [moduleId, submoduleId],
  )

  if (loading) return <Loader />
  if (error) {
    return (
      <Screen>
        <ErrorPanel error={error} onRetry={reload} />
      </Screen>
    )
  }

  const [tree, codex] = data!
  const node = tree.find((n) => n.id === submoduleId)
  if (!node || !node.unlocked) {
    return (
      <Screen>
        <Panel style={{ alignItems: 'center', gap: space.md }}>
          <PixelText size={11} tone="mist">
            🔒 Códice sellado
          </PixelText>
          <Body tone="mist" style={{ textAlign: 'center' }}>
            Derrota al subjefe anterior para abrir este submódulo.
          </Body>
        </Panel>
      </Screen>
    )
  }

  const goToFight = async () => {
    setMarking(true)
    setMarkError(null)
    try {
      if (!node.codexRead) announceBadges(await gameApi.markSubmoduleCodexRead(submoduleId))
      if (node.subboss.defeated) router.back()
      else router.replace(`/modulo/${moduleId}/submodulo/${submoduleId}/combate`)
    } catch (e) {
      setMarkError(e instanceof Error ? e.message : 'No se pudo registrar la lectura')
      setMarking(false)
    }
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: `Códice ${node.order} · ${node.title}` }} />
      <View>
        <Body tone="mist" size={13}>
          Submódulo {node.order} · Códice
        </Body>
        <PixelText size={12} tone="moss" style={{ marginTop: space.xs }}>
          {codex.title}
        </PixelText>
      </View>

      {codex.videoUrl && <Button label="▶ Ver video del Códice" variant="ghost" onPress={() => void Linking.openURL(codex.videoUrl!)} />}

      {codex.sections.map((section) => (
        <Panel key={section.heading} parchment>
          <PixelText size={12} tone="gold">
            {section.heading}
          </PixelText>
          <View style={{ gap: space.md, marginTop: space.md }}>
            {section.body.map((paragraph, i) => (
              <Body key={i} size={16} style={{ lineHeight: 25 }}>
                {paragraph}
              </Body>
            ))}
          </View>
        </Panel>
      ))}

      {codex.checkpoints.length > 0 && (
        <View style={{ gap: space.md }}>
          <PixelText size={9} tone="gold">
            Checkpoints de control
          </PixelText>
          {codex.checkpoints.map((cp) => (
            <Checkpoint key={cp.id} checkpoint={cp} onPassed={() => void gameApi.passCheckpoint(submoduleId, cp.id).catch(() => undefined)} />
          ))}
          <Body tone="mist" size={12}>
            Los checkpoints son práctica: no gastan vidas ni dan XP.
          </Body>
        </View>
      )}

      <SubbossFrame submoduleId={node.id} name={node.subboss.name} title={node.subboss.title} defeated={node.subboss.defeated} spriteSize={40}>
        <Body tone="mist" size={12} style={{ marginTop: 4 }}>
          {node.subboss.defeated ? 'Ya lo derrotaste.' : `Te espera al final de este Códice · ${node.subboss.maxHp} HP`}
        </Body>
      </SubbossFrame>

      {markError && <Body tone="blood">{markError}</Body>}
      <Button
        label={node.subboss.defeated ? 'Volver al módulo' : node.codexRead ? '⚔ Enfrentar al subjefe' : 'He leído el Códice: ⚔ combatir'}
        onPress={() => void goToFight()}
        loading={marking}
      />
    </Screen>
  )
}

function Checkpoint({ checkpoint, onPassed }: { checkpoint: CodexCheckpoint; onPassed: () => void }) {
  const [picked, setPicked] = useState<string | null>(null)
  const correctAnswer = checkpoint.options[checkpoint.correctIndex]
  const correct = picked === correctAnswer

  const pick = (option: string) => {
    if (picked) return
    setPicked(option)
    if (option === correctAnswer) onPassed()
  }

  return (
    <Panel>
      <Body tone="gold" size={11} style={{ textTransform: 'uppercase' }}>
        ◆ Checkpoint
      </Body>
      <Body weight="semibold" size={16} style={{ marginTop: space.sm }}>
        {checkpoint.prompt}
      </Body>
      <View style={{ gap: space.sm, marginTop: space.md }}>
        {checkpoint.options.map((option, i) => (
          <OptionButton
            key={option}
            label={option}
            letter={String.fromCharCode(65 + i)}
            state={optionState(option, picked, picked ? { correctAnswer } : null)}
            disabled={Boolean(picked)}
            onPress={() => pick(option)}
          />
        ))}
      </View>
      {picked && (
        <View style={{ marginTop: space.md, gap: space.sm }}>
          <Body tone={correct ? 'moss' : 'blood'} size={14}>
            {correct ? '¡Correcto! ' : 'No es esa. '}
            <Body tone="mist" size={14}>
              {checkpoint.explanation}
            </Body>
          </Body>
          {!correct && <Button label="Reintentar" variant="ghost" onPress={() => setPicked(null)} />}
        </View>
      )}
    </Panel>
  )
}
