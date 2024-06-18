import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import OrderBaseScreen from './OrderBaseScreen'
import Button from '../../components/Button'
import OrderStatus from '../../model/OrderStatus'
import OrderType from '../../model/OrderType'

const PickedScreen = ({ order, updateOrder }) => {
  const onReturnPress = () => {
    console.log(`onReturnPress orderId ${order.orderId}`);
    updateOrder(OrderStatus.Returned)
  }
  if (order.orderType === OrderType.In) {
    return (
      <View>
        <OrderBaseScreen order={order} />
        <TouchableOpacity onPress={onReturnPress}>
          <Button buttonText={"Return"} />
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <OrderBaseScreen order={order} />
    )
  }
}

export default PickedScreen

const styles = StyleSheet.create({})