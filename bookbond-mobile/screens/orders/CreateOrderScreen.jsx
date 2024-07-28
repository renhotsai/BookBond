import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import Button from '../../components/Button';
import { OrderStatus } from '../../model/OrderStatus';
import { set } from 'firebase/database';
import { OrderType } from '../../model/OrderType';
import { OrderCollection, Orders, UsersCollection, auth, db } from '../../controller/firebaseConfig';
import MapWithMarker from '../../components/MapWithMarker';
import dayjs from 'dayjs';
import { OrderDate } from '../../components/OrderDate';

const CreateOrderScreen = ({ navigation, route }) => {
    const { item } = route.params;

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
                    id: item.id,
                    bookId: item.bookId,
                    borrower: user.email,
                    owner: item.owner,
                    status: OrderStatus.Pending,
                    imageLinks: item.imageLinks,
                    title: item.title,
                    authors: item.authors,
                    location: item.location,
                    from: dayjs(item.dates.from).toDate(),
                    to: dayjs(item.dates.to).toDate(),
                }
                const order = await addDoc(orderColRef, orderToInsert);
                orderToLandlord(item.owner, order.id, orderToInsert);
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

    const postNotifications = async (token) => {
        try {
            const response = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: token,
                    title: "New Order",
                    body: "You got a new order",
                    badge: 1
                }),
            });
        } catch (error) {
            console.error(error);
        }
    }

    const orderToLandlord = (email, orderId, orderToInsert) => {
        const userDocRef = doc(db, UsersCollection, email)
        getDoc(userDocRef)
            .then((userDoc) => {
                if (userDoc.exists()) {
                    const expoPushToken = userDoc.data().expoPushToken;
                    if (expoPushToken) {
                        postNotifications(expoPushToken);
                    } else {
                        console.error('Expo push token not found in user document');
                    }
                } else {
                    console.error('No such document!');
                }
            })
            .catch((error) => {
                console.error('Error fetching user document:', error);
            });


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
        <View style={{ margin: 10, height: '95%', justifyContent: 'space-between' }}>
            <View style={{ gap: 10 }} >
                <MapWithMarker item={item} />
                <OrderDate from={item.dates.from} to={item.dates.to} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: '16vm' }}>Pick Up Address:</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: '16vm' }}>
                        {item.address}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: '16vm' }}>Owner:</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: '16vm' }}>{item.owner}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={onBorrowPress} style={{
            }}>
                <Button buttonText="Borrow" />
            </TouchableOpacity>
        </View>
    )
}

export default CreateOrderScreen