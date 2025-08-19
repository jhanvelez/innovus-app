import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native-elements";
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'

// Redux
import { setMeters } from '@/store/meter.slice'

// Api
import {
  usePropertiesMetersQuery,
} from '@/api/propety.api';

// Utils
import { isLoggedIn } from '@/lib/auth'

// Types
import { Property } from '@/types/Property';

export default function HomeScreen() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [checking, setChecking] = useState(true)
  const screenWidth = Dimensions.get("window").width;

  const {
    data: properties,
    isLoading,
    refetch: refetchProperties,
  } = usePropertiesMetersQuery({});

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Simular una carga (puede ser fetch a API)
    setTimeout(() => {
      refetchProperties();
      setRefreshing(false);
    }, 1500);
  }, [refetchProperties]);

  const propetiesList = useMemo(() => {
    if (!properties) return [];
    return properties.data.map((property: Property) => ({
      id: property.id,
      cadastralRecord: property.cadastralRecord,
      address: property.address,
      meters: property.meters || [],
    }));
  }, [properties]);

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

  const renderItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={[styles.card, { width: screenWidth - 20 }]}
      onPress={() => {
        dispatch(setMeters(item.meters))
        router.push({ pathname: "/detail" })
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text>{item.meters.length} - Medidores</Text>
          <Text style={styles.title}>{item.cadastralRecord}</Text>
          <Text style={styles.subtitle}>{item.address}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Icono de casa */}
          <Ionicons name="home" size={26} color="#808080" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#808080" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={propetiesList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
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
  subtitle: {
    fontSize: 16,
    fontWeight: "medium",
    marginBottom: 6,
  },
});
