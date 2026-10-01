import { useState } from 'react'
import { View } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Body, Button, ErrorPanel, Loader, Panel, PixelText, Screen } from '@/components/ui'
import { useToast } from '@/context/ToastContext'
import { useAsync } from '@/hooks/useAsync'
import { gameApi } from '@/lib/game'
import { space } from '@/theme'

export default function CodexScreen() {
  const moduleId = Number(useLocalSearchParams<{ id: string }>().id)
  const { announceBadges } = useToast()
  const [marking, setMarking] = useState(false)
  const [markError, setMarkError] = useState<string | null>(null)
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
  if (!module) {
    return (
      <Screen>
        <Panel>
          <Body tone="mist">Este módulo no existe.</Body>
        </Panel>
      </Screen>
    )
  }

  if (!module.unlocked) {
    return (
      <Screen>
        <Panel style={{ alignItems: 'center' }}>
          <PixelText size={11} tone="mist">
            🔒 Códice sellado
          </PixelText>
          <Body tone="mist" style={{ marginTop: space.md, textAlign: 'center' }}>
            La comunidad debe derrotar al jefe anterior para abrir este módulo.
          </Body>
        </Panel>
      </Screen>
    )
  }

  const goToRaid = async () => {
    setMarking(true)
    setMarkError(null)
    try {
      if (!module.codexRead) announceBadges(await gameApi.markCodexRead(module.id))
      router.replace(`/modulo/${module.id}/raid`)
    } catch (e) {
      setMarkError(e instanceof Error ? e.message : 'No se pudo registrar la lectura')
      setMarking(false)
    }
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: `Códice · ${module.title}` }} />
      <Body tone="mist" size={13}>
        Módulo {module.id} · Texto de estudio
      </Body>

      {module.codex.map((section) => (
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

      {markError && <Body tone="blood">{markError}</Body>}
      <Button
        label={module.codexRead ? 'Ir al Boss Raid' : 'He leído el Códice: ir al Boss Raid'}
        onPress={() => void goToRaid()}
        loading={marking}
      />
    </Screen>
  )
}
