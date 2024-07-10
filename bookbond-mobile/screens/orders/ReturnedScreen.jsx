import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {OrderStatus} from '../../model/OrderStatus'
import {OrderType} from '../../model/OrderType'
import OrderBaseScreen from './OrderBaseScreen'
import Button from '../../components/Button'

const ReturnedScreen = ({ item, updateOrder }) => {
    const onCheckedPress = () => {
        console.log(`onCheckedPress orderId ${item.orderId}`);
        updateOrder(OrderStatus.Checked)
    }

    if (item.orderType === OrderType.Out) {
        return (
            <View>
                <OrderBaseScreen item={item} />
                <TouchableOpacity onPress={onCheckedPress}>
                    <Button buttonText={"Checked"} />
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <OrderBaseScreen item={item} />
        )
    }
}

export default ReturnedScreen

const styles = StyleSheet.create({})