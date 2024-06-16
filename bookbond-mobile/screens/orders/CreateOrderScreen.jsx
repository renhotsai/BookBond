import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import Button from '../../components/Button';
import OrderStatus from '../../model/status';
import { set } from 'firebase/database';

const CreateOrderScreen = ({ navigation, route }) => {
    const { book } = route.params;

    // const handleSubmit = async () => {
    //     const user = auth.currentUser;
    //     if (user !== null) {
    //         try {
    //             const booksColRef = collection(db, 'borrowedBooks');
    //             const bookToInsert = {
    //                 borrower: user.email,
    //                 ...book
    //             };
    //             await addDoc(booksColRef, bookToInsert);
    //             Alert.alert("Listing Created", "You have borrowed the book");
    //         } catch (error) {
    //             console.error("Error adding document: ", error);
    //             Alert.alert("Error", "There was an error borrowing the book.");
    //         }
    //     } else {
    //         Alert.alert("Not signed in", "You must be signed in to create a listing.");
    //     }
    // };

    useEffect(() => {
        getOwner();
    }, [])

    const [owner, setOwner] = useState({});

    const getOwner = async () => {
        const userDocRef = doc(db, 'UsersCollection', book.owner);
        const user = await getDoc(userDocRef);
        console.log(JSON.stringify(user.data()));
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
                const orderColRef = collection(db, "OrderCollection")
                const orderToInsert = {
                    bookId: book.bookId,
                    borrower: user.email,
                    owner: owner.emailAddress,
                    status: OrderStatus.Pending,
                }
                const order = await addDoc(orderColRef, orderToInsert);
                orderToLandlord(owner.emailAddress, order.id, orderToInsert);
                orderToTenant(user.email, order.id, orderToInsert);

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
        const userDocRef = doc(db, "UsersCollection", email)
        const userOrderDocRef = doc(userDocRef, "Orders", orderId);
        orderToInsert.orderId = orderId;
        setDoc(userOrderDocRef, orderToInsert)
    }

    const orderToTenant = (email, orderId, orderToInsert) => {
        const userDocRef = doc(db, "UsersCollection", email)
        const userOrderDocRef = doc(userDocRef, "Orders", orderId);
        orderToInsert.orderId = orderId;
        setDoc(userOrderDocRef, orderToInsert)
    }

    return (
        <View style={styles.container}>
            {book.imageLinks && book.imageLinks.thumbnail && (
                <Image source={{ uri: book.imageLinks.smallThumbnail }} style={styles.image} />
            )}
            <Text style={styles.title}>{book.title}</Text>
            <Text>{owner.lastName}</Text>
            <Text></Text>
            <Text>MapView</Text>
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