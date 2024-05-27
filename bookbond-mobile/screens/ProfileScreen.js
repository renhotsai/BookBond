import { Text, View, TouchableOpacity } from "react-native";

const ProfileScreen = (props) => {

  const logOut = () => {
    props.logout();
    
  }


  return (
    <View>
      <Text>Sign Up Screen Jeremy</Text>
      <TouchableOpacity onPress={logOut}>
        <Text style={{color: 'blue'}}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ProfileScreen;
