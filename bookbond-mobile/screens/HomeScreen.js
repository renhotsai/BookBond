import { useEffect, useState } from "react";
import { FlatList, Text, View, Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = ({navigation}) => {

    useEffect(() => {
        fetchData()
    }, [])

    const [booksFromAPI, setBooksFromAPI] = useState([]);
    const fetchData = async () => {
        const dataJson = await (await fetch(`https://www.googleapis.com/books/v1/volumes?q=""&startIndex=0&maxResults=40`)).json()
        setBooksFromAPI(dataJson.items)
    }

    const onSearchPress = () => {
        // Search
    }
    const onBookPress = () => {
        console.log("onBookPress");
        // Book details page
        navigation.navigate("BookDetails");
    }

    const renderBookItem = (item) => {

        console.log(item.volumeInfo.imageLinks.thumbnail);
        return (
            <TouchableOpacity style={{ display: "flex", flexDirection: "row", padding: 5, gap: 10 }} onPress={onBookPress}>
                <Image source={{ uri: `${item.volumeInfo.imageLinks.thumbnail}` }} style={{ width: 100, height: 100 }} />

                <View style={{ justifyContent: "space-around" }}>
                    <Text>{item.volumeInfo.title}</Text>
                    <Text>{item.volumeInfo.authors}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <TextInput placeholder="search" />
                <TouchableOpacity onPress={onSearchPress}>
                    <AntDesign name="search1" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={booksFromAPI}
                renderItem={({ item }) => renderBookItem(item)}
            />
        </View>
    );
}
export default HomeScreen;