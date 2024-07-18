import { StyleSheet } from "react-native"
import { Text, View } from "react-native"

const OrderDate = ({ from, to }) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.dateTimeTxt}>{from}</Text>
            <Text style={styles.dateTimeTxt}>-</Text>
            <Text style={styles.dateTimeTxt}>{to}</Text>
        </View>
    )
}
export { OrderDate }

const styles = StyleSheet.create({
    dateTimeTxt: {
        fontWeight: 'bold', fontSize: '20vm',
    }
})