import React from 'react';
import { View, StyleSheet } from 'react-native';
import BorrowedBooksScreen from './BorrowedBooksScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CollectionScreen from './CollectionScreen';
import MyBooksScreen from './MyBooksScreen';
import BorrowingScreen from './BorrowingScreen';
import OwnerOrderScreen from './OwnerOrderScreen';
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();

const MyLibraryScreen = () => {
    return (
        <View style={styles.container}>
            <Tab.Navigator screenOptions={{
                tabBarShowLabel: true,
                tabBarLabelStyle: { fontSize: '6vm' }
            }}>
                <Tab.Screen name="History" component={BorrowedBooksScreen}
                    options={{ tabBarIcon: (() => (<Fontisto name="history" size={24} color="black" />)) }} />
                <Tab.Screen name="Collections" component={CollectionScreen}
                    options={{ tabBarIcon: (() => (<FontAwesome name="heart" size={24} color="black" />)) }} />
                <Tab.Screen name="My Books" component={MyBooksScreen}
                    options={{ tabBarIcon: (() => (<MaterialCommunityIcons name="bookshelf" size={24} color="black" />)) }} />
                <Tab.Screen name="Borrowing" component={BorrowingScreen}
                    options={{ tabBarIcon: (() => (<MaterialCommunityIcons name="book-arrow-down" size={24} color="black" />)) }} />
                <Tab.Screen name="Orders" component={OwnerOrderScreen}
                    options={{ tabBarIcon: (() => (<MaterialCommunityIcons name="book-arrow-up" size={24} color="black" />)) }} />
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
