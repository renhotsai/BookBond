import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Button = ({buttonText}) => {
    return (
        <View style={styles.button}>
                <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#1e90ff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
})