import Ionicons from "@expo/vector-icons/Ionicons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../App";
import { Item, apiUrl, pathSuffix } from "./Main";

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: "#555",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
  },
  label: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default function BookDetailPage() {
  const [data, setData] = useState<Item>();
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, "BookDetailPage">>();
  const id = route.params?.id ? route.params?.id.toString() : "";
  const booksIdURL = `${apiUrl}${pathSuffix}/${id}`;

  async function fetchData() {
    try {
      console.log("Fetching data ", booksIdURL);
      const response = await fetch(booksIdURL as string);
      const data = await response.json();
      console.log("Fetched response: ", data);
      const item = data as Item;
      setData(item);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="pencil"
          size={24}
          color="#007bff"
          onPress={() => {
            navigation.navigate("EditBookPage", {
              id: id as unknown as number,
            });
          }}
        />
      ),
    });
  }, []);

  return (
    <View style={detailStyles.container}>
      {loading && <Text>Loading..</Text>}
      {data && (
        <View>
          <Text style={detailStyles.label}>Title:</Text>
          <Text style={detailStyles.title}>{data.title}</Text>
          <Text style={detailStyles.label}>Author:</Text>
          <Text style={detailStyles.author}>{data.author}</Text>
          <Text style={detailStyles.label}>Price:</Text>
          <Text style={detailStyles.price}>{data.price}€</Text>
        </View>
      )}
    </View>
  );
}
