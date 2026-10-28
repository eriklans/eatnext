import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PantryScreen from "./src/screens/PantryScreen";
import ScanScreen from "./src/screens/ScanScreen";
import AddItemScreen from "./src/screens/AddItemScreen";
import { colors } from "./src/theme/colors";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Pantry"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontWeight: "700" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Pantry"
          component={PantryScreen}
          options={{ title: "Skafferi" }}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{ title: "Skanna vara" }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{ title: "Lägg till vara" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}