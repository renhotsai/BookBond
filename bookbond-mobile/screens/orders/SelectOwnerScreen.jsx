import { FlatList, StyleSheet, Text, TouchableOpacity, View, LogBox, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { and, collection, doc, getDocs, or, query, where } from 'firebase/firestore';
import Button from '../../components/Button';
import { BooksCollection, OrderCollection, Orders, UsersCollection, auth, db } from '../../controller/firebaseConfig';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { getCurrentLocation, reverseGeoCoding } from '../../controller/LocationHelper';
import { Entypo } from '@expo/vector-icons';
import DatePickerWithShown from '../../components/DatePicker';
import { Dialog } from 'react-native-simple-dialogs';
import dayjs from 'dayjs';
import { OrderStatus } from '../../model/OrderStatus';

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
    const [orders, setOrders] = useState([])
    const [visibleBooks, setVisibleBooks] = useState([])

    useEffect(() => {
        getBooks()
        getOrders()
    }, [])
    useEffect(() => {
        showSelectedDateBooks()
    }, [returnDate, books, orders])

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

    //TODO: find books and check orders where status in Accepted, Picked, Returned

    const getOrders = async () => {
        try {
            const ordersColRef = collection(db, OrderCollection);
            const q = query(ordersColRef,
                where('bookId', '==', item.bookId),
                where("status", "in", [OrderStatus.Accepted, OrderStatus.Picked, OrderStatus.Returned]))

            const querySnapshot = await getDocs(q);
            if (querySnapshot.size !== 0) {
                const temp = []
                for (const doc of querySnapshot.docs) {
                    const bookDetail = {
                        id: doc.id,
                        ...doc.data()
                    };
                    temp.push(bookDetail);
                }
                setOrders(temp);
            } else {
                console.log(`No book order`);
            }
        } catch (error) {
            console.error(error);
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
                    const address = await reverseGeoCoding(book.location);
                    const bookDetail = {
                        id: doc.id,
                        address: address,
                        ...book
                    };
                    temp.push(bookDetail);
                }
                setBooks(temp);
            } else {
                console.log(`No book can borrow.`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const showSelectedDateBooks = () => {
        const temp = []
        books.forEach(book => {
            const bookOrders = orders.filter(order => order.id === book.id);
            if (bookOrders.length === 0) {
                temp.push(book)
            } else {
                let isAvailable = true
                for (const order of bookOrders) {
                    const orderTo = order.to.toDate()
                    const orderFrom = order.from.toDate()

                    const isBorrowDateInRange = orderFrom <= borrowDate && borrowDate <= orderTo
                    const isReturnDateInRange = orderFrom <= returnDate && returnDate <= orderTo
                    if (isBorrowDateInRange || isReturnDateInRange) {
                        isAvailable = false
                        break
                    }
                }
                if (isAvailable) {
                    temp.push(book)
                }
            }
        })
        setVisibleBooks(temp)
        moveToDeviceLocation()
        createBookMarker(temp)
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
            <View style={{
                flex: 1,
                flexDirection: 'row',
                margin: 10,
                backgroundColor: '#fff',
                padding: 5,
                borderRadius: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => onBookPress(item)}>
                    <Text style={{ fontWeight: 'bold', fontSize: '16vm' }}>{item.address}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onBorrowPress(item)}>
                    <Button buttonText="Borrow" />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ marginHorizontal: 10, gap: 10,height:'100%' }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity onPress={() => setOpen(true)} style={{ display: 'flex', flexDirection: "row", gap: 10, padding: 15 }}>
                    <Text style={styles.dateTimeTxt}>{borrowDate.toDateString()}</Text>
                    <Text style={styles.dateTimeTxt}> - </Text>
                    <Text style={styles.dateTimeTxt}>{returnDate.toDateString()}</Text>
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
            <FlatList
                data={visibleBooks}
                key={(item) => item.id}
                renderItem={renderOwnerWithButton}
            />
        </View>
    )
}

export default SelectOwnerScreen

const styles = StyleSheet.create({
    dateTimeTxt: {
        fontWeight: 'bold', fontSize: '20vm',
    }
})