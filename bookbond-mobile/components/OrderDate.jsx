import { Text, View } from "react-native"

const OrderDate = ({ from, to }) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{from}</Text>
            <Text>-</Text>
            <Text>{to}</Text>
        </View>
    )
}
export { OrderDate }