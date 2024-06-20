import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { Orders, UsersCollection, auth, db } from '../../controller/firebaseConfig'
import Book from '../../components/Book'
import OrderStatus from '../../model/OrderStatus'
import OrderType from '../../model/OrderType'

const BorrowingScreen = ({ navigation }) => {

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
          where("orderType", "==", OrderType.In),
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
    navigation.navigate("Order Details", { item: item })
  }


  const renderBook = ({ item }) => {
    const displayStatus = item.orderType !== OrderType.In ? item.status  : item.status !== OrderStatus.Accepted ? item.status : "Waiting to Pick up"
    
    return (
      <TouchableOpacity onPress={() => { onPressBook(item) }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Book item={item} />
          <Text>{displayStatus}</Text>
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

export default BorrowingScreen


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
    padding: 20,
  },
});