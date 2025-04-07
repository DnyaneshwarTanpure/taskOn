// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCP4tkGQwWobipd9LQkaw6kQlZ8jxyVa8A",
  authDomain: "taskon-3c29b.firebaseapp.com",
  projectId: "taskon-3c29b",
  storageBucket: "taskon-3c29b.firebasestorage.app",
  messagingSenderId: "1065117759501",
  appId: "1:1065117759501:web:bfb1167149dd37f672bd44",
  measurementId: "G-253FB80K05",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
