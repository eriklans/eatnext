import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addItem } from "../services/storage";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/colors";

const OPEN_FOOD_FACTS_URL = "https://world.openfoodfacts.org";

export default function AddItemScreen({ route, navigation }) {
  // Parametrar från Skanna-skärmen. ?? {} gör att skärmen fungerar även utan parametrar,
  // till exempel när man lägger till en vara manuellt från Skafferi.
  const { barcode, name: initialName = "", imageUrl, found } = route.params ?? {};

  const [name, setName] = useState(initialName);
  const [expiryDate, setExpiryDate] = useState(new Date());

  function handleDateChange(event, selectedDate) {
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  }

  async function handleSave() {
    if (name.trim() === "") {
      Alert.alert("Namn saknas", "Skriv in ett namn på varan innan du sparar.");
      return;
    }

    try {
      await addItem({
        name: name.trim(),
        expiryDate: expiryDate.toISOString(),
        imageUrl: imageUrl ?? null,
        barcode: barcode ?? null,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert("Kunde inte spara", "Något gick fel när varan skulle sparas. Försök igen.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        {imageUrl && (
          <View style={styles.imageBox}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
          </View>
        )}

        {!found && (
          <Text style={styles.hint}>
            Ingen produktinformation hittades. Fyll i namnet själv.
          </Text>
        )}

        <Text style={styles.label}>Namn</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="T.ex. mjölk"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Bäst före</Text>
        <DateTimePicker
          value={expiryDate}
          mode="date"
          display="compact"
          locale="sv-SE"
          minimumDate={new Date()}
          accentColor={colors.primary}
          onValueChange={handleDateChange}
          style={styles.datePicker}
        />

        {barcode && <Text style={styles.barcode}>Streckkod: {barcode}</Text>}

        {/* Källhänvisning som Open Food Facts licens (ODbL) kräver */}
        {found && (
          <Pressable onPress={() => Linking.openURL(OPEN_FOOD_FACTS_URL)}>
            <Text style={styles.source}>
              Produktdata från <Text style={styles.link}>Open Food Facts</Text>
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <PrimaryButton title="Spara" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  imageBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
  },
  image: {
    width: "100%",
    height: 160,
    resizeMode: "contain",
  },
  hint: {
    color: colors.status.soon.text,
    backgroundColor: colors.status.soon.background,
    borderRadius: 10,
    padding: 12,
  },
  label: {
    fontWeight: "700",
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: colors.text,
  },
  datePicker: {
    alignSelf: "flex-start",
  },
  barcode: {
    color: colors.textMuted,
  },
  source: {
    fontSize: 12,
    color: colors.textMuted,
  },
  link: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
});