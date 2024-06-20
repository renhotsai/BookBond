import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CancelScreen from './CancelScreen'
import OrderType from '../../model/OrderType'
import Button from '../../components/Button'
import OrderBaseScreen from './OrderBaseScreen'
import OrderStatus from '../../model/OrderStatus'

const PendingScreen = ({ item, updateOrder }) => {

  const onAcceptPress = () => {
    console.log(`onAcceptPress orderId ${item.orderId}`);
    updateOrder(OrderStatus.Accepted)
  }

  const onDeniedPress = () => {
    console.log(`onDeniedPress orderId ${item.orderId}`);
    updateOrder(OrderStatus.Denied)
  }


  if (item.orderType === OrderType.In) {
    return (
      <CancelScreen item={item} updateOrder={updateOrder} />
    )
  } else {
    return (
      <View>
        <OrderBaseScreen item={item} />
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