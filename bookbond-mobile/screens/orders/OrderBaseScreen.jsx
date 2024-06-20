import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderStatus from '../../model/OrderStatus'
import OrderType from '../../model/OrderType'

const OrderBaseScreen = ({ item }) => {
    const displayStatus = item.orderType !== OrderType.In ? item.status  : item.status !== OrderStatus.Accepted ? item.status : "Waiting to Pick up"
    return (
        <View>
            {item.imageLinks && item.imageLinks.thumbnail && (
                <Image source={{ uri: item.imageLinks.smallThumbnail }} style={styles.image} />
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text>MapView</Text>
            <Text>{displayStatus}</Text>
        </View>
    )
}

export default OrderBaseScreen


const styles = StyleSheet.create({
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
})