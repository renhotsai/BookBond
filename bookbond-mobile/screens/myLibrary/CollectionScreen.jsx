import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { BooksCollection, CollectBooks, UsersCollection, auth, db } from '../../controller/firebaseConfig'
import Book from '../../components/Book'
import { EmptyList } from '../../components/EmptyList'




const CollectionScreen = ({ navigation }) => {

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

  const onBookPress = async (item) => {
    try {
      const book = await fetchData(item)
      navigation.navigate("Book Details", { item: book })
    } catch (error) {
      console.error(error);
    }
  }

  const fetchData = async (item) => {
    try {
      const uri = `https://www.googleapis.com/books/v1/volumes/${item.bookId}`
      const dataJson = await (await fetch(uri)).json();
      const book = {
        bookId: dataJson.id,
        ...dataJson.volumeInfo
      }
      return book
    } catch (error) {
      console.error(error);
    }
  };
  const renderItem = (item) => {
    return (
      <TouchableOpacity onPress={() => onBookPress(item)}>
        <Book item={item} />
      </TouchableOpacity>
    )
  }

  const [containerHeight, setContainerHeight] = useState(0);

  return (
    <View style={styles.container} onLayout={(event) => {
      const { height } = event.nativeEvent.layout;
      setContainerHeight(height);
    }}>
      <FlatList
        data={booksCollection}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyList containerHeight={containerHeight} />}
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