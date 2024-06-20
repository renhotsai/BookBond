import { Button, Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps';
import { getCurrentLocation } from '../controller/LocationHelper';
import { MaterialIcons } from '@expo/vector-icons';

const MapWithMarker = ({ books }) => {
    const [currRegion, setCurrRegion] = useState({
        latitude: 43.6790048,
        longitude: -79.2980967,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    });

    useEffect(() => {
        moveToDeviceLocation()
    }, [])

    const [currCoord, setCurrCoord] = useState({});

    //a variable to programmatically access the MapView element
    const mapRef = useRef(null);

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

    return (<View>

        <MapView
            style={{ width: Dimensions.get('window').width, height: 500 }}
            initialRegion={currRegion}
            onRegionChangeComplete={mapMoved}
            ref={mapRef}
        >
            {books && books.map((book) => {
                const bookCoord = book.location;
                console.log(JSON.stringify(bookCoord));
                return (
                    <Marker
                        coordinate={bookCoord}
                        title={book.title}
                        description='Center of Toronto'>
                        <MaterialIcons name="person-pin-circle" size={60} color="red" />
                    </Marker>
                )
            })
            }

            <Marker
                coordinate={currCoord}
                title="1 Main Street, Toronto"
                description='Center of Toronto'>
                <MaterialIcons name="person-pin-circle" size={60} color="red" />
            </Marker>

        </MapView>

        <Button title='Move to My Location' onPress={moveToDeviceLocation} />

    </View>
    );
}

export default MapWithMarker

const styles = StyleSheet.create({
})