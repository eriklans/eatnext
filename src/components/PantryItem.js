import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatDate, getExpiryStatus } from "../utils/dates";
import { colors } from "../theme/colors";

// En vara i skafferilistan med namn, datum och en etikett som visar hur bråttom det är
export default function PantryItem({ item, onLongPress }) {
  const status = getExpiryStatus(item.expiryDate);
  const statusColors = colors.status[status.level];

  return (
    <Pressable style={styles.card} onLongPress={onLongPress}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>Bäst före {formatDate(item.expiryDate)}</Text>
      </View>

      <View
        style={[styles.badge, { backgroundColor: statusColors.background }]}
      >
        <Text style={[styles.badgeText, { color: statusColors.text }]}>
          {status.label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  date: {
    color: colors.textMuted,
  },
  badge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});