import { useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { auth } from "../firebaseConfig";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfileScreen from "./EditProfileScreen";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = (props) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="User Profile">
        {() => <Profile logout={props.logout} />}
      </Stack.Screen>
      <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};
export default ProfileScreen;

const Profile = (props) => {
  const navigation = useNavigation();
  const logOut = () => {
    props.logout();
    alert(`Logged Out!`);
  };

  const editProfileHandler = () => {
    navigation.navigate("Edit Profile");
  }

  useEffect(() => {
    console.log(auth.currentUser.email);
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      {/* <Text>Sign Up Screen {auth.currentUser.email}</Text> */}

      <View style={{ alignItems: "center" }}>
        <Text style={styles.welcomeStyle}>Welcome</Text>
        <Image
          style={styles.profilePicStyle}
          source={require("../assets/profilepic.jpg")}
        />

        <TouchableOpacity style={styles.editProfileButton} onPress={editProfileHandler}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.firstNameStyle}>First Name</Text>
      <Text style={styles.lastNameStyle}>Last Name</Text>
      <Text style={styles.emailStyle}>{auth.currentUser.email}</Text>

      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity style={styles.signOutButton} onPress={logOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
