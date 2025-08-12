// app/login.tsx
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, TextInput, Alert, StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-elements'
import { isLoggedIn, setSessionToken } from '../../lib/auth'

// Api
import {
  useLoginMutation,
} from "../../api/auth.api"

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    const checkSession = async () => {
      if (await isLoggedIn()) {
        router.replace('/home')
      }
    }
    checkSession()
  }, [])

  const handleLogin = async () => {
    try {
      const response = await login({ email, password }).unwrap()

      await setSessionToken(response.token)

      router.replace('/home')
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Credenciales inválidas')
    }
  }

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        Iniciar sesión
      </Text>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        title={isLoading ? 'Cargando...' : 'Entrar'}
        onPress={handleLogin}
        loading={isLoading}
        disabled={isLoading}
        containerStyle={{ marginTop: 20 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
})
