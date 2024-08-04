import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Orders, UsersCollection, auth, db } from '../../controller/firebaseConfig'
import { collection, doc, onSnapshot, or, query, where } from 'firebase/firestore'
import { OrderType } from '../../model/OrderType'
import { OrderStatus } from '../../model/OrderStatus'
import BookWithStatus from '../../components/BookWithStatus'
import { EmptyList } from '../../components/EmptyList'

const OwnerOrderScreen = ({ navigation }) => {

  useEffect(() => {
    getBorrowingOrders()
  }, [])

  const [ordersList, setOrdersList] = useState([]);

  const getBorrowingOrders = () => {
    const user = auth.currentUser
    if (user !== null) {
      try {
        const userDocRef = doc(db, UsersCollection, user.email)
        const orderColRef = collection(userDocRef, Orders)
        const q = query(
          orderColRef,
          where("orderType", "==", OrderType.Out),
          where("status", "not-in", [OrderStatus.Cancelled, OrderStatus.Checked, OrderStatus.Denied])
        )
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const temp = []
          querySnapshot.forEach((doc) => {
            const dataToPush = {
              id: doc.id,
              ...doc.data(),
            }
            temp.push(dataToPush);
          });
          setOrdersList(temp)
        })
        return () => { unsubscribe(); }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const onPressBook = (item) => {
    console.log("onPressBook");
    navigation.navigate("Order Details", { item: item })
  }


  const renderBook = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => { onPressBook(item) }}>
        <BookWithStatus item={item} />
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
        data={ordersList}
        renderItem={renderBook}
        keyExtractor={(item) => item.orderId}
        ListEmptyComponent={<EmptyList containerHeight={containerHeight} />}
      />
    </View>
  )
}

export default OwnerOrderScreen


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
    padding: 20,
  },
});