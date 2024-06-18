import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CancelScreen from './CancelScreen'
import OrderBaseScreen from './OrderBaseScreen'
import OrderType from '../../model/OrderType'
import Button from '../../components/Button'
import OrderStatus from '../../model/OrderStatus'


const AcceptedScreen = ({ order, updateOrder }) => {
  const onPickPress = () => {
    console.log(`onPickPress orderId ${order.orderId}`);
    updateOrder(OrderStatus.Picked)
  }

  const onCancel = () => {
    console.log(`onCancelPress orderId ${order.orderId}`);
    updateOrder(OrderStatus.Cancelled)
  }
   
  if (order.orderType === OrderType.In) {
    return (
      <View>
        <OrderBaseScreen order={order} />
        <TouchableOpacity onPress={onPickPress}>
          <Button buttonText={"Picked"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel}>
          <Button buttonText={"Cancel"}/>
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <OrderBaseScreen order={order} />
    )
  }
}

export default AcceptedScreen

const styles = StyleSheet.create({
})