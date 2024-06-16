import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Button from '../../components/Button';
import { OrderCollection, UsersCollection, auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import OrderStatus from '../../model/OrderStatus';

const OrderDetailScreen = ({ navigation, route }) => {

  const { order } = route.params;


  const onCancelPress = () => {
    console.log(`onCancelPress orderId: ${order.orderId}`);

    Alert.alert('Confirm', 'Do you want to cancel order', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes', onPress: () => { onYesPress() },
        style: 'ok',
      },
    ]);
  }

  const onYesPress = () => {

    console.log('Yse Pressed')
    const user = auth.currentUser;

    if (user !== null) {
      try {
        const updateOrderList = []

        const orderDocRef = doc(db, OrderCollection, order.orderId)
        updateOrderList.push(orderDocRef)


        // Tenant
        const userDocRef = doc(db, UsersCollection, user.email)
        const userOrderDocRef = doc(userDocRef, "Orders", order.orderId);
        updateOrderList.push(userOrderDocRef)


        // Landlord
        const landlordDocRef = doc(db, UsersCollection, order.owner)
        const landlordOrderDocRef = doc(landlordDocRef, "Orders", order.orderId);
        updateOrderList.push(landlordOrderDocRef)

        updateOrderList.forEach(async (docRef) => {
          await updateDoc(
            docRef,
            {
              status: OrderStatus.Cancelled
            }
          );
        });
        navigation.navigate("Main")
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("user is not logged in");
    }
  }

  return (
    <View style={styles.container}>
      {order.imageLinks && order.imageLinks.thumbnail && (
        <Image source={{ uri: order.imageLinks.smallThumbnail }} style={styles.image} />
      )}
      <Text style={styles.title}>{order.title}</Text>
      <Text>MapView</Text>
      <Text>{order.status}</Text>
      <TouchableOpacity onPress={onCancelPress}>
        <Button buttonText="Cancel" />
      </TouchableOpacity>
    </View>
  )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
})