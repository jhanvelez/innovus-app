// app/login.tsx
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, TextInput, Alert, StyleSheet, Image, TouchableOpacity , Dimensions} from 'react-native'
import { Button, Text } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient';

import { isLoggedIn, setSessionToken } from '../../lib/auth'

// Api
import { useLoginMutation } from "../../api/auth.api"

// Dimensions
const { width, height } = Dimensions.get("window");

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
      <LinearGradient
        colors={['#dde8f0', '#97cbdc', '#018abd']} // colores del degradado
        start={{ x: 1, y: 0.6 }}   // punto de inicio
        end={{ x: 1, y: 1 }}     // punto final
        style={styles.gradient}
      >
        {/* Logo */}
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />

        {/* Título */}
        <Text h3 style={styles.title}>Bienvenido de nuevo 👋</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        {/* Formulario */}
        <View style={styles.form}>
          <TextInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
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
            buttonStyle={styles.button}
            containerStyle={{ marginTop: 10 }}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F9FF' },
  logo: { width: 400, height: 200, alignSelf: 'center', marginTop: 90, marginBottom: 30 },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 },
  form: { padding: 20, borderRadius: 12, elevation: 3 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    marginBottom: 12, 
    borderRadius: 8, 
    backgroundColor: '#fff' 
  },
  forgotPassword: { alignItems: 'center', marginTop: 15 },
  forgotText: { fontSize: 12, color: '#666' },
  button: { backgroundColor: '#004581', borderRadius: 30, paddingVertical: 12 },
  gradient: {
    width: width,
    height: height,
    justifyContent: 'flex-start',
  },
})
