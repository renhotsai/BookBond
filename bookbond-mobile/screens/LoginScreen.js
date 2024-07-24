import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import TabScreen from "./TabScreen";
import {
  auth,
  db,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "../controller/firebaseConfig";

const LoginScreen = (props) => {
  const [emailFromUI, setEmailFromUI] = useState("jeremy@gmail.com");
  const [passwordFromUI, setPasswordFromUI] = useState("jeremy");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userLoggedIn, setUserLoggedIn] = useState("");

  const onLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailFromUI,
        passwordFromUI
      );
      setUserLoggedIn(emailFromUI);
      props.screenChange({ screenName: "Main" });
    } catch (err) {
      alert("Invalid Credentials");
      console.log(err);
    }
  };

  const onLogout = async () => {
    try {
      //1. check if user is currently logged in
      if (auth.currentUser === null) {
        alert(`Sorry, no user is logged in.`);
      } else {
        await signOut(auth);
        setUserLoggedIn("");
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const signUp = () => {
    props.screenChange({ screenName: "SignUp" });
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? (
        <TabScreen logout={onLogout} user={userLoggedIn} />
      ) : (
        <View style={styles.container}>
          <Image
            style={{
              height: 275,
                width: 275,
              borderRadius: 125,
                objectFit: "contain",
            }}
            source={require("../assets/AppLogo.png")}
          />
          {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.title}>Login Screen</Text>
          </View> */}

          <View style={styles.form}>
            <TextInput
              style={styles.textInputStyles}
              placeholder="Enter Email"
              onChangeText={setEmailFromUI}
              value={emailFromUI}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.textInputStyles}
              placeholder="Enter Password"
              onChangeText={setPasswordFromUI}
              value={passwordFromUI}
              secureTextEntry={true}
              keyboardType="default"
            />

            <TouchableOpacity
              style={styles.button}
              //   onPress={() => onLogin(emailFromUI, passwordFromUI)}
              onPress={onLogin}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpNeedAnAccount}>Need an Account? </Text>
              <TouchableOpacity onPress={signUp}>
                <Text style={styles.signUpHere}>Register Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'blue'
  },
  title: {
    fontWeight: "bold",
    fontSize: "25",
    alignContent: "center",
    padding: 10,
  },
  form: {
    width: "100%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    justifyContent: "flex-start",
    borderColor: "#151515",
  },

  button: {
    margin: 10,
    padding: 10,
    backgroundColor: "#A91D3A",
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  textInputStyles: {
    backgroundColor: "#dedede",
    borderWidth: 1,
    borderColor: "#D3d3d3",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    margin: 10,
  },

  signUpContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  signUpNeedAnAccount: {
    fontStyle: "italic",
    color: "#B4B4B8",
  },
  signUpHere: {
    color: "#378CE7",
  },
});
