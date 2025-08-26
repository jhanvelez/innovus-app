import React, { useState, useEffect, useMemo } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native"
import { CameraView, useCameraPermissions } from 'expo-camera'
import {
  Button as RNButton,
  SearchBar,
} from 'react-native-elements'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'
import { Toast } from 'toastify-react-native'

// Api
import {
  useStoreReadigMutation,
} from '@/api/reading.api';

// Redux
import { useSelector } from 'react-redux';
import { meterSelectors } from '@/store/meter.slice';

// Types
import { Meter } from '@/types/Meter';

export default function DetailScreen() {
  const router = useRouter()
  const screenWidth = Dimensions.get("window").width;
  const [activeTab, setActiveTab] = useState<"reading" | "causal">("reading");

  const [modalVisible, setModalVisible] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [number, setNumber] = useState("");
  const [meterSelected, setMeterSelected] = useState<Meter | null>(null);

  const [storeReading, storeReadingResult] = useStoreReadigMutation()

  const causales = useMemo(() => {
    return [
      { id: "1", name: "Medidor dañado" },
      { id: "2", name: "Cliente ausente" },
      { id: "3", name: "Acceso bloqueado" },
      { id: "4", name: "Perro agresivo en el predio" },
      { id: "5", name: "Dirección incorrecta" },
      { id: "6", name: "Propiedad desocupada" },
      { id: "7", name: "Llave de acceso no entregada" },
      { id: "8", name: "Medidor sumergido en agua" },
      { id: "9", name: "Lectura ilegible" },
      { id: "10", name: "Medidor cubierto por objetos" },
      { id: "11", name: "Usuario negó el acceso" },
      { id: "12", name: "Medidor con vidrio roto" },
      { id: "13", name: "Medidor sin tapa de protección" },
      { id: "14", name: "Instalación peligrosa" },
      { id: "15", name: "Medidor vandalizado" },
      { id: "16", name: "Obra en construcción" },
      { id: "17", name: "Predio cerrado con candado" },
      { id: "18", name: "Medidor enterrado" },
      { id: "19", name: "Condiciones climáticas adversas" },
      { id: "20", name: "Medidor inexistente" },
      { id: "21", name: "Medidor reemplazado sin informar" },
      { id: "22", name: "Número de medidor no corresponde" },
      { id: "23", name: "Medidor manipulado" },
      { id: "24", name: "Riesgo eléctrico en la zona" },
      { id: "25", name: "Cliente impidió la toma de lectura" },
      { id: "26", name: "Medidor congelado" },
      { id: "27", name: "Alarma activa en el predio" },
      { id: "28", name: "Medidor sin sello de seguridad" },
      { id: "29", name: "Zona insegura" },
      { id: "30", name: "Obstáculo natural (árbol, ramas, etc.)" },
    ];
  }, []);

  const [search, setSearch] = useState("");
  const [filteredCausales, setFilteredCausales] = useState(causales);

  useEffect(() => {
    if (storeReadingResult.isSuccess) {
      Toast.success('Lectura registrada exitosamente!')
      setModalVisible(false);
      setPhoto(null);
      setNumber("");
      if (meters.length === 1) {
        router.back();
      }
    }

    if (storeReadingResult.isError) {
      Toast.error('Error al registrar la lectura, intenta nuevamente.')
    }
  }, [storeReadingResult]);

  // Obtener los medidores del store
  const meters = useSelector(meterSelectors.selectMeters) as Meter[];

  // Pedir permisos de cámara al cargar
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Necesitamos permisos para usar la cámara</Text>
        <Button title="Dar permisos" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef) {
      const result = await cameraRef.takePictureAsync();
      setPhoto(result.uri);
    }
  };

  const renderItem = ({ item }: { item: Meter }) => (
    <TouchableOpacity
      style={[styles.card, { width: screenWidth - 20 }]}
      onPress={() => {
        setMeterSelected(item)
        setModalVisible(true)
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.serial}>{item.serialNumber}</Text>
          <Text style={styles.brand}>{item.brand}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="water" size={26} color="#808080" />
          <Ionicons name="speedometer" size={26} color="#808080" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const updateSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const filtered = causales.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCausales(filtered);
    } else {
      setFilteredCausales(causales);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Listado de medidores del predio.</Text>

      {/* Ejemplo de caja que abre el modal */}

      {meters === undefined || meters.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -80 }}>
          <Text>No hay medidores disponibles.</Text>
        </View>
      ): (
        <FlatList
          data={meters ?? []}
          renderItem={renderItem}
          keyExtractor={(item: Meter) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
        />
      )}

      {/* Modal tipo bottom sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Tabs */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === "reading" && styles.tabActive]}
                onPress={() => setActiveTab("reading")}
              >
                <Text style={styles.tabText}>Hacer lectura</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === "causal" && styles.tabActive]}
                onPress={() => setActiveTab("causal")}
              >
                <Text style={styles.tabText}>Registrar causal</Text>
              </TouchableOpacity>
            </View>

            {/* Contenido dinámico */}
            {activeTab === "reading" ? (
              <>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={styles.modalTitle}>Registrar lectura</Text>

                  <RNButton
                    title="Guardar"
                    style={{ marginBottom: 15 }}
                    accessibilityLabel="Guardar lectura"
                    onPress={() => {
                      if (!meterSelected?.id) {
                        Alert.alert(
                          "Medidor",
                          "Debes seleccionar un medidor válido",
                        );
                        return;
                      }

                      const formData = new FormData();

                      formData.append("meterId", meterSelected.id);
                      formData.append("cycle", "A");
                      formData.append("route", "1");
                      formData.append("type", "EVIDENCE");

                      formData.append("evidence.value", String(number));

                      if (photo) {
                        formData.append("evidence.photo", {
                          uri: photo,
                          type: "image/jpeg",
                          name: "photo.jpg",
                        } as any);
                      }

                      storeReading(formData);
                    }}
                  />
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="987654321"
                  value={number}
                  onChangeText={setNumber}
                  keyboardType="number-pad"
                />

                {!photo ? (
                  <CameraView style={styles.camera} ref={(ref) => setCameraRef(ref)} />
                ) : (
                  <Image source={{ uri: photo }} style={styles.preview} />
                )}

                <View style={styles.buttonRow}>
                  {!photo ? (
                    <Button title="Tomar foto" onPress={takePhoto} />
                  ) : (
                    <Button title="Repetir" onPress={() => setPhoto(null)} />
                  )}
                  <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                </View>
              </>
            ) : (
              <>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <Text style={styles.modalTitle}>Seleccionar causal</Text>
                </View>

                <SearchBar
                  platform="default"
                  placeholder="Buscar causal..."
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

                <FlatList
                  data={filteredCausales}
                  keyExtractor={(item) => item.id}
                  style={{ maxHeight: 300 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.causalItem}
                      onPress={() => {
                        if (!meterSelected?.id) {
                          Alert.alert(
                            "Medidor",
                            "Debes seleccionar un medidor válido",
                          );
                          return;
                        }

                        const formData = new FormData();

                        formData.append("meterId", meterSelected.id);
                        formData.append("cycle", "A");
                        formData.append("route", "1");
                        formData.append("type", "CAUSAL");
                        formData.append("causalId", String(item.id));

                        storeReading(formData);
                      }}
                    >
                      <Text style={styles.causalText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />

                <Button title="Cerrar" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f8f9fa",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 15,
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

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "60%", // Mínimo la mitad de la pantalla
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  camera: {
    flex: 1,
    minHeight: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
  },
  preview: {
    flex: 1,
    minHeight: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  serial: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  brand: {
    fontSize: 16,
    fontWeight: "medium",
    marginBottom: 6,
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  causalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  causalText: {
    fontSize: 16,
  },
});
