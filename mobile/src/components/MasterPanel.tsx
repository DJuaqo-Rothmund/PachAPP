import { useState } from 'react'
import { Alert, View } from 'react-native'
import { Body, Button, Panel, PixelText } from './ui'
import { useLives } from '@/context/LivesContext'
import { useProfile } from '@/context/ProfileContext'
import { gameApi, type TesterResetScope } from '@/lib/game'
import { space } from '@/theme'

const ACTIONS: { scope: TesterResetScope; label: string; confirm: string }[] = [
  { scope: 'lives', label: '❤ Recargar mis vidas', confirm: '¿Recargar tus 3 vidas de hoy?' },
  {
    scope: 'progress',
    label: '↺ Reiniciar mi progreso y XP',
    confirm: 'Se borrarán tu XP, respuestas, lecturas de Códices, raids, subjefes derrotados y emblemas.',
  },
  {
    scope: 'bosses',
    label: '♛ Restaurar HP de todos los jefes',
    confirm: 'Todos los jefes vuelven a su HP completo y se bloquean los módulos que abrió la comunidad. Afecta a TODOS los jugadores.',
  },
  {
    scope: 'all',
    label: '⚠ Reiniciar todo',
    confirm: 'Se reinician tu progreso, tus vidas y el HP de todos los jefes (afecta a TODOS los jugadores).',
  },
]

/** Herramientas de prueba visibles solo en modo maestro. `onDone` recarga la pantalla que lo muestra. */
export function MasterPanel({ onDone }: { onDone?: () => void }) {
  const { profile, refresh } = useProfile()
  const { refresh: refreshLives } = useLives()
  const [busy, setBusy] = useState<TesterResetScope | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  if (!profile?.isTester) return null

  const run = async (scope: TesterResetScope) => {
    setBusy(scope)
    setMessage(null)
    try {
      await gameApi.testerReset(scope)
      await Promise.all([refresh(), refreshLives()])
      onDone?.()
      setMessage('Listo: reinicio aplicado.')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'No se pudo reiniciar')
    } finally {
      setBusy(null)
    }
  }

  const ask = (a: (typeof ACTIONS)[number]) =>
    Alert.alert(a.label, a.confirm, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Reiniciar', style: 'destructive', onPress: () => void run(a.scope) },
    ])

  return (
    <Panel style={{ borderColor: 'rgba(250, 204, 21, 0.4)', backgroundColor: 'rgba(250, 204, 21, 0.05)', gap: space.sm }}>
      <PixelText size={9} tone="gold">
        🔮 Panel del modo maestro
      </PixelText>
      <Body tone="mist" size={12}>
        Todo desbloqueado · vidas ilimitadas · raids sin límite
      </Body>
      <View style={{ gap: space.sm, marginTop: space.xs }}>
        {ACTIONS.map((a) => (
          <Button key={a.scope} label={a.label} variant="ghost" loading={busy === a.scope} disabled={busy !== null} onPress={() => ask(a)} />
        ))}
      </View>
      {message && (
        <Body tone={message.startsWith('Listo') ? 'moss' : 'blood'} size={13}>
          {message}
        </Body>
      )}
    </Panel>
  )
}
