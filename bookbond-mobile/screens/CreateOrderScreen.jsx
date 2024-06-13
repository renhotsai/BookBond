import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Button from '../components/Button';

const CreateOrderScreen = ({ route }) => {
    const { owner } = route.params;

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

    return (
        <View>
            <Text>{owner}</Text>
        </View>
    )
}

export default CreateOrderScreen

const styles = StyleSheet.create({

})