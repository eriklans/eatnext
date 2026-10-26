import { StyleSheet, Text, View } from "react-native";

export default function AddItemScreen({ route }) {
    // Parametrar från Skanna-skärmen. ?? {} gör att skärmen fungerar även utan parametrar,
    // till exempel när man lägger till en vara manuellt från Skafferi.
    const { barcode, name, imageUrl, found } = route.params ?? {};

    return (
        <View style={styles.container}>
            <Text>Streckkod: {barcode}</Text>
            <Text>{found ? name : 'Varan hittades inte - fyll i namnet själv'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
});