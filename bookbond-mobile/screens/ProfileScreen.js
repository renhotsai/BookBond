import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  Button,
} from "react-native";
import { auth, db, storage } from "../controller/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, onSnapshot } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const editProfileHandler = () => {
    navigation.navigate("Edit Profile");
  };

  useEffect(() => {
    getData();
    setUserEmail(auth.currentUser.email);
  }, []);

  const getData = () => {
    const docRef = doc(db, "UsersCollection", auth.currentUser.email);

    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserFirstName(userData.firstName);
        setUserLastName(userData.lastName);
        setContactNumber(userData.contactNumber);
        setUserAddress(userData.address);
      } else {
        console.log("No such document!");
      }
    });
  };

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage2 = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });

    console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      const uploadURL = await uploadImageAsync(result.assets[0].uri);
      setIsModalVisible(false);
      setImage(uploadURL);
      // setImage(result.assets[0].uri);
      setInterval(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      setImage(null);
      setInterval(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    try {
      const storageRef = await ref(storage, `images/${userEmail}`);
      const result = await uploadBytes(storageRef, blob);
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const deleteImage = async () => {
    setIsLoading(true);
    const deleteRef = ref(storage, image);

    try {
      deleteObject(deleteRef).then(() => {
        setImage(null);
        setIsModalVisible(false);
        setInterval(() => {
          setIsLoading(false);
        }, 2000);
      });
    } catch (error) {
      alert(`Error: ${error}`);
      setInterval(() => {
        setIsLoading(false);
      }, 2000);
      return;
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.welcomeStyle}>Welcome</Text>

        {!image ? (
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            {isLoading ? (
              <View style={styles.profilePicStyle}>
                <ActivityIndicator color={"grey"} animating size={"large"} />
              </View>
            ) : (
              <Image
                style={styles.profilePicStyle}
                source={require("../assets/profilepic.jpg")}
              />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            {isLoading ? (
              <View style={styles.profilePicStyle}>
                <ActivityIndicator color={"grey"} animating size={"large"} />
              </View>
            ) : (
              <Image style={styles.profilePicStyle} source={{ uri: image }} />
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={editProfileHandler}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          animationType="slide"
          presentationStyle="overFullScreen"
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: "white",
                width: "100%",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <TouchableOpacity style={styles.modalButton} onPress={pickImage2}>
                <Text style={styles.modalText}>Choose Photo from Library</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={deleteImage}
              >
                <Text style={styles.modalText}>Remove Profile Picture</Text>
              </TouchableOpacity>
              <Button
                title="Close"
                color="red"
                onPress={() => setIsModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </View>

      <Text style={styles.firstNameStyle}>{userFirstName}</Text>
      <Text style={styles.lastNameStyle}>{userLastName}</Text>
      <Text style={styles.emailStyle}>{contactNumber}</Text>
      <Text style={styles.emailStyle}>{auth.currentUser.email}</Text>
      <Text style={styles.emailStyle}>{userAddress}</Text>
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
  modalButton: {
    width: "95%",
    padding: 10,
    backgroundColor: "#F5EDED",
    borderRadius: 10,
    alignItems: "center",
    margin: 5,
  },
  modalText: {
    fontWeight: "600",
    color: "#508C9B",
  },
});
