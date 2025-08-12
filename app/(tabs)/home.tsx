import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

import { isLoggedIn } from '../../lib/auth'

const { height } = Dimensions.get("window");

const data = [
  { id: "1", name: "Lugar 1", location: "Ciudad A", address: "Calle 123" },
  { id: "2", name: "Lugar 2", location: "Ciudad B", address: "Avenida 456" },
  { id: "3", name: "Lugar 3", location: "Ciudad C", address: "Carrera 789" },
  { id: "4", name: "Lugar 1", location: "Ciudad A", address: "Calle 123" },
  { id: "5", name: "Lugar 2", location: "Ciudad B", address: "Avenida 456" },
  { id: "6", name: "Lugar 3", location: "Ciudad C", address: "Carrera 789" },
  { id: "7", name: "Lugar 1", location: "Ciudad A", address: "Calle 123" },
  { id: "8", name: "Lugar 2", location: "Ciudad B", address: "Avenida 456" },
  { id: "9", name: "Lugar 3", location: "Ciudad C", address: "Carrera 789" },
  { id: "10", name: "Lugar 1", location: "Ciudad A", address: "Calle 123" },
  { id: "11", name: "Lugar 2", location: "Ciudad B", address: "Avenida 456" },
  { id: "12", name: "Lugar 3", location: "Ciudad C", address: "Carrera 789" },
  { id: "13", name: "Lugar 1", location: "Ciudad A", address: "Calle 123" },
  { id: "14", name: "Lugar 2", location: "Ciudad B", address: "Avenida 456" },
  { id: "15", name: "Lugar 3", location: "Ciudad C", address: "Carrera 789" },
];

export default function HomeScreen() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const validateSession = async () => {
      if (!(await isLoggedIn())) {
        router.replace('/login')
      } else {
        setChecking(false)
      }
    }
    validateSession()
  }, [])

  if (checking) return <ActivityIndicator size="large" style={{ flex: 1 }} />

  const renderItem = ({ item }: { item: typeof data[0] }) => (
    <TouchableOpacity
      style={[styles.card, { width: screenWidth - 20 }]}
      onPress={() => router.push({ pathname: "/detail", params: { id: item.id } })}
    >
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.location}</Text>
      <Text>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3, // sombra en Android
    shadowColor: "#000", // sombra en iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
});
