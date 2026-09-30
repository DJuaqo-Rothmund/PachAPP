import Tabs from 'expo-router/js-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PixelSprite } from '@/components/PixelSprite'
import { BADGE_SPRITES, CLASS_SPRITES } from '@shared/components/pixel/sprites'
import { useProfile } from '@/context/ProfileContext'
import { useClassTheme } from '@/hooks/useClassTheme'
import { colors, fonts } from '@/theme'

export default function TabsLayout() {
  const { profile } = useProfile()
  const avatar = CLASS_SPRITES[profile?.rpgClass ?? 'druida']
  const { accent } = useClassTheme()
  // Altura explícita que incluye el margen de la barra de gestos de Android.
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.crypt,
          borderTopColor: colors.rune,
          height: 68 + insets.bottom,
          paddingTop: 4,
          paddingBottom: 4 + insets.bottom,
        },
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: colors.mist,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
        sceneStyle: { backgroundColor: colors.void },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Mapa', tabBarIcon: ({ focused }) => <PixelSprite rows={BADGE_SPRITES.leaf} size={20} muted={!focused} /> }}
      />
      <Tabs.Screen
        name="ranking"
        options={{ title: 'Ranking', tabBarIcon: ({ focused }) => <PixelSprite rows={BADGE_SPRITES.trophy} size={20} muted={!focused} /> }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Perfil', tabBarIcon: ({ focused }) => <PixelSprite rows={avatar} size={24} muted={!focused} /> }}
      />
    </Tabs>
  )
}
