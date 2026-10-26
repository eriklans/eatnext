import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { fetchProduct } from '../services/openFoodFacts';
import { useState, useRef } from 'react';

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Spärr som stoppar dubbla skanningar direkt, innan React hunnit rita om
  const isHandlingScan = useRef(false);

  // Körs när kameran hittar en streckkod: hämtar varan och går vidare till "Lägg till vara"
  async function handleBarcodeScanned(result) {
    if (isHandlingScan.current) {
      return;
    }
    isHandlingScan.current = true;

    setScannedCode(result.data);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const product = await fetchProduct(result.data);
      goToAddItem(result.data, product);
    } catch (error) {
      setErrorMessage('Kunde inte hämta varan. Kontrollera din internetanslutning.');
    } finally {
      setIsLoading(false);
    }
  }

  // Skickar vidare koden och varan till "Lägg till vara"
  function goToAddItem(barcode, product) {
    navigation.replace('AddItem', {
      barcode,
      name: product?.name ?? '',
      imageUrl: product?.imageUrl ?? null,
      found: product !== null,
    });
  }

  function resetScan() {
    isHandlingScan.current = false;
    setScannedCode(null);
    setErrorMessage(null);
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
        // EAN och UPC är de streckkodstyper som används på matvaror
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
        // Pausa skanningen när kod redan finns, annars läser det samma kod många gånger i sekunden
        onBarcodeScanned={scannedCode ? undefined : handleBarcodeScanned}
      />

      <View style={styles.result}>
        {renderResult()}
      </View>

      <StatusBar style="auto" />
    </View>
  );

  // Väljer vad resultatrutan ska visa utifrån skanningens läge
  function renderResult() {
    if (!scannedCode) {
      return <Text>Rikta kameran mot en streckkod</Text>;
    }

    if (isLoading) {
      return <Text>Hämtar vara...</Text>;
    }

    // Hit kommer man bara vid nätverksfel, eftersom övriga fall navigerar vidare
    return (
      <>
        <Text style={styles.error}>{errorMessage}</Text>
        <Text>Streckkod: {scannedCode}</Text>
        <Button title="Skanna igen" onPress={resetScan} />
        <Button title="Lägg till manuellt" onPress={() => goToAddItem(scannedCode, null)} />
      </>
    );
  }
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
  error: {
    color: '#B42318',
    textAlign: 'center',
  },
});
