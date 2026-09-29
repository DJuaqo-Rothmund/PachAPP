import { useLocalSearchParams } from 'expo-router'
import { Body, Panel, Screen } from '@/components/ui'

// Se implementa en el hito 2 (pantallas del juego).
export default function RaidScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <Screen>
      <Panel>
        <Body tone="mist">El Boss Raid del módulo {id} llega en el próximo hito.</Body>
      </Panel>
    </Screen>
  )
}
