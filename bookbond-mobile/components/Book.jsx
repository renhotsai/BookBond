import React, { useEffect } from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';



const Book = ({ item }) => {
    if (item.imageLinks !== undefined) {
        return (
            <View style={styles.bookItem} >
                <Image source={{ uri: item.imageLinks.thumbnail }} style={styles.bookImage} />
                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{item.title}</Text>
                    <Text style={styles.bookAuthors}>{item.authors}</Text>
                </View>
            </View>
        )
    } else {
        return (
            <View style={styles.bookItem} >
                <Image style={styles.bookImage} />
                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{item.title}</Text>
                    <Text style={styles.bookAuthors}>{item.authors}</Text>
                </View>
            </View>
        )
    }
}

export default Book



const styles = StyleSheet.create({
    bookItem: {
        flex: 1,
        padding: 20,
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
