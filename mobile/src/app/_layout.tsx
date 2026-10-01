import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p'
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import { StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ProfileProvider, useProfile } from '@/context/ProfileContext'
import { ToastProvider } from '@/context/ToastContext'
import { LivesProvider } from '@/context/LivesContext'
import { Loader } from '@/components/ui'
import { hydrateDemoStorage } from '@/lib/demoStorage'
import { isSupabaseConfigured } from '@/lib/supabase'
import { colors } from '@/theme'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })
  // En modo demo, el progreso guardado debe estar en memoria antes del primer uso de la API.
  const [storageReady, setStorageReady] = useState(isSupabaseConfigured)
  useEffect(() => {
    if (!isSupabaseConfigured) void hydrateDemoStorage().finally(() => setStorageReady(true))
  }, [])

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {fontsLoaded && storageReady ? (
        <AuthProvider>
          <ProfileProvider>
            <LivesProvider>
              <ToastProvider>
                <RootNavigator />
              </ToastProvider>
            </LivesProvider>
          </ProfileProvider>
        </AuthProvider>
      ) : (
        <Loader />
      )}
    </SafeAreaProvider>
  )
}

function RootNavigator() {
  const { user, demoMode, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const authed = demoMode || Boolean(user)
  const loading = authLoading || (authed && profileLoading)
  // Mientras carga el perfil no se sabe si tiene clase: se deja pasar y, si no
  // tiene, la guardia lo lleva a onboarding cuando termina de cargar. El navegador
  // nunca se desmonta, así no se pierde la ruta tras el login.
  const hasClass = profileLoading || Boolean(profile?.rpgClass)

  return (
    <View style={{ flex: 1, backgroundColor: colors.void }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.void },
          headerTintColor: colors.bone,
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.void },
        }}
      >
        <Stack.Protected guard={authed}>
          <Stack.Protected guard={hasClass}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modulo/[id]/index" options={{ title: 'Módulo' }} />
            <Stack.Screen name="modulo/[id]/submodulo/[sub]/index" options={{ title: 'Códice' }} />
            <Stack.Screen name="modulo/[id]/submodulo/[sub]/combate" options={{ title: 'Subjefe' }} />
            <Stack.Screen name="modulo/[id]/codice" options={{ title: 'El Códice' }} />
            <Stack.Screen name="modulo/[id]/raid" options={{ title: 'Boss Raid' }} />
            <Stack.Screen name="modulo/[id]/entrenar" options={{ title: 'Entrenamiento' }} />
          </Stack.Protected>
          <Stack.Screen name="onboarding" options={{ title: 'Elige tu clase' }} />
        </Stack.Protected>
        <Stack.Protected guard={!authed}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="auth-callback" options={{ headerShown: false }} />
      </Stack>
      {loading && (
        <View style={StyleSheet.absoluteFill}>
          <Loader />
        </View>
      )}
    </View>
  )
}
