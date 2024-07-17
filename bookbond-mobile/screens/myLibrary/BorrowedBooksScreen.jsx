import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth, UsersCollection, Orders, BooksCollection } from '../../controller/firebaseConfig';
import Book from '../../components/Book';
import { OrderType } from '../../model/OrderType';
import { OrderStatus } from '../../model/OrderStatus';
import { EmptyList } from '../../components/EmptyList';
import { FontAwesome6 } from '@expo/vector-icons';

const BorrowedBooksScreen = ({ navigation }) => {
    const [containerHeight, setContainerHeight] = useState(0);

    const [bookingsList, setBookingsList] = useState([]);
    const retrieveFromDb = () => {
        const user = auth.currentUser;

        if (user !== null) {
            const userDocRef = doc(db, UsersCollection, user.email)
            const userOrderColRef = collection(userDocRef, Orders)
            const q = query(userOrderColRef, where("orderType", "==", OrderType.In), where("status", "==", OrderStatus.Checked));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const resultsFromFirestore = [];
                querySnapshot.forEach((doc) => {
                    const dataToPush = {
                        id: doc.id,
                        ...doc.data(),
                    }
                    resultsFromFirestore.push(dataToPush);
                });

                setBookingsList(resultsFromFirestore);
            });

            return () => unsubscribe();
        }
    };
    useEffect(() => {
        retrieveFromDb();
    }, []);


    const onOrderPress = async (item) => {
        console.log("onOrderPress");
        console.log(JSON.stringify(item));
        const book = await getBook(item.id)
        if(book){
            navigation.navigate("Book Details", { item: book,isHistory: true });
        }else{
            console.log('Book not found!');
        }
    }

    const getBook = async (id) => {
        const bookRef = doc(db, BooksCollection, id);
        const docSnap = await getDoc(bookRef);
        if (!docSnap.exists()) {
            console.log('No such document!');
            return null;
        } else {
            const bookData = docSnap.data();
            return bookData;
        }
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity onPress={() => onOrderPress(item)}>
                <Book item={item} />
            </TouchableOpacity>
        )
    }


    return (
        <View style={styles.container}
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setContainerHeight(height);
            }}>
            <FlatList
                data={bookingsList}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <EmptyList containerHeight={containerHeight} />}
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
