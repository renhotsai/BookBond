import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import OrderBaseScreen from './OrderBaseScreen'
import Button from '../../components/Button'
import OrderStatus from '../../model/OrderStatus'
import OrderType from '../../model/OrderType'

const PickedScreen = ({ item, updateOrder }) => {
  const onReturnPress = () => {
    console.log(`onReturnPress orderId ${item.orderId}`);
    updateOrder(OrderStatus.Returned)
  }
  if (item.orderType === OrderType.In) {
    return (
      <View>
        <OrderBaseScreen item={item} />
        <TouchableOpacity onPress={onReturnPress}>
          <Button buttonText={"Return"} />
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <OrderBaseScreen item={item} />
    )
  }
}

export default PickedScreen

const styles = StyleSheet.create({})