import { View, Text, TouchableOpacity, Alert, Button } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabScreen from "./TabScreen";
import BookDetailScreen from "./BookDetailScreen";
import { ScreenStackHeaderSearchBarView } from "react-native-screens";
import { Ionicons } from "@expo/vector-icons";
import { CollectBooks, UsersCollection, auth, db } from "../firebaseConfig";
import ProfileScreen from "./ProfileScreen";
import { AntDesign } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { get } from "firebase/database";
import EditProfileScreen from "./EditProfileScreen";
import SelectOwnerScreen from "./orders/SelectOwnerScreen";
import CreateOrderScreen from "./orders/CreateOrderScreen";

const StackScreen = (props) => {
  const Stack = createNativeStackNavigator();

  const logout = () => {
    auth.signOut();
    alert(`Logged Out!`);
    props.screenChange({ screenName: "Login" });
  };

  const onHeartPress = (item) => {
    console.log(`onHeartPress`);
    const { book } = item.params;
    bookCollect(book);
  };

  const bookCollect = async (book) => {
    const user = auth.currentUser
    if (user !== null) {
      try {
        const userDocRef = doc(db, UsersCollection, user.email);
        const booksCollectionColRef = collection(userDocRef, CollectBooks)

        const q = query(booksCollectionColRef, where("id", "==", book.id));
        const books = await getDocs(q);
        if (books.size !== 0) {
          await deleteDoc(doc(booksCollectionColRef, book.id));
          Alert.alert("Success", `You remove this book from your collection`);
        } else {

          const bookToInsert = {
            id: book.id,
            title: book.title ?? "No title",
            authors: book.authors?.join(", ") ?? "No authors",
            imageLinks: book.imageLinks ?? "No Image",
          };
          await setDoc(doc(booksCollectionColRef, book.id), bookToInsert);
          Alert.alert("Success", `You have collected this book`);
        }
      } catch (error) {
        console.error("Error adding document: ", error);
        Alert.alert("Error", "There was an error borrowing the book.");
      }
    } else {
      Alert.alert(
        "Not signed in",
        "You must be signed in to create a listing."
      );
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" options={{ headerShown: false }}>
        {() => <TabScreen logout={logout} />}
      </Stack.Screen>
      <Stack.Screen
        name="Book Details"
        component={BookDetailScreen}
        options={({ navigation, route }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                onHeartPress(route);
              }}
              title="Info"
              color="#000"
            >
              <AntDesign name="heart" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        options={{
          headerRight: () => (
            <Button onPress={logout} title="Sign Out" color="blue" />
          ),
        }}
      >
        {() => <ProfileScreen />}
      </Stack.Screen>
      <Stack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="Borrow Book"
        component={SelectOwnerScreen}
      />
      <Stack.Screen
        name="Create Order"
        component={CreateOrderScreen}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;
