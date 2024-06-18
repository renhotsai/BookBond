import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Orders, UsersCollection, auth, db } from '../../firebaseConfig'
import { collection, doc, onSnapshot, or, query, where } from 'firebase/firestore'
import OrderType from '../../model/OrderType'
import OrderStatus from '../../model/OrderStatus'
import Book from '../../components/Book'

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
            temp.push(doc.data());
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
    navigation.navigate("Order Details", { order: item })
  }


  const renderBook = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => { onPressBook(item) }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Book item={item} />
          <Text>{item.status}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderOrders = () => {
    if (ordersList.length > 0) {
      return (
        <View>
          <FlatList
            data={ordersList}
            renderItem={renderBook}
            keyExtractor={(item) => item.orderId}
          />
        </View>
      )
    } else {
      return (
        <View>
          <Text>No Borrowing</Text>
        </View>
      )
    }
  }


  return (
    <View style={styles.container}>
      {renderOrders()}
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