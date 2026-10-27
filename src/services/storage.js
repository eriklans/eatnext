import AsyncStorage  from '@react-native-async-storage/async-storage';

// Nyckeln som skafferiet sparas under i telefonens minne
const STORAGE_KEY = 'eatnext.pantryItems';

// Läser alla sparade varor. Returnerar en tom lista om inget har sparats än.
export async function loadItems() {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
}

// Lägger till en vara och ger den ett unikt id
export async function addItem(item) {
    const items = await loadItems();
    const newItem = { ...item, id: Date.now().toString() };
    await saveItems([...items, newItem]);
    return newItem;
}

// Tar bort varan med det angivna id:t
export async function removeItem(id) {
    const items = await loadItems();
    await saveItems(items.filter((item) => item.id !== id));
}

async function saveItems(items) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}