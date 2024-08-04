import { SafeAreaView } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackScreen from "./screens/StackScreen";
import NotificationContextProvider from "./context/notification";
import mobileAds, { AppOpenAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.APP_OPEN : "ca-app-pub-7840691051615441/3527391164";

const App = () => {
  const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
  });

  const initializeAds = async () => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        appOpenAd.load();
      });
  };

  useEffect(() => {
    initializeAds();
    appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      setTimeout(() => {
        appOpenAd.show();
      }, 1000);
    })
  }, []);

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
