import { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { isLoggedIn } from '../lib/auth'
import { useRouter } from 'expo-router'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const logged = await isLoggedIn()
      router.replace(logged ? '/home' : '/login')
    }
    check()
  }, [])

  return <ActivityIndicator size="large" style={{ flex: 1 }} />
}
