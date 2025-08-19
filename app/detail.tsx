import React, { useState, useEffect } from "react";
import {
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
import { Button as RNButton } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'

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
  const screenWidth = Dimensions.get("window").width;

  const [modalVisible, setModalVisible] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [number, setNumber] = useState("");
  const [meterSelected, setMeterSelected] = useState<Meter | null>(null);

  const [storeReading, storeReadingResult] = useStoreReadigMutation()

  useEffect(() => {
    if (storeReadingResult.isSuccess) {
      console.log("Reading stored successfully:", storeReadingResult.data);
      setModalVisible(false);
      setPhoto(null);
      setNumber("");
    }

    if (storeReadingResult.isError) {
      console.error("Error storing reading:", storeReadingResult.error);
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
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.modalTitle}>Registrar lectura</Text>

              <RNButton
                title="Guardar"
                style={{ marginBottom: 15 }}
                accessibilityLabel="Guardar lectura"
                onPress={() => {
                  // Formdata para enviar
                  const formData = new FormData();
                  formData.append("meterId", meterSelected?.id ?? "");
                  formData.append("reading", number);
                  formData.append("cycle", "A");
                  formData.append("route", "1");
                  
                  if (photo) {
                    formData.append(
                      "photo",
                      {
                        uri: photo,
                        type: "image/jpeg",
                        name: "photo.jpg",
                      } as unknown as Blob
                    );
                  }

                  console.log("Submitting reading:", formData.values);

                  storeReading(formData);
                }}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Número del medidor"
              value={number}
              onChangeText={setNumber}
              keyboardType="numeric"
            />

            {/* Cámara */}
            {!photo ? (
              <CameraView
                style={styles.camera}
                ref={(ref) => setCameraRef(ref)}
              />
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
    minHeight: "50%", // Mínimo la mitad de la pantalla
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
    minHeight: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
});
