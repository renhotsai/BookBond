import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabScreen from './TabScreen'
import BookDetailScreen from './BookDetailScreen'
import { ScreenStackHeaderSearchBarView } from 'react-native-screens'
import { Ionicons } from "@expo/vector-icons";
import { auth } from '../firebaseConfig'
import ProfileScreen from './ProfileScreen'

const StackScreen = (props) => {
    const Stack = createNativeStackNavigator()


    const logout = () => {
        auth.signOut();
        props.screenChange({ screenName: "Login" })
    }

    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" options={{headerShown:false}}>
                {()=><TabScreen logout={logout}/>}
            </Stack.Screen>
            <Stack.Screen name="BookDetails" component={BookDetailScreen} />
            <Stack.Screen name="Profile" options={{headerShown:false}}>
                {()=><ProfileScreen logout={logout}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}

export default StackScreen