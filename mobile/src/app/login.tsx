import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PixelSprite } from '@/components/PixelSprite'
import { Body, Button, PixelText } from '@/components/ui'
import { BADGE_SPRITES } from '@shared/components/pixel/sprites'
import { signInWithGoogle } from '@/lib/auth'
import { colors, space } from '@/theme'

export default function LoginScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      // Si inicia sesión, la navegación raíz cambia sola a la app.
      await signInWithGoogle()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

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

        <Button
          label="Entrar con Google"
          onPress={() => void handleLogin()}
          loading={loading}
          style={{ marginTop: space.xl * 1.5, alignSelf: 'stretch' }}
        />
        {error && (
          <Body tone="blood" style={{ marginTop: space.md, textAlign: 'center' }}>
            {error}
          </Body>
        )}

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
