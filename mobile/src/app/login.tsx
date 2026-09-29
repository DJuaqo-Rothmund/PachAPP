import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PixelSprite } from '@/components/PixelSprite'
import { Body, Panel, PixelText } from '@/components/ui'
import { BADGE_SPRITES } from '@shared/components/pixel/sprites'
import { colors, space } from '@/theme'

// El login con Google nativo llega en el hito 3 (requiere credenciales Android en Google Cloud).
export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.center}>
        <PixelSprite rows={BADGE_SPRITES.leaf} size={72} />
        <PixelText size={22} tone="moss" style={{ marginTop: space.xl }}>
          Pachapp
        </PixelText>
        <Body tone="mist" style={{ marginTop: space.sm, textAlign: 'center' }}>
          Aprende agronomía. Derrota jefes. Gana loot.
        </Body>
        <Panel style={{ marginTop: space.xl, width: '100%' }}>
          <Body tone="gold" style={{ textAlign: 'center' }}>
            El inicio de sesión con Google estará disponible pronto.
          </Body>
        </Panel>
        <Body tone="mist" size={12} style={{ marginTop: space.xl }}>
          by DJuaqo
        </Body>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
})
