import { Stack } from 'expo-router';
import { Provider } from 'react-redux'
import { store } from '../store'

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ title: 'Predios', headerShown: false }} />
        <Stack.Screen name="detail" options={{ title: 'Medidores' }} />
      </Stack>
    </Provider>
  )
}
