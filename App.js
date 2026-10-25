import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { fetchProduct } from './src/services/openFoodFacts';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState(null);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Körs när kameran hittar en streckkod, samt sparar koden och hämtar varan från API:et
  async function handleBarcodeScanned(result) {
    setScannedCode(result.data);
    setProduct(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const foundProduct = await fetchProduct(result.data);
      setProduct(foundProduct);
    } catch (error) {
      setErrorMessage('Kunde inte hämta varan. Kontrollera din internetanslutning.');
    } finally {
      setIsLoading(false);
    }
  }

  function resetScan() {
    setScannedCode(null);
    setProduct(null);
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

    return (
      <>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        {!errorMessage && !product && <Text>Varan hittades inte</Text>}
        {product && <Text style={styles.code}>{product.name || 'Namn saknas'}</Text>}
        <Text>Streckkod: {scannedCode}</Text>
        <Button title='Skanna igen' onPress={resetScan} />
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
  code: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  error: {
    color: '#B42318',
    textAlign: 'center',
  },
});
