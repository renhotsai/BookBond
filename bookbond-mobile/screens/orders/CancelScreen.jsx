import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Button from '../../components/Button'
import OrderStatus from '../../model/OrderStatus'
import OrderBaseScreen from './OrderBaseScreen'

const CancelScreen = ({ item, updateOrder }) => {

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
      <TouchableOpacity onPress={onCancelPress}>
        <Button buttonText="Cancel" />
      </TouchableOpacity>
    </View>
  )
}

export default CancelScreen

const styles = StyleSheet.create({
})