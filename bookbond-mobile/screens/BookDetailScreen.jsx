import React, { useEffect, useState } from 'react';
import { ScrollView, Text, Image, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { BooksCollection, OwnBooks, UsersCollection, auth, db } from '../firebaseConfig';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

const BookDetailsScreen = ({ route }) => {
    const { book } = route.params;
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        console.log(JSON.stringify(book));
        checkOwnBook()
    }, [])

    const [isOwnBook, setIsOwnBook] = useState(false)

    const renderDescription = () => {
        const description = book.description;
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
    };

    const checkOwnBook = async () => {
        const user = auth.currentUser
        if (user !== null) {
            try {
                const userDocRef = doc(db, UsersCollection, user.email)
                const ownBooksColRef = collection(userDocRef, OwnBooks)
                const q = query(ownBooksColRef, where("id", "==", book.id));
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

    const renderButtons = () => {
        if (!isOwnBook) {
            return (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Borrow</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onOwnPress}>
                        <Text style={styles.buttonText}>I have it</Text>
                    </TouchableOpacity>
                </View>
            )
        }else{
            return (
                <View style={styles.buttonContainer}/>
            )
        }
    }

    const handleSubmit = async () => {
        const user = auth.currentUser;
        if (user !== null) {
            try {
                const booksColRef = collection(db, 'borrowedBooks');
                const bookToInsert = {
                    borrower: user.email,
                    ...book
                };
                await addDoc(booksColRef, bookToInsert);
                Alert.alert("Listing Created", "You have borrowed the book");
            } catch (error) {
                console.error("Error adding document: ", error);
                Alert.alert("Error", "There was an error borrowing the book.");
            }
        } else {
            Alert.alert("Not signed in", "You must be signed in to create a listing.");
        }
    };

    const onOwnPress = async () => {
        console.log(`onOwnPress`);
        const user = auth.currentUser;
        if (user !== null) {
            try {
                const booksColRef = collection(db, BooksCollection);
                const bookToInsert = {
                    borrowed: false,
                    owner: user.email,
                    ...book
                };
                const docRef = await addDoc(booksColRef, bookToInsert);
                console.log(docRef.id);
                const userRef = doc(db, UsersCollection, user.email);
                const userOwnColRef = collection(userRef, OwnBooks);
                const bookToUser = {
                    id: book.id,
                    title: book.title,
                    authors: book.authors,
                    imageLinks: book.imageLinks
                }
                console.log(`start to insert`);
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
            {book.imageLinks && book.imageLinks.thumbnail && (
                <Image source={{ uri: book.imageLinks.thumbnail }} style={styles.image} />
            )}
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.authors}>{book.authors?.join(', ')}</Text>
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
