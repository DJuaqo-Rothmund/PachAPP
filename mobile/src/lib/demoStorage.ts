import AsyncStorage from '@react-native-async-storage/async-storage'
import { setDemoStorage, type DemoStorage } from '@shared/lib/game/demoApi'

const PREFIX = 'pachapp-demo'

/**
 * El backend demo compartido lee y escribe de forma síncrona, pero AsyncStorage
 * es asíncrono. Se cargan los datos a memoria al iniciar la app y cada
 * escritura se replica a AsyncStorage en segundo plano.
 */
export async function hydrateDemoStorage(): Promise<void> {
  const cache = new Map<string, string>()
  const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith(PREFIX))
  for (const [key, value] of await AsyncStorage.multiGet(keys)) {
    if (value !== null) cache.set(key, value)
  }

  const storage: DemoStorage = {
    getItem: (key) => cache.get(key) ?? null,
    setItem: (key, value) => {
      cache.set(key, value)
      void AsyncStorage.setItem(key, value)
    },
    removeItem: (key) => {
      cache.delete(key)
      void AsyncStorage.removeItem(key)
    },
  }
  setDemoStorage(storage)
}
