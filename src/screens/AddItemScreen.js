import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddItemScreen({ route, navigation }) {
    // Parametrar från Skanna-skärmen. ?? {} gör att skärmen fungerar även utan parametrar,
    // till exempel när man lägger till en vara manuellt från Skafferi.
    const { barcode, name: initialName = '', imageUrl, found } = route.params ?? {};

    const [name, setName] = useState(initialName);
    const [expiryDate, setExpiryDate] = useState(new Date());

    function handleDateChange(event, selectedDate) {
        if (selectedDate) {
            setExpiryDate(selectedDate);
        }
    }

    function handleSave() {
        if (name.trim() === '') {
            Alert.alert('Namn saknas', 'Skriv in ett namn på varan innan du sparar.');
            return;
        }

        // Varan sparas i skafferiet i nästa steg
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}

            {!found && (
                <Text style={styles.hint}>Ingen produktinformation hittades. Fyll i namnet själv.</Text>
            )}

            <Text style={styles.label}>Namn</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="T.ex. mjölk"
            />

            <Text style={styles.label}>Bäst före</Text>
            <DateTimePicker
                value={expiryDate}
                mode="date"
                display="compact"
                minimumDate={new Date()}
                onValueChange={handleDateChange}
                style={styles.datePicker}
            />

            {barcode && <Text style={styles.barcode}>Streckkod: {barcode}</Text>}

            <Button title="Spara" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        gap: 12,
    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'contain',
    },
    hint: {
        color: '#9A4A0B',
    },
    label: {
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    datePicker: {
        alignSelf: 'flex-start',
    },
    barcode: {
        color: '#666',
    },
});