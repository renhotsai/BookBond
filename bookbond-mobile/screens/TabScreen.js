import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, TouchableOpacity, View } from "react-native";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import BorrowedBooksScreen from "./BorrowedBooksScreen";
import MyLibraryScreen from "./MyLibraryScreen";

const TabScreen = (props) => {
  const Tab = createBottomTabNavigator();


  const logout = () => {
    props.logout();
  };

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={24} color="black" />
          ),
        }}
        component={HomeScreen}
      ></Tab.Screen>
      <Tab.Screen
        name="My Library"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={24} color="black" />
          ),
        }}
        component={MyLibraryScreen}
      >
      </Tab.Screen>
    </Tab.Navigator>
  );
};
export default TabScreen;
