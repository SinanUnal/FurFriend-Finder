import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0FFW_EiRH5CgloZkEsMmVWe380XwaBKw",
  authDomain: "animal-adoption-app-1a726.firebaseapp.com",
  projectId: "animal-adoption-app-1a726",
  storageBucket: "animal-adoption-app-1a726.appspot.com",
  messagingSenderId: "1053854127126",
  appId: "1:1053854127126:web:a5b8f416cad2d8cd9f1137",
  measurementId: "G-CKTYNEWCRY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };
