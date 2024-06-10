import { getDoc, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

const EditProfileScreen = () => {
  const [firstNameFromUI, setFirstNameFromUI] = useState("");
  const [lastNameFromUI, setLastNameFromUI] = useState("");
  const [phoneNumberFromUI, setPhoneNumberFromUI] = useState("");
  // const [passwordFromUI, setPasswordFromUI] = useState("");
  // const [reenterPasswordFromUI, setReenterPasswordFromUI] = useState("");

  const onUpdate = async () => {
    const docRef = doc(db, "UsersCollection", `${auth.currentUser.email}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, {
        firstName: firstNameFromUI,
        lastName: lastNameFromUI,
        contactNumber: phoneNumberFromUI,
      });
    }
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

        {/* <TextInput
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
        /> */}

        <TouchableOpacity style={styles.button} onPress={onUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default EditProfileScreen;

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
