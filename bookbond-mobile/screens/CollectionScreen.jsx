import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, onSnapshot, query } from 'firebase/firestore'
import { CollectBooks, UsersCollection, auth, db } from '../firebaseConfig'
import Book from '../components/Book'




const CollectionScreen = () => {

  useEffect(() => {
    getBooksCollection()
  }, [])

  const [booksCollection, setBooksCollection] = useState({})

  const getBooksCollection = async () => {
    const user = auth.currentUser
    if (user !== null) {
      try {
        const userDocRef = doc(db, UsersCollection, user.email);
        const booksCollectionColRef = collection(userDocRef, CollectBooks)


        const unsubscribe = onSnapshot(query(booksCollectionColRef), (querySnapshot) => {
          const temp = []
          querySnapshot.forEach((doc) => {
            temp.push({
              id: doc.id,
              ...doc.data()
            });
          });

          setBooksCollection(temp)

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



  return (
    <View style={styles.container}>
      <FlatList
        data={booksCollection}
        renderItem={({ item }) => <Book item={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No collection books</Text>}
      />
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
    padding: 20,
  },
});

export default CollectionScreen