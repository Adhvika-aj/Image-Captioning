// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDihQIEsNagOc8VVLuE4qEsw0hI_Uj88FI",
  authDomain: "image-captioning-e216a.firebaseapp.com",
  projectId: "image-captioning-e216a",
  storageBucket: "image-captioning-e216a.firebasestorage.app",
  messagingSenderId: "71997055454",
  appId: "1:71997055454:web:59dc381ade998e7c73fd4f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, googleProvider };
export { storage };