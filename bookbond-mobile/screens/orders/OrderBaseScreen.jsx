import { Image, StyleSheet, Text, View } from 'react-native'
import React, { } from 'react'
import { OrderStatus } from '../../model/OrderStatus'
import { OrderType } from '../../model/OrderType'
import MapWithMarker from '../../components/MapWithMarker'
import { OrderDate } from '../../components/OrderDate'

const OrderBaseScreen = ({ item }) => {
    const displayStatus = item.orderType !== OrderType.In ? item.status : item.status !== OrderStatus.Accepted ? item.status : "Waiting to Pick up"

    if (item.orderType === OrderType.Out) {
        return (
            <View>
                {item.imageLinks && item.imageLinks.thumbnail && (
                    <Image source={{ uri: item.imageLinks.thumbnail }} style={styles.image} />
                )}
                <Text>{item.borrower}</Text>
                <OrderDate from={item.from.toDate().toDateString()} to={item.to.toDate().toDateString()} />
            </View>
        )
    } else {
        return (
            <View>
                <MapWithMarker item={item} />
                <OrderDate from={item.from.toDate().toDateString()} to={item.to.toDate().toDateString()} />
                <Text>{displayStatus}</Text>
            </View>
        )
    }
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