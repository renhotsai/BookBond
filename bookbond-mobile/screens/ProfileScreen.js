import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { auth, db } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";

const ProfileScreen = (props) => {
  const navigation = useNavigation();

  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");

  const logOut = () => {
    props.logout();
    alert(`Logged Out!`);
  };

  const editProfileHandler = () => {
    navigation.navigate("Edit Profile");
  };

  useEffect(() => {
    // console.log(auth.currentUser.email);
    getData();
  }, []);

  const getData = async () => {
    const docRef = doc(db, "UsersCollection", `${auth.currentUser.email}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      const userData = docSnap.data();
      setUserFirstName(userData.firstName);
      setUserLastName(userData.lastName);
    } else {
      console.log("No such document!");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      {/* <Text>Sign Up Screen {auth.currentUser.email}</Text> */}

      <View style={{ alignItems: "center" }}>
        <Text style={styles.welcomeStyle}>Welcome</Text>
        <Image
          style={styles.profilePicStyle}
          source={require("../assets/profilepic.jpg")}
        />

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={editProfileHandler}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.firstNameStyle}>{userFirstName}</Text>
      <Text style={styles.lastNameStyle}>{userLastName}</Text>
      <Text style={styles.emailStyle}>{auth.currentUser.email}</Text>

      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity style={styles.signOutButton} onPress={logOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  profilePicStyle: {
    height: 150,
    width: 150,
    borderRadius: 100,
    margin: 10,
  },
  editProfileButton: {
    width: 100,
    padding: 10,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    alignItems: "center",
  },
  editProfileText: {
    fontWeight: "600",
    color: "#FFE8C5",
  },
  welcomeStyle: {
    fontSize: 50,
    fontWeight: "bold",
    marginTop: 10,
    marginHorizontal: 10,
  },
  firstNameStyle: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 10,
    marginHorizontal: 10,
  },
  lastNameStyle: {
    fontSize: 40,
    marginBottom: 10,
    marginHorizontal: 10,
    color: "grey",
  },
  emailStyle: {
    margin: 10,
    color: "grey",
  },
  signOutButton: {
    width: 100,
    padding: 10,
    backgroundColor: "#DDDDDD",
    borderRadius: 10,
    alignItems: "center",
  },
  signOutText: {
    fontWeight: "600",
    color: "#40A2E3",
  },
});
