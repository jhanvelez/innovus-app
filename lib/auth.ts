import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN_KEY = 'auth_token'

export const login = async (email: string, password: string) => {
  if (email === 'test@example.com' && password === '123456') {
    const token = 'FAKE_TOKEN_123'
    await AsyncStorage.setItem(TOKEN_KEY, token)
    return { token }
  } else {
    throw new Error('Credenciales inválidas')
  }
}

export const prepareHeaders = async (headers: Headers) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY) // ✅
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
}

export const logout = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY)
}

export const isLoggedIn = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY)
  return !!token
}

export const getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY)
}

export const setSessionToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token)
}
