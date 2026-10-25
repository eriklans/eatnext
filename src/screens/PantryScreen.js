import { StyleSheet, Text, View, Button } from 'react-native';

export default function PantryScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Skafferiet är tomt</Text>
            <Button title="Skanna vara" onPress={() => navigation.navigate('Scan')} />
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