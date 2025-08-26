import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

// Redux
import { setMeters } from '@/store/meter.slice';

// Types
import { Property } from '@/types/Property';

export default function PropertyCard({ item }: {item : Property}) {
  const router = useRouter()
  const dispatch = useDispatch()

  const screenWidth = Dimensions.get("window").width;

  return (
    <TouchableOpacity
        key={item.id}
        style={[{ width: screenWidth - 20 }]}
        onPress={() => {
          dispatch(setMeters(item.meters))
          router.push({ pathname: "/detail" })
        }}
      >
      <LinearGradient
        colors={["#97cbdc", "#004581"]}
        style={styles.card}
        start={{ x: 0, y: 2 }}
        end={{ x: 1, y: 3 }}
      >
        <View style={styles.row}>
          <Ionicons name="home" size={26} color="#001b48" />

          <View style={styles.info}>
            <Text style={styles.name}>TRULULU</Text>
            <Text style={styles.address}>{item.address}</Text>
          </View>

          <View style={styles.ranking}>
            <Text style={styles.rankText}>{item.meters.length}</Text>
            <Text style={styles.rankLabel}>Medidor(s)</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#001b48",
  },
  address: {
    fontSize: 14,
    fontWeight: "600",
    color: "#001b48",
    marginTop: 2,
  },
  ranking: {
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#dde8f0",
  },
  rankLabel: {
    fontSize: 12,
    color: "#dde8f0",
  },
});