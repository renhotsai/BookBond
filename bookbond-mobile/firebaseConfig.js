// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbfMWlQ38JDW82yYp6x0NubBFfcAI3k2A",
  authDomain: "bookbond-cc6d2.firebaseapp.com",
  projectId: "bookbond-cc6d2",
  storageBucket: "bookbond-cc6d2.appspot.com",
  messagingSenderId: "571918797211",
  appId: "1:571918797211:web:17e188d11e987130cf393e",
  measurementId: "G-PTN9WMHQ1S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services (database, auth, etc)
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

//Collections
const UsersCollection = "UsersCollection"
const BooksCollection = "BooksCollection"


//User's SubCollection
const OwnBooks = "OwnBooks"
const CollectBooks = "CollectBooks"

export {
  db,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UsersCollection,
  BooksCollection,
  OwnBooks,
  CollectBooks,
};
