import { Stack } from 'expo-router';
import { Provider } from 'react-redux'
import ToastManager from 'toastify-react-native'
import { store } from '../store'

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ToastManager />
      <Stack>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ title: 'Predios', headerShown: false }} />
        <Stack.Screen name="detail" options={{ title: 'Medidores' }} />
      </Stack>
    </Provider>
  )
}
