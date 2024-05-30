import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

const EditProfileScreen = ({ navigation }) => {
  const goBackHandler = () => {
    navigation.goBack();
  };
  return (
    <View style={{ flex: 1 }}>
      <Text>Edit</Text>

      <TouchableOpacity style={styles.signOutButton} onPress={goBackHandler}>
        <Text style={styles.signOutText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};
export default EditProfileScreen;

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
