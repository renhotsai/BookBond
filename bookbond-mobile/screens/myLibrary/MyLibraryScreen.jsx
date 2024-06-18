import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BorrowedBooksScreen from './BorrowedBooksScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CollectionScreen from './CollectionScreen';
import MyBooksScreen from './MyBooksScreen';
import BorrowingScreen from './BorrowingScreen';
import OwnerOrderScreen from './OwnerOrderScreen';

const Tab = createMaterialTopTabNavigator();

const MyLibraryScreen = () => {
    return (
        <View style={styles.container}>
            <Tab.Navigator>
                <Tab.Screen name="History" component={BorrowedBooksScreen} />
                <Tab.Screen name="Collections" component={CollectionScreen} />
                <Tab.Screen name="My Books" component={MyBooksScreen} />  
                <Tab.Screen name="Borrowing" component={BorrowingScreen} />
                <Tab.Screen name="Orders" component={OwnerOrderScreen} />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default MyLibraryScreen;
