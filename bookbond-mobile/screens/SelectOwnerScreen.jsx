import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Button from '../components/Button';

const SelectOwnerScreen = ({ navigation, route }) => {
    const { book } = route.params;

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

    const onBorrowPress = (owner) => {
        console.log("onBorrowPress");
        console.log(`item: ${owner}`);
        navigation.navigate('Create Order', { owner: owner });
    }

    const renderOwnerWithButton = ({ item }) => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                <Text>{item}</Text>
                <TouchableOpacity onPress={() => onBorrowPress(item)}>
                    <Button buttonText="Borrow" />
                </TouchableOpacity>
            </View>
        )
    }

    const renderOwnerList = () => {
        console.log(owners.length);
        if (owners.length !== 0) {
            return (
                <View>
                    <Text>MapView</Text>
                    <FlatList
                        data={owners}
                        renderItem={renderOwnerWithButton}
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