import { Body, Panel, PixelText, Screen } from '@/components/ui'
import { space } from '@/theme'

// Se implementa en el hito 2 (pantallas del juego).
export default function RankingScreen() {
  return (
    <Screen>
      <PixelText size={14}>Ranking mensual</PixelText>
      <Panel>
        <Body tone="mist" style={{ marginTop: space.xs }}>
          Próximamente.
        </Body>
      </Panel>
    </Screen>
  )
}
