import { View, Text } from 'react-native'
import React from 'react'
import Book from './Book'
import { OrderStatus, statusColors } from '../model/OrderStatus'
import { OrderType } from '../model/OrderType'

const BookWithStatus = ({item}) => {
    const displayStatus = item.orderType !== OrderType.In ? item.status : item.status !== OrderStatus.Accepted ? item.status : "Waiting to Pick up"

    return (
        <View style={{ display: 'flex',marginVertical:5}}>
            <View style={{ width: '95%' }}>
                <Book item={item} />
            </View>
            <View style={{
                backgroundColor: statusColors[displayStatus], zIndex: -1, position: 'absolute', bottom: 0, height: '100%', width: '100%', borderRadius: 20, alignItems: 'flex-end', justifyContent: 'flex-end'
            }}>
                <Text style={{ marginEnd: '5%', color: 'white', fontStyle: 'italic', fontWeight: 'bold' }}>{displayStatus}</Text>
            </View>
        </View>
    )
}

export default BookWithStatus