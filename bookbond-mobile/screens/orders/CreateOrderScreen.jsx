import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import Button from '../../components/Button';
import OrderStatus from '../../model/OrderStatus';
import { set } from 'firebase/database';
import OrderType from '../../model/OrderType';
import { OrderCollection, Orders, UsersCollection, auth, db } from '../../controller/firebaseConfig';
import MapWithMarker from '../../components/MapWithMarker';

const CreateOrderScreen = ({ navigation, route }) => {
    const { item } = route.params;

    useEffect(() => {
        getOwner();
    }, [])

    const [owner, setOwner] = useState({});

    const getOwner = async () => {
        const userDocRef = doc(db, UsersCollection, item.owner);
        const user = await getDoc(userDocRef);
        setOwner(user.data());
    }

    const onBorrowPress = () => {
        console.log("onBorrowPress");

        createOrder()

        navigation.navigate('Main');
    }

    const createOrder = async () => {
        console.log("start creating order");
        const user = auth.currentUser;
        if (user !== null) {
            try {
                const orderColRef = collection(db, OrderCollection)
                const orderToInsert = {
                    id:item.id,
                    bookId: item.bookId,
                    borrower: user.email,
                    owner: owner.emailAddress,
                    status: OrderStatus.Pending,
                    imageLinks:item.imageLinks,
                    title: item.title,
                    authors: item.authors,
                    location: item.location,
                }
                const order = await addDoc(orderColRef, orderToInsert);
                orderToLandlord(owner.emailAddress, order.id, orderToInsert);
                orderToTenant(user.email, order.id, orderToInsert);

                console.log(`Order Id : ${order.id}`);
                Alert.alert("Success", "Waiting owner approval...");
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "There was an error borrowing the book.");
            }
        } else {
            console.error("user not logged in");
        }
    }


    const orderToLandlord = (email, orderId, orderToInsert) => {
        const userDocRef = doc(db, UsersCollection, email)
        const userOrderDocRef = doc(userDocRef, Orders, orderId);
        orderToInsert.orderId = orderId;
        orderToInsert.orderType = OrderType.Out
        setDoc(userOrderDocRef, orderToInsert)
    }

    const orderToTenant = (email, orderId, orderToInsert) => {
        const userDocRef = doc(db, UsersCollection, email)
        const userOrderDocRef = doc(userDocRef, Orders, orderId);
        orderToInsert.orderId = orderId;
        orderToInsert.orderType = OrderType.In
        setDoc(userOrderDocRef, orderToInsert)
    }

    return (
        <View style={styles.container}>
            <MapWithMarker item={item}/>
            <Text> {item.address}</Text>
            <TouchableOpacity onPress={onBorrowPress}>
                <Button buttonText="Borrow" />
            </TouchableOpacity>
        </View>
    )
}

export default CreateOrderScreen

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        gap:10,
    },
})