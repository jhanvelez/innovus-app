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
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [number, setNumber] = useState("");

  // Pedir permisos de cámara al cargar
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
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

  if (hasPermission === null) {
    return <Text>Solicitando permisos de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No tienes acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de la ubicación</Text>
      <Text>ID: {id}</Text>

      {/* Ejemplo de caja que abre el modal */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => setModalVisible(true)}
      >
        <Text>Registrar medidor</Text>
      </TouchableOpacity>

      {/* Modal tipo bottom sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Registrar medidor</Text>

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
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
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
});
