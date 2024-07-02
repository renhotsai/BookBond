import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CancelScreen from './CancelScreen'
import OrderBaseScreen from './OrderBaseScreen'
import OrderType from '../../model/OrderType'
import Button from '../../components/Button'
import OrderStatus from '../../model/OrderStatus'
import { reverseGeoCoding } from '../../controller/LocationHelper'


const AcceptedScreen = ({ item, updateOrder }) => {

  useEffect(() => {
    getAddress()
  }, [])
  const [address, setAddress] = useState("")

  const onPickPress = () => {
    console.log(`onPickPress orderId ${item.orderId}`);
    updateOrder(OrderStatus.Picked)
  }

  const onCancel = () => {
    console.log(`onCancelPress orderId ${item.orderId}`);
    updateOrder(OrderStatus.Cancelled)
  }

  const getAddress = async () => {
    const address = await reverseGeoCoding(item.location)
    setAddress(address)
  }

  if (item.orderType === OrderType.In) {
    return (
      <View>
        <OrderBaseScreen item={item} />
        <Text>{address}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onPickPress}>
            <Button buttonText={"Picked"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel}>
            <Button buttonText={"Cancel"} />
          </TouchableOpacity>
        </View>
      </View>
    )
  } else {
    return (
      <OrderBaseScreen item={item} />
    )
  }
}

export default AcceptedScreen

const styles = StyleSheet.create({
  buttonContainer:{
    flexDirection: 'row',
    justifyContent:'space-around',
  }
})