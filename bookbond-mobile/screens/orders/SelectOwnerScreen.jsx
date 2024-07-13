import { FlatList, Dimensions, StyleSheet, Text, TouchableOpacity, View ,LogBox} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import Button from '../../components/Button';
import {OrderStatus} from '../../model/OrderStatus';
import {OrderType} from '../../model/OrderType';
import { BooksCollection, Orders, UsersCollection, auth, db } from '../../controller/firebaseConfig';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { getCurrentLocation, reverseGeoCoding } from '../../controller/LocationHelper';
import { Entypo } from '@expo/vector-icons';

LogBox.ignoreLogs(['Encountered two children with the same key']);

const SelectOwnerScreen = ({ navigation, route }) => {
    const { item } = route.params;

    //a variable to programmatically access the MapView element
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([])

    useEffect(() => {
        getBooks()
    }, [])



    const [currRegion, setCurrRegion] = useState({
        latitude: 43.6790048,
        longitude: -79.2980967,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    });

    const [books, setBooks] = useState([])
    const [currCoord, setCurrCoord] = useState({});


    //map
    const mapMoved = (updatedRegion) => {
        setCurrRegion(updatedRegion);
    }

    const moveToDeviceLocation = async () => {
        try {
            const location = await getCurrentLocation()
            const coords = { latitude: location.latitude, longitude: location.longitude };
            setCurrCoord(coords);

            const region = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }
            setCurrRegion(region);
            mapRef.current.animateCamera({ center: coords }, 2000);

        } catch (error) {
            console.error(error);
        }
    }

    const moveToBookLocation = (item) => {
        const bookCoord = item.location;
        mapRef.current.animateCamera({ center: bookCoord }, 2000);
    }

    const createBookMarker = async (books) => {
        const temp = [];
        for (const book of books) {
            const bookCoord = book.location;
            const address = await reverseGeoCoding(bookCoord);
            const marker = (
                <Marker
                    key={book.bookId}
                    coordinate={bookCoord}
                    title={book.title}
                    description={address}
                    ref={(ref) => (temp[book.bookId] = ref)}
                >
                    <Entypo name="book" size={24} color="blue" />
                </Marker>
            );
            temp.push(marker);
        }
        setMarkers(temp);
    };

    const getBooks = async () => {
        try {
            const booksColRef = collection(db, BooksCollection);
            const q = query(booksColRef, where('id', '==', item.id), where('borrowed', '==', false));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size !== 0) {
                const temp = []
                for (const doc of querySnapshot.docs) {
                    const address = await reverseGeoCoding(doc.data().location);
                    const bookDetail = {
                        bookId: doc.id,
                        address: address,
                        ...doc.data()
                    };
                    temp.push(bookDetail);
                }
                setBooks(temp);
                moveToDeviceLocation()
                createBookMarker(temp)
            } else {
                console.log(`No book can borrow.`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    //button actions
    const onBorrowPress = (item) => {
        console.log("onBorrowPress");
        navigation.navigate('Create Order', { item: item });
    }

    const onBookPress = (item) => {
        console.log(`onBookPress :${item.bookId}`);
        moveToBookLocation(item)
        markers[item.bookId].showCallout()
    }

    //renderItem
    const renderOwnerWithButton = ({ item }) => {
            return (
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => onBookPress(item)}>
                        <Text>{item.address}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onBorrowPress(item)}>
                        <Button buttonText="Borrow" />
                    </TouchableOpacity>
                </View>
            )
    }

    return (
        <View style={styles.container}>
            {books.length !== 0 ? (
                <View style={styles.container}>
                    <MapView
                        style={{ height: 500 }}
                        initialRegion={currRegion}
                        onRegionChangeComplete={mapMoved}
                        ref={mapRef}
                    >
                        {markers}
                        <Marker
                            coordinate={currCoord}
                            title="1 Main Street, Toronto"
                            description='Center of Toronto'>
                            <MaterialIcons name="person-pin-circle" size={60} color="red" />
                        </Marker>

                    </MapView>
                    <FlatList
                        data={books}
                        renderItem={renderOwnerWithButton}
                    />
                </View>
            ) : <Text>No books can be borrowed</Text>
            }
        </View>
    )
}

export default SelectOwnerScreen

const styles = StyleSheet.create({
    container: {
        gap:20
    },
})