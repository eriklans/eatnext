import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState(null);

  // Körs när kameran hittar en streckkod
  function handleBarcodeScanned(result) {
    setScannedCode(result.data);
  }

  // Läge 1: behörigheten har inte laddats än
  if (!permission) {
    return <View/>;
  }

  // Läge 2: användaren har inte gett behörighet
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>EatNext behöver kameran för att skanna streckkoder.</Text>
        <Button title='Ge åtkomst till kameran' onPress={requestPermission} />
      </View>
    );
  }

  // Läge 3: behörighet finns
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          // EAN och UPC är de streckkodstyper som används på matvaror
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
        // Pausa skanningen när kod redan finns, annars läser det samma kod många gånger i sekunden
        onBarcodeScanned={scannedCode ? undefined : handleBarcodeScanned}
      />

      <View style={styles.result}>
        {scannedCode ? (
          <>
            <Text style={styles.code}>{scannedCode}</Text>
            <Button title="Skanna igen" onPress={() => setScannedCode(null)} />
          </>
        ) : (
          <Text>Rikta kameran mot en streckkod</Text>
        )}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  result: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  code: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
