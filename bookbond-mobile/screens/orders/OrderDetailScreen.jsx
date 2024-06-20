import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Button from '../../components/Button';
import { BooksCollection, OrderCollection, Orders, UsersCollection, auth, db } from '../../firebaseConfig';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import OrderStatus from '../../model/OrderStatus';
import OrderType from '../../model/OrderType';
import PendingScreen from './PendingScreen';
import AcceptedScreen from './AcceptedScreen';
import PickedScreen from './PickedScreen';
import ReturnedScreen from './ReturnedScreen';

const OrderDetailScreen = ({ navigation, route }) => {

  const { item } = route.params;


  const updateOrderStatus = (updateStatus) => {
    try {
      const updateOrderList = []

      const orderDocRef = doc(db, OrderCollection, item.orderId)
      updateOrderList.push(orderDocRef)

      // Tenant
      const userDocRef = doc(db, UsersCollection, item.borrower)
      const userOrderDocRef = doc(userDocRef, "Orders", item.orderId);
      updateOrderList.push(userOrderDocRef)


      // Landlord
      const landlordDocRef = doc(db, UsersCollection, item.owner)
      const landlordOrderDocRef = doc(landlordDocRef, "Orders", item.orderId);
      updateOrderList.push(landlordOrderDocRef)

      updateOrderList.forEach(async (docRef) => {
        await updateDoc(
          docRef,
          {
            status: updateStatus
          }
        );
      });
    } catch (error) {
      console.error(`updateOrderStatus: ${error}`);
    }
  }


  const updateBookStatus = async (updateStatus) => {
    try {
      const bookDocRef = doc(db, BooksCollection, item.bookId)
      let isBorrowed = false;

      switch (updateStatus) {
        case OrderStatus.Accepted:
          isBorrowed = true;
          break;

        case OrderStatus.Checked:
        case OrderStatus.Cancelled:
          isBorrowed = false;
          break;

        default:
          break;
      }

      await updateDoc(
        bookDocRef,
        {
          borrowed: isBorrowed
        })
    } catch (error) {
      console.error(`updateBookStatus: ${error}`);
    }
  }


  const deniedOtherOrder = async () => {
    try {
      const denyList = []
      const orderColRef = collection(db, OrderCollection)
      const q = query(
        orderColRef,
        where('bookId', '==', item.bookId),
        where('status', '==', OrderStatus.Pending),
        where('borrower', '!=', item.borrower)
      );
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((docRef) => {
        //deny order
        const orderDocRef = doc(db, OrderCollection, docRef.id)
        denyList.push(orderDocRef)

        //deny tenant's order
        const tenantDocRef = doc(db, UsersCollection, docRef.data().borrower)
        const tenantOrderDocRef = doc(tenantDocRef, Orders, docRef.id)
        denyList.push(tenantOrderDocRef)

        //deny landlord's order
        const landlordDocRef = doc(db, UsersCollection, docRef.data().owner)
        const landlordOrderDocRef = doc(landlordDocRef, Orders, docRef.id)
        denyList.push(landlordOrderDocRef)
      })

      denyList.forEach(async (docRef) => {
        await updateDoc(
          docRef,
          {
            status: OrderStatus.Denied
          }
        )
      })

    } catch (error) {
      console.error(`deniedOtherOrder: ${error}`);
    }
  }

  const updateOrder = (updateStatus) => {
    const user = auth.currentUser;

    if (user !== null) {
      updateOrderStatus(updateStatus)
      switch (updateStatus) {
        case OrderStatus.Accepted:
          deniedOtherOrder()
          break;

        case OrderStatus.Accepted:
        case OrderStatus.Cancelled:
        case OrderStatus.Checked:
          updateBookStatus(updateStatus)
          break;
        default:
          break;
      }

      Alert.alert("Successfully!", `This order has been ${updateStatus}`)
      navigation.navigate("Main")

    } else {
      console.log("user is not logged in");
    }
  }


  const renderOrderDetail = () => {
    switch (item.status) {
      case OrderStatus.Pending:
        return <PendingScreen item={item} updateOrder={updateOrder} />
      case OrderStatus.Accepted:
        return <AcceptedScreen item={item} updateOrder={updateOrder} />
      case OrderStatus.Picked:
        return <PickedScreen item={item} updateOrder={updateOrder} />
      case OrderStatus.Returned:
        return <ReturnedScreen item={item} updateOrder={updateOrder} />
      case OrderStatus.Checked:
        return <ReturnedScreen item={item} updateOrder={updateOrder} />
    }
  }
  return (
    <View style={styles.container}>
      {renderOrderDetail()}
    </View>
  )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  }
})