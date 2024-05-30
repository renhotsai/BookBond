import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, TouchableOpacity, View } from "react-native";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import BorrowedBooksScreen from "./BorrowedBooksScreen";

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
        name="Borrowed Books"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={24} color="black" />
          ),
        }}
        component={BorrowedBooksScreen}
      >
        {/* {() => <ProfileScreen logout={logout} />} */}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
export default TabScreen;
