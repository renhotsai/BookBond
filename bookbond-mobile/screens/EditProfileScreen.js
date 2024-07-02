import { getDoc, setDoc, doc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../controller/firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

const EditProfileScreen = ({ navigation }) => {
  const [firstNameFromUI, setFirstNameFromUI] = useState("");
  const [lastNameFromUI, setLastNameFromUI] = useState("");
  const [phoneNumberFromUI, setPhoneNumberFromUI] = useState("");
  const [addressFromUI, setAddressFromUI] = useState("");
  // const [passwordFromUI, setPasswordFromUI] = useState("");
  // const [reenterPasswordFromUI, setReenterPasswordFromUI] = useState("");

  const [deviceLocation, setDeviceLocation] = useState("");
  const [currAddress, setCurrAddress] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const docRef = doc(db, "UsersCollection", auth.currentUser.email);

    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setFirstNameFromUI(userData.firstName);
        setLastNameFromUI(userData.lastName);
        setPhoneNumberFromUI(userData.contactNumber);
        setAddressFromUI(userData.address);
      } else {
        console.log("No such document!");
      }
    });
  };

  const onUpdate = async () => {
    if (
      firstNameFromUI == "" ||
      lastNameFromUI == "" ||
      addressFromUI == "" ||
      phoneNumberFromUI == "" ||
      passwordFromUI == "" ||
      reenterPasswordFromUI == ""
    ) {
      alert("Fields cannot be empty");
      return;
    } else if (passwordFromUI !== reenterPasswordFromUI) {
      alert("Password doesn't match.");
      return;
    }

    const docRef = doc(db, "UsersCollection", `${auth.currentUser.email}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, {
        firstName: firstNameFromUI,
        lastName: lastNameFromUI,
        contactNumber: phoneNumberFromUI,
        address: addressFromUI,
      });
      alert("Update Successful");
      navigation.goBack();
    }
  };

  const getCurrentLocation = async () => {
    try {
      // Request permission to access location
      const result = await Location.requestForegroundPermissionsAsync();
      console.log(`result from permission request : ${result.status}`);

      if (result.status === "granted") {
        console.log(`Location permission granted`);

        // Get current position
        const location = await Location.getCurrentPositionAsync();
        const deviceLocation = {
          latitude: parseFloat(location.coords.latitude),
          longitude: parseFloat(location.coords.longitude),
        };
        setDeviceLocation(deviceLocation);
        console.log(deviceLocation);

        // Perform reverse geocoding
        const resultArray = await Location.reverseGeocodeAsync(deviceLocation);
        if (resultArray.length > 0) {
          const matchedLocation = resultArray[0];
          const address = `${matchedLocation.streetNumber} ${matchedLocation.street}, ${matchedLocation.city}, ${matchedLocation.region}, ${matchedLocation.postalCode}`;
          setCurrAddress(address);
          console.log(address);
          setAddressFromUI(address);
        } else {
          console.error(`No address found for the given coords`);
          setCurrAddress(`No address found for the given coords`);
        }
      } else {
        console.log(`Location permission DENIED`);
      }
    } catch (err) {
      console.error(`Error: ${err}`);
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

        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.textInputStyles1}
            placeholder="Address"
            onChangeText={setAddressFromUI}
            value={addressFromUI}
          />

          <TouchableOpacity style={styles.button1} onPress={getCurrentLocation}>
            <MaterialIcons name="my-location" size={24} color="black" />
          </TouchableOpacity>
        </View>

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

  textInputStyles1: {
    width: "85%",
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

  button1: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#96C9F4",
    borderRadius: 20,
    alignItems: "center",
  },
});
