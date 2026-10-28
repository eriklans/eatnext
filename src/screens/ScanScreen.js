import { StyleSheet, Text, View, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { fetchProduct } from "../services/openFoodFacts";
import { useState, useRef } from "react";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/colors";

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
      setErrorMessage("Kunde inte hämta varan. Kontrollera din internetanslutning.");
    } finally {
      setIsLoading(false);
    }
  }

  // Skickar vidare koden och varan till "Lägg till vara"
  function goToAddItem(barcode, product) {
    navigation.replace("AddItem", {
      barcode,
      name: product?.name ?? "",
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
    return <View style={styles.container} />;
  }

  // Läge 2: användaren har inte gett behörighet
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.message}>
          EatNext behöver kameran för att skanna streckkoder.
        </Text>
        <PrimaryButton title="Ge åtkomst till kameran" onPress={requestPermission} />
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
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        // Pausa skanningen när kod redan finns, annars läser det samma kod många gånger i sekunden
        onBarcodeScanned={scannedCode ? undefined : handleBarcodeScanned}
      />

      <View style={styles.result}>
        {renderResult()}
      </View>
    </View>
  );

  // Väljer vad resultatrutan ska visa utifrån skanningens läge
  function renderResult() {
    if (!scannedCode) {
      return <Text style={styles.message}>Rikta kameran mot en streckkod</Text>;
    }

    if (isLoading) {
      return <Text style={styles.message}>Hämtar vara...</Text>;
    }

    // Hit kommer man bara vid nätverksfel, eftersom övriga fall navigerar vidare
    return (
      <>
        <Text style={styles.error}>{errorMessage}</Text>
        <Text style={styles.barcode}>Streckkod: {scannedCode}</Text>
        <PrimaryButton title="Skanna igen" onPress={resetScan} />
        <Pressable onPress={() => goToAddItem(scannedCode, null)}>
          <Text style={styles.link}>Lägg till manuellt</Text>
        </Pressable>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  camera: {
    flex: 1,
  },
  result: {
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    color: colors.text,
  },
  error: {
    color: colors.error,
    textAlign: "center",
  },
  barcode: {
    textAlign: "center",
    color: colors.textMuted,
  },
  link: {
    textAlign: "center",
    color: colors.primary,
    fontWeight: "600",
    padding: 8,
  },
});
