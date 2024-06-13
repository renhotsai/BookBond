import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const CreateOrderScreen = ({ route }) => {
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
        bookOwners()
    }, [])

    const [owners, setOwners] = useState([])

    const bookOwners = async () => {
        try {
            const booksColRef = collection(db, 'BooksCollection');
            const q = query(booksColRef, where('id', '==', book.id), where('borrowed', '==', false));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.size !== 0) {
                const temp = []
                querySnapshot.forEach((doc) => {
                    const bookDetail = doc.data()
                    temp.push(bookDetail.owner)
                })
                setOwners(temp)
                return true;
            } else {
                console.log(`No book can borrow.`);
                return false;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const renderOwnerList = () => {
        console.log(owners.length);
        if (owners.length !== 0) {
            return (
                <View>
                    <Text>MapView</Text>
                    <FlatList
                        data={owners}
                        renderItem={({ item }) => <Text>{item} address</Text>}
                    />
                </View>
            )
        } else {
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