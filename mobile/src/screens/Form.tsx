import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../App";
import { Item, apiUrl, pathSuffix } from "./Main";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  label: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  validation: {
    marginBottom: 20,
  },
});

export default function Form() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, "BookDetailPage">>();
  const id = route.params?.id ? route.params?.id.toString() : "";
  const method = id ? "PUT" : "POST";
  const booksIdURL = `${apiUrl}${pathSuffix}/${id}`;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (id != "") {
      try {
        console.log("Fetching data");
        const response = await fetch(booksIdURL);
        const data = await response.json();
        console.log("Fetched response: ", data);
        const item = data as Item;
        setTitle(item.title);
        setAuthor(item.author);
        setPrice(item.price.toString());
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
      return;
    }
    setLoading(false);
  }

  const handleSaveChanges = async () => {
    if (!title.trim() || !author.trim() || !price.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert("Error", "Please enter a valid price greater than zero.");
      return;
    }
    const uniqueId: number = id ? id as unknown as number : new Date().getTime();

    const updatedBook = {
      id: uniqueId,
      title: title,
      author: author,
      price: price as unknown as number,
    };

    console.log("Updating book: ", updatedBook);

    try {
      await fetch(booksIdURL, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });
    } catch (error) {
      console.log(error);
    }
    navigation.popToTop();

    navigation.navigate("BookDetailPage", {
      id: uniqueId,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading..</Text>
      ) : (
        <View>
          <View style={styles.validation}>
            <Text style={styles.label}>Titolo:</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Titolo"
            />
            {!title.trim() && <Text>Please enter a valid title.</Text>}
          </View>

          <View style={styles.validation}>
            <Text style={styles.label}>Autore:</Text>
            <TextInput
              style={styles.input}
              value={author}
              onChangeText={setAuthor}
              placeholder="Autore"
            />
            {!author.trim() && <Text>Please enter a valid author.</Text>}
          </View>

          <View style={styles.validation}>
            <Text style={styles.label}>Prezzo:</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Prezzo"
              keyboardType="numeric"
            />
            {!price.trim() && <Text>Please enter a valid price.</Text>}
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>Salva modifiche</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
