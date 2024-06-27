import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { collection, doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  auth,
  db,
  signInWithEmailAndPassword,
} from "../controller/firebaseConfig";

const SignUpScreen = (props) => {
  const [firstNameFromUI, setFirstNameFromUI] = useState("");
  const [lastNameFromUI, setLastNameFromUI] = useState("");
  const [phoneNumberFromUI, setPhoneNumberFromUI] = useState("");
  const [emailFromUI, setEmailFromUI] = useState("");
  const [passwordFromUI, setPasswordFromUI] = useState("");
  const [reenterPasswordFromUI, setReenterPasswordFromUI] = useState("");

  const onLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailFromUI,
        passwordFromUI
      );
      props.screenChange({ screenName: "Main" });
    } catch (err) {
      alert("Invalid Credentials");
      console.log(err);
    }
  };

  const onRegister = async () => {
    if (
      passwordFromUI == reenterPasswordFromUI &&
      firstNameFromUI !== "" &&
      lastNameFromUI !== "" &&
      phoneNumberFromUI !== "" &&
      emailFromUI !== ""
    ) {
      console.log(
        firstNameFromUI,
        lastNameFromUI,
        phoneNumberFromUI,
        emailFromUI,
        passwordFromUI
      );
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          emailFromUI,
          passwordFromUI
        );

        const documentRef = doc(
          collection(db, "UsersCollection"), //Firebase Collection name
          emailFromUI //Document ID
        );
        await setDoc(documentRef, {
          firstName: firstNameFromUI,
          lastName: lastNameFromUI,
          contactNumber: phoneNumberFromUI,
          emailAddress: emailFromUI,
          userPassword: passwordFromUI,
        });

        // Display success message
        alert("Register Successful!");
        onLogin();
      } catch (err) {
        console.log(err);
      }
      console.log("Account Registered");
    } else {
      console.log("Account not Registered!");
      alert("Unable to Register. Please check Fields.");
    }
  };

  const onLoginPress = () => {
    props.screenChange({ screenName: "Login" });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.form}>
        <TextInput
          style={styles.textInputStyles}
          placeholder="First Name"
          onChangeText={setFirstNameFromUI}
          value={firstNameFromUI}
        />

        <TextInput
          style={styles.textInputStyles}
          placeholder="Last Name"
          onChangeText={setLastNameFromUI}
          value={lastNameFromUI}
        />

        <TextInput
          style={styles.textInputStyles}
          placeholder="Contact Number"
          onChangeText={setPhoneNumberFromUI}
          value={phoneNumberFromUI}
          keyboardType="decimal-pad"
        />

        <TextInput
          style={styles.textInputStyles}
          placeholder="Email Address"
          onChangeText={setEmailFromUI}
          value={emailFromUI}
          autoCapitalize={false}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.textInputStyles}
          placeholder="Password"
          onChangeText={setPasswordFromUI}
          value={passwordFromUI}
          secureTextEntry={true}
        />

        <TextInput
          style={styles.textInputStyles}
          placeholder="Re-enter Password"
          onChangeText={setReenterPasswordFromUI}
          value={reenterPasswordFromUI}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={onRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onLoginPress}>
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SignUpScreen;

const styles = StyleSheet.create({
  form: {
    width: "100%",
    height: "60%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    justifyContent: "space-evenly",
    borderColor: "#151515",
  },

  textInputStyles: {
    backgroundColor: "#dedede",
    borderWidth: 1,
    borderColor: "#D3d3d3",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },

  button: {
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
});
