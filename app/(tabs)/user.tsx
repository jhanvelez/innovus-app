
import React, { useEffect, useMemo } from 'react'
import { useRouter } from 'expo-router'

import { View, StyleSheet } from 'react-native'
import { Avatar, Text, Button } from 'react-native-elements'

import { logout } from '../../lib/auth'

// Api
import {
  useUserQuery
} from '../../api/user.api'

export default function User() {
  const router = useRouter()

  const { data: userData } = useUserQuery({ search: "", page: 1, limit: 1000 })

    const user = useMemo(() => {
    if (!userData) return null;

    return userData
  }, [userData]);

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  return (
    <View style={styles.container}>
      {user != null && (
        <>
          <Avatar
            rounded
            size="xlarge"
            source={{ uri: 'https://i.pravatar.cc/150?img=68' }}
            containerStyle={styles.avatar}
          />
          <Text h4 style={styles.name}>{user.firstName}{" "}{user.lastName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </>
      )}
      

      <Button
        title="Cerrar sesión"
        type="outline"
        onPress={handleLogout}
        buttonStyle={styles.logoutButton}
        titleStyle={styles.logoutTitle}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    marginBottom: 20,
  },
  name: {
    marginBottom: 5,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    borderColor: '#007BFF',
    paddingHorizontal: 20,
  },
  logoutTitle: {
    color: '#007BFF',
  },
})
