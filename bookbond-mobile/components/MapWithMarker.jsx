import { Button, Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps';
import { Entypo } from '@expo/vector-icons';

const MapWithMarker = ({ item }) => {

    const mapRef = useRef(null);
    return (
            <MapView
                style={{ height: 250 }}
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
    );
}

export default MapWithMarker

const styles = StyleSheet.create({
})