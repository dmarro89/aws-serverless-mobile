import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BookDetailPage from "./screens/Details";
import EditBookPage from "./screens/Form";
import Main from "./screens/Main";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Main}
          options={{
            title: "Books",
            headerRight: () => (
              <Ionicons name="ios-add" size={32} color="#007bff" />
            ),
          }}
        />
        <Stack.Screen
          name="BookDetailPage"
          component={BookDetailPage}
          options={{
            title: "Books",
            headerRight: () => (
              <Ionicons name="pencil" size={24} color="#007bff" />
            ),
          }}
        />
        <Stack.Screen
          name="EditBookPage"
          component={EditBookPage}
          options={{
            title: "Modifica"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export type RootStackParamList = {
  BookDetailPage: { id: number } | undefined;
  EditBookPage: { id: number } | undefined;
};
