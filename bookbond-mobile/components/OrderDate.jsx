import { Text, View } from "react-native"

const OrderDate = (order) => {
    const borrowDate = order.from.toDate()
    const returnDate = order.to.toDate()
    return (
        <View style={{ display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
            <Text>{borrowDate.toDateString()}</Text>
            <Text>-</Text>
            <Text>{returnDate.toDateString()}</Text>
        </View>
    )
}
export default OrderDate