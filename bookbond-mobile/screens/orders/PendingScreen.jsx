import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CancelScreen from './CancelScreen'
import OrderType from '../../model/OrderType'
import Button from '../../components/Button'
import OrderBaseScreen from './OrderBaseScreen'
import OrderStatus from '../../model/OrderStatus'

const PendingScreen = ({ order, updateOrder }) => {

  const onAcceptPress = () => {
    console.log(`onAcceptPress orderId ${order.orderId}`);
    updateOrder(OrderStatus.Accepted)
  }

  const onDeniedPress = () => {
    console.log(`onDeniedPress orderId ${order.orderId}`);
    updateOrder(OrderStatus.Denied)
  }


  if (order.orderType === OrderType.In) {
    return (
      <CancelScreen order={order} updateOrder={updateOrder} />
    )
  } else {
    return (
      <View>
        <OrderBaseScreen order={order} />
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity onPress={onDeniedPress}>
            <Button buttonText="Denied" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onAcceptPress}>
            <Button buttonText="Accept" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}



export default PendingScreen

const styles = StyleSheet.create({
})