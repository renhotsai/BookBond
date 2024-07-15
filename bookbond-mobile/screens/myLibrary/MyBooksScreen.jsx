import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Book from '../../components/Book'
import { BooksCollection, OwnBooks, UsersCollection, auth, db } from '../../controller/firebaseConfig'
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore'

const MyBooksScreen = ({ navigation }) => {

  useEffect(() => {
    getOwnBooks()
  }, [])

  const [ownBooks, setOwnBooks] = useState([])

  const getOwnBooks = async () => {
    const user = auth.currentUser
    if (user !== null) {
      try {
        const userDocRef = doc(db, UsersCollection, user.email);
        const ownBooksColRef = collection(userDocRef, OwnBooks)


        const unsubscribe = onSnapshot(query(ownBooksColRef), (querySnapshot) => {
          const temp = []
          querySnapshot.forEach((doc) => {
            temp.push({
              id: doc.id,
              ...doc.data()
            });
          });

          setOwnBooks(temp)

          return () => unsubscribe();
        });

      } catch (error) {
        console.error("Error adding document: ", error);
        Alert.alert("Error", "There was an error borrowing the book.");
      }
    } else {
      Alert.alert("Not signed in", "You must be signed in to create a listing.");
    }
  }

  const onBookPress = async (item) => {
    try {
      const bookDocRef = doc(db, BooksCollection, item.id);
      const book = await getDoc(bookDocRef)
      navigation.navigate("Book Details", { item: book.data() })
    } catch (error) {
      console.error(error);
    }
  }

  const renderItem = (item) => {
    return (
      <TouchableOpacity onPress={() => onBookPress(item)}>
        <Book item={item} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ownBooks}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No own books</Text>}
      />
    </View>
  )
}

export default MyBooksScreen


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
    padding: 20,
  },
});