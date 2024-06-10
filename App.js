import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(true);
  const cameraRef = useRef(null); 

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>Nous avons besoin de votre autorisation pour montrer la caméra</Text>
        <Button onPress={requestPermission} title="Accorder l'autorisation" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function displayResultBarCode(e) {
    alert(e.data);
    console.log(e.data);
    setCameraActive(false);
  }

  function rescanQR() {
    setCameraActive(true);
  }

  async function takePicture() {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      console.log(photo.uri);

      try {
        // Enregistrez la photo dans le répertoire Pictures
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        await MediaLibrary.createAlbumAsync('Pictures', asset, false);
        console.log('Photo sauvegardée sur:', asset.uri);
      } catch (e) {
        console.log("Échec de l'enregistrement de la photo sur le disque'", e);
      }
    }
  }

  return (
    <View style={styles.container}>
      {cameraActive ? (
        <CameraView
          ref={cameraRef} 
          style={styles.camera}
          facing={facing}
          barcodeSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(e) => {
            displayResultBarCode(e);
          }}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Basculer la caméra</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Prendre une photo</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <Button onPress={rescanQR} title="Scanner un QR code ou reprendre une photo." />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5FCFF", 
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 20,
    justifyContent: "space-between", 
    alignItems: "flex-end",
  },
  button: {
    flex: 1, 
    paddingHorizontal: 20,
    paddingVertical: 15, 
    backgroundColor: "#1E90FF",
    borderRadius: 10, 
    margin: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});