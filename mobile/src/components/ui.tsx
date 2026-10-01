import type { ReactNode } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/AuthContext'
import { useClassTheme } from '@/hooks/useClassTheme'
import { ThemeBackdrop } from './ThemeBackdrop'
import { colors, fonts, mix, radius, space } from '@/theme'

/** Pantalla con fondo oscuro, scroll y aviso de modo demo. */
export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const { demoMode } = useAuth()
  const theme = useClassTheme()
  const body = scroll ? (
    <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
  ) : (
    <View style={[styles.content, { flex: 1 }]}>{children}</View>
  )
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ThemeBackdrop motif={theme.motif} color={theme.motifColor} />
      {demoMode && (
        <View style={styles.demoBanner}>
          <Text style={styles.demoText}>Modo demo · progreso guardado en este teléfono</Text>
        </View>
      )}
      {body}
    </SafeAreaView>
  )
}

/** Bloque de piedra tallada: borde teñido con la clase y bisel pixel (luz arriba, sombra abajo). */
export function Panel({
  children,
  style,
  parchment = false,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  /** Pergamino desgastado: para Códices y textos de estudio. */
  parchment?: boolean
}) {
  const { accentDim } = useClassTheme()
  return (
    <View
      style={[
        styles.panel,
        parchment ? styles.parchment : { borderColor: mix(accentDim, colors.rune, 0.55) },
        style,
      ]}
    >
      <View pointerEvents="none" style={styles.bevel} />
      {children}
    </View>
  )
}

type Tone = 'bone' | 'mist' | 'moss' | 'gold' | 'blood'

/**
 * Texto pixel. Desde tamaño 9 usa VT323 (títulos grandes y legibles, con sombra dura);
 * bajo 9 usa Press Start 2P para etiquetas pequeñas y sellos.
 */
export function PixelText({ children, size = 12, tone = 'bone', style, ...rest }: TextProps & { size?: number; tone?: Tone }) {
  const title = size >= 9
  const fontSize = title ? Math.round(size * 2.3) : size
  return (
    <Text
      {...rest}
      style={[
        title
          ? { fontFamily: fonts.title, fontSize, lineHeight: fontSize * 1.05, color: colors[tone], ...styles.titleShadow }
          : { fontFamily: fonts.pixel, fontSize, lineHeight: fontSize * 1.7, color: colors[tone] },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

export function Body({
  children,
  tone = 'bone',
  weight = 'regular',
  size = 15,
  style,
  ...rest
}: TextProps & { tone?: Tone; weight?: 'regular' | 'medium' | 'semibold' | 'bold'; size?: number }) {
  return (
    <Text {...rest} style={[{ fontFamily: fonts[weight], fontSize: size, lineHeight: size * 1.45, color: colors[tone] }, style]}>
      {children}
    </Text>
  )
}

/** Botón "chunky": color sólido, bordes rectos y un grosor inferior que se hunde al presionar. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: {
  label: string
  onPress: () => void
  variant?: 'primary' | 'ghost'
  disabled?: boolean
  loading?: boolean
  style?: StyleProp<ViewStyle>
}) {
  const primary = variant === 'primary'
  const { accent } = useClassTheme()
  const face = primary ? accent : '#353028'
  const inactive = disabled || loading
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      onPress={onPress}
      disabled={inactive}
      style={[{ opacity: inactive ? 0.5 : 1 }, style]}
    >
      {({ pressed }) => (
        <View style={[styles.buttonBase, { marginTop: pressed ? 5 : 0 }]}>
          <View style={[styles.button, { backgroundColor: face }]}>
            <View pointerEvents="none" style={[styles.buttonShine, pressed && { opacity: 0 }]} />
            {loading ? (
              <ActivityIndicator color={primary ? colors.ink : colors.bone} />
            ) : (
              <Text style={[styles.buttonLabel, { color: primary ? colors.ink : colors.bone }]}>{label}</Text>
            )}
          </View>
          {!pressed && <View style={[styles.buttonDepth, { backgroundColor: primary ? mix(accent, colors.ink, 0.35) : colors.ink }]} />}
        </View>
      )}
    </Pressable>
  )
}

export function Loader() {
  return (
    <View style={styles.loader}>
      <PixelText tone="moss" size={11}>
        Cargando...
      </PixelText>
    </View>
  )
}

export function ErrorPanel({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <Panel style={{ borderColor: colors.blood }}>
      <Body tone="blood">Algo salió mal: {error.message}</Body>
      {onRetry && <Button label="Reintentar" variant="ghost" onPress={onRetry} style={{ marginTop: space.md }} />}
    </Panel>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.void },
  content: { padding: space.lg, gap: space.lg, paddingBottom: space.xl * 2 },
  demoBanner: { backgroundColor: 'rgba(250, 204, 21, 0.1)', paddingVertical: 6, paddingHorizontal: space.lg },
  demoText: { color: colors.gold, fontFamily: fonts.regular, fontSize: 12, textAlign: 'center' },
  panel: {
    backgroundColor: colors.crypt,
    borderWidth: 2,
    borderRadius: radius.sm,
    padding: space.lg,
  },
  parchment: { backgroundColor: colors.leather, borderColor: '#5c4526' },
  bevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopColor: colors.bevelLight,
    borderLeftColor: colors.bevelLight,
    borderBottomColor: colors.bevelDark,
    borderRightColor: colors.bevelDark,
  },
  titleShadow: { textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0.1 },
  buttonBase: { borderWidth: 2, borderColor: colors.ink },
  button: {
    minHeight: 44,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderRightColor: 'rgba(0, 0, 0, 0.25)',
  },
  buttonDepth: { height: 5 },
  buttonLabel: { fontFamily: fonts.title, fontSize: 24, lineHeight: 26, letterSpacing: 0.5 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.void },
})
