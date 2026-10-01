import { useEffect, useRef } from 'react'
import { Animated, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { colors } from '@/theme'

const LOGO = require('../../assets/logo.png')

/** Pantalla de carga al abrir la app: el logo de Pachapp con un aviso que late. */
export function BootScreen() {
  const { width } = useWindowDimensions()
  const pulse = useRef(new Animated.Value(0.4)).current
  const size = Math.min(320, width * 0.78)

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [pulse])

  return (
    <View style={styles.screen}>
      <Image source={LOGO} style={{ width: size, height: size }} resizeMode="contain" accessibilityLabel="Pachapp" />
      {/* Sin la fuente pixel: al abrir la app todavía se está cargando. */}
      <Animated.View style={{ opacity: pulse, marginTop: 24 }}>
        <Text style={styles.text}>Cargando…</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.void },
  text: { color: colors.gold, fontSize: 14, letterSpacing: 2 },
})
