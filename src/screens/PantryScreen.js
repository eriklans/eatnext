import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { loadItems, removeItem } from "../services/storage";
import PantryItem from "../components/PantryItem";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/colors";

export default function PantryScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Läser in varorna varje gång skärmen visas, så att nya varor syns direkt efter att de sparats
  useFocusEffect(
    useCallback(() => {
      loadPantry();
    }, []),
  );

  async function loadPantry() {
    try {
      const storedItems = await loadItems();
      setItems(sortByExpiryDate(storedItems));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Kunde inte läsa skafferiet. Försök starta om appen.");
    }
  }

  // Frågar användaren innan en vara tas bort, så att ingen tas bort av misstag
  function confirmRemove(item) {
    Alert.alert(
      "Ta bort vara",
      `Vill du ta bort ${item.name} från skafferiet?`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Ta bort",
          style: "destructive",
          onPress: () => deleteItem(item.id),
        },
      ],
    );
  }

  async function deleteItem(id) {
    try {
      await removeItem(id);
      await loadPantry();
    } catch (error) {
      setErrorMessage("Kunde inte ta bort varan. Försök igen.");
    }
  }

  return (
    <View style={styles.container}>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PantryItem item={item} onLongPress={() => confirmRemove(item)} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Skafferiet är tomt. Skanna en vara för att börja.
          </Text>
        }
        ListFooterComponent={
          items.length > 0 && (
            <Text style={styles.hint}>
              Håll inne på en vara för att ta bort den
            </Text>
          )
        }
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <PrimaryButton
          title="Skanna vara"
          icon={<Ionicons name="camera-outline" size={22} color="#FFFFFF" />}
          onPress={() => navigation.navigate("Scan")}
        />
      </View>
    </View>
  );
}

// Sorterar så att varan som går ut först hamnar överst
function sortByExpiryDate(items) {
  return [...items].sort(
    (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textMuted,
  },
  hint: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
    color: colors.textMuted,
  },
  error: {
    color: colors.error,
    textAlign: "center",
    padding: 16,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
});