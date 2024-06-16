import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BooksCollection, Orders, UsersCollection, auth, db } from '../../firebaseConfig';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import Button from '../../components/Button';
import OrderStatus from '../../model/OrderStatus';

const SelectOwnerScreen = ({ navigation, route }) => {
    const { book } = route.params;

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
                const q = query(userOrderColRef,where("status","not-in",[OrderStatus.Cancelled,OrderStatus.Denied,OrderStatus.Returned]))
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
            const q = query(booksColRef, where('id', '==', book.id), where('borrowed', '==', false));
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
        navigation.navigate('Create Order', { book: item });
    }

    const renderOwnerWithButton = ({ item }) => {
        const orderIndex  = orders.findIndex(order => order.bookId === item.bookId)
        if (orders.length > 0){
            return (
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                    <Text>{item.address}</Text>
                    <Button buttonText={orders[orderIndex].status} />
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                    <Text>{item.bookId}</Text>
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
                    <Text>MapView</Text>
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
            {book.imageLinks && book.imageLinks.thumbnail && (
                <Image source={{ uri: book.imageLinks.smallThumbnail }} style={styles.image} />
            )}
            <Text style={styles.title}>{book.title}</Text>
            {renderOwnerList()}
        </View>
    )
}

export default SelectOwnerScreen

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