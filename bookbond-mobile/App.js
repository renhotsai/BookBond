import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/SignUpScreen";
import BookDetails from './screens/BookDetailScreen';
import TabScreen from "./screens/TabScreen";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackScreen from "./screens/StackScreen";

const App = () => {
  const Stack = createNativeStackNavigator();

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
      default:
        return <LoginScreen screenChange={changeScreen} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        {renderScreen()}
      </NavigationContainer>
    </SafeAreaView>
  );
};
export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#D2E9E9",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
