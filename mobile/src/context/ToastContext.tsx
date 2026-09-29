import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { Badge } from '@shared/data/types'
import { BadgeIcon } from '@/components/game'
import { Body, PixelText } from '@/components/ui'
import { loadBadgeCatalog } from '@/lib/badgeCatalog'
import { colors, radius, space } from '@/theme'

interface Toast {
  id: number
  badge: Badge
}

interface ToastContextValue {
  /** Muestra una notificación de "¡Loot obtenido!" por cada emblema nuevo. */
  announceBadges: (badgeIds: string[]) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)
let nextId = 1
const MAX_VISIBLE = 2
const TOAST_MS = 3500

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const insets = useSafeAreaInsets()
  // Máximo dos a la vez para no tapar la pantalla; el resto espera su turno.
  const visible = toasts.slice(0, MAX_VISIBLE)
  const visibleKey = visible.map((t) => t.id).join(',')

  useEffect(() => {
    const timers = visible.map((toast) =>
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== toast.id)), TOAST_MS),
    )
    return () => timers.forEach(clearTimeout)
    // Solo reinicia los timers cuando cambia qué notificaciones están a la vista.
  }, [visibleKey])

  const announceBadges = useCallback((badgeIds: string[]) => {
    if (badgeIds.length === 0) return
    loadBadgeCatalog()
      .then((catalog) => {
        const fresh = badgeIds
          .map((id) => catalog.find((b) => b.id === id))
          .filter((b): b is Badge => Boolean(b))
          .map((badge) => ({ id: nextId++, badge }))
        setToasts((t) => [...t, ...fresh])
      })
      .catch(() => {
        // Sin catálogo no hay notificación; el emblema igual queda en el perfil.
      })
  }, [])

  return (
    <ToastContext.Provider value={{ announceBadges }}>
      {children}
      <View pointerEvents="none" style={[styles.stack, { top: insets.top + space.sm }]}>
        {visible.map((t) => (
          <ToastCard key={t.id} badge={t.badge} />
        ))}
      </View>
    </ToastContext.Provider>
  )
}

function ToastCard({ badge }: { badge: Badge }) {
  const enter = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.spring(enter, { toValue: 1, useNativeDriver: true, friction: 7 }).start()
  }, [enter])

  return (
    <Animated.View
      accessibilityRole="alert"
      style={[
        styles.card,
        { opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] },
      ]}
    >
      <BadgeIcon icon={badge.icon} size={40} />
      <View style={{ flex: 1 }}>
        <PixelText size={8} tone="gold">
          ¡Loot obtenido!
        </PixelText>
        <Body weight="semibold" size={14} style={{ marginTop: 2 }}>
          {badge.name}
        </Body>
      </View>
    </Animated.View>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}

const styles = StyleSheet.create({
  stack: { position: 'absolute', left: space.lg, right: space.lg, gap: space.sm, zIndex: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.crypt,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    elevation: 8,
  },
})
