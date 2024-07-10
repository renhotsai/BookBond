import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth, UsersCollection, Orders } from '../../controller/firebaseConfig';
import Book from '../../components/Book';
import {OrderType} from '../../model/OrderType';
import {OrderStatus} from '../../model/OrderStatus';

const BorrowedBooksScreen = ({navigation}) => {

    const [bookingsList, setBookingsList] = useState([]);

    const retrieveFromDb = () => {
        const user = auth.currentUser;

        if (user !== null) {
            const userDocRef = doc(db, UsersCollection, user.email)
            const userOrderColRef = collection(userDocRef, Orders)
            const q = query(userOrderColRef, where("orderType", "==", OrderType.In),where("status","==",OrderStatus.Checked));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const resultsFromFirestore = [];
                querySnapshot.forEach((doc) => {
                    resultsFromFirestore.push(doc.data());
                });

                setBookingsList(resultsFromFirestore);
            });

            return () => unsubscribe();
        }
    };
    useEffect(() => {
        retrieveFromDb();
    }, []);


    const onOrderPress = (item) => {
        console.log("onOrderPress");
        navigation.navigate("Order Details", { item: item })
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity onPress={() => onOrderPress(item)}>
                <Book item={item} />
            </TouchableOpacity>
        )
    }


    return (
        <View style={styles.container}>
            <FlatList
                data={bookingsList}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text>No borrowed books</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    bookItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    bookImage: {
        width: 80,
        height: 80,
        marginRight: 10,
    },
    bookInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    bookAuthors: {
        fontSize: 16,
        color: '#666',
    },
});

export default BorrowedBooksScreen;
