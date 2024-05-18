// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbfMWlQ38JDW82yYp6x0NubBFfcAI3k2A",
  authDomain: "bookbond-cc6d2.firebaseapp.com",
  projectId: "bookbond-cc6d2",
  storageBucket: "bookbond-cc6d2.appspot.com",
  messagingSenderId: "571918797211",
  appId: "1:571918797211:web:17e188d11e987130cf393e",
  measurementId: "G-PTN9WMHQ1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);