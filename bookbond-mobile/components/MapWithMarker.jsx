import { Button, Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps';
import { Entypo } from '@expo/vector-icons';

const MapWithMarker = ({ item }) => {

    // useEffect(() => {
    //     moveToBookLocation()
    // }, [])

    //a variable to programmatically access the MapView element
    const mapRef = useRef(null);

    // const moveToBookLocation = async () => {
    //     try {
    //         const location = item.location
    //         const coords = { latitude: location.latitude, longitude: location.longitude };
    //         mapRef.current.animateCamera({ center: coords }, 2000);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    return (
        <View>
            <MapView
                style={{ width: Dimensions.get('window').width, height: 500 }}
                initialRegion={{
                    latitude: item.location.latitude,
                    longitude: item.location.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                }}
                ref={mapRef}
            >
                <Marker
                    coordinate={{
                        latitude: item.location.latitude,
                        longitude: item.location.longitude,
                    }}
                    title="1 Main Street, Toronto"
                    description='Center of Toronto'>
                    <Entypo name="book" size={24} color="blue" />
                </Marker>

            </MapView>
        </View>
    );
}

export default MapWithMarker

const styles = StyleSheet.create({
})