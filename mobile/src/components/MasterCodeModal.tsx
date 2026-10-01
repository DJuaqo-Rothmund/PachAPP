import { useState } from 'react'
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, View } from 'react-native'
import { Body, Button, PixelText } from './ui'
import { useLives } from '@/context/LivesContext'
import { useProfile } from '@/context/ProfileContext'
import { gameApi } from '@/lib/game'
import { colors, fonts, radius, space } from '@/theme'

/** Pide la clave del modo maestro (cuenta de pruebas sin límites). */
export function MasterCodeModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { refresh } = useProfile()
  const { refresh: refreshLives } = useLives()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const close = () => {
    setCode('')
    setError(null)
    setDone(false)
    onClose()
  }

  const submit = async () => {
    if (!code || busy) return
    setBusy(true)
    setError(null)
    try {
      const ok = await gameApi.activateMasterMode(code)
      if (!ok) {
        setError('Clave incorrecta.')
        setCode('')
        return
      }
      await Promise.all([refresh(), refreshLives()])
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo activar el modo maestro')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.backdrop}>
        <View style={styles.card}>
          <PixelText size={11} tone="gold">
            🔮 Modo maestro
          </PixelText>
          {done ? (
            <>
              <Body tone="mist">
                Vidas ilimitadas, todos los submódulos y jefes abiertos y Boss Raid sin límite semanal. El daño que hagas sí cuenta para los
                jefes de la comunidad. Puedes desactivarlo desde tu perfil.
              </Body>
              <Button label="Entendido" onPress={close} />
            </>
          ) : (
            <>
              <Body tone="mist">Ingresa la clave de pruebas para desbloquear todo el contenido.</Body>
              <TextInput
                value={code}
                onChangeText={setCode}
                secureTextEntry
                keyboardType="number-pad"
                autoFocus
                placeholder="Clave"
                placeholderTextColor={colors.mist}
                style={styles.input}
                onSubmitEditing={() => void submit()}
                accessibilityLabel="Clave del modo maestro"
              />
              {error && <Body tone="blood">{error}</Body>}
              <Button label="Activar" onPress={() => void submit()} disabled={!code} loading={busy} />
              <Button label="Cancelar" variant="ghost" onPress={close} />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: space.lg },
  card: { backgroundColor: colors.crypt, borderColor: colors.rune, borderWidth: 1, borderRadius: radius.lg, padding: space.lg, gap: space.md },
  input: {
    borderWidth: 1,
    borderColor: colors.rune,
    backgroundColor: colors.void,
    borderRadius: radius.md,
    color: colors.bone,
    fontFamily: fonts.regular,
    fontSize: 16,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
})
