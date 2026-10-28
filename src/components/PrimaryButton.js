import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";

// Appens huvudknapp: stor grön och lätt att träffa med tummen
export default function PrimaryButton({ title, onPress, icon }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {icon}
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
