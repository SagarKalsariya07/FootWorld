// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfEtUFhy-kM8VBSTQCBE3X3A0Fkf7W3v8",
  authDomain: "myapp-32ded.firebaseapp.com",
  projectId: "myapp-32ded",
  storageBucket: "myapp-32ded.firebasestorage.app",
  messagingSenderId: "146892625271",
  appId: "1:146892625271:web:8ef54a6d5bd73856f0bd72",
  measurementId: "G-B77PYNCLYP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app)

export {database,auth};