import { useCallback, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { loadItems } from "../services/storage";

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

  return (
    <View style={styles.container}>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDate}>
              Bäst före {formatDate(item.expiryDate)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Skafferiet är tomt. Skanna en vara för att börja.
          </Text>
        }
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <Button
          title="Skanna vara"
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

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("sv-SE");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDate: {
    color: "#666",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
  error: {
    color: "#B42318",
    textAlign: "center",
    padding: 16,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
});
