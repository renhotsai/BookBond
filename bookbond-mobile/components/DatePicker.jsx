import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';


const DatePickerWithShown = ({ borrowDate, returnDate, setBorrowDate, setReturnDate }) => {

    const [startDate, setStartDate] = useState(borrowDate)
    const [endDate, setEndDate] = useState(returnDate)

    useEffect(() => {
        setBorrowDate(dayjs(startDate).toDate())
        setReturnDate(dayjs(endDate).toDate())
    }, [endDate])


    return (
        <View >
            <DateTimePicker
                mode='range'
                minDate={new Date()}
                startDate={startDate}
                endDate={endDate}
                onChange={({ startDate, endDate }) => {
                    setStartDate(startDate)
                    setEndDate(endDate)
                }}
            />
        </View>
    );
}

export default DatePickerWithShown