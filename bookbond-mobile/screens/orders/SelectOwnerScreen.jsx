import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import Button from '../../components/Button';
import OrderStatus from '../../model/OrderStatus';
import OrderType from '../../model/OrderType';
import MapWithMarker from '../../components/MapWithMarker';
import { BooksCollection, Orders, UsersCollection, auth, db } from '../../controller/firebaseConfig';

const SelectOwnerScreen = ({ navigation, route }) => {
    const { item } = route.params;

    useEffect(() => {
        getBooks()
        getUserOrders()
    }, [])

    const [books, setBooks] = useState([])

    const [orders, setOrders] = useState([])

    const getUserOrders = async () => {
        try {
            const user = auth.currentUser;
            if (user !== null) {
                const userDocRef = doc(db, UsersCollection, user.email)
                const userOrderColRef = collection(userDocRef, Orders)
                const q = query(
                    userOrderColRef,
                    where("status", "not-in", [OrderStatus.Cancelled, OrderStatus.Denied, OrderStatus.Checked]),
                    where("orderType", "==", OrderType.In)
                )
                const orders = await getDocs(q)

                if (orders.size !== 0) {
                    const temp = []
                    orders.forEach((doc) => {
                        temp.push(doc.data())
                    })
                    setOrders(temp)
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getBooks = async () => {
        try {
            const booksColRef = collection(db, BooksCollection);
            const q = query(booksColRef, where('id', '==', item.id), where('borrowed', '==', false));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.size !== 0) {
                const temp = []
                querySnapshot.forEach((doc) => {
                    const bookDetail = {
                        bookId: doc.id,
                        ...doc.data()
                    }
                    temp.push(bookDetail)
                })
                setBooks(temp);
            } else {
                console.log(`No book can borrow.`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onBorrowPress = (item) => {
        console.log("onBorrowPress");
        navigation.navigate('Create Order', { item: item });
    }

    const renderOwnerWithButton = ({ item }) => {
        const orderIndex = orders.findIndex(order => order.bookId === item.bookId)
        if (orders.length > 0) {
            return (
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                    <Text>{item.bookId}</Text>
                    <Button buttonText={orders[orderIndex].status} />
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                    <Text>{item.location.latitude}</Text>
                    <TouchableOpacity onPress={() => onBorrowPress(item)}>
                        <Button buttonText="Borrow" />
                    </TouchableOpacity>
                </View>
            )
        }
    }

    const renderOwnerList = () => {
        if (books.length !== 0) {
            return (
                <View>
                    <MapWithMarker books={books}/>
                    <FlatList
                        data={books}
                        renderItem={renderOwnerWithButton}
                    />
                </View>
            )
        } else {
            console.log("no books");
            return (
                <View>
                    <Text>No books can be borrowed</Text>
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            {renderOwnerList()}
        </View>
    )
}

export default SelectOwnerScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f8f8',
    },
})