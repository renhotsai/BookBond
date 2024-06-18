import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderStatus from '../../model/OrderStatus'
import OrderType from '../../model/OrderType'

const OrderBaseScreen = ({ order }) => {
    const displayStatus = order.orderType !== OrderType.In ? order.status  : order.status !== OrderStatus.Accepted ? order.status : "Waiting to Pick up"
    return (
        <View>
            {order.imageLinks && order.imageLinks.thumbnail && (
                <Image source={{ uri: order.imageLinks.smallThumbnail }} style={styles.image} />
            )}
            <Text style={styles.title}>{order.title}</Text>
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