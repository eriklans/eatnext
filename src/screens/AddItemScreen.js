import { StyleSheet, Text, View } from "react-native";

export default function AddItemScreen() {
    return (
        <View style={styles.container}>
            <Text>Här ska varan läggas till</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});