import { FlatList, StyleSheet, Text, TouchableOpacity, View, LogBox } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { and, collection, doc, getDocs, or, query, where } from 'firebase/firestore';
import Button from '../../components/Button';
import { BooksCollection, Orders, UsersCollection, auth, db } from '../../controller/firebaseConfig';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { getCurrentLocation, reverseGeoCoding } from '../../controller/LocationHelper';
import { Entypo } from '@expo/vector-icons';
import DatePickerWithShown from '../../components/DatePicker';
import { Dialog } from 'react-native-simple-dialogs';
import dayjs from 'dayjs';

LogBox.ignoreLogs(['Encountered two children with the same key']);

const SelectOwnerScreen = ({ navigation, route }) => {
    const { item } = route.params;


    //map
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([])
    const [currCoord, setCurrCoord] = useState({});

    //date picker
    const [borrowDate, setBorrowDate] = useState(dayjs().add(1, 'day').toDate())
    const [returnDate, setReturnDate] = useState(dayjs().add(2, 'days').toDate())
    const [open, setOpen] = useState(false)

    const [books, setBooks] = useState([])

    useEffect(() => {
        getBooks()
    }, [])
    useEffect(() => {
        console.log(`renew book list`);
        getBooks()
    }, [returnDate])

    const [currRegion, setCurrRegion] = useState({
        latitude: 43.6790048,
        longitude: -79.2980967,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    });

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
                    key={book.id}
                    coordinate={bookCoord}
                    title={book.title}
                    description={address}
                    ref={(ref) => (temp[book.id] = ref)}
                >
                    <Entypo name="book" size={24} color="blue" />
                </Marker>
            );
            temp.push(marker);
        }
        setMarkers(temp);
    };
    const checkAvailableBook = (book) => {
        if (book.borrowed === false) {
            return true;
        }

        if (book.borrowed === true) {
            const bookTo = book.to.toDate()
            const bookFrom = book.from.toDate()
            if (book.borrowed === true) {
                const isSelectedDateInRange = bookFrom < borrowDate && returnDate < bookTo;
                const isBookFromInRange = borrowDate < bookFrom && bookFrom < returnDate;
                const isBookToInRange = borrowDate < bookTo && bookTo < returnDate;
                return !(isBookFromInRange || isBookToInRange || isSelectedDateInRange);
            }
        }
    }
    const getBooks = async () => {
        try {
            const booksColRef = collection(db, BooksCollection);
            const q = query(booksColRef, where('bookId', '==', item.bookId));

            const querySnapshot = await getDocs(q);
            if (querySnapshot.size !== 0) {
                const temp = []
                for (const doc of querySnapshot.docs) {
                    const book = doc.data()
                    if (checkAvailableBook(book)) {
                        const address = await reverseGeoCoding(book.location);
                        const bookDetail = {
                            id: doc.id,
                            address: address,
                            ...book
                        };
                        temp.push(bookDetail);
                    }
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
        const dates = { from: borrowDate.toDateString(), to: returnDate.toDateString() };
        item.dates = dates;
        navigation.navigate('Create Order', { item: item });
    }

    const onBookPress = (item) => {
        console.log(`onBookPress :${item.id}`);
        moveToBookLocation(item)
        markers[item.id].showCallout()
    }

    //renderItem
    const renderOwnerWithButton = ({ item }) => {
        return (
            <View style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between', alignItems: "center", margin: 10 }}>
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
            <View style={styles.container}>
                <MapView
                    style={{ height: 300 }}
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
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity onPress={() => setOpen(true)} style={{ display: 'flex', flexDirection: "row", gap: 10 }}>
                        <Text>{borrowDate.toDateString()}</Text>
                        <Text> - </Text>
                        <Text>{returnDate.toDateString()}</Text>
                    </TouchableOpacity>
                    <Dialog
                        visible={open}
                        onTouchOutside={() => { setOpen(false) }} >
                        <DatePickerWithShown
                            borrowDate={borrowDate} setBorrowDate={setBorrowDate}
                            returnDate={returnDate} setReturnDate={setReturnDate} />
                        <TouchableOpacity onPress={() => { setOpen(false) }}>
                            <Text>Done</Text>
                        </TouchableOpacity>
                    </Dialog>


                </View>

                <FlatList
                    data={books}
                    key={(item) => item.id}
                    renderItem={renderOwnerWithButton}
                />
            </View>

        </View>
    )
}

export default SelectOwnerScreen

const styles = StyleSheet.create({
    container: {
        gap: 20
    },
})