import { View, Text, TouchableOpacity, Alert, Button } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabScreen from "./TabScreen";
import BookDetailScreen from "./BookDetailScreen";
import ProfileScreen from "./ProfileScreen";
import { AntDesign } from "@expo/vector-icons";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import EditProfileScreen from "./EditProfileScreen";
import SelectOwnerScreen from "./orders/SelectOwnerScreen";
import CreateOrderScreen from "./orders/CreateOrderScreen";
import OrderDetailScreen from "./orders/OrderDetailScreen";
import {
  CollectBooks,
  UsersCollection,
  auth,
  db,
} from "../controller/firebaseConfig";

const StackScreen = (props) => {
  const Stack = createNativeStackNavigator();

  const logout = () => {
    auth.signOut();
    props.screenChange({ screenName: "Login" });
  };

  const onHeartPress = (route) => {
    console.log(`onHeartPress`);
    const { item } = route.params;
    bookCollect(item);
  };

  const bookCollect = async (item) => {
    const user = auth.currentUser;
    if (user !== null) {
      try {
        const userDocRef = doc(db, UsersCollection, user.email);
        const booksCollectionColRef = collection(userDocRef, CollectBooks);

        const q = query(booksCollectionColRef, where("id", "==", item.id));
        const books = await getDocs(q);
        if (books.size !== 0) {
          await deleteDoc(doc(booksCollectionColRef, item.id));
          Alert.alert("Success", `You remove this book from your collection`);
        } else {
          const bookToInsert = {
            id: item.id,
            title: item.title ?? "No title",
            authors: item.authors?.join(", ") ?? "No authors",
            imageLinks: item.imageLinks ?? "No Image",
          };
          await setDoc(doc(booksCollectionColRef, item.id), bookToInsert);
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
    <Stack.Navigator screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="Main" options={{ headerShown: false }}>
        {() => <TabScreen logout={logout} />}
      </Stack.Screen>
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
        name="Book Details"
        component={BookDetailScreen}
        options={({ route }) => ({
          title: route.params.item.title,
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
        name="Borrow Book"
        component={SelectOwnerScreen}
        options={({ route }) => ({
          title: route.params.item.title,
        })}
      />
      <Stack.Screen
        name="Create Order"
        component={CreateOrderScreen}
        options={({ route }) => ({
          title: route.params.item.title,
        })}
      />
      <Stack.Screen
        name="Order Details"
        component={OrderDetailScreen}
        options={({ route }) => ({
          title: route.params.item.title,
        })}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;
