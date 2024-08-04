import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '../../components/Button'
import { OrderStatus } from '../../model/OrderStatus'
import OrderBaseScreen from './OrderBaseScreen'
import { reverseGeoCoding } from '../../controller/LocationHelper'

const CancelScreen = ({ item, updateOrder }) => {

  useEffect(() => {
    getAddress()
  }, [])

  const [address, setAddress] = useState("")

  const getAddress = async () => {
    const address = await reverseGeoCoding(item.location)
    setAddress(address)
  }
  const onCancelPress = () => {
    console.log(`onCancelPress orderId: ${item.orderId}`);

    Alert.alert('Confirm', 'Do you want to cancel order', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes', onPress: () => { updateOrder(OrderStatus.Cancelled) },
        style: 'ok',
      },
    ]);
  }

  return (
    <View>
      <OrderBaseScreen item={item} />
      <Text>{address}</Text>
      <TouchableOpacity onPress={onCancelPress}>
        <Button buttonText="Cancel" />
      </TouchableOpacity>
    </View>
  )
}

export default CancelScreen

const styles = StyleSheet.create({
})