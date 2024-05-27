
import { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { auth } from "../firebaseConfig";

const ProfileScreen = (props) => {
  const logOut = () => {
    props.logout();
    alert(`Logged Out!`);
  };

   useEffect(() => {
     console.log(auth.currentUser.email);
   }, []);

  return (
    <View>
      <Text>Sign Up Screen { auth.currentUser.email }</Text>
      <TouchableOpacity onPress={logOut}>
        <Text style={{ color: "blue" }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ProfileScreen;
