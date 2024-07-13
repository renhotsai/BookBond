import { Text, View } from "react-native"
import { DateTimeConvert } from "../utitlies /dateTimeConvert"

const OrderDate = (order) => {
    const borrowDate = new Date(DateTimeConvert(order.from))
    const returnDate = new Date(DateTimeConvert(order.to))
    return (
        <View style={{ display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
            <Text>{borrowDate.toDateString()}</Text>
            <Text>-</Text>
            <Text>{returnDate.toDateString()}</Text>
        </View>
    )
}
export default OrderDate