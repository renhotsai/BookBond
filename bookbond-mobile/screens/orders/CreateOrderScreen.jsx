import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import Button from '../../components/Button';
import { OrderStatus } from '../../model/OrderStatus';
import { set } from 'firebase/database';
import { OrderType } from '../../model/OrderType';
import { OrderCollection, Orders, UsersCollection, auth, db } from '../../controller/firebaseConfig';
import MapWithMarker from '../../components/MapWithMarker';
import DatePickerWithShown from '../../components/DatePicker';

const CreateOrderScreen = ({ navigation, route }) => {
    const { item } = route.params;
    const [borrowDate, setBorrowDate] = useState(new Date())
    const [returnDate, setReturnDate] = useState(new Date());
    const [borrowOpen, setBorrowOpen] = useState(false)
    const [returnOpen, setReturnOpen] = useState(false)


    useEffect(() => {
        resetReturnDate()
    }, [])

    const resetReturnDate = () => {
        const result = new Date(borrowDate)
        result.setDate(result.getDate() + 1);
        setReturnDate(result);
    }

    useEffect(() => {
        if (borrowDate > returnDate) {
            resetReturnDate()
        }
    }, [borrowDate])

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
                    // from: borrowDate,
                    // to:returnDate,
                }

                console.log(JSON.stringify(orderToInsert));
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
            <MapWithMarker item={item} />
            <Text> {item.address}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <DatePickerWithShown open={borrowOpen} date={borrowDate} setDate={setBorrowDate} setOpen={setBorrowOpen} />
                <Text> - </Text>
                <DatePickerWithShown open={returnOpen} date={returnDate} setDate={setReturnDate} setOpen={setReturnOpen} />
            </View>
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
        gap: 10,
    },
})