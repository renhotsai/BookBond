import { Text, View, TouchableOpacity } from "react-native";

const ProfileScreen = (props) => {
  return (
    <View>
      <Text>Sign Up Screen Jeremy</Text>
      <TouchableOpacity onPress={props.logOut}>
        <Text style={{color: 'blue'}}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ProfileScreen;
