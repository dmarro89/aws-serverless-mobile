import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../App";

export interface Item {
  title: string;
  author: string;
  id: number;
  price: number;
}

export const apiUrl = process.env.EXPO_PUBLIC_API_GATEWAY_URL as string;
export const pathSuffix = "/books";
export const booksURL = `${apiUrl}${pathSuffix}`;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 15,
  },
  text: {
    textAlign: "center",
  },
});

const flatStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#CDF0EA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  subTitle: {
    opacity: 0.6,
  },
});

export default function Main() {
  const [data, setData] = useState<Item[]>();
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const isFocused = useIsFocused();

  async function fetchData() {
    try {
      console.log("Fetching data");
      const response = await fetch(booksURL as string);
      const data = await response.json();
      console.log("Fetched response: ", data);
      const items = data as Item[];
      setData(items);
      setLoading(false);
    } catch (error) {
      console.log("error " + error);
    }
  }

  useEffect(() => {
    isFocused && fetchData();
    isFocused &&
      navigation.setOptions({
        headerRight: () => (
          <Ionicons
            name="ios-add"
            size={24}
            color="#007bff"
            onPress={() => {
              navigation.navigate("EditBookPage", { id: 0 });
            }}
          />
        ),
      });
  }, [isFocused]);

  const deleteData = async (id: number) => {
    const booksIdURL = `${apiUrl}${pathSuffix}/${id}`;
    console.log("Deleting id: ", id);
    try {
      await fetch(booksIdURL, {
        method: "DELETE",
      });
      console.log("Successfully deleted");
    } catch (error) {
      console.log("Error " + error);
    }
    fetchData();
  };

  const FlatListBasics = () => {
    return (
      <View style={styles.container}>
        {loading && <Text style={styles.text}>Loading..</Text>}
        {data && (
          <FlatList<Item>
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              console.log(item);
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("BookDetailPage", { id: item.id })
                  }
                >
                  <View style={flatStyles.container}>
                    <View>
                      <Text style={flatStyles.title}>{item.title}</Text>
                      <Text style={flatStyles.subTitle}>{item.author}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteData(item.id)}>
                      <View>
                        <Ionicons
                          name="ios-remove-circle-outline"
                          size={32}
                          color="red"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
        {!loading && data?.length == 0 && (
          <Text style={styles.text}>No Books available</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatListBasics />
    </SafeAreaView>
  );
}
