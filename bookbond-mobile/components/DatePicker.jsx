import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-date-picker'

const DatePickerWithShown = ({ open, date, setOpen, setDate }) => {
    return (
        <View>
            <TouchableOpacity onPress={() => setOpen(true)} >
                <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
            <DatePicker
                modal
                open={open}
                date={date}
                mode='date'
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </View>
    )
}

export default DatePickerWithShown