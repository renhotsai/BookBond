import React, { useEffect, useState } from 'react';
import { ScrollView, Text, Image, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';

import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import Button from '../components/Button';
import {OrderStatus} from '../model/OrderStatus';
import {OrderType} from '../model/OrderType';
import { BooksCollection, Orders, OwnBooks, UsersCollection, auth, db } from '../controller/firebaseConfig';

const BookDetailsScreen = ({ navigation, route }) => {
    const { item } = route.params;
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        checkOwnBook()
    }, [])

    const [isOwnBook, setIsOwnBook] = useState(false)

    const renderDescription = () => {
        if(item.description){
            const description = item.description;
            if (isExpanded) {
                return (
                    <>
                        <Text style={styles.description}>{description}</Text>
                        <TouchableOpacity onPress={toggleDescription}>
                            <Text style={styles.readMoreText}>Read Less</Text>
                        </TouchableOpacity>
                    </>
                );
            } else {
                const shortDescription = description.length > 200 ? description.substring(0, 200) + '...' : description;
                return (
                    <>
                        <Text style={styles.description}>{shortDescription}</Text>
                        {description.length > 200 && (
                            <TouchableOpacity onPress={toggleDescription}>
                                <Text style={styles.readMoreText}>Read More</Text>
                            </TouchableOpacity>
                        )}
                    </>
                );
            }
        }else{
            return (
                <>
                    <Text style={styles.description}>No description</Text>
                </>
            )
        }
    };

    const checkOwnBook = async () => {
        const user = auth.currentUser
        if (user !== null) {
            try {
                const userDocRef = doc(db, UsersCollection, user.email)
                const ownBooksColRef = collection(userDocRef, OwnBooks)
                const q = query(ownBooksColRef, where("id", "==", item.id));
                const querySnapshot = await getDocs(q)

                if (querySnapshot.size !== 0) {
                    setIsOwnBook(true)
                } else {
                    setIsOwnBook(false)
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const onBorrowPress = async () => {
        console.log("onBorrowPress");
        const user = auth.currentUser
        if (user !== null) {
            try {
                const userDocRef = doc(db, UsersCollection, user.email)
                const userOrderColRef = collection(userDocRef, Orders)
                const q = query(userOrderColRef,
                    where("status", "not-in", [OrderStatus.Checked, OrderStatus.Cancelled, OrderStatus.Denied]),
                    where("orderType", "==", OrderType.In),
                    where("bookId", "==", item.id)
                )
                const querySnapshot = await getDocs(q)
                if (querySnapshot.size === 0) {
                    navigation.navigate('Borrow Book', { item: item });
                } else {
                    querySnapshot.forEach((doc) => {
                        const item = doc.data()
                        navigation.navigate("Order Details", { item: item })
                    })
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const renderButtons = () => {
        if (isOwnBook) {
            return (
                <View style={styles.buttonContainer} />
            )
        } else {
            return (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={onBorrowPress}>
                        <Button buttonText={"I want borrow"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onOwnPress}>
                        <Button buttonText={"I have it"} />
                    </TouchableOpacity>
                </View>
            )
        }
    }

    const onOwnPress = async () => {
        console.log(`onOwnPress`);
        const user = auth.currentUser;
        if (user !== null) {
            try {
                const booksColRef = collection(db, BooksCollection);
                const bookToInsert = {
                    borrowed: false,
                    owner: user.email,
                    ...item
                };
                const docRef = await addDoc(booksColRef, bookToInsert);
                const userRef = doc(db, UsersCollection, user.email);
                const userOwnColRef = collection(userRef, OwnBooks);
                const bookToUser = {
                    id: item.id,
                    title: item.title,
                    authors: item.authors,
                    imageLinks: item.imageLinks
                }
                await setDoc(doc(userOwnColRef, docRef.id), bookToUser);
                setIsOwnBook(true)
            } catch (error) {
                console.error(error);
            }
        } else {
            Alert.alert("Not signed in", "You must be signed in to create a listing.");
        }
    }

    return (
        <ScrollView style={styles.container}>
            {item.imageLinks && item.imageLinks.thumbnail && (
                <Image source={{ uri: item.imageLinks.thumbnail }} style={styles.image} />
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.authors}>{item.authors?.join(', ')}</Text>
            {renderDescription()}

            {renderButtons()}

        </ScrollView>
    );
};

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
    authors: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 10,
    },
    readMoreText: {
        fontSize: 16,
        color: '#1e90ff',
        marginTop: 5,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        backgroundColor: '#1e90ff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BookDetailsScreen;
