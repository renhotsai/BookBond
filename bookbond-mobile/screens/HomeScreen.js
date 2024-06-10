import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Book from "../components/Book";

const HomeScreen = ({ navigation }) => {

    useEffect(() => {
        fetchData();
    }, []);

    const [booksFromAPI, setBooksFromAPI] = useState([]);

    const fetchData = async () => {
        const dataJson = await (await fetch(`https://www.googleapis.com/books/v1/volumes?q=""&startIndex=0&maxResults=40`)).json();
        const temp = []
        for (const item of dataJson.items) {
            const book = {
                id: item.id,
                ...item.volumeInfo
            }
            temp.push(book);
        }
        setBooksFromAPI(temp);
    };

    const onSearchPress = () => {

    };

    const onBookPress = (item) => {
        console.log("onBookPress", item.title);

        navigation.navigate("BookDetails", { book: item });
    };

    const navigateToProfile = () => {
        navigation.navigate("Profile");
    };

    const renderBookItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => onBookPress(item)}>
                <Book item={item}/>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>List of Books</Text>
                <TouchableOpacity onPress={navigateToProfile} style={styles.profileIcon}>
                    <Ionicons name="person-circle" size={30} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.searchBar}>
                <TextInput placeholder="Search" style={styles.searchInput} />
                <TouchableOpacity onPress={onSearchPress}>
                    <AntDesign name="search1" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={booksFromAPI}
                renderItem={renderBookItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.bookList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileIcon: {
        padding: 10,
    },
    searchBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    bookList: {
        padding: 20,
    },
    bookItem: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 15,
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

export default HomeScreen;
