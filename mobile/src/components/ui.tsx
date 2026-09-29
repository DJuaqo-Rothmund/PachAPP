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
import { colors, fonts, radius, space } from '@/theme'

/** Pantalla con fondo oscuro, scroll y aviso de modo demo. */
export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const { demoMode } = useAuth()
  const body = scroll ? (
    <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
  ) : (
    <View style={[styles.content, { flex: 1 }]}>{children}</View>
  )
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {demoMode && (
        <View style={styles.demoBanner}>
          <Text style={styles.demoText}>Modo demo · progreso guardado en este teléfono</Text>
        </View>
      )}
      {body}
    </SafeAreaView>
  )
}

export function Panel({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.panel, style]}>{children}</View>
}

type Tone = 'bone' | 'mist' | 'moss' | 'gold' | 'blood'

export function PixelText({ children, size = 12, tone = 'bone', style, ...rest }: TextProps & { size?: number; tone?: Tone }) {
  return (
    <Text {...rest} style={[{ fontFamily: fonts.pixel, fontSize: size, lineHeight: size * 1.7, color: colors[tone] }, style]}>
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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.buttonPrimary : styles.buttonGhost,
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? colors.void : colors.bone} />
      ) : (
        <Text style={[styles.buttonLabel, { color: primary ? colors.void : colors.bone }]}>{label}</Text>
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
    borderColor: colors.rune,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: { backgroundColor: colors.moss },
  buttonGhost: { borderWidth: 1, borderColor: colors.rune },
  buttonLabel: { fontFamily: fonts.semibold, fontSize: 15 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.void },
})
