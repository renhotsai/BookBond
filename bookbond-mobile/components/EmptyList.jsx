import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { FontAwesome6 } from '@expo/vector-icons';

const EmptyList = ({containerHeight}) => {
    return (
        <View style={[styles.emptyComponent, { height: containerHeight }]}>
            <FontAwesome6 name="book-open" size={50} color="gray" />
            <Text style={{ color: 'gray' }}>No Books</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    emptyComponent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export { EmptyList }