import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  Text,
  SearchBar,
  Button as RNButton,
} from "react-native-elements";
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

// Api
import {
  usePropertiesMetersQuery,
} from '@/api/propety.api';
import {
  useActiveReadigSessionQuery,
  useStoreReadigSessionMutation,
} from '@/api/reading-session.api'

// Utils
import { isLoggedIn } from '@/lib/auth'

// Types
import { Property } from '@/types/Property';

// Components
import PropertyCard from '@/components/PropetyCard';

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const screenWidth = Dimensions.get("window").width;

  const {
    data: properties,
    isLoading,
    refetch: refetchProperties,
  } = usePropertiesMetersQuery({});

  const {
    data: readingSession,
    isLoading: isLoadingSession,
  } = useActiveReadigSessionQuery({});
  const [storeReadigSession, storeReadigSessionResult] = useStoreReadigSessionMutation();

  useEffect(() => {
    if (readingSession) {
      console.log(readingSession.isActive);
    }
  }, [readingSession]);

  const [search, setSearch] = useState("");

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setRefreshing(true);

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

  const [filteredProperties, setFilteredProperties] = useState();

  useEffect(() => {
    setFilteredProperties(propetiesList);
  }, [propetiesList])

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

  const updateSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const filtered = properties.data.filter((item: Property) =>
        item.address.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties.data);
    }
  };

  if (checking) return <ActivityIndicator size="large" style={{ flex: 1 }} />

  const renderItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={[styles.card, { width: screenWidth - 20 }]}
      onPress={() => {
        //dispatch(setMeters(item.meters))
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
    readingSession
      && readingSession.isActive === true ? (
      <View style={styles.container}>
        <SearchBar
          platform="default"
          placeholder="Buscar propiedad..."
          onChangeText={updateSearch}
          value={search}
          lightTheme
          round
          containerStyle={{
            backgroundColor: "transparent",
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          inputContainerStyle={{
            backgroundColor: "#eee",
          }}

          loadingProps={{}}
          showLoading={false}
          onClear={() => setSearch("")}
          onFocus={() => {}}
          onBlur={() => {}}
          onCancel={() => {}}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#808080" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredProperties}
            renderItem={({ item }) => <PropertyCard item={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 10 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    ) : (
      <View style={styles.containerButton}>
        <RNButton
          title="Iniciar lectura"
          loading={isLoadingSession || storeReadigSessionResult.isLoading}
          titleStyle={{
            fontWeight: '600',
            color: '#dde8f0',
            fontSize: 20,
          }}
          buttonStyle={{
            backgroundColor: 'rgba(0, 69, 129, 1)',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 20,
            paddingVertical: 5,
          }}
          containerStyle={{
            width: 300,
            height: 60,
            marginHorizontal: 50,
            marginVertical: 10,
          }}
          onPress={() => {
            storeReadigSession({});
          }}
        />
      </View>
    )
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerButton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 1000,
    backgroundColor: "#fff",
    paddingTop: (height/2)-120
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
