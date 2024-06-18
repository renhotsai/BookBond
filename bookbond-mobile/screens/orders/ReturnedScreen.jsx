import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import OrderStatus from '../../model/OrderStatus'
import OrderType from '../../model/OrderType'
import OrderBaseScreen from './OrderBaseScreen'
import Button from '../../components/Button'

const ReturnedScreen = ({ order, updateOrder }) => {
    const onCheckedPress = () => {
        console.log(`onCheckedPress orderId ${order.orderId}`);
        updateOrder(OrderStatus.Checked)
    }

    if (order.orderType === OrderType.Out) {
        return (
            <View>
                <OrderBaseScreen order={order} />
                <TouchableOpacity onPress={onCheckedPress}>
                    <Button buttonText={"Checked"} />
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <OrderBaseScreen order={order} />
        )
    }
}

export default ReturnedScreen

const styles = StyleSheet.create({})