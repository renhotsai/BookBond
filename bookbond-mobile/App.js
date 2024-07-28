import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/SignUpScreen";
import { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackScreen from "./screens/StackScreen";
import NotificationContextProvider, { useNotification } from "./context/notification";

const App = () => {
  const navigationRef = useRef(null)
  const [currentScreen, setCurrentScreen] = useState("Login")

  const changeScreen = (screen) => {
    console.log(`changeScreen ${screen.screenName}`);
    setCurrentScreen(screen.screenName);
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen screenChange={changeScreen} />;
      case 'SignUp':
        return <SignUpScreen screenChange={changeScreen} />;
      case 'Main':
        return <StackScreen screenChange={changeScreen} />;
      case 'Profile':
        return <StackScreen screenChange={changeScreen} />;
      default:
        return <LoginScreen screenChange={changeScreen} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NotificationContextProvider navigationRef={navigationRef}>
        <NavigationContainer ref={navigationRef}>
          {renderScreen()}
        </NavigationContainer>
      </NotificationContextProvider>
    </SafeAreaView>
  );
};
export default App;
